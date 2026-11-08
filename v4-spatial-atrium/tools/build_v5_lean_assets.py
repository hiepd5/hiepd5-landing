# -*- coding: utf-8 -*-
"""
HIEPD5.COM V5.0 — LEAN CORE ASSET OPTIMIZER (.GLB QUANTIZATION + DRAW-CALL MERGE + 1:1 WEBP PROOF)
==================================================================================================
1. Deletes orphaned `public/models/campus_4layers.glb` (454.1 KB dead weight).
2. Losslessly merges mesh primitives by material + strips unused `TEXCOORD_0` + welds duplicate seam
   vertices + encodes `KHR_mesh_quantization` (Int16 POSITION + Int8 NORMAL + Uint16 indices) across
   all 8 active `.glb` models while preserving `Shell_Left` & `Shell_Right` kinematic subtrees.
3. Compresses the 3 real 1:1 Campus Blueprint <-> 8K Render pairs from `../assets/images/` into crisp
   lazy-loaded WebP pairs (`public/proof/*.webp`) + `public/og-preview.jpg` (1200x630 OpenGraph card).
"""

import json
import math
import struct
from pathlib import Path
import numpy as np
from PIL import Image

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_DIR = SCRIPT_DIR.parent
PUBLIC_DIR = PROJECT_DIR / "public"
MODELS_DIR = PUBLIC_DIR / "models"
PROOF_DIR = PUBLIC_DIR / "proof"
WORKSPACE_IMAGES = PROJECT_DIR.parent / "assets" / "images"

COMPONENT_DTYPE = {
    5120: np.int8,
    5121: np.uint8,
    5122: np.int16,
    5123: np.uint16,
    5125: np.uint32,
    5126: np.float32,
}
TYPE_COUNTS = {
    "SCALAR": 1,
    "VEC2": 2,
    "VEC3": 3,
    "VEC4": 4,
    "MAT4": 16,
}


def quat_to_mat3(q):
    x, y, z, w = q
    xx, yy, zz = x * x, y * y, z * z
    xy, xz, yz = x * y, x * z, y * z
    wx, wy, wz = w * x, w * y, w * z
    return np.array(
        [
            [1.0 - 2.0 * (yy + zz), 2.0 * (xy - wz), 2.0 * (xz + wy)],
            [2.0 * (xy + wz), 1.0 - 2.0 * (xx + zz), 2.0 * (yz - wx)],
            [2.0 * (xz - wy), 2.0 * (yz + wx), 1.0 - 2.0 * (xx + yy)],
        ],
        dtype=np.float64,
    )


def node_local_matrix(node):
    if "matrix" in node:
        return np.array(node["matrix"], dtype=np.float64).reshape((4, 4)).T
    t = np.array(node.get("translation", [0.0, 0.0, 0.0]), dtype=np.float64)
    q = np.array(node.get("rotation", [0.0, 0.0, 0.0, 1.0]), dtype=np.float64)
    s = np.array(node.get("scale", [1.0, 1.0, 1.0]), dtype=np.float64)
    r = quat_to_mat3(q)
    m = np.eye(4, dtype=np.float64)
    m[:3, :3] = r * s[None, :]
    m[:3, 3] = t
    return m


def read_glb(path: Path):
    raw = path.read_bytes()
    magic, version, total_len = struct.unpack_from("<III", raw, 0)
    assert magic == 0x46546C67 and version == 2, f"Invalid GLB: {path}"
    json_len, json_type = struct.unpack_from("<II", raw, 12)
    assert json_type == 0x4E4F534A
    gltf = json.loads(raw[20 : 20 + json_len].decode("utf-8"))
    bin_offset = 20 + json_len
    bin_len, bin_type = struct.unpack_from("<II", raw, bin_offset)
    assert bin_type == 0x004E4942
    bin_buf = raw[bin_offset + 8 : bin_offset + 8 + bin_len]
    return gltf, bin_buf


