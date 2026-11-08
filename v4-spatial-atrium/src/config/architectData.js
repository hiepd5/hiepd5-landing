import { COMMERCIAL_CONFIG, OWNER_INFO, PRODUCT_SHOWCASE } from './siteContent';

export { COMMERCIAL_CONFIG };

export function recordBetaSignal(signalKey = 'ecosystem_click') {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = window.localStorage.getItem('hd5_beta_telemetry') || '{}';
    const parsed = JSON.parse(raw);
    parsed[signalKey] = (parsed[signalKey] || 0) + 1;
    parsed.updatedAt = new Date().toISOString();
    window.localStorage.setItem('hd5_beta_telemetry', JSON.stringify(parsed));
    return parsed[signalKey];
  } catch {
    return 0;
  }
}

export function detectInitialLang() {
  if (typeof window === 'undefined') return 'vi';
  try {
    const saved = window.localStorage.getItem('hd5_lang');
    if (saved === 'vi' || saved === 'en') return saved;
  } catch {
    // ignore storage restriction
  }
  const langs = window.navigator?.languages?.length
    ? window.navigator.languages
    : [window.navigator?.language || ''];
  if (langs.some((l) => String(l).toLowerCase().startsWith('vi'))) {
    return 'vi';
  }
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    if (tz === 'Asia/Ho_Chi_Minh' || tz === 'Asia/Saigon' || tz === 'Asia/Bangkok') {
      return 'vi';
    }
  } catch {
    // ignore Intl fallback
  }
  return 'en';
}

const V6_PALETTE = {
  bg: '#0a0a0b',
  primary: '#ff7a59',
  secondary: '#f5f5f7',
  aurora: '#161618',
  rim: '#ff7a59',
};
const PALETTES = [V6_PALETTE, V6_PALETTE, V6_PALETTE, V6_PALETTE, V6_PALETTE];

const MODELS = {
  modules: {
    plaza: '/models/modules/mod_01_plaza_base.glb',
    interior: '/models/modules/mod_02_interior_core.glb',
    structure: '/models/modules/mod_03_structural_frame.glb',
    shell: '/models/modules/mod_04_outer_shell.glb',
    roof: '/models/modules/mod_05_sky_roof_garden.glb',
  },
};

const V6_COPY = {
  vi: {
    nav: {
      plugins: 'Plugin SketchUp',
      gallery: 'Ảnh sản phẩm',
      projects: 'Đối chứng 1:1',
      ecosystem: 'Liên kết',
      contact: 'Liên hệ',
      top: 'Lên đầu trang',
    },
    hero: {
      lines: ['Kiến trúc.', 'Đa chiều.'],
      sub: 'KTS. Vương Đắc Hiệp — Hệ sinh thái Plugin SketchUp, Thiết kế & Diễn họa AI.',
      primary: 'Xem Plugin SketchUp',
      secondary: 'Đối chứng ảnh 1:1',
    },
    chapterCopy: [
      null,
      { title: '5 lớp mô-đun.', sub: 'Đế, lõi, khung, vỏ và mái — bóc tách trực quan.' },
      { title: 'Khớp khung dây.', sub: 'Đối chiếu trực tiếp hình học mô hình và vật liệu.' },
      { title: 'Ánh sáng & Nắng.', sub: 'Mô phỏng hướng chiếu sáng trên khối công trình.' },
      { title: 'Plugin SketchUp.', sub: 'Cuộn tiếp xuống để xem Render AI Studio & MapSKP.' },
    ],
    hotspotShort: {
      plaza: 'Mặt đế',
      interior: 'Lõi xoắn',
      structure: 'Hệ khung',
      shell: 'Hệ vỏ',
      roof: 'Mái xanh',
      zoning: 'Khối bao',
    },
    footer: { links: 'Liên kết chính thức', tech: 'Nền tảng kỹ thuật', legal: 'Pháp lý & Bản quyền' },
  },
  en: {
    nav: {
      plugins: 'SketchUp Plugins',
      gallery: 'Gallery',
      projects: '1:1 Compare',
      ecosystem: 'Links',
      contact: 'Contact',
      top: 'Back to top',
    },
    hero: {
      lines: ['Architecture.', 'In every dimension.'],
      sub: 'Arch. Vuong Dac Hiep — SketchUp AI Plugins, Design & Visualization.',
      primary: 'Explore Plugins',
      secondary: '1:1 Comparison',
    },
    chapterCopy: [
      null,
      { title: 'Five modules.', sub: 'Base, core, frame, shell, and roof — cleanly separated.' },
      { title: 'Wireframe lock.', sub: 'Direct alignment between geometry and surface shading.' },
      { title: 'Solar study.', sub: 'Interactive directional light across the massing.' },
      { title: 'SketchUp Plugins.', sub: 'Scroll down for Render AI Studio & MapSKP.' },
    ],
    hotspotShort: {
      plaza: 'Base plinth',
      interior: 'Spiral core',
      structure: 'Frame',
      shell: 'Outer shell',
      roof: 'Roof canopy',
      zoning: 'Envelope',
    },
    footer: { links: 'Official links', tech: 'Technology', legal: 'Legal & IP' },
  },
};

