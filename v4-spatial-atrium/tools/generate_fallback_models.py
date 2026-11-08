# -*- coding: utf-8 -*-
"""
HIEPD5.COM V4.2 — 5-MODULE COAXIAL TELESCOPIC ARCHITECTURAL .GLB GENERATOR (BLENDER 4.4)
========================================================================================
Generates 5 independent coaxial interlocking .glb building modules + 3 spatial props:
  1. public/models/modules/mod_01_plaza_base.glb       (Chamfered Square Plaza w/ Socket Groove)
  2. public/models/modules/mod_02_interior_core.glb    (3-Floor Mezzanine Slabs + Helical Spiral Ramp + Glass Core)
  3. public/models/modules/mod_03_structural_frame.glb (Hollow Brushed-Brass Perimeter Columns + Arched Diagrid Cage)
  4. public/models/modules/mod_04_outer_shell.glb      (Hollow Curved Terracotta Louver Sleeve split into Shell_Left & Shell_Right!)
  5. public/models/modules/mod_05_sky_roof_garden.glb  (Chamfered Square Sky-Garden Canopy Lid + Glass Oculus)
  +  public/models/drone_ai.glb, tree_bokeh.glb, monolith_plaza.glb

When assembled (explode = 0):
  - mod_01 sits at Y = 0.00m
  - mod_02 (inner), mod_03 (middle frame), and mod_04 (outer hollow shell) ALL sit coaxially at Y = 0.34m,
    telescopically nested inside one another on the shared 1:1 chamfered-square plan!
  - mod_05 caps flush onto the top rim of mod_04 at Y = 2.74m!
"""

import math
from pathlib import Path
import bpy
import bmesh
from mathutils import Vector

SCRIPT_DIR = Path(__file__).resolve().parent
MODELS_DIR = SCRIPT_DIR.parent / "public" / "models"
MODULES_DIR = MODELS_DIR / "modules"
MODELS_DIR.mkdir(parents=True, exist_ok=True)
MODULES_DIR.mkdir(parents=True, exist_ok=True)


def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)