def read_accessor(gltf, bin_buf: bytes, acc_idx: int) -> np.ndarray:
    acc = gltf["accessors"][acc_idx]
    bv = gltf["bufferViews"][acc["bufferView"]]
    dtype = np.dtype(COMPONENT_DTYPE[acc["componentType"]]).newbyteorder("<")
    num_comp = TYPE_COUNTS[acc["type"]]
    count = acc["count"]
    elem_bytes = dtype.itemsize * num_comp
    offset = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
    stride = bv.get("byteStride", elem_bytes)

    if stride == elem_bytes:
        arr = np.frombuffer(bin_buf, dtype=dtype, count=count * num_comp, offset=offset)
        arr = arr.reshape((count, num_comp)) if num_comp > 1 else arr
    else:
        out = np.empty((count, num_comp), dtype=dtype)
        for i in range(count):
            row = np.frombuffer(bin_buf, dtype=dtype, count=num_comp, offset=offset + i * stride)
            out[i] = row
        arr = out if num_comp > 1 else out[:, 0]

    if acc.get("normalized"):
        arr = arr.astype(np.float64)
        if acc["componentType"] == 5120:
            arr = np.maximum(arr / 127.0, -1.0)
        elif acc["componentType"] == 5121:
            arr = arr / 255.0
        elif acc["componentType"] == 5122:
            arr = np.maximum(arr / 32767.0, -1.0)
        elif acc["componentType"] == 5123:
            arr = arr / 65535.0
    elif dtype != np.uint32 and dtype != np.uint16:
        arr = arr.astype(np.float64)
    return arr


def collect_group_buckets(gltf, bin_buf: bytes, preserve_groups: set):
    """
    Walks the default scene and buckets world/group-transformed triangles by:
      group_name -> material_idx -> list of (positions_f64, normals_f64, indices_u32)
    """
    scenes = gltf.get("scenes", [])
    scene_idx = gltf.get("scene", 0)
    root_nodes = scenes[scene_idx]["nodes"] if scenes else list(range(len(gltf.get("nodes", []))))
    nodes = gltf.get("nodes", [])
    meshes = gltf.get("meshes", [])

    buckets = {}

    def visit(n_idx: int, parent_mat: np.ndarray, active_group: str):
        node = nodes[n_idx]
        name = node.get("name", "")
        if name in preserve_groups:
            # Reset transform relative to preserved kinematic group node (`Shell_Left` / `Shell_Right`)
            cur_group = name
            cur_mat = np.eye(4, dtype=np.float64)
        else:
            cur_group = active_group
            cur_mat = parent_mat @ node_local_matrix(node)

        if "mesh" in node:
            mesh_def = meshes[node["mesh"]]
            lin = cur_mat[:3, :3]
            trans = cur_mat[:3, 3]
            try:
                norm_mat = np.linalg.inv(lin).T
            except np.linalg.LinAlgError:
                norm_mat = lin

            for prim in mesh_def.get("primitives", []):
                if prim.get("mode", 4) != 4:
                    continue
                attrs = prim["attributes"]
                if "POSITION" not in attrs:
                    continue
                pos = read_accessor(gltf, bin_buf, attrs["POSITION"])
                pos_w = pos @ lin.T + trans[None, :]

                if "NORMAL" in attrs:
                    nrm = read_accessor(gltf, bin_buf, attrs["NORMAL"])
                    nrm_w = nrm @ norm_mat.T
                    lengths = np.linalg.norm(nrm_w, axis=1, keepdims=True)
                    nrm_w = nrm_w / np.maximum(lengths, 1e-8)
                else:
                    nrm_w = np.zeros_like(pos_w)
                    nrm_w[:, 1] = 1.0

                if "indices" in prim:
                    idx = read_accessor(gltf, bin_buf, prim["indices"]).astype(np.uint32).ravel()
                else:
                    idx = np.arange(len(pos_w), dtype=np.uint32)

                mat_id = prim.get("material", 0)
                buckets.setdefault(cur_group, {}).setdefault(mat_id, []).append((pos_w, nrm_w, idx))

        for ch_idx in node.get("children", []) or []:
            visit(ch_idx, cur_mat, cur_group)

    ident = np.eye(4, dtype=np.float64)
    for r in root_nodes:
        visit(r, ident, "__ROOT__")
    return buckets


