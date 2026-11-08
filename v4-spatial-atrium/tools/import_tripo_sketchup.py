# -*- coding: utf-8 -*-
"""
HIEPD5.COM V4.2 — 5-MODULE COAXIAL SOCKET CALIBRATOR FOR TRIPO AI & SKETCHUP (.GLB)
===================================================================================
Drop up to 5 modular .glb / .fbx / .obj files from Tripo AI or SketchUp into `raw_drop/`
and run `SYNC_MODELS_V4.bat`.

How it ensures 5 separate Tripo AI models FIT TOGETHER 1:1 (`ghép nối khớp khít`):
Each module is calibrated to its exact Coaxial Telescopic Envelope (`(halfW*2, halfD*2, H)`):
  - `mod_01*` / `*plaza*` / `*base*`   -> `modules/mod_01_plaza_base.glb`       (6.30 x 5.50 x 0.40m)
  - `mod_02*` / `*interior*` / `*core*`-> `modules/mod_02_interior_core.glb`    (3.46 x 2.98 x 2.34m) [Nested Inside!]
  - `mod_03*` / `*struct*` / `*frame*` -> `modules/mod_03_structural_frame.glb` (3.98 x 3.44 x 2.38m) [Middle Cage!]
  - `mod_04*` / `*shell*` / `*facade*` -> `modules/mod_04_outer_shell.glb`      (4.52 x 3.92 x 2.42m) + Auto X=0 Split (`Shell_Left` & `Shell_Right`)!
  - `mod_05*` / `*roof*` / `*garden*`  -> `modules/mod_05_sky_roof_garden.glb`  (4.58 x 3.98 x 0.62m) [Top Canopy Lid!]
  - `*drone*`                          -> `drone_ai.glb`
  - `*tree*` / `*bonsai*`              -> `tree_bokeh.glb`
  - `*monolith*` / `*sculpture*`       -> `monolith_plaza.glb`
"""

from pathlib import Path
import bpy
import bmesh
from mathutils import Vector

SCRIPT_DIR = Path(__file__).resolve().parent
RAW_DIR = SCRIPT_DIR.parent / "raw_drop"
MODELS_DIR = SCRIPT_DIR.parent / "public" / "models"
MODULES_DIR = MODELS_DIR / "modules"
MODULES_DIR.mkdir(parents=True, exist_ok=True)

SUPPORTED_EXTS = {".glb", ".gltf", ".fbx", ".obj"}

# Target (rel_output_path, target_X_width, target_Y_depth_in_blender, target_Z_height_in_blender, split_shell_lr)
SLOT_SPECS = [
    (("mod_01", "01_", "plaza", "base", "de_"), ("modules/mod_01_plaza_base.glb", 6.30, 5.50, 0.40, False)),
    (("mod_02", "02_", "interior", "core", "atrium", "noi_that", "loi"), ("modules/mod_02_interior_core.glb", 3.46, 2.98, 2.34, False)),
    (("mod_03", "03_", "struct", "frame", "ket_cau", "khung"), ("modules/mod_03_structural_frame.glb", 3.98, 3.44, 2.38, False)),
    (("mod_04", "04_", "shell", "facade", "vo_", "arch"), ("modules/mod_04_outer_shell.glb", 4.52, 3.92, 2.42, True)),
    (("mod_05", "05_", "roof", "garden", "canopy", "mai"), ("modules/mod_05_sky_roof_garden.glb", 4.58, 3.98, 0.62, False)),
    (("drone", "uav", "lidar"), ("drone_ai.glb", 0.92, 0.92, 0.34, False)),
    (("tree", "bonsai", "cay"), ("tree_bokeh.glb", 1.15, 1.15, 1.92, False)),
    (("monolith", "sculpture", "statue", "tuong"), ("monolith_plaza.glb", 0.72, 0.72, 1.95, False)),
]


def match_slot(filename: str):
    low = filename.lower()
    for keys, spec in SLOT_SPECS:
        if any(k in low for k in keys):
            return spec
    return None


def import_3d(filepath: Path):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    ext = filepath.suffix.lower()
    if ext in (".glb", ".gltf"):
        bpy.ops.import_scene.gltf(filepath=str(filepath))
    elif ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(filepath))
    elif ext == ".obj":
        bpy.ops.wm.obj_import(filepath=str(filepath))


