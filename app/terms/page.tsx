import ThemeToggle from '@/components/ThemeToggle';

export const metadata = { title: 'Điều Khoản Dịch Vụ · Lá Số Tử Vi', description: 'Điều khoản dịch vụ và thỏa thuận người dùng nền tảng Lá Số Tử Vi' };

export default function TermsPage() {
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
        <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 8 }}>Điều Khoản Dịch Vụ</h1>
        <p style={{ fontSize: 12, color: 'var(--tx-3)', marginBottom: 32 }}>Cập nhật lần cuối: Tháng 4 năm 2026</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>1. Khái Quát Dịch Vụ</h2>
      <p>Nền tảng Lá Số Tử Vi (sau đây gọi tắt là &ldquo;nền tảng&rdquo;) cung cấp dịch vụ lập lá số và phân tích dựa trên hệ thống Tử Vi Đẩu Số 《Thiên Kỷ》 của Thầy Nghê Hải Hạ kết hợp công nghệ AI. Mọi nội dung mệnh lý trên nền tảng chỉ mang tính chất tham khảo học thuật và tu dưỡng bản thân, <strong>không cấu thành bất kỳ tư vấn y tế, pháp lý, tài chính, đầu tư hay quyết định thay đổi cuộc đời mang tính bắt buộc nào</strong>.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>2. Quy Chuẩn Hành Vi Người Dùng</h2>
      <p>Khi sử dụng nền tảng này, bạn đồng thuận rằng:</p>
      <ul style={{ paddingLeft: 24 }}>
        <li>Chỉ sử dụng nền tảng cho mục đích hợp pháp và tham khảo cá nhân</li>
        <li>Không phát tán, sao chép nội dung nhằm mục đích thương mại hoặc trục lợi bất chính</li>
        <li>Không thực hiện các hành vi gây cản trở hoặc phá hoại sự vận hành ổn định của hệ thống</li>
        <li>Cung cấp thông tin ngày giờ sinh chính xác; nền tảng không chịu trách nhiệm đối với sự sai lệch trong luận giải do thông tin đầu vào không chuẩn xác</li>
      </ul>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>3. Sở Hữu Trí Tuệ & Điều Khoản Chống Thu Thập Dữ Liệu Trái Phép</h2>
      <p style={{ background: 'rgba(168,50,40,0.06)', border: '1px solid rgba(168,50,40,0.2)', padding: 16, borderRadius: 8 }}>
        <strong>Toàn bộ nội dung mệnh lý, kho tri thức (bao gồm 14 chính tinh × 12 cung × Tứ Hóa × Đại hạn lưu niên), thiết kế giao diện UI và thuật toán kết hợp đều thuộc bản quyền trí tuệ của dự án.</strong><br/><br/>
        Nghiêm cấm các hành vi sau:<br/>
        ① Sử dụng bot, công cụ cào dữ liệu tự động hoặc gọi API hàng loạt trái phép nhằm trích xuất nội dung;<br/>
        ② Sử dụng các nội dung phân tích, văn bản luận giải của nền tảng <strong>để huấn luyện (training) các mô hình học máy / LLM</strong> khi chưa có thỏa thuận bằng văn bản;<br/>
        ③ Bán lại hoặc phân phối trái phép các nội dung phát sinh từ nền tảng;<br/>
        ④ Biên dịch ngược, sao chép mã nguồn để vận hành các dịch vụ thương mại cạnh tranh không lành mạnh.<br/><br/>
        Chúng tôi bảo lưu toàn bộ quyền yêu cầu bồi thường thiệt hại và khởi kiện theo quy định của pháp luật hiện hành khi phát hiện vi phạm.
      </p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>4. Miễn Trừ Trách Nhiệm</h2>
      <p>Nội dung phân tích trên nền tảng được tổng hợp từ học thuật Tử Vi Đẩu Số truyền thống và hệ thống Thầy Nghê Hải Hạ, <strong>không cam kết tính chính xác tuyệt đối 100%</strong>. Cuộc đời con người chịu sự tác động đồng thời của Thiên - Địa - Nhân (Tiên thiên vận mệnh, Môi trường địa lý, Ý chí và nỗ lực của con người). Người dùng cần giữ tâm thế lý tính, tỉnh thức và không nên ỷ lại hay mê tín thái quá vào bất kỳ dự đoán mệnh lý đơn lẻ nào.</p>
      <p>Nền tảng không chịu trách nhiệm pháp lý đối với bất kỳ hệ quả nào phát sinh từ việc người dùng áp dụng thông tin vào các quyết định thực tế của đời sống cá nhân.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>5. Thay Đổi & Chấm Dứt Dịch Vụ</h2>
      <p>Nền tảng có quyền điều chỉnh, nâng cấp hoặc tạm ngừng một phần hay toàn bộ dịch vụ bất cứ lúc nào nhằm mục đích hoàn thiện chất lượng hệ thống.</p>

      <h2 style={{ fontSize: 18, marginTop: 32, marginBottom: 12 }}>6. Luật Áp Dụng</h2>
      <p>Các điều khoản này tuân thủ theo các quy định pháp luật hiện hành. Mọi bất đồng phát sinh sẽ được ưu tiên thương lượng giải quyết trên tinh thần thiện chí và tôn trọng lẫn nhau.</p>

        <p style={{ marginTop: 48, fontSize: 12, color: 'var(--tx-3)' }}>
          <a href="/privacy" style={{ color: 'var(--ac)' }}>Chính sách quyền riêng tư</a> · <a href="/" style={{ color: 'var(--ac)' }}>Về trang chủ</a>
        </p>
      </main>
    </div>
  );
}