const LOCALIZED = {
  vi: {
    langCode: 'vi',
    ui: {
      overviewTitle: 'Mở khung kéo đối chứng hình học 1:1 (Phím O)',
      langSwitchTitle: 'Chuyển ngôn ngữ Tiếng Việt ⇄ English (Phím L)',
      menuTitle: 'Mở nhanh các kênh chính thức (Ctrl+K)',
      fxModes: [
        { id: 'auto', icon: '✦', label: 'Tự động', title: 'Xoay theo nhịp cuộn trang' },
        { id: 'xray', icon: '◎', label: 'X-Ray', title: 'Làm mờ lớp vỏ để quan sát lõi bên trong' },
        { id: 'explode', icon: '≡', label: '5 Lớp', title: 'Tách rời 5 lớp mô-đun công trình' },
        { id: 'laser', icon: '⚡', label: 'Laser', title: 'Cắt mặt phẳng đối chiếu khung dây & vật liệu' },
        { id: 'solar', icon: '☀', label: 'Ánh nắng', title: 'Mô phỏng quỹ đạo chiếu sáng' },
      ],
      closeBtn: 'Đóng',
      zoningTag: { code: 'ENVELOPE', name: 'Khung bao không gian mô hình', metric: '3D STAGE' },
      hub: {
        eyebrow: 'HIEPD5 · KÊNH CHÍNH THỨC',
        title: 'Liên Kết Hệ Sinh Thái HiệpD5',
        cards: [
          {
            title: 'Render AI Studio & MapSKP',
            desc: 'Cuộn tới khu trưng bày Plugin SketchUp trên trang',
            action: 'scrollPlugins',
          },
          {
            title: 'Đối Chứng Hình Học 1:1',
            desc: 'Kéo thanh gạt so sánh Khung dây gốc ↔ Ảnh Render',
            action: 'openOverview',
          },
          {
            title: 'HD5Studio.com',
            desc: 'Website dịch vụ Thiết kế & Diễn họa Kiến trúc',
            url: OWNER_INFO.studioUrl,
          },
          {
            title: 'HiệpD5 AI Prompt 2.0',
            desc: 'Ứng dụng hỗ trợ gợi ý ánh sáng & vật liệu',
            url: OWNER_INFO.aiPromptUrl,
          },
          {
            title: 'Kênh YouTube HiệpD5',
            desc: 'Video chia sẻ quy trình SketchUp, D5 & AI',
            url: OWNER_INFO.youtube,
          },
          {
            title: `Zalo ${OWNER_INFO.phone}`,
            desc: 'Liên hệ trực tiếp KTS. Vương Đắc Hiệp',
            url: OWNER_INFO.zalo,
          },
        ],
      },
      overview: {
        eyebrow: '1:1 GEOMETRY COMPARISON',
        heading: 'Đối Chứng Khung Dây & Kết Quả Render',
        lead: 'Kéo thanh trượt sang trái/phải để kiểm tra độ trùng khớp hình học. Bộ ảnh sản phẩm mới từ Render AI Studio sẽ tiếp tục được bổ sung.',
        stats: [
          { value: '1 : 1', label: 'Giữ nguyên góc máy & tỷ lệ' },
          { value: 'SU 17–26', label: 'Tương thích SketchUp' },
          { value: 'Render AI', label: 'Plugin kết xuất trực tiếp' },
          { value: 'MapSKP', label: 'Plugin bản đồ & bối cảnh' },
        ],
        sliderLabelLeft: 'KHUNG DÂY GỐC',
        sliderLabelRight: 'ẢNH KẾT QUẢ',
        sliderHint: '⇄ Kéo thanh gạt để so sánh chi tiết từng nét cấu kiện',
        pillarsTitle: 'Danh Mục Đang Triển Khai',
        pillars: [
          {
            tag: 'PLUGIN SKETCHUP',
            title: 'Render AI Studio for SketchUp',
            price: 'Đang mở đăng ký thử nghiệm Beta',
            desc: 'Kết xuất phương án AI bám sát hình học khung nhìn SketchUp.',
            ctaLabel: 'Nhắn Zalo nhận Beta',
            url: OWNER_INFO.zalo,
          },
          {
            tag: 'PLUGIN SKETCHUP',
            title: 'MapSKP for SketchUp',
            price: 'Đang cập nhật ảnh & tài liệu',
            desc: 'Nhập dữ liệu bản đồ, địa hình và khối công trình lân cận vào SketchUp.',
            ctaLabel: 'Đăng ký nhận tin',
            url: OWNER_INFO.zalo,
          },
          {
            tag: 'STUDIO & CỘNG ĐỒNG',
            title: 'HD5Studio.com & YouTube HiệpD5',
            price: 'Tài nguyên & dịch vụ chuyên ngành',
            desc: 'Diễn họa kiến trúc, quy hoạch và chuỗi bài hướng dẫn thực hành.',
            ctaLabel: 'Mở HD5Studio.com',
            url: OWNER_INFO.studioUrl,
          },
        ],
        directBarText: 'Cần trao đổi trực tiếp về Plugin SketchUp hoặc hợp tác dự án?',
        primaryContactLabel: `Zalo ${OWNER_INFO.phone}`,
        primaryContactUrl: OWNER_INFO.zalo,
        secondaryContactLabel: 'Gửi Email',
        secondaryContactUrl: OWNER_INFO.emailHref,
        backTo3dLabel: 'Đóng cửa sổ',
      },
      webglFallback: {
        title: 'Thiết bị đang tắt hiển thị 3D WebGL',
        desc: 'Bạn vẫn có thể xem đầy đủ thông tin Plugin Render AI Studio, MapSKP và bộ ảnh đối chứng bên dưới.',
        cta: 'Xem Kho Đối Chứng Ảnh',
      },
      colophon: {
        eyebrow: 'THÔNG TIN CHÍNH CHỦ & NGUỒN CÔNG NGHỆ',
        architectRole: 'Kiến trúc sư · Nhà phát triển hệ sinh thái Plugin SketchUp & HD5 Studio.',
        open8kBtn: 'Đối chứng ảnh 1:1',
        linksHeading: 'Liên kết chính thức',
        links: [
          {
            label: 'HD5Studio.com',
            sub: 'Thiết kế & Diễn họa Kiến trúc',
            url: OWNER_INFO.studioUrl,
            signal: 'studio_click',
          },
          {
            label: 'Render AI Studio for SketchUp',
            sub: 'Plugin kết xuất AI giữ hình học 1:1',
            url: OWNER_INFO.zalo,
            signal: 'upgrade_click_render_ai_studio',
          },
          {
            label: 'MapSKP for SketchUp',
            sub: 'Plugin nhập bản đồ & địa hình SketchUp',
            url: OWNER_INFO.zalo,
            signal: 'upgrade_click_mapskp',
          },
          {
            label: 'HiệpD5 AI Prompt 2.0',
            sub: 'Công cụ gợi ý ánh sáng & vật liệu',
            url: OWNER_INFO.aiPromptUrl,
            signal: 'prompt_click',
          },
          {
            label: 'Kênh YouTube HiệpD5',
            sub: 'Hướng dẫn D5 Render & AI thực hành',
            url: OWNER_INFO.youtube,
            signal: 'youtube_click',
          },
          {
            label: 'Cộng Đồng D5 Render VN',
            sub: 'Nhóm trao đổi chuyên môn trên Facebook',
            url: OWNER_INFO.fbGroup,
            signal: 'community_click',
          },
        ],
        sourcesHeading: 'Công nghệ & Pháp lý',
        sources: [
          {
            k: 'Đồ họa không gian 3D',
            v: 'Three.js & React Three Fiber (Giấy phép mã nguồn mở MIT sạch · 0% GPL/AGPL).',
          },
          {
            k: ' Tối ưu hiệu năng Đa thiết bị',
            v: 'Mô hình 5 lớp nén lượng tử KHR_mesh_quantization & chế độ tiết kiệm GPU tự động trên di động.',
          },
          {
            k: 'Nguồn dữ liệu Bản đồ (MapSKP)',
            v: 'Ghi công chuẩn quốc tế: © OpenStreetMap contributors (ODbL).',
          },
          {
            k: 'Pháp lý & Nhãn hiệu 2026',
            v: 'Render AI Studio for SketchUp và MapSKP for SketchUp là sản phẩm độc lập (không trực thuộc Trimble Inc.). Tuân thủ Luật BVDLCN 91/2025/QH15 · Bản Beta cung cấp nguyên trạng ("AS-IS").',
          },
        ],
        copyright: '© 2026 KTS. Vương Đắc Hiệp (HiepD5.com · HD5Studio.com).',
      },
    },
    curiosityNodes: [
      {
        modId: 'roof',
        code: 'LỚP 05',
        metric: 'MÔ-ĐUN MÁI',
        title: 'Hệ Mái & Giếng Trời Trung Tâm',
        detail: 'Mô-đun đỉnh công trình minh họa khả năng tách lớp độc lập trong không gian 3D.',
        fxAction: 'solar',
        ctaLabel: 'Xem hiệu ứng Ánh nắng',
      },
      {
        modId: 'shell',
        code: 'LỚP 04',
        metric: 'MÔ-ĐUN VỎ',
        title: 'Hệ Vỏ Lam Bao Che',
        detail: 'Hai cánh vỏ mặt đứng có thể tách mở trực tiếp để quan sát kết cấu bên trong.',
        fxAction: 'explode',
        ctaLabel: 'Tách mở 5 lớp mô-đun',
      },
      {
        modId: 'structure',
        code: 'LỚP 03',
        metric: 'MÔ-ĐUN KHUNG',
        title: 'Hệ Khung Chịu Lực',
        detail: 'Lớp khung xương trung gian dùng để đối chiếu trực tiếp giữa lưới khung dây và bề mặt vật liệu.',
        fxAction: 'laser',
        ctaLabel: 'Bật mặt cắt Laser',
      },
      {
        modId: 'interior',
        code: 'LỚP 02',
        metric: 'MÔ-ĐUN LÕI',
        title: 'Lõi Không Gian Bên Trong',
        detail: 'Khối không gian nội thất trung tâm lộ rõ khi chuyển sang chế độ nhìn xuyên thấu X-Ray.',
        fxAction: 'xray',
        ctaLabel: 'Bật chế độ X-Ray',
      },
      {
        modId: 'plaza',
        code: 'LỚP 01',
        metric: 'MÔ-ĐUN ĐẾ',
        title: 'Mặt Đế & Bối Cảnh Khu Đất',
        detail: 'Lớp nền tiếp đất đại diện cho quy trình nhập bối cảnh bản đồ và địa hình.',
        fxAction: 'plugins',
        ctaLabel: 'Xem Plugin bên dưới',
      },
    ],
    proofCases: [
      {
        id: 'sample-01',
        code: 'MẪU 01',
        tab: '01 · Ngoại thất vòm',
        title: 'Đối chứng Khung dây & Kết quả Render #01',
        caption: 'Ảnh mẫu minh họa độ khớp cạnh hình học (sẽ bổ sung thêm ảnh chụp trực tiếp từ Render AI Studio).',
        bp: '/proof/scene-01-bp.webp',
        render: '/proof/scene-01-8k.webp',
        metrics: ['Khớp góc nhìn 1:1', 'Mẫu đối chứng #01'],
      },
      {
        id: 'sample-02',
        code: 'MẪU 02',
        tab: '02 · Không gian cầu',
        title: 'Đối chứng Khung dây & Kết quả Render #02',
        caption: 'Kiểm tra chi tiết lan can, độ cong vòm và ánh sáng gián tiếp.',
        bp: '/proof/scene-03-bp.webp',
        render: '/proof/scene-03-8k.webp',
        metrics: ['Khớp góc nhìn 1:1', 'Mẫu đối chứng #02'],
      },
      {
        id: 'sample-03',
        code: 'MẪU 03',
        tab: '03 · Khối cao tầng',
        title: 'Đối chứng Khung dây & Kết quả Render #03',
        caption: 'Kiểm tra tỷ lệ mặt đứng kính và lam chắn nắng công trình.',
        bp: '/proof/scene-05-bp.webp',
        render: '/proof/scene-05-8k.webp',
        metrics: ['Khớp góc nhìn 1:1', 'Mẫu đối chứng #03'],
      },
    ],
    ecosystemPortals: [
      {
        id: 'render-ai',
        code: 'AI',
        badge: 'SKETCHUP PLUGIN',
        title: 'Render AI Studio for SketchUp',
        desc: 'Plugin kết xuất phương án AI trực tiếp từ SketchUp.',
        ctaLabel: 'Xem chi tiết bên dưới',
        action: 'plugins',
        position: [-2.4, 0.92, 2.35],
      },
      {
        id: 'mapskp',
        code: 'MAP',
        badge: 'SKETCHUP PLUGIN',
        title: 'MapSKP for SketchUp',
        desc: 'Plugin nhập bản đồ, địa hình & bối cảnh khu đất vào SketchUp.',
        ctaLabel: 'Xem chi tiết bên dưới',
        action: 'plugins',
        position: [0.0, 0.92, 2.75],
      },
      {
        id: 'hd5studio',
        code: 'HD5',
        badge: 'STUDIO',
        title: 'HD5Studio.com',
        desc: 'Dịch vụ Thiết kế & Diễn họa Kiến trúc.',
        ctaLabel: 'Mở HD5Studio.com',
        url: OWNER_INFO.studioUrl,
        position: [2.4, 0.92, 2.35],
      },
    ],
    chapters: [
      { id: 'identity', index: '01', azimuth: '000°', title: 'Mở đầu' },
      { id: 'exploded', index: '02', azimuth: '072°', title: '5 Lớp' },
      { id: 'laser-proof', index: '03', azimuth: '144°', title: 'Khung dây' },
      { id: 'urban-ai', index: '04', azimuth: '216°', title: 'Ánh nắng' },
      { id: 'ecosystem', index: '05', azimuth: '288°', title: 'Plugin SU' },
    ],
  },

  en: {
    langCode: 'en',
    ui: {
      overviewTitle: 'Open 1:1 Wireframe vs. Render Comparison (Key O)',
      langSwitchTitle: 'Switch Language: English ⇄ Tiếng Việt (Key L)',
      menuTitle: 'Open Official Links Hub (Ctrl+K)',
      fxModes: [
        { id: 'auto', icon: '✦', label: 'Auto', title: 'Scroll-synchronized rotation' },
        { id: 'xray', icon: '◎', label: 'X-Ray', title: 'Translucent outer shell revealing interior core' },
        { id: 'explode', icon: '≡', label: '5-Layer', title: 'Separate all 5 architectural modules' },
        { id: 'laser', icon: '⚡', label: 'Laser', title: 'Live wireframe-to-shaded section plane' },
        { id: 'solar', icon: '☀', label: 'Solar', title: 'Interactive directional sun path' },
      ],
      closeBtn: 'Close',
      zoningTag: { code: 'ENVELOPE', name: '3D Spatial Bounding Envelope', metric: '3D STAGE' },
      hub: {
        eyebrow: 'HIEPD5 · OFFICIAL CHANNELS',
        title: 'Arch. Vuong Dac Hiep — Ecosystem',
        cards: [
          {
            title: 'Render AI Studio & MapSKP',
            desc: 'Jump to the SketchUp Plugin Showcase below',
            action: 'scrollPlugins',
          },
          {
            title: '1:1 Geometry Comparison',
            desc: 'Interactive wireframe vs. render split-slider',
            action: 'openOverview',
          },
          {
            title: 'HD5Studio.com',
            desc: 'Architectural Design & Visualization Studio',
            url: OWNER_INFO.studioUrl,
          },
          {
            title: 'HiepD5 AI Prompt 2.0',
            desc: 'Lighting & material prompt assistant',
            url: OWNER_INFO.aiPromptUrl,
          },
          {
            title: 'HiepD5 YouTube Channel',
            desc: 'SketchUp, D5 Render & AI tutorials',
            url: OWNER_INFO.youtube,
          },
          {
            title: `WhatsApp ${OWNER_INFO.phoneIntl}`,
            desc: 'Direct contact with Arch. Vuong Dac Hiep',
            url: OWNER_INFO.whatsapp,
          },
        ],
      },
      overview: {
        eyebrow: '1:1 GEOMETRY COMPARISON',
        heading: 'Wireframe vs. Rendered Output',
        lead: 'Drag the divider to inspect edge-for-edge alignment. Additional captures directly from Render AI Studio are being added.',
        stats: [
          { value: '1 : 1', label: 'Locked camera & proportions' },
          { value: 'SU 17–26', label: 'SketchUp compatibility' },
          { value: 'Render AI', label: 'Viewport AI rendering' },
          { value: 'MapSKP', label: 'GIS & terrain importer' },
        ],
        sliderLabelLeft: 'SOURCE WIREFRAME',
        sliderLabelRight: 'RENDERED OUTPUT',
        sliderHint: '⇄ Drag slider to compare structural edges',
        pillarsTitle: 'Active Product Lineup',
        pillars: [
          {
            tag: 'SKETCHUP PLUGIN',
            title: 'Render AI Studio for SketchUp',
            price: 'Beta access registration open',
            desc: 'AI rendering locked to your SketchUp viewport geometry.',
            ctaLabel: 'Request Beta via WhatsApp',
            url: OWNER_INFO.whatsapp,
          },
          {
            tag: 'SKETCHUP PLUGIN',
            title: 'MapSKP for SketchUp',
            price: 'Screenshots & docs updating',
            desc: 'Import map bounds, terrain, and surrounding massing into SketchUp.',
            ctaLabel: 'Get Launch Updates',
            url: OWNER_INFO.whatsapp,
          },
          {
            tag: 'STUDIO & MEDIA',
            title: 'HD5Studio.com & YouTube',
            price: 'Architectural services & tutorials',
            desc: 'Architectural visualization services and practical AI workflows.',
            ctaLabel: 'Visit HD5Studio.com',
            url: OWNER_INFO.studioUrl,
          },
        ],
        directBarText: 'Questions about SketchUp plugins or project collaboration?',
        primaryContactLabel: `WhatsApp ${OWNER_INFO.phoneIntl}`,
        primaryContactUrl: OWNER_INFO.whatsapp,
        secondaryContactLabel: 'Send Email',
        secondaryContactUrl: OWNER_INFO.emailHref,
        backTo3dLabel: 'Close',
      },
      webglFallback: {
        title: '3D WebGL Preview Disabled',
        desc: 'Explore Render AI Studio for SketchUp, MapSKP for SketchUp, and 1:1 visual comparisons below.',
        cta: 'Open 1:1 Comparison',
      },
      colophon: {
        eyebrow: 'OFFICIAL CREDITS & LEGAL INFORMATION',
        architectRole: 'Architect · Creator of HD5 SketchUp Plugins & Founder of HD5 Studio.',
        open8kBtn: '1:1 Comparison',
        linksHeading: 'Official links',
        links: [
          {
            label: 'HD5Studio.com',
            sub: 'Architectural Design & Visualization',
            url: OWNER_INFO.studioUrl,
            signal: 'studio_click',
          },
          {
            label: 'Render AI Studio for SketchUp',
            sub: 'Geometry-locked SketchUp AI rendering',
            url: OWNER_INFO.whatsapp,
            signal: 'upgrade_click_render_ai_studio',
          },
          {
            label: 'MapSKP for SketchUp',
            sub: 'Map, terrain & site context importer',
            url: OWNER_INFO.whatsapp,
            signal: 'upgrade_click_mapskp',
          },
          {
            label: 'HiepD5 AI Prompt 2.0',
            sub: 'Lighting & material prompt assistant',
            url: OWNER_INFO.aiPromptUrl,
            signal: 'prompt_click',
          },
          {
            label: 'HiepD5 YouTube',
            sub: 'D5 Render & AI architectural workflows',
            url: OWNER_INFO.youtube,
            signal: 'youtube_click',
          },
          {
            label: 'D5 Render Vietnam Community',
            sub: 'Official Facebook professional group',
            url: OWNER_INFO.fbGroup,
            signal: 'community_click',
          },
        ],
        sourcesHeading: 'Technology & Legal',
        sources: [
          {
            k: 'Real-Time 3D Graphics',
            v: 'Three.js & React Three Fiber (Clean MIT open-source license · 0% GPL/AGPL).',
          },
          {
            k: 'Adaptive Mobile Pipeline',
            v: 'Quantized KHR_mesh_quantization 5-module GLBs & automatic 0%-GPU demand sleep below the fold.',
          },
          {
            k: 'Map Data Attribution (MapSKP)',
            v: 'Map data © OpenStreetMap contributors (ODbL).',
          },
          {
            k: 'Trademark & Privacy 2026',
            v: 'Render AI Studio for SketchUp and MapSKP for SketchUp are independent products (not affiliated with Trimble Inc.). Vietnam PDPL 91/2025 compliant · Beta provided "AS-IS".',
          },
        ],
        copyright: '© 2026 Arch. Vuong Dac Hiep (HiepD5.com · HD5Studio.com).',
      },
    },
    curiosityNodes: [
      {
        modId: 'roof',
        code: 'LAYER 05',
        metric: 'ROOF MODULE',
        title: 'Roof Canopy & Central Oculus',
        detail: 'Top architectural module demonstrating independent vertical layer separation.',
        fxAction: 'solar',
        ctaLabel: 'Preview Solar Study',
      },
      {
        modId: 'shell',
        code: 'LAYER 04',
        metric: 'SHELL MODULE',
        title: 'Articulated Louver Envelope',
        detail: 'Twin facade wings part smoothly to reveal the internal structural frame.',
        fxAction: 'explode',
        ctaLabel: 'Separate 5 Modules',
      },
      {
        modId: 'structure',
        code: 'LAYER 03',
        metric: 'FRAME MODULE',
        title: 'Primary Structural Frame',
        detail: 'Perimeter frame used to demonstrate live wireframe-to-shaded alignment.',
        fxAction: 'laser',
        ctaLabel: 'Slice w/ Laser Plane',
      },
      {
        modId: 'interior',
        code: 'LAYER 02',
        metric: 'CORE MODULE',
        title: 'Interior Circulation Core',
        detail: 'Central circulation plates highlighted clearly in translucent X-Ray mode.',
        fxAction: 'xray',
        ctaLabel: 'Inspect w/ X-Ray',
      },
      {
        modId: 'plaza',
        code: 'LAYER 01',
        metric: 'BASE MODULE',
        title: 'Site Plinth & Context Base',
        detail: 'Ground podium representing site context and terrain integration.',
        fxAction: 'plugins',
        ctaLabel: 'Explore Plugins Below',
      },
    ],
    proofCases: [
      {
        id: 'sample-01',
        code: 'SAMPLE 01',
        tab: '01 · Exterior Arch',
        title: 'Wireframe vs. Render Alignment #01',
        caption: 'Sample geometry-lock comparison (live Render AI Studio captures updating soon).',
        bp: '/proof/scene-01-bp.webp',
        render: '/proof/scene-01-8k.webp',
        metrics: ['1:1 Camera Lock', 'Comparison #01'],
      },
      {
        id: 'sample-02',
        code: 'SAMPLE 02',
        tab: '02 · Vault Skywalk',
        title: 'Wireframe vs. Render Alignment #02',
        caption: 'Curved soffit, balustrade, and indirect daylight comparison.',
        bp: '/proof/scene-03-bp.webp',
        render: '/proof/scene-03-8k.webp',
        metrics: ['1:1 Camera Lock', 'Comparison #02'],
      },
      {
        id: 'sample-03',
        code: 'SAMPLE 03',
        tab: '03 · Facade Study',
        title: 'Wireframe vs. Render Alignment #03',
        caption: 'Glass curtainwall and horizontal shading louver alignment.',
        bp: '/proof/scene-05-bp.webp',
        render: '/proof/scene-05-8k.webp',
        metrics: ['1:1 Camera Lock', 'Comparison #03'],
      },
    ],
    ecosystemPortals: [
      {
        id: 'render-ai',
        code: 'AI',
        badge: 'SKETCHUP PLUGIN',
        title: 'Render AI Studio for SketchUp',
        desc: 'Geometry-locked AI rendering directly from SketchUp.',
        ctaLabel: 'View Plugin Section',
        action: 'plugins',
        position: [-2.4, 0.92, 2.35],
      },
      {
        id: 'mapskp',
        code: 'MAP',
        badge: 'SKETCHUP PLUGIN',
        title: 'MapSKP for SketchUp',
        desc: 'Import map context, roads & terrain into SketchUp.',
        ctaLabel: 'View Plugin Section',
        action: 'plugins',
        position: [0.0, 0.92, 2.75],
      },
      {
        id: 'hd5studio',
        code: 'HD5',
        badge: 'STUDIO',
        title: 'HD5Studio.com',
        desc: 'Architectural Design & Visualization Studio.',
        ctaLabel: 'Visit HD5Studio.com',
        url: OWNER_INFO.studioUrl,
        position: [2.4, 0.92, 2.35],
      },
    ],
    chapters: [
      { id: 'identity', index: '01', azimuth: '000°', title: 'Intro' },
      { id: 'exploded', index: '02', azimuth: '072°', title: '5-Layer' },
      { id: 'laser-proof', index: '03', azimuth: '144°', title: 'Wireframe' },
      { id: 'urban-ai', index: '04', azimuth: '216°', title: 'Solar' },
      { id: 'ecosystem', index: '05', azimuth: '288°', title: 'Plugins' },
    ],
  },
};

export function getLocalizedData(lang = 'vi') {
  const pack = LOCALIZED[lang] || LOCALIZED.vi;
  return {
    owner: {
      ...OWNER_INFO,
      name: lang === 'en' ? OWNER_INFO.nameEn : OWNER_INFO.nameVi,
      displayPhone: lang === 'en' ? OWNER_INFO.phoneIntl : OWNER_INFO.phone,
      directChatUrl: lang === 'en' ? OWNER_INFO.whatsapp : OWNER_INFO.zalo,
    },
    commercial: COMMERCIAL_CONFIG,
    models: MODELS,
    palettes: PALETTES,
    v6: V6_COPY[lang] || V6_COPY.vi,
    showcase: PRODUCT_SHOWCASE[lang] || PRODUCT_SHOWCASE.vi,
    ...pack,
  };
}

export const ARCHITECT_DATA = getLocalizedData('vi');
