# Kế hoạch redesign UI/UX CompliPilot

## Mục tiêu

Tạo trải nghiệm SaaS compliance nhất quán, dễ quét thông tin và dễ hoàn thành tác vụ; hỗ trợ desktop, tablet, mobile và song ngữ Việt/Anh. Giữ lại nhận diện tin cậy của sản phẩm nhưng thay phong cách card/gradient dày đặc bằng giao diện gọn, rõ thứ bậc và tập trung vào công việc.

## Hiện trạng quan sát được

- Shell tối màu và phân nhóm điều hướng phù hợp sản phẩm B2B, nhưng sidebar rộng và có nhiều nội dung phụ chiếm không gian làm việc.
- Khu nội dung dùng nhiều card lớn, khoảng trống và bóng đổ; các chỉ số/CTA chưa tạo được thứ bậc nhanh như trong ảnh.
- Thanh tìm kiếm, workspace và thông báo là các điểm vào quan trọng nhưng trạng thái lỗi đang chưa nhất quán; một số form hiển thị lỗi đỏ dưới trường trong khi các mutation đã dùng toast.
- Ngôn ngữ Việt/Anh đã có nền tảng dịch, cần giữ nhất quán khi redesign.

## Hướng thiết kế đề xuất

- **Phong cách:** enterprise calm / audit-ready; nền sáng trung tính, navy làm màu cấu trúc, teal làm màu hành động và trạng thái tích cực; hạn chế gradient, blur, shadow lớn.
- **Layout:** sidebar thu gọn được trên desktop; navigation dạng drawer trên màn nhỏ; topbar cố định gồm workspace switcher, global search, trợ giúp, thông báo và menu tài khoản.
- **Thứ bậc trang:** tiêu đề + mô tả ngắn + hành động chính; KPI nhỏ gọn; nội dung chính ưu tiên bảng/list và bộ lọc; empty/loading/error states được thiết kế riêng.
- **Thành phần:** chuẩn hóa spacing, typography, radius, trạng thái hover/focus/disabled, bảng, filter bar, dialog, badge, pagination và toast thành design tokens/component patterns.
- **Thông báo lỗi:** validation và lỗi thao tác chỉ dùng toast; không render nội dung lỗi đỏ bên dưới field/form. Giữ nhãn và focus accessibility, toast nêu hành động tiếp theo và request ID khi có.

## Các giai đoạn triển khai

1. **Audit & baseline:** lập danh sách route, vai trò, tác vụ chính, các trạng thái loading/empty/error; chụp baseline desktop/mobile; thống kê component trùng lặp.
2. **Design system:** chốt palette/type/spacing, responsive breakpoints, component states; tạo wireframe cho shell, dashboard, compliance, evidence và task.
3. **Shell & navigation:** thiết kế lại sidebar/topbar/workspace switcher, responsive navigation, active states và global search.
4. **Core workflows:** ưu tiên dashboard và ba luồng thường xuyên nhất: cập nhật control, thu thập/liên kết evidence, tạo/hoàn thành task; đơn giản hóa bảng, filter và CTA.
5. **Forms & feedback:** chuẩn hóa dialog/form; validate bằng toast; chuẩn hóa success/error toast; kiểm thử request ID, retry, loading và không tạo toast lặp khi polling.
6. **Polish & release:** kiểm tra i18n, keyboard/screen reader, contrast, mobile, regression, hiệu năng; rollout theo route/feature flag nếu cần và theo dõi feedback.

## Tiêu chí nghiệm thu

- Mỗi trang có một hành động chính dễ nhận biết và các trạng thái loading/empty/error không gây hiểu nhầm.
- Tất cả form validation không hiển thị dòng lỗi đỏ dưới field; lỗi được phát ra bằng toast tiếng Việt/Anh đúng locale.
- Toast không lặp do polling/refetch; lỗi API có thể cung cấp request ID để hỗ trợ chẩn đoán.
- Các tác vụ chính hoàn thành được trên viewport mobile và desktop, điều hướng dùng được bằng bàn phím, focus nhìn thấy rõ và contrast đạt WCAG AA.
- Bản dịch không tràn layout; bảng/list có cách dùng thay thế phù hợp trên màn nhỏ.

## Thứ tự ưu tiên đề xuất

P0: lỗi/toast nhất quán và responsive shell; P1: dashboard + compliance/evidence/tasks; P2: audit, billing, admin và polish. Chốt wireframe/style direction trước khi thay đổi đồng loạt các route.
