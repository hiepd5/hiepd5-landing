import base64
import json
import os
import shutil
import socket
import struct
import subprocess
import sys
import tempfile
import time
import urllib.request

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT_DIR = os.path.join(tempfile.gettempdir(), "hd5_v5_e2e_shots")
PROFILE_DIR = os.path.join(tempfile.gettempdir(), "hd5_v5_cdp_profile")
CDP_PORT = 9348


class MiniCDP:
    def __init__(self, ws_url: str):
        rest = ws_url.split("ws://", 1)[1]
        host_port, path = rest.split("/", 1)
        host, port = host_port.split(":")
        self.sock = socket.create_connection((host, int(port)), timeout=15)
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        req = (
            f"GET /{path} HTTP/1.1\r\n"
            f"Host: {host_port}\r\n"
            f"Upgrade: websocket\r\n"
            f"Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            f"Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.sock.sendall(req.encode("ascii"))
        buf = b""
        while b"\r\n\r\n" not in buf:
            buf += self.sock.recv(4096)
        self.leftover = buf.split(b"\r\n\r\n", 1)[1]
        self.msg_id = 0
        self.events = []

    def _recv_exact(self, n: int) -> bytes:
        while len(self.leftover) < n:
            chunk = self.sock.recv(65536)
            if not chunk:
                raise EOFError("WebSocket closed")
            self.leftover += chunk
        out = self.leftover[:n]
        self.leftover = self.leftover[n:]
        return out

    def _read_frame(self) -> str:
        hdr = self._recv_exact(2)
        opcode = hdr[0] & 0x0F
        length = hdr[1] & 0x7F
        if length == 126:
            length = struct.unpack(">H", self._recv_exact(2))[0]
        elif length == 127:
            length = struct.unpack(">Q", self._recv_exact(8))[0]
        payload = self._recv_exact(length)
        if opcode == 0x9:
            self._send_raw(payload, opcode=0xA)
            return self._read_frame()
        return payload.decode("utf-8", errors="replace")

    def _send_raw(self, payload: bytes, opcode: int = 0x1):
        mask = os.urandom(4)
        n = len(payload)
        header = bytearray([0x80 | opcode])
        if n < 126:
            header.append(0x80 | n)
        elif n < 65536:
            header.append(0x80 | 126)
            header.extend(struct.pack(">H", n))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack(">Q", n))
        header.extend(mask)
        masked = bytes(b ^ mask[i % 4] for i, b in enumerate(payload))
        self.sock.sendall(bytes(header) + masked)

    def call(self, method: str, params=None):
        self.msg_id += 1
        cid = self.msg_id
        msg = json.dumps({"id": cid, "method": method, "params": params or {}}).encode("utf-8")
        self._send_raw(msg)
        while True:
            raw = self._read_frame()
            obj = json.loads(raw)
            if obj.get("id") == cid:
                if "error" in obj:
                    raise RuntimeError(f"CDP {method} error: {obj['error']}")
                return obj.get("result", {})
            if "method" in obj:
                self.events.append(obj)

    def drain(self, wait_sec: float):
        end = time.time() + wait_sec
        self.sock.settimeout(0.25)
        while time.time() < end:
            try:
                raw = self._read_frame()
                obj = json.loads(raw)
                if "method" in obj:
                    self.events.append(obj)
            except socket.timeout:
                pass
        self.sock.settimeout(15)

    def eval_js(self, expr: str):
        res = self.call("Runtime.evaluate", {"expression": expr, "returnByValue": True, "awaitPromise": True})
        if "exceptionDetails" in res:
            raise RuntimeError(f"JS eval exception: {res['exceptionDetails']}")
        return res.get("result", {}).get("value")

    def screenshot(self, filename: str) -> str:
        res = self.call("Page.captureScreenshot", {"format": "png"})
        out_path = os.path.join(OUT_DIR, filename)
        with open(out_path, "wb") as f:
            f.write(base64.b64decode(res["data"]))
        return out_path

    def close(self):
        try:
            self.sock.close()
        except Exception:
            pass


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    shutil.rmtree(OUT_DIR, ignore_errors=True)
    shutil.rmtree(PROFILE_DIR, ignore_errors=True)
    os.makedirs(OUT_DIR, exist_ok=True)

    proc = subprocess.Popen(
        [
            CHROME,
            "--headless=new",
            f"--user-data-dir={PROFILE_DIR}",
            f"--remote-debugging-port={CDP_PORT}",
            "--remote-allow-origins=*",
            "--no-first-run",
            "--no-default-browser-check",
            "--window-size=1440,900",
            "--enable-webgl",
            "--ignore-gpu-blocklist",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )

    cdp = None
    try:
        ws_url = None
        for _ in range(30):
            try:
                with urllib.request.urlopen(f"http://127.0.0.1:{CDP_PORT}/json", timeout=2) as r:
                    targets = json.loads(r.read().decode("utf-8"))
                    pages = [t for t in targets if t.get("type") == "page"]
                    if pages:
                        ws_url = pages[0]["webSocketDebuggerUrl"]
                        break
            except Exception:
                time.sleep(0.2)
        if not ws_url:
            raise RuntimeError("Could not attach to headless Chrome CDP port")

        cdp = MiniCDP(ws_url)
        cdp.call("Page.enable")
        cdp.call("Runtime.enable")
        cdp.call("Log.enable")
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 1440, "height": 900, "deviceScaleFactor": 1, "mobile": False})

        # 1. Boot into V6 Spatial Pro state (hero headline, 5 hotspots, 0 cards, 5 segmented FX)
        cdp.call("Page.navigate", {"url": "http://localhost:5188/"})
        cdp.drain(3.6)

        boot_state = cdp.eval_js(
            """(() => {
              const canvas = document.querySelector('.webgl-stage-fixed canvas');
              const loader = document.getElementById('hd5-boot-loader');
              return {
                hasCanvas: Boolean(canvas && canvas.width > 0 && canvas.height > 0),
                loaderGone: !loader || getComputedStyle(loader).opacity === '0',
                heroHeadline: document.querySelector('.hero-headline')?.textContent || '',
                navBar: Boolean(document.querySelector('.nav-bar')),
                hotspots: document.querySelectorAll('.hotspot').length,
                openCards: document.querySelectorAll('.spatial-card').length,
                segButtons: document.querySelectorAll('.segmented .seg-btn').length,
                emojiFree: !/[\\u2600-\\u27BF\\u{1F300}-\\u{1FAFF}]/u.test(document.querySelector('.nav-bar')?.textContent + document.querySelector('.fx-dock')?.textContent),
                bodyFont: getComputedStyle(document.body).fontFamily.slice(0, 60)
              };
            })()"""
        )
        s1 = cdp.screenshot("shot_01_v6_hero.png")

        # 2. Click hotspot (Spiral core) -> opens single Spatial Card
        cdp.eval_js("document.querySelectorAll('.hotspot')[3]?.click()")
        cdp.drain(0.7)
        click_state = cdp.eval_js(
            """(() => ({
              openCards: document.querySelectorAll('.spatial-card').length,
              cardTitle: document.querySelector('.spatial-card-title')?.textContent || ''
            }))()"""
        )
        s2 = cdp.screenshot("shot_02_v6_card.png")

        # 3. Trigger X-Ray from card CTA, dismiss card
        cdp.eval_js("document.querySelector('.spatial-card .text-link')?.click()")
        cdp.drain(0.2)
        cdp.eval_js("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))")
        cdp.drain(1.1)
        s3 = cdp.screenshot("shot_03_v6_xray.png")

        # 4. Five-layer explode via segmented control (#2)
        cdp.eval_js("document.querySelectorAll('.segmented .seg-btn')[2]?.click()")
        cdp.drain(1.4)
        s4 = cdp.screenshot("shot_04_v6_explode.png")

        # 5. Laser slice via segmented control (#3)
        cdp.eval_js("document.querySelectorAll('.segmented .seg-btn')[3]?.click()")
        cdp.drain(1.2)
        s5 = cdp.screenshot("shot_05_v6_laser.png")

        # 6. Back to auto, scroll to #plugins (Apple Bento Showcase) & verify WebGL auto-sleep + PDPL opt-in
        cdp.eval_js("document.querySelectorAll('.segmented .seg-btn')[0]?.click()")
        cdp.eval_js(
            """(() => {
              const sp = document.querySelector('.scroll-spatial-spacer');
              window.scrollTo({ top: (sp ? sp.offsetHeight : 1800) + 24, behavior: 'instant' });
            })()"""
        )
        cdp.drain(1.2)
        plugins_state = cdp.eval_js(
            """(() => {
              const cb = document.querySelector('.beta-consent-checkbox');
              return {
                canvasSleeping: Boolean(document.querySelector('.webgl-stage-fixed.is-sleeping')),
                dockHidden: Boolean(document.querySelector('.fx-dock.is-hidden')),
                pluginTitles: Array.from(document.querySelectorAll('.plugin-title')).map((el) => el.textContent.trim()),
                hasOsmBadge: (document.querySelector('#plugins')?.textContent || '').includes('OpenStreetMap'),
                betaCheckboxExists: Boolean(cb),
                betaCheckboxUnchecked: Boolean(cb && cb.checked === false),
                galleryCards: document.querySelectorAll('.gallery-card').length
              };
            })()"""
        )
        s6 = cdp.screenshot("shot_06_v61_plugins.png")

        # 6b. Scroll to #gallery Bento Grid
        cdp.eval_js("document.getElementById('gallery')?.scrollIntoView({ behavior: 'instant', block: 'start' })")
        cdp.drain(0.9)
        s6b = cdp.screenshot("shot_06b_v61_gallery.png")

        # 7. Footer (apple.com style)
        cdp.eval_js("window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' })")
        cdp.drain(1.0)
        footer_state = cdp.eval_js(
            """(() => ({
              dockHidden: Boolean(document.querySelector('.fx-dock.is-hidden')),
              authorName: document.querySelector('.footer-name')?.textContent || '',
              linksCount: document.querySelectorAll('.footer-link').length,
              sourcesCount: document.querySelectorAll('.footer-source').length
            }))()"""
        )
        s7 = cdp.screenshot("shot_07_v6_footer.png")

        # 8. Mobile 390x844 hero (1-Pass Lite GPU, 0 floating HTML hotspots)
        cdp.call("Emulation.setDeviceMetricsOverride", {"width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True})
        cdp.eval_js("window.scrollTo({ top: 0, behavior: 'instant' })")
        cdp.call("Page.reload")
        cdp.drain(3.6)
        mobile_state = cdp.eval_js(
            """(() => ({
              heroHeadline: document.querySelector('.hero-headline')?.textContent || '',
              hotspotsOnMobile: document.querySelectorAll('.hotspot').length,
              segButtons: document.querySelectorAll('.segmented .seg-btn').length,
              overflowX: document.documentElement.scrollWidth > innerWidth
            }))()"""
        )
        s8 = cdp.screenshot("shot_08_v61_mobile_hero.png")

        # 9. Mobile 390x844 scrolled into #plugins Bento Showcase (WebGL sleeping = 0% GPU)
        cdp.eval_js(
            """(() => {
              const sp = document.querySelector('.scroll-spatial-spacer');
              window.scrollTo({ top: (sp ? sp.offsetHeight : 1500) + 20, behavior: 'instant' });
            })()"""
        )
        cdp.drain(1.0)
        mobile_plugins_state = cdp.eval_js(
            """(() => ({
              canvasSleeping: Boolean(document.querySelector('.webgl-stage-fixed.is-sleeping')),
              overflowX: document.documentElement.scrollWidth > innerWidth,
              pluginCards: document.querySelectorAll('.plugin-bento-card').length
            }))()"""
        )
        s9 = cdp.screenshot("shot_09_v61_mobile_plugins.png")

        errors = []
        for ev in cdp.events:
            m = ev.get("method")
            p = ev.get("params", {})
            if m == "Runtime.exceptionThrown":
                errors.append({"type": "exception", "detail": p.get("exceptionDetails", {}).get("text", str(p))})
            elif m == "Runtime.consoleAPICalled" and p.get("type") == "error":
                args_txt = " ".join(str(a.get("value") or a.get("description") or "") for a in p.get("args", []))
                errors.append({"type": "console.error", "detail": args_txt})
            elif m == "Log.entryAdded" and p.get("entry", {}).get("level") == "error":
                ent = p.get("entry", {})
                if "favicon.ico" not in (ent.get("url") or ""):
                    errors.append({"type": "log.error", "detail": f"{ent.get('text')} ({ent.get('url')})"})

        summary = {
            "errors_count": len(errors),
            "errors": errors,
            "boot_v6": boot_state,
            "hotspot_click": click_state,
            "plugins_bento": plugins_state,
            "footer": footer_state,
            "mobile_hero": mobile_state,
            "mobile_plugins": mobile_plugins_state,
            "screenshots": [s1, s2, s3, s4, s5, s6, s6b, s7, s8, s9],
        }
        print(json.dumps(summary, indent=2, ensure_ascii=False))
        if (
            errors
            or not boot_state.get("hasCanvas")
            or boot_state.get("openCards") != 0
            or boot_state.get("hotspots") != 5
            or boot_state.get("segButtons") != 5
            or click_state.get("openCards") != 1
            or not plugins_state.get("canvasSleeping")
            or len(plugins_state.get("pluginTitles", [])) != 2
            or not plugins_state.get("hasOsmBadge")
            or not plugins_state.get("betaCheckboxUnchecked")
            or plugins_state.get("galleryCards") != 6
            or footer_state.get("linksCount") != 6
            or mobile_state.get("hotspotsOnMobile") != 0
            or mobile_state.get("overflowX")
            or not mobile_plugins_state.get("canvasSleeping")
            or mobile_plugins_state.get("overflowX")
        ):
            sys.exit(1)
    finally:
        if cdp:
            cdp.close()
        proc.terminate()
        try:
            proc.wait(timeout=4)
        except Exception:
            proc.kill()
        shutil.rmtree(PROFILE_DIR, ignore_errors=True)


if __name__ == "__main__":
    main()