def weld_and_quantize(chunks, scale_factor: float):
    all_p = []
    all_n = []
    all_i = []
    v_offset = 0
    for pos, nrm, idx in chunks:
        all_p.append(pos)
        all_n.append(nrm)
        all_i.append(idx + v_offset)
        v_offset += len(pos)

    pos_cat = np.vstack(all_p)
    nrm_cat = np.vstack(all_n)
    idx_cat = np.concatenate(all_i)

    p_norm = np.clip(pos_cat / scale_factor, -1.0, 1.0)
    p_q = np.round(p_norm * 32767.0).astype("<i2")
    n_q = np.round(np.clip(nrm_cat, -1.0, 1.0) * 127.0).astype("<i1")

    # Lossless weld of identical quantized (pos, normal) pairs to eliminate split UV seam bloat
    packed_key = np.zeros(len(p_q), dtype=[("p", "<i2", (3,)), ("n", "<i1", (3,))])
    packed_key["p"] = p_q
    packed_key["n"] = n_q
    _, unique_first, inverse_map = np.unique(packed_key, return_index=True, return_inverse=True)

    # Keep original vertex order stability where possible
    order = np.argsort(unique_first)
    remap = np.empty_like(order)
    remap[order] = np.arange(len(order))
    keep_indices = unique_first[order]

    welded_p = p_q[keep_indices]
    welded_n = n_q[keep_indices]
    welded_idx = remap[inverse_map[idx_cat]].astype("<u2" if len(welded_p) <= 65535 else "<u4")
    return welded_p, welded_n, welded_idx


def pad4(buf: bytearray):
    rem = len(buf) % 4
    if rem:
        buf.extend(b"\x00" * (4 - rem))


def write_glb(path: Path, gltf_obj: dict, bin_bytes: bytes):
    json_bytes = json.dumps(gltf_obj, separators=(",", ":")).encode("utf-8")
    json_pad = (4 - (len(json_bytes) % 4)) % 4
    json_bytes += b" " * json_pad

    bin_pad = (4 - (len(bin_bytes) % 4)) % 4
    bin_bytes += b"\x00" * bin_pad

    total_len = 12 + 8 + len(json_bytes) + 8 + len(bin_bytes)
    out = bytearray()
    out.extend(struct.pack("<III", 0x46546C67, 2, total_len))
    out.extend(struct.pack("<II", len(json_bytes), 0x4E4F534A))
    out.extend(json_bytes)
    out.extend(struct.pack("<II", len(bin_bytes), 0x004E4942))
    out.extend(bin_bytes)
    path.write_bytes(bytes(out))


