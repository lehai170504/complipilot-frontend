const fs = require('fs');

const updateJson = (path, updates) => {
  const content = JSON.parse(fs.readFileSync(path, 'utf8'));
  Object.assign(content.landing, updates);
  fs.writeFileSync(path, JSON.stringify(content, null, 2));
}

const enUpdates = {
  "heroNew": {
    "eyebrow": "AI Compliance & Evidence OS",
    "title": "Build audit-ready compliance workflows faster.",
    "description": "CompliPilot helps teams manage compliance controls, evidence, audit trails, AI analysis, workspace settings, and SaaS operations in one clean platform.",
    "primaryCta": "Start your workspace",
    "secondaryCta": "Go to dashboard"
  },
  "featuresNew": {
    "eyebrow": "Features",
    "title": "Everything needed for an MVP compliance SaaS.",
    "description": "Designed for teams that need structured controls, evidence, traceability, and production operations from day one.",
    "items": [
      {
        "title": "Framework templates",
        "description": "Start from compliance baselines and apply requirements directly to a workspace."
      },
      {
        "title": "Evidence vault",
        "description": "Upload, organize, review, and export evidence for audit-ready workflows."
      },
      {
        "title": "AI evidence analysis",
        "description": "Use AI to summarize evidence, detect risk, and suggest missing information."
      },
      {
        "title": "Audit trail",
        "description": "Track important actions across compliance, evidence, tasks, and workspace settings."
      },
      {
        "title": "SaaS operations",
        "description": "Manage billing usage, platform organizations, notifications, and system status."
      },
      {
        "title": "Secure workspace controls",
        "description": "Role-based access, invitation flows, disabled workspace guard, and account security."
      }
    ]
  },
  "highlightsNew": {
    "eyebrow": "Built for SaaS",
    "title": "Ready for product demos, testing, and future billing.",
    "description": "The product includes key SaaS foundations such as workspace lifecycle, role-based access, notifications, usage limits, platform admin controls, and system diagnostics.",
    "cta": "Explore Architecture",
    "items": [
      "Compliance workspace management",
      "Evidence upload and download links",
      "Member invitations and regenerate links",
      "Billing-ready plan and usage limits",
      "Platform admin console",
      "CSV export for audit review"
    ]
  },
  "mockupNew": {
    "readiness": "Readiness",
    "evidence": "Evidence",
    "thisWeek": "+12 this week",
    "aiInsights": "AI Insights",
    "riskDetected": "Risk detected"
  },
  "footerNew": {
    "description": "Evidence-first compliance operating system.",
    "product": "Product",
    "features": "Features",
    "security": "Security",
    "pricing": "Pricing",
    "company": "Company",
    "about": "About",
    "blog": "Blog",
    "contact": "Contact",
    "legal": "Legal",
    "privacy": "Privacy Policy",
    "terms": "Terms of Service",
    "rights": "All rights reserved."
  }
};

const viUpdates = {
  "heroNew": {
    "eyebrow": "Hệ Điều Hành Tuân Thủ & Bằng Chứng AI",
    "title": "Xây dựng quy trình tuân thủ sẵn sàng kiểm toán nhanh hơn.",
    "description": "CompliPilot giúp các nhóm quản lý control tuân thủ, bằng chứng, nhật ký kiểm toán, phân tích AI, cài đặt workspace và vận hành SaaS trên một nền tảng tinh gọn.",
    "primaryCta": "Bắt đầu workspace của bạn",
    "secondaryCta": "Đi tới dashboard"
  },
  "featuresNew": {
    "eyebrow": "Tính Năng",
    "title": "Mọi thứ cần thiết cho một SaaS tuân thủ MVP.",
    "description": "Được thiết kế cho các nhóm cần kiểm soát có cấu trúc, bằng chứng, khả năng truy xuất nguồn gốc và vận hành sản xuất ngay từ ngày đầu.",
    "items": [
      {
        "title": "Mẫu framework",
        "description": "Bắt đầu từ cơ sở tuân thủ và áp dụng trực tiếp các yêu cầu vào workspace."
      },
      {
        "title": "Kho bằng chứng",
        "description": "Tải lên, tổ chức, đánh giá và xuất bằng chứng cho các luồng công việc sẵn sàng kiểm toán."
      },
      {
        "title": "Phân tích bằng chứng AI",
        "description": "Sử dụng AI để tóm tắt bằng chứng, phát hiện rủi ro và gợi ý thông tin còn thiếu."
      },
      {
        "title": "Nhật ký kiểm toán",
        "description": "Theo dõi các hành động quan trọng trên toàn bộ tuân thủ, bằng chứng, tác vụ và cài đặt workspace."
      },
      {
        "title": "Vận hành SaaS",
        "description": "Quản lý mức sử dụng thanh toán, tổ chức nền tảng, thông báo và trạng thái hệ thống."
      },
      {
        "title": "Kiểm soát workspace an toàn",
        "description": "Truy cập dựa trên vai trò, quy trình lời mời, bảo vệ workspace bị vô hiệu hóa và bảo mật tài khoản."
      }
    ]
  },
  "highlightsNew": {
    "eyebrow": "Dành Cho SaaS",
    "title": "Sẵn sàng cho bản demo sản phẩm, thử nghiệm và thanh toán trong tương lai.",
    "description": "Sản phẩm bao gồm các nền tảng SaaS chính như vòng đời workspace, truy cập dựa trên vai trò, thông báo, giới hạn sử dụng, kiểm soát quản trị viên nền tảng và chẩn đoán hệ thống.",
    "cta": "Khám Phá Kiến Trúc",
    "items": [
      "Quản lý workspace tuân thủ",
      "Liên kết tải lên và tải xuống bằng chứng",
      "Lời mời thành viên và tạo lại liên kết",
      "Gói sẵn sàng thanh toán và giới hạn sử dụng",
      "Bảng điều khiển quản trị nền tảng",
      "Xuất CSV để đánh giá kiểm toán"
    ]
  },
  "mockupNew": {
    "readiness": "Mức Độ Sẵn Sàng",
    "evidence": "Bằng Chứng",
    "thisWeek": "+12 tuần này",
    "aiInsights": "Hiểu Biết AI",
    "riskDetected": "Phát hiện rủi ro"
  },
  "footerNew": {
    "description": "Hệ điều hành tuân thủ ưu tiên bằng chứng.",
    "product": "Sản Phẩm",
    "features": "Tính năng",
    "security": "Bảo mật",
    "pricing": "Bảng giá",
    "company": "Công Ty",
    "about": "Giới thiệu",
    "blog": "Blog",
    "contact": "Liên hệ",
    "legal": "Pháp Lý",
    "privacy": "Chính sách bảo mật",
    "terms": "Điều khoản dịch vụ",
    "rights": "Đã đăng ký bản quyền."
  }
};

updateJson('src/messages/en.json', enUpdates);
updateJson('src/messages/vi.json', viUpdates);
