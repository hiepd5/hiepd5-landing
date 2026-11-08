import json
import os
import re
import struct
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def check_utf8_and_null_bytes():
    checked = 0
    for base, _, files in os.walk(ROOT):
        if "node_modules" in base or os.path.basename(base) == "dist":
            continue
        for fn in files:
            if fn.endswith((".jsx", ".js", ".mjs", ".css", ".html", ".json")):
                p = os.path.join(base, fn)
                raw = open(p, "rb").read()
                if b"\x00" in raw:
                    raise AssertionError(f"Null byte detected in {p}")
                raw.decode("utf-8")
                checked += 1
    return checked


def check_css_class_coverage():
    css_path = os.path.join(ROOT, "src", "index.css")
    css_text = open(css_path, "r", encoding="utf-8").read()
    defined_classes = set(re.findall(r"\.([a-zA-Z0-9_-]+)", css_text))

    referenced = set()
    src_dir = os.path.join(ROOT, "src")
    for base, _, files in os.walk(src_dir):
        for fn in files:
            if fn.endswith(".jsx"):
                txt = open(os.path.join(base, fn), "r", encoding="utf-8").read()
                for m in re.finditer(r'className="([^"]+)"', txt):
                    for tok in m.group(1).split():
                        referenced.add(tok)

    missing = sorted(referenced - defined_classes)
    dead_legacy = sorted(
        {
            "axis-3d-subpanel",
            "axis-node-head",
            "axis-orbit-node",
            "axis-node-title",
            "axis-node-detail",
            "axis-node-sub",
            "axis-preset-bar",
            "axis-cta-row",
            "axis-bottom-compass",
            "sacred-chamfer-xs",
            "cad-crosshair",
            "curiosity-holo-card",
            "kbtn-ripple",
        }
        & defined_classes
    )
    if missing:
        raise AssertionError(f"Missing CSS classes in index.css: {missing}")
    if dead_legacy:
        raise AssertionError(f"Dead V4 legacy CSS classes still present: {dead_legacy}")
    return len(referenced), len(defined_classes)


def inspect_glb_telemetry():
    models_dir = os.path.join(ROOT, "public", "models")
    orphan = os.path.join(models_dir, "campus_4layers.glb")
    if os.path.exists(orphan):
        raise AssertionError("Orphan campus_4layers.glb still exists!")

    total_bytes = 0
    total_prims = 0
    glb_count = 0
    shell_nodes = set()

    for base, _, files in os.walk(models_dir):
        for fn in sorted(files):
            if not fn.endswith(".glb"):
                continue
            glb_count += 1
            p = os.path.join(base, fn)
            sz = os.path.getsize(p)
            total_bytes += sz
            with open(p, "rb") as f:
                magic, ver, length = struct.unpack("<4sII", f.read(12))
                assert magic == b"glTF" and ver == 2
                jlen, jtype = struct.unpack("<II", f.read(8))
                gltf = json.loads(f.read(jlen).decode("utf-8"))
                prims = sum(len(m.get("primitives", [])) for m in gltf.get("meshes", []))
                total_prims += prims
                if fn == "mod_04_outer_shell.glb":
                    for nd in gltf.get("nodes", []):
                        if nd.get("name") in ("Shell_Left", "Shell_Right"):
                            shell_nodes.add(nd["name"])

    if glb_count != 8:
        raise AssertionError(f"Expected 8 active GLBs, found {glb_count}")
    if shell_nodes != {"Shell_Left", "Shell_Right"}:
        raise AssertionError(f"Missing kinematic shell halves: {shell_nodes}")

    font_kb = os.path.getsize(os.path.join(ROOT, "public", "fonts", "vn_arch_bold.json")) / 1024
    proof_dir = os.path.join(ROOT, "public", "proof")
    proof_files = [f for f in os.listdir(proof_dir) if f.endswith(".webp")]
    assert len(proof_files) == 6, f"Expected 6 proof WebPs, found {len(proof_files)}"
    proof_kb = sum(os.path.getsize(os.path.join(proof_dir, f)) for f in proof_files) / 1024
    og_kb = os.path.getsize(os.path.join(ROOT, "public", "og-preview.jpg")) / 1024

    return {
        "glb_count": 8,
        "glb_total_kb": round(total_bytes / 1024, 1),
        "glb_total_prims": total_prims,
        "font_kb": round(font_kb, 1),
        "proof_webp_total_kb": round(proof_kb, 1),
        "og_preview_kb": round(og_kb, 1),
    }


