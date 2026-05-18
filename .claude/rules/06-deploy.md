---
description: Kiến trúc deploy — Vercel + Cloudflare R2, ASSET_BASE, GitHub, domain
---

# Deploy & Infrastructure

## Kiến trúc

```
hiepd5.com (Cloudflare DNS)
    ↓
Vercel project: hiepd5-landing (account jeamin2811)
    ← GitHub: hiepd5/hiepd5-landing (3 file: index.html, style.css, main.js)

assets.hiepd5.com (Cloudflare DNS → R2 custom domain)
    ↓
Cloudflare R2 bucket: hiepd5 (account jeamin2811)
    ← key prefix: hiepd5-assets/
    ← images/scene-01.jpg … scene-05.jpg
    ← frames/t-01-02/0001.jpg … t-05-01/0152.jpg
```

## ASSET_BASE

```js
// Local dev:
const ASSET_BASE = 'assets/';

// Production:
const ASSET_BASE = 'https://assets.hiepd5.com/hiepd5-assets/';
```

**Quan trọng:** Key R2 có prefix `hiepd5-assets/` — upload tool tự tạo subfolder này.  
URL đúng: `https://assets.hiepd5.com/hiepd5-assets/frames/t-01-02/0001.jpg`

## Deploy workflow

```bash
# Sửa code xong → push → Vercel tự build (~30s)
git add index.html style.css main.js
git commit -m "mô tả thay đổi"
git push
```

## Swap asset (không cần redeploy)

Upload file mới lên R2 cùng key → URL không đổi → website tự cập nhật.

## DNS Cloudflare (hiepd5.com)

| Type | Name | Content |
|------|------|---------|
| A | hiepd5.com | 76.76.21.21 |
| CNAME | www | cname.vercel-dns.com |
| TXT | _vercel | vc-domain-verify=hiepd5.com,05c31c34b3d87849e3ca |
| TXT | _vercel | vc-domain-verify=www.hiepd5.com,5bd1910dd8ce55300838 |
| R2 | assets.hiepd5.com | hiepd5 (Proxied) |

## Accounts

| Service | Account |
|---------|---------|
| GitHub repo | hiepd5/hiepd5-landing (jeamin2811) |
| Vercel | jeamin2811 |
| Cloudflare / R2 | jeamin2811 |
| Vercel cũ (Next.js) | arcvuongdachiep — KHÔNG dùng cho landing page |