def make_pbr_mat(name, base_rgba, metallic=0.0, roughness=0.5, emission_rgb=None, emission_strength=0.0, alpha=1.0):
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = base_rgba
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if alpha < 1.0:
        bsdf.inputs["Alpha"].default_value = alpha
        if hasattr(mat, "blend_method"):
            mat.blend_method = "BLEND"
    if emission_rgb is not None and emission_strength > 0.0:
        if "Emission Color" in bsdf.inputs:
            bsdf.inputs["Emission Color"].default_value = (*emission_rgb, 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
        elif "Emission" in bsdf.inputs:
            bsdf.inputs["Emission"].default_value = (*emission_rgb, 1.0)
    return mat


def shade_smooth(obj):
    for poly in obj.data.polygons:
        poly.use_smooth = True


def chamfered_rect_point(ang: float, half_w: float, half_d: float, power: float = 4.2):
    """Superellipse canonical 1:1 chamfered-square architectural footprint shared by ALL 5 modules."""
    ca = math.cos(ang)
    sa = math.sin(ang)
    denom = (abs(ca) ** power + abs(sa) ** power) ** (1.0 / power)
    r = 1.0 / max(denom, 1e-5)
    return ca * r * half_w, sa * r * half_d


def build_extruded_ring(name, inner_hw, inner_hd, outer_hw, outer_hd, z0, z1, segs=96, mat=None):
    bm = bmesh.new()
    loops = []
    for i in range(segs):
        ang = (i / segs) * math.tau
        ix, iy = chamfered_rect_point(ang, inner_hw, inner_hd)
        ox, oy = chamfered_rect_point(ang, outer_hw, outer_hd)
        v0 = bm.verts.new((ix, iy, z0))
        v1 = bm.verts.new((ox, oy, z0))
        v2 = bm.verts.new((ox, oy, z1))
        v3 = bm.verts.new((ix, iy, z1))
        loops.append((v0, v1, v2, v3))
    for i in range(segs):
        ni = (i + 1) % segs
        a0, a1, a2, a3 = loops[i]
        b0, b1, b2, b3 = loops[ni]
        bm.faces.new((a0, b0, b1, a1))
        bm.faces.new((a1, b1, b2, a2))
        bm.faces.new((a2, b2, b3, a3))
        bm.faces.new((a3, b3, b0, a0))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    if mat:
        obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def build_solid_plate(name, hw, hd, z0, z1, segs=80, mat=None):
    bm = bmesh.new()
    bot = []
    top = []
    for i in range(segs):
        ang = (i / segs) * math.tau
        x, y = chamfered_rect_point(ang, hw, hd)
        bot.append(bm.verts.new((x, y, z0)))
        top.append(bm.verts.new((x, y, z1)))
    bm.faces.new(list(reversed(bot)))
    bm.faces.new(top)
    for i in range(segs):
        ni = (i + 1) % segs
        bm.faces.new((bot[i], bot[ni], top[ni], top[i]))
    mesh = bpy.data.meshes.new(f"{name}_Mesh")
    bm.to_mesh(mesh)
    bm.free()
    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    if mat:
        obj.data.materials.append(mat)
    shade_smooth(obj)
    return obj


def export_glb(filepath: Path, apply_transforms=True):
    bpy.ops.export_scene.gltf(
        filepath=str(filepath),
        export_format="GLB",
        export_apply=apply_transforms,
        export_yup=True,
        export_materials="EXPORT",
    )
    print(f"[OK] Exported {filepath.name} ({filepath.stat().st_size / 1024.0:.1f} KB)")


# ==============================================================================
# MODULE 01: URBAN MASTERPLAN SOCKET PLAZA BASE (Z = 0.00 .. 0.36m)
# ==============================================================================
def build_mod01_plaza_base():
    reset_scene()
    mat_basalt = make_pbr_mat("BasaltStone", (0.055, 0.062, 0.076, 1.0), metallic=0.16, roughness=0.40)
    mat_socket = make_pbr_mat("SocketRecess", (0.03, 0.036, 0.048, 1.0), metallic=0.25, roughness=0.32)
    mat_brass = make_pbr_mat("BrassTrim", (0.84, 0.65, 0.36, 1.0), metallic=0.90, roughness=0.24, emission_rgb=(0.86, 0.64, 0.30), emission_strength=0.22)
    mat_cyan = make_pbr_mat("SubGridCyan", (0.22, 0.75, 0.96, 1.0), metallic=0.3, roughness=0.2, emission_rgb=(0.22, 0.78, 0.98), emission_strength=1.9)

    # Lower subterranean tech grid slab + stepped upper podium
    build_solid_plate("Plaza_LowerSlab", 3.15, 2.75, 0.00, 0.14, segs=80, mat=mat_basalt)
    build_solid_plate("Plaza_UpperPodium", 2.72, 2.38, 0.14, 0.34, segs=80, mat=mat_basalt)

    # Recessed Coaxial Socket Collar (exact registration lip at hw=2.24, hd=1.94 where Mod 04 Shell locks in!)
    build_extruded_ring("Plaza_SocketLip", 2.24, 1.94, 2.34, 2.04, 0.34, 0.40, segs=80, mat=mat_brass)
    build_solid_plate("Plaza_InnerFloor", 2.23, 1.93, 0.32, 0.35, segs=80, mat=mat_socket)

    # Glowing outer perimeter circuit rim & 4 corner registration sockets
    build_extruded_ring("Plaza_GlowTrack", 3.12, 2.72, 3.16, 2.76, 0.13, 0.155, segs=80, mat=mat_cyan)
    for sx in (-1, 1):
        for sy in (-1, 1):
            bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.075, depth=0.08, location=(sx * 2.02, sy * 1.74, 0.37))
            pin_pad = bpy.context.active_object
            pin_pad.data.materials.append(mat_cyan)
            shade_smooth(pin_pad)

    export_glb(MODULES_DIR / "mod_01_plaza_base.glb")