def world_bounds(meshes):
    mins = Vector((1e9, 1e9, 1e9))
    maxs = Vector((-1e9, -1e9, -1e9))
    for obj in meshes:
        for c in obj.bound_box:
            w = obj.matrix_world @ Vector(c)
            mins.x, mins.y, mins.z = min(mins.x, w.x), min(mins.y, w.y), min(mins.z, w.z)
            maxs.x, maxs.y, maxs.z = max(maxs.x, w.x), max(maxs.y, w.y), max(maxs.z, w.z)
    return mins, maxs


def calibrate_to_socket(tx: float, ty: float, tz: float, split_shell_lr: bool):
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        return False

    bpy.ops.object.select_all(action="DESELECT")
    for m in meshes:
        m.select_set(True)
        bpy.context.view_layer.objects.active = m
    bpy.ops.object.parent_clear(type="CLEAR_KEEP_TRANSFORM")
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    for o in list(bpy.context.scene.objects):
        if o.type != "MESH":
            bpy.data.objects.remove(o, do_unlink=True)

    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    mins, maxs = world_bounds(meshes)
    sz = maxs - mins
    sx = tx / max(sz.x, 1e-4)
    sy = ty / max(sz.y, 1e-4)
    sz_f = tz / max(sz.z, 1e-4)
    cx, cy, min_z = (mins.x + maxs.x) * 0.5, (mins.y + maxs.y) * 0.5, mins.z

    for m in meshes:
        for v in m.data.vertices:
            v.co.x = (v.co.x - cx) * sx
            v.co.y = (v.co.y - cy) * sy
            v.co.z = (v.co.z - min_z) * sz_f
        m.data.update()

    if not split_shell_lr:
        return True

    # Bisect Outer Shell cleanly at X = 0 into `Shell_Left` & `Shell_Right` for Clamshell Peel!
    bpy.ops.object.select_all(action="DESELECT")
    for m in meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    unified = bpy.context.active_object

    for side_name, clear_in, clear_out in (("Shell_Left", False, True), ("Shell_Right", True, False)):
        dup = unified.copy()
        dup.data = unified.data.copy()
        dup.name = f"{side_name}_Mesh"
        bpy.context.collection.objects.link(dup)

        bm = bmesh.new()
        bm.from_mesh(dup.data)
        geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
        bmesh.ops.bisect_plane(
            bm,
            geom=geom,
            plane_co=(0.0, 0.0, 0.0),
            plane_no=(1.0, 0.0, 0.0),
            clear_inner=clear_in,
            clear_outer=clear_out,
        )
        bm.to_mesh(dup.data)
        bm.free()
        dup.data.update()

        grp = bpy.data.objects.new(side_name, None)
        bpy.context.collection.objects.link(grp)
        dup.parent = grp

    bpy.data.objects.remove(unified, do_unlink=True)
    return True


def main():
    files = [p for p in sorted(RAW_DIR.iterdir()) if p.is_file() and p.suffix.lower() in SUPPORTED_EXTS] if RAW_DIR.exists() else []
    if not files:
        print("[INFO] Khong co file .glb/.fbx/.obj trong raw_drop/. Giu nguyen bo 5 mo-dun hien tai.")
        return

    for src in files:
        spec = match_slot(src.name)
        if not spec:
            print(f"[WARN] Bo qua '{src.name}' — hay dat ten chua: mod_01..mod_05 (hoac plaza, interior, struct, shell, roof, drone, tree, monolith).")
            continue
        rel_out, tx, ty, tz, split_lr = spec
        print(f"[SYNC] Calibrating '{src.name}' -> '{rel_out}' ({tx}x{ty}x{tz}m, ShellSplit={split_lr})...")
        import_3d(src)
        if calibrate_to_socket(tx, ty, tz, split_lr):
            out_path = MODELS_DIR / rel_out
            out_path.parent.mkdir(parents=True, exist_ok=True)
            bpy.ops.export_scene.gltf(
                filepath=str(out_path),
                export_format="GLB",
                export_apply=not split_lr,
                export_yup=True,
                export_materials="EXPORT",
            )
            print(f"[OK] Saved {rel_out} ({out_path.stat().st_size / 1024.0:.1f} KB)")


if __name__ == "__main__":
    main()