def verify_dist_artifacts():
    dist_dir = os.path.join(ROOT, "dist")
    assets_dir = os.path.join(dist_dir, "assets")
    js_files = [f for f in os.listdir(assets_dir) if f.startswith("index-") and f.endswith(".js")]
    lazy_files = [f for f in os.listdir(assets_dir) if f.startswith("OverviewProofDrawer-") and f.endswith(".js")]
    css_files = [f for f in os.listdir(assets_dir) if f.startswith("index-") and f.endswith(".css")]
    assert js_files and lazy_files and css_files, "Expected split JS/CSS bundles in dist/assets"

    bundle_txt = open(os.path.join(assets_dir, js_files[0]), "r", encoding="utf-8").read()
    assert "In every dimension." in bundle_txt, "V6 hero headline missing in compiled bundle!"
    assert "Render AI Studio for SketchUp" in bundle_txt, "Render AI Studio missing in bundle!"
    assert "MapSKP for SketchUp" in bundle_txt, "MapSKP missing in bundle!"
    assert "OpenStreetMap contributors" in bundle_txt, "OSM attribution missing in bundle!"
    assert "91/2025/QH15" in bundle_txt, "PDPL 91/2025 opt-in notice missing in bundle!"
    for forbidden in ("42.8%", "FAR 3.2", "VƯỢT NHỊP 40M", "40M SPAN"):
        assert forbidden not in bundle_txt, f"Fabricated stat still present in bundle: {forbidden}"
    assert "fonts.googleapis.com" not in open(os.path.join(dist_dir, "index.html"), encoding="utf-8").read(), "Google Fonts still linked!"
    assert "WhatsApp" in bundle_txt and "Zalo" in bundle_txt, "Regional VI/EN CTAs missing!"

    required_dist_files = [
        "index.html",
        "models/modules/mod_04_outer_shell.glb",
        "fonts/vn_arch_bold.json",
        "proof/scene-01-8k.webp",
        "proof/scene-01-bp.webp",
        "og-preview.jpg",
    ]
    sizes = {}
    for rel in required_dist_files:
        p = os.path.join(dist_dir, *rel.split("/"))
        assert os.path.exists(p) and os.path.getsize(p) > 0, f"Missing dist artifact: {rel}"
        sizes[rel] = round(os.path.getsize(p) / 1024, 1)

    return {
        "app_js_kb": round(os.path.getsize(os.path.join(assets_dir, js_files[0])) / 1024, 2),
        "lazy_drawer_js_kb": round(os.path.getsize(os.path.join(assets_dir, lazy_files[0])) / 1024, 2),
        "css_kb": round(os.path.getsize(os.path.join(assets_dir, css_files[0])) / 1024, 2),
        "dist_files_kb": sizes,
    }


def main():
    utf8_files = check_utf8_and_null_bytes()
    ref_cls, def_cls = check_css_class_coverage()
    assets = inspect_glb_telemetry()
    dist_info = verify_dist_artifacts()
    report = {
        "status": "PASS",
        "utf8_clean_files": utf8_files,
        "jsx_static_classes_verified": ref_cls,
        "css_defined_classes": def_cls,
        "local_badge_verified": "V6 hero + 0 Google Fonts",
        **assets,
        **dist_info,
    }
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"VERIFY FAILED: {exc}", file=sys.stderr)
        sys.exit(1)