# ==============================================================================
# MODULE 02: INTERIOR MULTI-FLOOR SPATIAL CORE & HELICAL SPIRAL RAMP (Local Z = 0.00 .. 2.36m)
# Fits INSIDE Module 03 & Module 04 (Footprint hw=1.72, hd=1.48)
# ==============================================================================
def build_mod02_interior_core():
    reset_scene()
    mat_oak = make_pbr_mat("WarmOakSlab", (0.68, 0.46, 0.27, 1.0), metallic=0.04, roughness=0.44)
    mat_stone_white = make_pbr_mat("TravertineFloor", (0.86, 0.83, 0.77, 1.0), metallic=0.05, roughness=0.38)
    mat_warm_core = make_pbr_mat("WarmLightCore", (0.98, 0.80, 0.52, 1.0), metallic=0.1, roughness=0.25, emission_rgb=(0.98, 0.76, 0.42), emission_strength=1.15)
    mat_glass = make_pbr_mat("InteriorCurtainGlass", (0.62, 0.84, 0.95, 1.0), metallic=0.08, roughness=0.06, alpha=0.30)
    mat_brass = make_pbr_mat("HandrailBrass", (0.85, 0.67, 0.38, 1.0), metallic=0.88, roughness=0.24)

    # 3 Stacked Interior Mezzanine Floor Slabs with Central Void Cutout (Atrium!)
    floor_heights = [(0.02, 0.10, 1.66, 1.42), (0.78, 0.86, 1.58, 1.35), (1.56, 1.64, 1.50, 1.28)]
    for idx, (z0, z1, hw, hd) in enumerate(floor_heights):
        build_extruded_ring(
            f"Interior_Mezzanine_{idx + 1}",
            0.66,
            0.58,
            hw,
            hd,
            z0,
            z1,
            segs=72,
            mat=mat_stone_white if idx % 2 == 0 else mat_oak,
        )
        # Interior glass balustrade ring around atrium void
        build_extruded_ring(f"Atrium_Balustrade_{idx + 1}", 0.66, 0.58, 0.68, 0.60, z1, z1 + 0.18, segs=64, mat=mat_brass)

    # Central Luminous Warm Core Cylinder
    bpy.ops.mesh.primitive_cylinder_add(vertices=40, radius=0.32, depth=2.32, location=(0, 0, 1.16))
    core = bpy.context.active_object
    core.data.materials.append(mat_warm_core)
    shade_smooth(core)

    # Sculptural Helical Spiral Ramp / Staircase winding 1.5 turns up through the Atrium!
    bm = bmesh.new()
    steps = 96
    loops = []
    for i in range(steps + 1):
        t = i / steps
        ang = t * math.tau * 1.45
        z = 0.08 + t * 2.12
        r_in, r_out = 0.36, 0.64
        ca, sa = math.cos(ang), math.sin(ang)
        v0 = bm.verts.new((ca * r_in, sa * r_in, z - 0.028))
        v1 = bm.verts.new((ca * r_out, sa * r_out, z - 0.028))
        v2 = bm.verts.new((ca * r_out, sa * r_out, z + 0.028))
        v3 = bm.verts.new((ca * r_in, sa * r_in, z + 0.028))
        loops.append((v0, v1, v2, v3))
    for i in range(steps):
        a0, a1, a2, a3 = loops[i]
        b0, b1, b2, b3 = loops[i + 1]
        bm.faces.new((a0, b0, b1, a1))
        bm.faces.new((a1, b1, b2, a2))
        bm.faces.new((a2, b2, b3, a3))
        bm.faces.new((a3, b3, b0, a0))
    ramp_mesh = bpy.data.meshes.new("HelicalAtriumRamp_Mesh")
    bm.to_mesh(ramp_mesh)
    bm.free()
    ramp_obj = bpy.data.objects.new("HelicalAtriumRamp", ramp_mesh)
    bpy.context.collection.objects.link(ramp_obj)
    ramp_obj.data.materials.append(mat_oak)
    shade_smooth(ramp_obj)

    # 8 Interior Slender Columns
    for i in range(8):
        ang = (i / 8) * math.tau + math.pi / 8
        cx, cy = chamfered_rect_point(ang, 1.32, 1.12)
        bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.036, depth=2.30, location=(cx, cy, 1.16))
        col = bpy.context.active_object
        col.data.materials.append(mat_brass)
        shade_smooth(col)

    # Ultra-clear Interior Glass Curtain Envelope (hw=1.72, hd=1.48) so inside floors/spiral are 100% visible
    build_extruded_ring("Interior_GlassSkin", 1.70, 1.46, 1.73, 1.49, 0.02, 2.34, segs=80, mat=mat_glass)

    export_glb(MODULES_DIR / "mod_02_interior_core.glb")