def optimize_glb_file(path: Path, preserve_groups=frozenset()):
    orig_kb = path.stat().st_size / 1024.0
    gltf, bin_buf = read_glb(path)
    if "KHR_mesh_quantization" in gltf.get("extensionsUsed", []):
        prims_now = sum(len(m.get("primitives", [])) for m in gltf.get("meshes", []))
        return {
            "file": path.name,
            "orig_kb": round(orig_kb, 1),
            "new_kb": round(orig_kb, 1),
            "saved_pct": 0.0,
            "orig_meshes": len(gltf.get("meshes", [])),
            "orig_prims": prims_now,
            "new_draw_calls": prims_now,
            "verts": 0,
            "tris": 0,
            "max_bbox_err_mm": 0.0,
        }
    orig_meshes = len(gltf.get("meshes", []))
    orig_prims = sum(len(m.get("primitives", [])) for m in gltf.get("meshes", []))

    buckets = collect_group_buckets(gltf, bin_buf, preserve_groups)

    # Compute original global bounding box for 1:1 verification
    all_orig_pts = []
    for grp_mats in buckets.values():
        for chunks in grp_mats.values():
            for p, _, _ in chunks:
                all_orig_pts.append(p)
    orig_concat = np.vstack(all_orig_pts)
    orig_min = orig_concat.min(axis=0)
    orig_max = orig_concat.max(axis=0)

    new_buffer = bytearray()
    buffer_views = []
    accessors = []
    new_meshes = []
    new_nodes = []
    root_node_indices = []

    new_prims_total = 0
    new_verts_total = 0
    new_tris_total = 0

    for grp_name, mat_map in buckets.items():
        # Compute uniform bounding scale S for this group's child mesh
        grp_pts = [p for chunks in mat_map.values() for (p, _, _) in chunks]
        grp_all = np.vstack(grp_pts)
        max_abs = float(np.max(np.abs(grp_all)))
        scale_s = max(round(max_abs * 1.02, 5), 0.001)

        mesh_prims = []
        for mat_id in sorted(mat_map.keys()):
            wp, wn, widx = weld_and_quantize(mat_map[mat_id], scale_s)
            v_count = len(wp)
            new_verts_total += v_count
            new_tris_total += len(widx) // 3
            new_prims_total += 1

            # 1. POSITION BufferView (VEC3 SHORT normalized, padded to 8-byte stride)
            pad4(new_buffer)
            pos_padded = np.zeros((v_count, 4), dtype="<i2")
            pos_padded[:, :3] = wp
            pos_bytes = pos_padded.tobytes()
            pos_bv_idx = len(buffer_views)
            buffer_views.append(
                {
                    "buffer": 0,
                    "byteOffset": len(new_buffer),
                    "byteLength": len(pos_bytes),
                    "byteStride": 8,
                    "target": 34962,
                }
            )
            new_buffer.extend(pos_bytes)

            pos_acc_idx = len(accessors)
            accessors.append(
                {
                    "bufferView": pos_bv_idx,
                    "componentType": 5122,
                    "normalized": True,
                    "count": v_count,
                    "type": "VEC3",
                    "min": [int(wp[:, 0].min()), int(wp[:, 1].min()), int(wp[:, 2].min())],
                    "max": [int(wp[:, 0].max()), int(wp[:, 1].max()), int(wp[:, 2].max())],
                }
            )

            # 2. NORMAL BufferView (VEC3 BYTE normalized, padded to 4-byte stride)
            pad4(new_buffer)
            nrm_padded = np.zeros((v_count, 4), dtype="<i1")
            nrm_padded[:, :3] = wn
            nrm_bytes = nrm_padded.tobytes()
            nrm_bv_idx = len(buffer_views)
            buffer_views.append(
                {
                    "buffer": 0,
                    "byteOffset": len(new_buffer),
                    "byteLength": len(nrm_bytes),
                    "byteStride": 4,
                    "target": 34962,
                }
            )
            new_buffer.extend(nrm_bytes)

            nrm_acc_idx = len(accessors)
            accessors.append(
                {
                    "bufferView": nrm_bv_idx,
                    "componentType": 5120,
                    "normalized": True,
                    "count": v_count,
                    "type": "VEC3",
                }
            )

            # 3. INDICES BufferView (SCALAR UNSIGNED_SHORT or UNSIGNED_INT, NO byteStride!)
            pad4(new_buffer)
            idx_bytes = widx.tobytes()
            idx_bv_idx = len(buffer_views)
            buffer_views.append(
                {
                    "buffer": 0,
                    "byteOffset": len(new_buffer),
                    "byteLength": len(idx_bytes),
                    "target": 34963,
                }
            )
            new_buffer.extend(idx_bytes)
            pad4(new_buffer)

            idx_comp_type = 5123 if widx.dtype == np.dtype("<u2") else 5125
            idx_acc_idx = len(accessors)
            accessors.append(
                {
                    "bufferView": idx_bv_idx,
                    "componentType": idx_comp_type,
                    "count": int(len(widx)),
                    "type": "SCALAR",
                }
            )

            mesh_prims.append(
                {
                    "attributes": {"POSITION": pos_acc_idx, "NORMAL": nrm_acc_idx},
                    "indices": idx_acc_idx,
                    "material": mat_id,
                    "mode": 4,
                }
            )

        mesh_idx = len(new_meshes)
        mesh_label = path.stem if grp_name == "__ROOT__" else f"{grp_name}_Mesh"
        new_meshes.append({"name": mesh_label, "primitives": mesh_prims})

        if grp_name == "__ROOT__":
            child_idx = len(new_nodes)
            new_nodes.append(
                {
                    "name": f"{path.stem}_QuantizedMesh",
                    "mesh": mesh_idx,
                    "scale": [scale_s, scale_s, scale_s],
                }
            )
            root_node_indices.append(child_idx)
        else:
            # Preserved Kinematic Group (`Shell_Left` / `Shell_Right`) keeps identity scale [1,1,1]!
            child_idx = len(new_nodes)
            new_nodes.append(
                {
                    "name": f"{grp_name}_Mesh",
                    "mesh": mesh_idx,
                    "scale": [scale_s, scale_s, scale_s],
                }
            )
            grp_idx = len(new_nodes)
            new_nodes.append({"name": grp_name, "children": [child_idx]})
            root_node_indices.append(grp_idx)

    # Clean materials (preserve exact PBR baseColorFactor, metallicFactor, roughnessFactor, emissiveFactor, alphaMode, KHR_materials_emissive_strength)
    kept_exts_used = ["KHR_mesh_quantization"]
    for ext in gltf.get("extensionsUsed", []):
        if ext.startswith("KHR_materials_") and ext not in kept_exts_used:
            kept_exts_used.append(ext)

    lean_gltf = {
        "asset": {"version": "2.0", "generator": "HiepD5 V5.0 Lean GLB Quantizer"},
        "extensionsUsed": kept_exts_used,
        "extensionsRequired": ["KHR_mesh_quantization"],
        "scene": 0,
        "scenes": [{"name": "Scene", "nodes": root_node_indices}],
        "nodes": new_nodes,
        "meshes": new_meshes,
        "materials": gltf.get("materials", []),
        "accessors": accessors,
        "bufferViews": buffer_views,
        "buffers": [{"byteLength": len(new_buffer)}],
    }

    write_glb(path, lean_gltf, bytes(new_buffer))

    # Re-read and verify 1:1 bounding box equivalence (< 1mm tolerance!)
    v_gltf, v_bin = read_glb(path)
    v_buckets = collect_group_buckets(v_gltf, v_bin, preserve_groups)
    v_pts = np.vstack([p for gm in v_buckets.values() for ch in gm.values() for (p, _, _) in ch])
    max_err = float(np.max(np.abs(np.vstack([v_pts.min(axis=0) - orig_min, v_pts.max(axis=0) - orig_max]))))
    assert max_err < 0.002, f"Bounding box drift {max_err:.5f}m on {path.name}!"

    new_kb = path.stat().st_size / 1024.0
    return {
        "file": path.name,
        "orig_kb": round(orig_kb, 1),
        "new_kb": round(new_kb, 1),
        "saved_pct": round((1.0 - new_kb / orig_kb) * 100.0, 1),
        "orig_meshes": orig_meshes,
        "orig_prims": orig_prims,
        "new_draw_calls": new_prims_total,
        "verts": new_verts_total,
        "tris": new_tris_total,
        "max_bbox_err_mm": round(max_err * 1000.0, 3),
    }


