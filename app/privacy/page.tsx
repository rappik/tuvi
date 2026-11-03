import ThemeToggle from '@/components/ThemeToggle';

export const metadata = { title: 'Chính Sách Quyền Riêng Tư · Lá Số Tử Vi', description: 'Chính sách bảo mật và quyền riêng tư nền tảng Lá Số Tử Vi' };

export default function PrivacyPage() {
  return (
    <div style={{ background: 'var(--bg-0)', minHeight: '100vh', transition: 'background 0.35s ease' }}>
      <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'var(--bg-0)', borderBottom: '1px solid var(--bdr)', padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--tx-3)', textDecoration: 'none' }}>
          <span style={{ fontSize: '16px' }}>‹</span>
          <span>Về trang chủ</span>
        </a>
        <div style={{ width: '1px', height: '20px', background: 'var(--bdr-med)' }} />
        <span style={{ fontSize: '12px', color: 'var(--ac)', letterSpacing: '0.15em' }}>LÁ SỐ TỬ VI</span>
        <div style={{ flex: 1 }} />
        <ThemeToggle />
      </header>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '60px 24px 80px', color: 'var(--tx-1)', lineHeight: 1.8 }}>
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Chính Sách Quyền Riêng Tư</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4 năm 2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Thông Tin Thu Thập</h2>
      <p>Nhằm phục vụ việc lập và phân tích lá số Tử Vi Đẩu Số, chúng tôi có thể xử lý các thông tin sau:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li><strong>Thông tin lập lá số</strong>: Họ tên (tùy chọn), Ngày tháng năm sinh Dương lịch/Âm lịch, Giờ sinh, Giới tính, Tỉnh/Thành phố sinh (để tính Chân Thái Dương Thời)</li>
        <li><strong>Thông tin tương tác</strong>: Lịch sử các câu hỏi luận giải và trao đổi cùng trợ lý AI</li>
        <li><strong>Dữ liệu kỹ thuật</strong>: Cấu hình giao diện (chủ đề sáng/tối), cookie phiên hoạt động</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Mục Đích Sử Dụng</h2>
      <ul style={{ paddingLeft: 24 }}>
        <li>Thông tin ngày giờ sinh chỉ được dùng trực tiếp để an sao, lập lá số và phân tích các cung vị</li>
        <li>Lưu trữ lịch sử lập lá số cục bộ trên trình duyệt (LocalStorage) giúp người dùng tiện theo dõi lại khi cần</li>
        <li>Không chia sẻ hoặc bán dữ liệu cá nhân của người dùng cho bên thứ ba vì bất kỳ mục đích quảng cáo nào</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Bảo Mật Thông Tin</h2>
      <p>Chúng tôi áp dụng các tiêu chuẩn an toàn bảo mật kỹ thuật số (mã hóa đường truyền HTTPS/TLS) để đảm bảo dữ liệu truyền tải giữa thiết bị của bạn và máy chủ luôn được bảo vệ tối đa.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Quyền Của Người Dùng</h2>
      <p>Bạn có toàn quyền xóa dữ liệu lưu trữ cục bộ (xóa cache/localStorage trình duyệt) bất kỳ lúc nào để làm sạch toàn bộ lịch sử các lá số đã lập trên thiết bị của mình.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Cookie & Lưu Trữ Cục Bộ</h2>
      <p>Nền tảng sử dụng LocalStorage để ghi nhớ lựa chọn giao diện (Sáng/Tối) và lưu trữ danh sách lá số cá nhân gần nhất, giúp bạn không phải nhập lại thông tin nhiều lần.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/terms" style={{ color: 'var(--ac)' }}>Điều khoản dịch vụ</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </div>
  );
}