# ==============================================================================
# MODULE 03: HOLLOW BRUSHED-BRASS & STEEL STRUCTURAL EXOSKELETON CAGE (Local Z = 0.00 .. 2.38m)
# Wraps coaxially AROUND Module 02 and fits INSIDE Module 04 (Footprint hw=1.98, hd=1.71)
# ==============================================================================
def build_mod03_structural_frame():
    reset_scene()
    mat_bronze = make_pbr_mat("StructuralChampagneBronze", (0.83, 0.65, 0.38, 1.0), metallic=0.92, roughness=0.24)
    mat_steel = make_pbr_mat("DarkDiagridSteel", (0.16, 0.19, 0.24, 1.0), metallic=0.85, roughness=0.30)

    hw, hd = 1.98, 1.71

    # 3 Horizontal Ring-Beams (Base, Mid-Transfer, Crown Ring)
    for z_lvl in (0.04, 1.18, 2.34):
        build_extruded_ring(f"Struct_RingBeam_{z_lvl:.2f}", hw - 0.06, hd - 0.06, hw + 0.03, hd + 0.03, z_lvl - 0.04, z_lvl + 0.04, segs=80, mat=mat_bronze)

    # 16 Perimeter Structural Columns
    for i in range(16):
        ang = (i / 16) * math.tau
        px, py = chamfered_rect_point(ang, hw - 0.01, hd - 0.01)
        bpy.ops.mesh.primitive_cylinder_add(vertices=14, radius=0.042, depth=2.36, location=(px, py, 1.18))
        col = bpy.context.active_object
        col.data.materials.append(mat_bronze if i % 2 == 0 else mat_steel)
        shade_smooth(col)

    # Diagonal Bracing Diagrid Lattice wrapping all 4 sides (100% open hollow center!)
    for direction in (-1, 1):
        for i in range(8):
            ang_start = (i / 8) * math.tau
            curve = bpy.data.curves.new(f"Diagrid_{direction}_{i}", type="CURVE")
            curve.dimensions = "3D"
            curve.bevel_depth = 0.026
            curve.bevel_resolution = 4
            sp = curve.splines.new("POLY")
            pts_count = 20
            sp.points.add(pts_count - 1)
            for k in range(pts_count):
                t = k / (pts_count - 1)
                ang = ang_start + direction * t * (math.tau / 4.0)
                x, y = chamfered_rect_point(ang, hw, hd)
                z = 0.05 + t * 2.28
                sp.points[k].co = (x, y, z, 1.0)
            c_obj = bpy.data.objects.new(f"DiagridMember_{direction}_{i}", curve)
            bpy.context.collection.objects.link(c_obj)
            bpy.context.view_layer.objects.active = c_obj
            c_obj.select_set(True)
            bpy.ops.object.convert(target="MESH")
            c_obj.data.materials.append(mat_steel)
            shade_smooth(c_obj)
            c_obj.select_set(False)

    export_glb(MODULES_DIR / "mod_03_structural_frame.glb")


