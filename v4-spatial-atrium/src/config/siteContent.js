// ============================================================================
// HIEPD5.COM — BẢNG NỘI DUNG & KỆ SẢN PHẨM TRUNG TÂM (CHỈ SỬA 1 FILE NÀY)
// - Toàn bộ con số giả định đã được gỡ bỏ hoàn toàn.
// - Khi Sếp có ảnh thật / thông số mới, thả ảnh vào `public/products/...`
//   rồi điền đường dẫn vào các trường `image`, `beforeImage`, `afterImage` bên dưới.
// ============================================================================

export const COMMERCIAL_CONFIG = {
  // ĐIỀU 8 — Công tắc Thương mại 1 chạm:
  // 'beta_smoke_test' (0đ chi phí pháp lý, đếm lượt quan tâm theo từng productCode)
  // -> 'live_commercial' (khi >= 30 lượt bấm nâng cấp: mở cổng VietQR 0% + EULA)
  commercialStage: 'beta_smoke_test',
  upgradeClickTarget: 30,
};

export const OWNER_INFO = {
  nameVi: 'KTS. Vương Đắc Hiệp',
  nameEn: 'Arch. Vuong Dac Hiep',
  brand: 'HiệpD5',
  domain: 'HIEPD5.COM',
  studioDomain: 'HD5STUDIO.COM',
  phone: '0979 591 156',
  phoneIntl: '+84 979 591 156',
  email: 'kts.vuongdachiep@gmail.com',
  emailHref: 'mailto:kts.vuongdachiep@gmail.com?subject=HD5%20Studio%20-%20Plugin%20%26%20Project%20Inquiry',
  zalo: 'https://zalo.me/0979591156',
  whatsapp:
    'https://wa.me/84979591156?text=Hello%20Arch.%20Vuong%20Dac%20Hiep%20(HD5%20Studio)%2C%20I%20would%20like%20to%20inquire%20about%20your%20SketchUp%20plugins.',
  youtube: 'https://www.youtube.com/channel/UCXD97eRzqP_7T9-wLg75MyQ',
  fbGroup: 'https://www.facebook.com/groups/9524388777642550',
  studioUrl: 'https://hd5studio.com',
  aiPromptUrl:
    'https://aistudio.google.com/u/1/apps/acd43aee-4604-4684-a130-194bea8817fa?showPreview=true&showAssistant=true&fullscreenApplet=true',
};