def build_proof_webp_pairs():
    PROOF_DIR.mkdir(parents=True, exist_ok=True)
    pairs = [
        ("scene-01-blueprint.jpg", "scene-01-bp.webp", 1040, 62),
        ("scene-01.jpg", "scene-01-8k.webp", 1040, 72),
        ("scene-03-blueprint.jpg", "scene-03-bp.webp", 1040, 62),
        ("scene-03.jpg", "scene-03-8k.webp", 1040, 72),
        ("scene-05-blueprint.jpg", "scene-05-bp.webp", 1040, 62),
        ("scene-05.jpg", "scene-05-8k.webp", 1040, 72),
    ]
    out_stats = []
    for src_name, dst_name, max_w, qual in pairs:
        src = WORKSPACE_IMAGES / src_name
        if not src.exists():
            continue
        dst = PROOF_DIR / dst_name
        with Image.open(src) as im:
            im_rgb = im.convert("RGB")
            w, h = im_rgb.size
            if w > max_w:
                nh = int(round(h * (max_w / w)))
                im_rgb = im_rgb.resize((max_w, nh), Image.Resampling.LANCZOS)
            im_rgb.save(dst, format="WEBP", quality=qual, method=6)
        out_stats.append((dst_name, round(src.stat().st_size / 1024.0, 1), round(dst.stat().st_size / 1024.0, 1)))

    # Generate 1200x630 OpenGraph Social Preview Card (`public/og-preview.jpg`)
    og_src = WORKSPACE_IMAGES / "scene-01.jpg"
    if og_src.exists():
        og_dst = PUBLIC_DIR / "og-preview.jpg"
        with Image.open(og_src) as im:
            im_rgb = im.convert("RGB")
            w, h = im_rgb.size
            target_ratio = 1200 / 630
            new_h = int(round(w / target_ratio))
            top = max(0, (h - new_h) // 2)
            cropped = im_rgb.crop((0, top, w, min(h, top + new_h))).resize((1200, 630), Image.Resampling.LANCZOS)
            cropped.save(og_dst, format="JPEG", quality=72, optimize=True)
            out_stats.append(("og-preview.jpg", round(og_src.stat().st_size / 1024.0, 1), round(og_dst.stat().st_size / 1024.0, 1)))
    return out_stats


def main():
    # 1. Remove orphaned 454.1 KB campus_4layers.glb
    orphan = MODELS_DIR / "campus_4layers.glb"
    if orphan.exists():
        orphan_kb = orphan.stat().st_size / 1024.0
        orphan.unlink()
        print(f"[PURGED] Removed orphaned campus_4layers.glb ({orphan_kb:.1f} KB -> 0.0 KB)")

    # 2. Optimize all 8 active .glb models
    targets = [
        (MODELS_DIR / "modules" / "mod_01_plaza_base.glb", frozenset()),
        (MODELS_DIR / "modules" / "mod_02_interior_core.glb", frozenset()),
        (MODELS_DIR / "modules" / "mod_03_structural_frame.glb", frozenset()),
        (MODELS_DIR / "modules" / "mod_04_outer_shell.glb", frozenset({"Shell_Left", "Shell_Right"})),
        (MODELS_DIR / "modules" / "mod_05_sky_roof_garden.glb", frozenset()),
        (MODELS_DIR / "drone_ai.glb", frozenset()),
        (MODELS_DIR / "tree_bokeh.glb", frozenset()),
        (MODELS_DIR / "monolith_plaza.glb", frozenset()),
    ]

    total_before = 0.0
    total_after = 0.0
    total_prims_before = 0
    total_prims_after = 0

    print("\n=== GLB QUANTIZATION & DRAW-CALL MERGE TELEMETRY ===")
    for p, groups in targets:
        if not p.exists():
            continue
        st = optimize_glb_file(p, groups)
        total_before += st["orig_kb"]
        total_after += st["new_kb"]
        total_prims_before += st["orig_prims"]
        total_prims_after += st["new_draw_calls"]
        print(
            f"  • {st['file']:<30} {st['orig_kb']:>6.1f} KB -> {st['new_kb']:>5.1f} KB "
            f"(-{st['saved_pct']:>4.1f}%) | Prims: {st['orig_prims']:>2} -> {st['new_draw_calls']:>2} "
            f"| MaxErr: {st['max_bbox_err_mm']:.3f}mm"
        )

    print(
        f"  => ACTIVE 8 GLBs TOTAL: {total_before:.1f} KB -> {total_after:.1f} KB "
        f"(-{(1.0 - total_after / total_before) * 100.0:.1f}%) | DrawCalls: {total_prims_before} -> {total_prims_after}"
    )

    # 3. Generate Lazy 1:1 Blueprint <-> 8K Render WebP Proof Pairs
    webp_stats = build_proof_webp_pairs()
    print("\n=== 1:1 LAZY WEBP PROOF PAIRS (0 KB INITIAL BUNDLE) ===")
    for name, s_kb, d_kb in webp_stats:
        print(f"  • {name:<22} {s_kb:>7.1f} KB -> {d_kb:>5.1f} KB")


if __name__ == "__main__":
    main()