# ==============================================================================
# MODULE 04: HOLLOW OUTER PARAMETRIC TERRACOTTA FACADE SHELL (Local Z = 0.00 .. 2.40m)
# Split cleanly at X = 0 into `Shell_Left` & `Shell_Right` for Clamshell Peel on Page 2!
# Footprint hw=2.24, hd=1.94 — locks directly into Plaza Socket Lip!
# ==============================================================================
def build_mod04_outer_shell():
    reset_scene()
    mat_terra = make_pbr_mat("KilnTerracotta", (0.76, 0.39, 0.24, 1.0), metallic=0.05, roughness=0.54)
    mat_terra_deep = make_pbr_mat("KilnTerracottaDeep", (0.56, 0.26, 0.16, 1.0), metallic=0.08, roughness=0.60)
    mat_brass_edge = make_pbr_mat("ShellBrassEdge", (0.85, 0.66, 0.36, 1.0), metallic=0.88, roughness=0.25)

    hw, hd = 2.24, 1.94
    all_shell_meshes = []

    # 15 Parametric Horizontal Louver Ribs with Grand Arched Cutouts on Front/Back/Left/Right
    # so you see RIGHT THROUGH the arches into Module 03 & Module 02!
    num_ribs = 15
    segs = 128
    for r_idx in range(num_ribs):
        frac = r_idx / (num_ribs - 1)
        base_z = 0.06 + frac * 2.30

        # Build continuous ring, skipping segments that fall beneath the 4 grand entrance arches!
        # Arch height profile peaks at 1.48m at the 4 cardinal face centers (cos(4*ang) == 1)
        bm = bmesh.new()
        w_in, w_out = 0.09, 0.09
        h_half = 0.038

        ring_samples = []
        for i in range(segs):
            ang = (i / segs) * math.tau
            # 4 grand arches centered at ang = 0, pi/2, pi, 3pi/2
            cardinal_peak = max(0.0, math.cos(2 * ang) ** 2 if i % 2 == 0 else math.cos(2 * ang) ** 2)
            arch_4 = max(0.0, math.cos(4 * ang)) ** 1.6
            arch_cut_h = 1.42 * arch_4

            wave_z = base_z + 0.12 * math.sin(4 * ang + frac * 1.6) * (1.0 - 0.5 * frac)
            inside_arch_opening = wave_z < arch_cut_h
            cx, cy = chamfered_rect_point(ang, hw + 0.05 * math.sin(frac * math.pi), hd + 0.05 * math.sin(frac * math.pi))
            ring_samples.append((cx, cy, wave_z, inside_arch_opening))

        # Emit solid segments wherever NOT inside an arch opening
        loops = []
        for i in range(segs):
            cx, cy, wz, is_open = ring_samples[i]
            if is_open:
                loops.append(None)
                continue
            rad_dir = Vector((cx, cy, 0.0)).normalized()
            p = Vector((cx, cy, wz))
            v0 = bm.verts.new(p - rad_dir * w_in + Vector((0, 0, -h_half)))
            v1 = bm.verts.new(p + rad_dir * w_out + Vector((0, 0, -h_half)))
            v2 = bm.verts.new(p + rad_dir * w_out + Vector((0, 0, h_half)))
            v3 = bm.verts.new(p - rad_dir * w_in + Vector((0, 0, h_half)))
            loops.append((v0, v1, v2, v3))

        for i in range(segs):
            ni = (i + 1) % segs
            cur_l = loops[i]
            nxt_l = loops[ni]
            if cur_l is not None and nxt_l is not None:
                a0, a1, a2, a3 = cur_l
                b0, b1, b2, b3 = nxt_l
                bm.faces.new((a0, b0, b1, a1))
                bm.faces.new((a1, b1, b2, a2))
                bm.faces.new((a2, b2, b3, a3))
                bm.faces.new((a3, b3, b0, a0))
            elif cur_l is not None and nxt_l is None:
                bm.faces.new((cur_l[0], cur_l[1], cur_l[2], cur_l[3]))
            elif cur_l is None and nxt_l is not None:
                bm.faces.new((nxt_l[3], nxt_l[2], nxt_l[1], nxt_l[0]))

        mesh = bpy.data.meshes.new(f"ShellRib_{r_idx:02d}_Mesh")
        bm.to_mesh(mesh)
        bm.free()
        rib_obj = bpy.data.objects.new(f"ShellRib_{r_idx:02d}", mesh)
        bpy.context.collection.objects.link(rib_obj)
        rib_obj.data.materials.append(mat_terra if r_idx % 2 == 0 else mat_terra_deep)
        shade_smooth(rib_obj)
        all_shell_meshes.append(rib_obj)

    # 4 Sculpted Corner Pier Columns framing the Hollow Shell + Continuous Crown Collar
    for k in range(4):
        ang = (k / 4) * math.tau + math.pi / 4.0
        px, py = chamfered_rect_point(ang, hw - 0.02, hd - 0.02)
        bpy.ops.mesh.primitive_cylinder_add(vertices=20, radius=0.15, depth=2.40, location=(px, py, 1.20))
        pier = bpy.context.active_object
        pier.data.materials.append(mat_terra)
        shade_smooth(pier)
        all_shell_meshes.append(pier)

    crown = build_extruded_ring("Shell_CrownCollar", hw - 0.08, hd - 0.08, hw + 0.06, hd + 0.06, 2.34, 2.42, segs=96, mat=mat_brass_edge)
    all_shell_meshes.append(crown)

    # Join & Precision-Bisect along X = 0 into `Shell_Left` (x <= 0) & `Shell_Right` (x >= 0)
    bpy.ops.object.select_all(action="DESELECT")
    for m in all_shell_meshes:
        m.select_set(True)
    bpy.context.view_layer.objects.active = all_shell_meshes[0]
    bpy.ops.object.join()
    unified_shell = bpy.context.active_object

    for side_name, clear_in, clear_out in (("Shell_Left", False, True), ("Shell_Right", True, False)):
        dup = unified_shell.copy()
        dup.data = unified_shell.data.copy()
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

    bpy.data.objects.remove(unified_shell, do_unlink=True)
    export_glb(MODULES_DIR / "mod_04_outer_shell.glb", apply_transforms=False)