// ============================================================================
// DANH MỤC PLUGIN SKETCHUP CHỦ LỰC & KỆ ẢNH SẢN PHẨM (VI / EN)
// Tên sản phẩm tuân thủ chuẩn Clean-IP Trimble: "[Tên Thương Hiệu] for SketchUp"
// ============================================================================
export const PRODUCT_SHOWCASE = {
  vi: {
    sectionEyebrow: 'HỆ SINH THÁI PLUGIN SKETCHUP',
    sectionTitle: 'Công cụ thực chiến cho SketchUp.',
    sectionSub:
      'Phát triển trực tiếp bởi KTS. Vương Đắc Hiệp. Thông tin chi tiết và bộ ảnh sản phẩm đang được cập nhật theo từng giai đoạn.',
    plugins: [
      {
        id: 'render-ai-studio',
        productCode: 'render_ai_studio',
        icon: 'sparkles',
        badge: 'PLUGIN · SKETCHUP 2017–2026',
        statusNote: 'Đang cập nhật thông số & ảnh giao diện thực tế',
        name: 'Render AI Studio for SketchUp',
        tagline: 'Kết xuất phương án AI trực tiếp từ khung nhìn SketchUp, bảo toàn tỷ lệ hình học.',
        bullets: [
          'Đồng bộ trực tiếp góc nhìn từ SketchUp (2017–2026)',
          'Đối chứng khung dây gốc và ảnh kết quả ngay trên bảng điều khiển',
          'Đóng gói cài đặt .rbz gọn nhẹ — tài liệu & bảng giá cập nhật sau',
        ],
        // Sếp có thể thay cặp ảnh giao diện / kết quả thật tại `public/products/render-ai-studio/`
        beforeImage: '/proof/scene-01-bp.webp',
        afterImage: '/proof/scene-01-8k.webp',
        beforeLabel: 'Khung dây gốc',
        afterLabel: 'Kết quả Render',
        uiPreview: '',
        dropHint: 'public/products/render-ai-studio/',
        primaryCta: 'Đăng ký dùng thử Beta',
        secondaryCta: 'Mở kho đối chứng',
        legalFoot:
          'Sản phẩm độc lập của HD5 Studio, không trực thuộc Trimble Inc. · Bản thử nghiệm Beta ("AS-IS" — vui lòng sao lưu file .skp trước khi chạy).',
      },
      {
        id: 'mapskp',
        productCode: 'mapskp',
        icon: 'map',
        badge: 'PLUGIN · GIS & ĐỊA HÌNH SKETCHUP',
        statusNote: 'Đang cập nhật ảnh sản phẩm & video thao tác',
        name: 'MapSKP for SketchUp',
        tagline: 'Đưa dữ liệu bản đồ, địa hình và bối cảnh khu đất trực tiếp vào mô hình SketchUp.',
        bullets: [
          'Khoanh vùng khu đất và tải bối cảnh vào thẳng không gian SketchUp',
          'Tách lớp đường giao thông, ranh khu đất và khối công trình lân cận',
          'Ảnh chụp giao diện thực tế sẽ được cập nhật tại khung bên cạnh',
        ],
        // Khi có ảnh chụp màn hình MapSKP, Sếp điền đường dẫn ví dụ: '/products/mapskp/preview-01.webp'
        uiPreview: '',
        dropHint: 'public/products/mapskp/',
        placeholderTitle: 'Khung chờ ảnh giao diện MapSKP',
        placeholderSub: 'Thả ảnh vào public/products/mapskp/ và cập nhật đường dẫn trong siteContent.js',
        attribution: 'Dữ liệu bản đồ © OpenStreetMap contributors (ODbL)',
        primaryCta: 'Nhận thông báo bản Beta',
        legalFoot:
          'Sản phẩm độc lập, không trực thuộc Trimble Inc. · Nguồn dữ liệu bản đồ © OpenStreetMap contributors.',
      },
    ],
    gallery: {
      eyebrow: 'ẢNH SẢN PHẨM & KẾT QUẢ THỰC TẾ',
      title: 'Kệ trưng bày hình ảnh.',
      sub: 'Các khung chờ dưới đây sẵn sàng hiển thị ngay khi cập nhật ảnh chụp plugin và sản phẩm thực tế.',
      items: [
        {
          id: 'gal-01',
          tag: 'Render AI Studio',
          title: 'Đối chứng hình học #01',
          image: '/proof/scene-01-8k.webp',
          hint: 'Có thể thay bằng ảnh sản phẩm mới tại siteContent.js',
        },
        {
          id: 'gal-02',
          tag: 'Render AI Studio',
          title: 'Đối chứng ánh sáng #02',
          image: '/proof/scene-03-8k.webp',
          hint: 'Có thể thay bằng ảnh sản phẩm mới tại siteContent.js',
        },
        {
          id: 'gal-03',
          tag: 'Render AI Studio',
          title: 'Đối chứng ngoại thất #03',
          image: '/proof/scene-05-8k.webp',
          hint: 'Có thể thay bằng ảnh sản phẩm mới tại siteContent.js',
        },
        {
          id: 'gal-04',
          tag: 'Render AI Studio · UI',
          title: 'Khung chờ ảnh bảng điều khiển Plugin',
          image: '',
          hint: 'public/products/render-ai-studio/',
        },
        {
          id: 'gal-05',
          tag: 'MapSKP · Bản đồ & Địa hình',
          title: 'Khung chờ ảnh chọn vùng bản đồ MapSKP',
          image: '',
          hint: 'public/products/mapskp/',
        },
        {
          id: 'gal-06',
          tag: 'MapSKP · Mô hình SketchUp',
          title: 'Khung chờ ảnh khối đô thị sinh tự động',
          image: '',
          hint: 'public/products/mapskp/',
        },
      ],
    },
    betaConsent: {
      label:
        'Tôi đồng ý cung cấp thông tin liên hệ để nhận bản dùng thử Beta theo Luật Bảo vệ dữ liệu cá nhân 91/2025/QH15 (bản thử nghiệm cung cấp nguyên trạng "AS-IS", vui lòng sao lưu file .skp).',
      promptHint: 'Tích xác nhận đồng ý trước khi gửi yêu cầu nhận bản Beta',
      ctaReady: 'Nhắn Zalo nhận bản Beta',
    },
  },

  en: {
    sectionEyebrow: 'SKETCHUP PLUGIN ECOSYSTEM',
    sectionTitle: 'Purpose-built tools for SketchUp.',
    sectionSub:
      'Created by Arch. Vuong Dac Hiep. Detailed specifications and live product captures are being added across upcoming releases.',
    plugins: [
      {
        id: 'render-ai-studio',
        productCode: 'render_ai_studio',
        icon: 'sparkles',
        badge: 'PLUGIN · SKETCHUP 2017–2026',
        statusNote: 'Detailed specs & UI captures updating',
        name: 'Render AI Studio for SketchUp',
        tagline: 'AI architectural rendering straight from the SketchUp viewport with locked geometry.',
        bullets: [
          'Direct viewport camera sync for SketchUp 2017–2026',
          'Side-by-side wireframe vs. rendered output inspection',
          'Compact .rbz installer — documentation & pricing updating soon',
        ],
        beforeImage: '/proof/scene-01-bp.webp',
        afterImage: '/proof/scene-01-8k.webp',
        beforeLabel: 'Viewport wireframe',
        afterLabel: 'Rendered output',
        uiPreview: '',
        dropHint: 'public/products/render-ai-studio/',
        primaryCta: 'Request Beta Access',
        secondaryCta: 'Open comparison drawer',
        legalFoot:
          'Independent product by HD5 Studio, not affiliated with Trimble Inc. · Beta preview ("AS-IS" — please back up your .skp files).',
      },
      {
        id: 'mapskp',
        productCode: 'mapskp',
        icon: 'map',
        badge: 'PLUGIN · GIS & SITE CONTEXT',
        statusNote: 'Product screenshots & workflow clips updating',
        name: 'MapSKP for SketchUp',
        tagline: 'Bring map context, terrain, and surrounding urban massing directly into SketchUp.',
        bullets: [
          'Select site bounds and import context into your SketchUp model',
          'Structured layers for roads, plots, and neighboring buildings',
          'Live interface captures will appear in this frame',
        ],
        uiPreview: '',
        dropHint: 'public/products/mapskp/',
        placeholderTitle: 'MapSKP Interface Slot',
        placeholderSub: 'Drop captures into public/products/mapskp/ and set path in siteContent.js',
        attribution: 'Map data © OpenStreetMap contributors (ODbL)',
        primaryCta: 'Get Beta Updates',
        legalFoot:
          'Independent product, not affiliated with Trimble Inc. · Map data © OpenStreetMap contributors.',
      },
    ],
    gallery: {
      eyebrow: 'PRODUCT CAPTURES & OUTPUTS',
      title: 'Product gallery.',
      sub: 'Placeholder frames below are wired to display new plugin captures as soon as images are added.',
      items: [
        {
          id: 'gal-01',
          tag: 'Render AI Studio',
          title: 'Geometry lock sample #01',
          image: '/proof/scene-01-8k.webp',
          hint: 'Replaceable anytime in siteContent.js',
        },
        {
          id: 'gal-02',
          tag: 'Render AI Studio',
          title: 'Lighting study sample #02',
          image: '/proof/scene-03-8k.webp',
          hint: 'Replaceable anytime in siteContent.js',
        },
        {
          id: 'gal-03',
          tag: 'Render AI Studio',
          title: 'Exterior study sample #03',
          image: '/proof/scene-05-8k.webp',
          hint: 'Replaceable anytime in siteContent.js',
        },
        {
          id: 'gal-04',
          tag: 'Render AI Studio · UI',
          title: 'Plugin panel screenshot slot',
          image: '',
          hint: 'public/products/render-ai-studio/',
        },
        {
          id: 'gal-05',
          tag: 'MapSKP · GIS Context',
          title: 'Map bounds selector slot',
          image: '',
          hint: 'public/products/mapskp/',
        },
        {
          id: 'gal-06',
          tag: 'MapSKP · 3D Massing',
          title: 'Imported SketchUp context slot',
          image: '',
          hint: 'public/products/mapskp/',
        },
      ],
    },
    betaConsent: {
      label:
        'I consent to share my contact info to receive Beta access under Vietnam PDPL 91/2025/QH15 (Beta software provided "AS-IS" — please back up .skp files).',
      promptHint: 'Check the opt-in box to request Beta access',
      ctaReady: 'Message on WhatsApp for Beta',
    },
  },
};