# ==============================================================================
# MODULE 05: CANTILEVERED SKY-GARDEN ROOF CANOPY LID (Local Z = 0.00 .. 0.62m)
# Caps flush onto Module 04's top collar (Footprint hw=2.28, hd=1.98)
# ==============================================================================
def build_mod05_sky_roof_garden():
    reset_scene()
    mat_terra = make_pbr_mat("RoofCorniceTerra", (0.74, 0.38, 0.24, 1.0), metallic=0.06, roughness=0.52)
    mat_brass = make_pbr_mat("RoofBrassParapet", (0.85, 0.67, 0.37, 1.0), metallic=0.90, roughness=0.24)
    mat_lawn = make_pbr_mat("RoofMeadowGreen", (0.20, 0.45, 0.20, 1.0), metallic=0.0, roughness=0.76)
    mat_foliage = make_pbr_mat("RoofTreeCanopy", (0.15, 0.36, 0.17, 1.0), metallic=0.0, roughness=0.70)
    mat_glass = make_pbr_mat("OculusSkylightGlass", (0.62, 0.84, 0.96, 1.0), metallic=0.1, roughness=0.06, alpha=0.36)
    mat_timber = make_pbr_mat("RoofTreeTrunk", (0.40, 0.26, 0.15, 1.0), metallic=0.0, roughness=0.65)

    # Roof Slab with Central Skylight Oculus Opening so light pours straight down into Mod 02 Atrium!
    build_extruded_ring("Roof_CorniceTray", 0.68, 0.60, 2.28, 1.98, 0.00, 0.12, segs=84, mat=mat_terra)
    build_extruded_ring("Roof_BrassRim", 2.26, 1.96, 2.30, 2.00, 0.11, 0.17, segs=84, mat=mat_brass)
    build_extruded_ring("Roof_GreenLawn", 0.72, 0.64, 2.14, 1.84, 0.12, 0.20, segs=80, mat=mat_lawn)

    # Central Raised Glass Skylight Oculus Dome
    bpy.ops.mesh.primitive_uv_sphere_add(segments=40, ring_count=18, radius=0.72, location=(0, 0, 0.16))
    dome = bpy.context.active_object
    dome.scale = (1.0, 0.88, 0.34)
    dome.data.materials.append(mat_glass)
    shade_smooth(dome)

    bpy.ops.mesh.primitive_torus_add(major_radius=0.71, minor_radius=0.032, major_segments=56, minor_segments=12, location=(0, 0, 0.17))
    ring = bpy.context.active_object
    ring.scale = (1.0, 0.88, 1.0)
    ring.data.materials.append(mat_brass)
    shade_smooth(ring)

    # 8 Sculpted Rooftop Canopy Trees
    for t_idx in range(8):
        ang = (t_idx / 8) * math.tau + 0.32
        tx, ty = chamfered_rect_point(ang, 1.52, 1.30)
        bpy.ops.mesh.primitive_cylinder_add(vertices=10, radius=0.035, depth=0.24, location=(tx, ty, 0.30))
        tr = bpy.context.active_object
        tr.data.materials.append(mat_timber)
        bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=2, radius=0.22 + (t_idx % 2) * 0.05, location=(tx, ty, 0.46))
        cr = bpy.context.active_object
        cr.scale = (1.18, 1.06, 0.72)
        cr.data.materials.append(mat_foliage)
        shade_smooth(cr)

    export_glb(MODULES_DIR / "mod_05_sky_roof_garden.glb")


if __name__ == "__main__":
    build_mod01_plaza_base()
    build_mod02_interior_core()
    build_mod03_structural_frame()
    build_mod04_outer_shell()
    build_mod05_sky_roof_garden()
    print("[DONE] All 5 Coaxial Interlocking Architectural Modules generated cleanly!")
