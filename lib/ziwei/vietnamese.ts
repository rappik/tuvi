/**
 * Module Thuật ngữ Chuyên ngành Tử Vi Đẩu Số Việt Nam (Hán Việt - Dịch Nghĩa Tiếng Việt)
 * 
 * Hệ thống thuật ngữ được chuẩn hóa theo truyền thống Tử Vi Đẩu Số Việt Nam
 * (kế thừa các bản dịch và công trình của các bậc danh gia: Cụ Thái Thứ Lang,
 * Cụ Vương Đình Chi, Cụ Thiên Lương, và giáo trình《Thiên Kỷ》của Thầy Nghê Hải Hạ).
 */

// ─── 1. THẬP NHỊ CUNG (12 Cung Chức Vị) ───────────────────────────
export interface PalaceTranslation {
  name: string;          // Tên Hán Việt chuẩn (VD: Mệnh Cung, Phu Thê)
  shortName: string;     // Tên ngắn gọn (VD: Mệnh, Thê)
  meaning: string;       // Giải nghĩa tiếng Việt dễ hiểu
  fullText: string;      // "Hán Việt - Dịch nghĩa" (VD: Phu Thê (Hôn nhân & Tình cảm))
  role: string;          // Chi tiết vai trò cung vị
}

export const PALACE_VI_MAP: Record<string, PalaceTranslation> = {
  '命宫': {
    name: 'Mệnh Cung',
    shortName: 'Mệnh',
    meaning: 'Bản thân, tính cách, số phận cốt lõi',
    fullText: 'Mệnh Cung (Bản Thân & Cốt Cách)',
    role: 'Chủ quản bản ngã, tiên thiên cách cục, tính tình, dung mạo và xu hướng thành bại cả đời.',
  },
  '兄弟宫': {
    name: 'Huynh Đệ Cung',
    shortName: 'Huynh Đệ',
    meaning: 'Anh chị em, bạn bè tri kỷ, đối tác',
    fullText: 'Huynh Đệ (Anh Em & Đối Tác)',
    role: 'Tình cảm anh em ruột thịt, mức độ hòa thuận, duyên hợp tác làm ăn và bạn bè chí cốt.',
  },
  '夫妻宫': {
    name: 'Phu Thê Cung',
    shortName: 'Phu Thê',
    meaning: 'Hôn nhân, tình duyên, bạn đời',
    fullText: 'Phu Thê (Hôn Nhân & Tình Duyên)',
    role: 'Xem duyên phận vợ chồng, tính cách và diện mạo của nửa kia, đời sống hôn nhân sớm hay muộn.',
  },
  '子女宫': {
    name: 'Tử Tức Cung',
    shortName: 'Tử Tức',
    meaning: 'Con cái, hậu duệ, học trò, cấp dưới',
    fullText: 'Tử Tức (Con Cái & Hậu Duệ)',
    role: 'Số lượng và phẩm hạnh con cái, tình cảm phụ tử/mẫu tử, cũng như duyên phận với học trò, nhân viên kế cận.',
  },
  '财帛宫': {
    name: 'Tài Bạch Cung',
    shortName: 'Tài Bạch',
    meaning: 'Tiền bạc, tài lộc, năng lực kiếm tiền',
    fullText: 'Tài Bạch (Tài Lộc & Tiền Bạc)',
    role: 'Phương thức kiếm tiền, dòng tiền ra vào, nguồn tài lộc đến từ chuyên môn hay kinh doanh mạo hiểm.',
  },
  '疾厄宫': {
    name: 'Tật Ách Cung',
    shortName: 'Tật Ách',
    meaning: 'Sức khỏe, bệnh tật, tạng phủ, tai ương',
    fullText: 'Tật Ách (Sức Khỏe & Tạng Phủ)',
    role: 'Tình trạng thể chất, cơ quan tạng phủ bẩm sinh cần lưu ý, bệnh tật tiềm ẩn và phòng tránh tai nạn.',
  },
  '迁移宫': {
    name: 'Thiên Di Cung',
    shortName: 'Thiên Di',
    meaning: 'Ra ngoài, xuất ngoại, giao tiếp xã hội',
    fullText: 'Thiên Di (Đi Xa & Xã Hội)',
    role: 'Vận may khi rời quê hương lập nghiệp, môi trường xã hội bên ngoài, quý nhân hay tiểu nhân khi đi xa.',
  },
  '交友宫': {
    name: 'Nô Bộc Cung',
    shortName: 'Nô Bộc',
    meaning: 'Bạn bè, đồng nghiệp, nhân mạch, cấp dưới',
    fullText: 'Nô Bộc / Giao Hữu (Bạn Bè & Nhân Mạch)',
    role: 'Các mối quan hệ xã giao, cấp dưới có đắc lực trung thành hay phản trắc, vòng tròn quan hệ rộng hẹp.',
  },
  '奴仆宫': {
    name: 'Nô Bộc Cung',
    shortName: 'Nô Bộc',
    meaning: 'Bạn bè, nhân mạch, cấp dưới',
    fullText: 'Nô Bộc (Bạn Bè & Trợ Thủ)',
    role: 'Các mối quan hệ xã giao, sự giúp đỡ từ bạn bè hoặc cấp dưới.',
  },
  '官禄宫': {
    name: 'Quan Lộc Cung',
    shortName: 'Quan Lộc',
    meaning: 'Công danh, sự nghiệp, học vấn, chức vị',
    fullText: 'Quan Lộc (Sự Nghiệp & Công Danh)',
    role: 'Thành tựu công việc, vị trí xã hội, khả năng lãnh đạo, phù hợp làm công chức hay tự lập lập nghiệp.',
  },
  '田宅宫': {
    name: 'Điền Trạch Cung',
    shortName: 'Điền Trạch',
    meaning: 'Nhà cửa, đất đai, bất động sản, gia đạo',
    fullText: 'Điền Trạch (Nhà Cửa & Điền Sản)',
    role: 'Kho cất giữ tài sản thực tế, thừa kế hương hỏa, môi trường sống và phong thủy nơi cư ngụ.',
  },
  '福德宫': {
    name: 'Phúc Đức Cung',
    shortName: 'Phúc Đức',
    meaning: 'Tâm hồn, phúc báo tổ tiên, thọ khang, tinh thần',
    fullText: 'Phúc Đức (Tâm Hồn & Phúc Báo)',
    role: 'Đời sống tinh thần, thú vui nội tâm, phúc đức dòng họ, tuổi thọ và sự bình an trong tâm trí.',
  },
  '父母宫': {
    name: 'Phụ Mẫu Cung',
    shortName: 'Phụ Mẫu',
    meaning: 'Cha mẹ, trưởng bối, di truyền, văn thư công quyền',
    fullText: 'Phụ Mẫu (Cha Mẹ & Trưởng Bối)',
    role: 'Tình cảm với cha mẹ, phúc ấm của phụ mẫu, sự di truyền cũng như duyên phận giấy tờ công quyền pháp lý.',
  },
  '身宫': {
    name: 'Thân Cung',
    shortName: 'Thân',
    meaning: 'Hậu vận (ngoài 30 tuổi), hành động thực tế',
    fullText: 'Thân Cung (Hậu Vận & Hành Động)',
    role: 'Nơi thể hiện hành động thực tế sau tuổi trưởng thành, định hình nửa sau cuộc đời.',
  },
};

// ─── 2. THẬP TỨ CHÍNH TINH (14 Sao Chính) ─────────────────────────
export interface StarTranslation {
  name: string;          // Tên Hán Việt chuẩn
  group: 'major' | 'lucky' | 'sha' | 'minor';
  element: string;       // Ngũ hành
  nature: string;        // Tính chất cát/hung
  keywords: string;      // Từ khóa cốt lõi
  summary: string;       // Tóm tắt ý nghĩa tiếng Việt
}

export const STAR_VI_MAP: Record<string, StarTranslation> = {
  // ─── 14 Chính Tinh ───
  '紫微': {
    name: 'Tử Vi',
    group: 'major',
    element: 'Thổ',
    nature: 'Đế tinh (Cát)',
    keywords: 'Đế Vương · Tôn Quý · Lãnh Đạo',
    summary: 'Chủ tinh tối cao của chòm Bắc Đẩu. Biểu tượng của bậc đế vương tôn quý, tự tôn cao, phong thái đĩnh đạc, có tài tổ chức và lãnh đạo.',
  },
  '天机': {
    name: 'Thiên Cơ',
    group: 'major',
    element: 'Mộc',
    nature: 'Thiện tinh (Cát)',
    keywords: 'Trí Tuệ · Mưu Lược · Cơ Biến',
    summary: 'Sao mưu trí, quân sư. Đầu óc linh hoạt, giỏi tính toán kế hoạch, thích học hỏi, giàu óc sáng tạo, hợp xa quê phát triển sự nghiệp.',
  },
  '太阳': {
    name: 'Thái Dương',
    group: 'major',
    element: 'Hỏa',
    nature: 'Quang minh tinh (Cát)',
    keywords: 'Quang Minh · Đại Hào Hiệp · Quan Quý',
    summary: 'Biểu tượng của mặt trời, cha, người chồng. Tính tình hào sảng, quang minh lỗi lạc, thích giúp đỡ người khác, có chí tiến thủ mạnh mẽ.',
  },
  '武曲': {
    name: 'Vũ Khúc',
    group: 'major',
    element: 'Kim',
    nature: 'Tài tinh (Cương nghị)',
    keywords: 'Tài Bạch · Cương Nghị · Quả Quyết',
    summary: 'Sao tài chính thực thụ. Tính cách thẳng thắn, quyết đoán, chịu khó chịu khổ, có tài năng quản lý tiền bạc và thực hành xuất sắc.',
  },
  '天同': {
    name: 'Thiên Đồng',
    group: 'major',
    element: 'Thủy',
    nature: 'Phúc tinh (Cát)',
    keywords: 'Ôn Hòa · Hưởng Phúc · An Nhiên',
    summary: 'Sao phúc thọ, thiện lương. Tính tình hiền lành, lạc quan, thích cuộc sống bình dị thong dong, có duyên hưởng lộc trời ban.',
  },
  '廉贞': {
    name: 'Liêm Trinh',
    group: 'major',
    element: 'Hỏa',
    nature: 'Đào hoa / Tù tinh (Biến hóa)',
    keywords: 'Tài Nghệ · Đào Hoa · Chính Trực',
    summary: 'Sao thứ hai về đào hoa và tài nghệ. Tính cách kiêu hãnh, bộc trực, thẩm mỹ cao; khi hóa cát thì uy quyền tột đỉnh, khi ngộ hung thì dễ vướng pháp lý.',
  },
  '天府': {
    name: 'Thiên Phủ',
    group: 'major',
    element: 'Thổ',
    nature: 'Lệnh tinh / Kho trời (Cát)',
    keywords: 'Kho Tài · Điềm Đạm · Giữ Của',
    summary: 'Kho bạc của trời đất, chủ quản tài sản và uy quyền. Phong thái khoan hòa, thận trọng, giỏi tích lũy và quản trị bền vững.',
  },
  '太阴': {
    name: 'Thái Âm',
    group: 'major',
    element: 'Thủy',
    nature: 'Phú tinh (Cát)',
    keywords: 'Dịu Dàng · Tích Lũy · Phú Quý',
    summary: 'Biểu tượng của mặt trăng, mẹ, người vợ. Tính tình nhu hòa, thẩm mỹ tinh tế, có duyên với điền sản, giàu tình cảm nội tâm.',
  },
  '贪狼': {
    name: 'Tham Lang',
    group: 'major',
    element: 'Thủy đới Mộc',
    nature: 'Dục tinh / Đào hoa (Trung tính)',
    keywords: 'Dục Vọng · Đào Hoa · Đa Tài Nghệ',
    summary: 'Sao đứng đầu về dục vọng và tài hoa nghệ thuật. Khéo léo trong giao tiếp, đa tài đa nghệ, thích khám phá cái mới và tâm linh huyền học.',
  },
  '巨门': {
    name: 'Cự Môn',
    group: 'major',
    element: 'Thủy',
    nature: 'Ám tinh (Khẩu tài)',
    keywords: 'Khẩu Tài · Tranh Biện · Nghiên Cứu',
    summary: 'Chủ về tài ăn nói, biện luận và phân tích sâu sắc. Giỏi nghiên cứu chuyên môn, thẳng thắn phản biện nhưng cần chú ý thị phi khẩu thiệt.',
  },
  '天相': {
    name: 'Thiên Tướng',
    group: 'major',
    element: 'Thủy',
    nature: 'Ấn tinh (Cát)',
    keywords: 'Phò Tá · Hành Chính · Trượng Nghĩa',
    summary: 'Ngọc ấn quyền lực, vị tể tướng phò tá đắc lực. Trung thực, chu đáo, giữ chữ tín, thích giúp đỡ kẻ yếu, có phong cách quý phái.',
  },
  '天梁': {
    name: 'Thiên Lương',
    group: 'major',
    element: 'Thổ',
    nature: 'Ấm tinh / Thọ tinh (Cát)',
    keywords: 'Che Chở · Trưởng Bối · Y Dược',
    summary: 'Sao che chở và cứu giải tai ách. Có phong thái trưởng lão, đạo mạo, giàu lòng từ bi, có duyên với y học, giáo dục và huyền thuật.',
  },
  '七杀': {
    name: 'Thất Sát',
    group: 'major',
    element: 'Kim đới Hỏa',
    nature: 'Tướng tinh (Cương liệt)',
    keywords: 'Dũng Mãnh · Quyết Đoán · Độc Lập',
    summary: 'Vị đại tướng quân dũng cảm xông pha chiến trường. Ý chí sắt đá, độc lập, ghét sự gò bó, có khả năng đột phá trong gian khó.',
  },
  '破军': {
    name: 'Phá Quân',
    group: 'major',
    element: 'Thủy',
    nature: 'Hao tinh (Biến động)',
    keywords: 'Khai Sáng · Phá Cũ Đổi Mới · Xung Phong',
    summary: 'Sao tiên phong phá hủy cái cũ để kiến tạo cái mới. Tinh thần dám nghĩ dám làm, không ngại biến động, thích tiên phong khai phá.',
  },

  // ─── Lục Cát Tinh & Cát Diệu ───
  '文昌': { name: 'Văn Xương', group: 'lucky', element: 'Kim', nature: 'Cát', keywords: 'Khoa Bảng · Văn Bằng', summary: 'Chủ về học vấn, văn bằng, năng khiếu văn chương chính thống.' },
  '文曲': { name: 'Văn Khúc', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Tài Nghệ · Khẩu Tài', summary: 'Chủ về nghệ thuật, tài ăn nói, hùng biện và cảm thụ tinh tế.' },
  '左辅': { name: 'Tả Phụ', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Trợ Lực · Quý Nhân', summary: 'Quý nhân đồng trang lứa, sự ủng hộ nhiệt tình từ bạn bè, đối tác.' },
  '右弼': { name: 'Hữu Bật', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Khéo Léo · Giúp Đỡ', summary: 'Trợ thủ đắc lực, tinh tế tháo vát, hóa giải khúc mắc.' },
  '天魁': { name: 'Thiên Khôi', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Dương Quý Nhân · Cơ Hội', summary: 'Đệ nhất quý nhân công khai, bậc trưởng bối nâng đỡ, cơ hội thăng tiến mở ra rõ ràng.' },
  '天钺': { name: 'Thiên Việt', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Âm Quý Nhân · May Mắn', summary: 'Quý nhân ngầm giúp đỡ trong lúc cấp bách, cơ hội ngầm đến bất ngờ.' },
  '禄存': { name: 'Lộc Tồn', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Lộc Trời · Tích Lũy', summary: 'Lộc trời ban sẵn, tài lộc ổn định, giữ tiền của vững vàng, giải trừ tai họa.' },
  '天马': { name: 'Thiên Mã', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Bôn Ba · Thăng Tiến', summary: 'Sao dịch mã, càng đi xa càng năng động và dễ thành công, mang lại tài vận phương xa.' },

  // ─── Lục Sát Tinh & Không Kiếp ───
  '擎羊': { name: 'Kình Dương', group: 'sha', element: 'Kim', nature: 'Hung', keywords: 'Hình Thương · Trực Xung', summary: 'Sát tinh sắc bén như lưỡi đao, tính tình nóng nảy, dũng mãnh nhưng dễ va chạm xô xát.' },
  '陀罗': { name: 'Đà La', group: 'sha', element: 'Kim', nature: 'Hung', keywords: 'Trì Trệ · Dây Dưa', summary: 'Sát tinh âm thầm, cản trở ngầm, dùng dằng không dứt, làm việc dễ bị kéo dài trắc trở.' },
  '火星': { name: 'Hỏa Tinh', group: 'sha', element: 'Hỏa', nature: 'Hung', keywords: 'Bộc Phát · Nóng Vội', summary: 'Bùng nổ dữ dội, tính khí bốc đồng, thành bại diễn ra chớp nhoáng.' },
  '铃星': { name: 'Linh Tinh', group: 'sha', element: 'Hỏa', nature: 'Hung', keywords: 'Âm Ỉ · Bền Bỉ', summary: 'Ngấm ngầm, kiên nhẫn toan tính, thâm trầm nhưng khi phát tác thì khó lường.' },
  '地空': { name: 'Địa Không', group: 'sha', element: 'Hỏa', nature: 'Hung', keywords: 'Hư Không · Tiêu Tán', summary: 'Tư tưởng tự do, coi nhẹ vật chất, hao tán tài lộc bất ngờ nhưng có duyên giác ngộ triết học.' },
  '地劫': { name: 'Địa Kiếp', group: 'sha', element: 'Thủy', nature: 'Hung', keywords: 'Trắc Trở · Tổn Thất', summary: 'Thăng trầm sóng gió, dễ gặp khúc quanh bất ngờ trong cuộc đời và tổn hao tài sản.' },

  // ─── Các Phụ Tinh & Thần Sát Khác ───
  '红鸾': { name: 'Hồng Loan', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Hỷ Sự · Duyên Lành', summary: 'Đào hoa chính thống, hỷ sự kết hôn, diện mạo duyên dáng, hòa nhã.' },
  '天喜': { name: 'Thiên Hỷ', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Vui Vẻ · May Mắn', summary: 'Gia đình thêm người thêm của, không khí vui tươi, giải trừ âu lo.' },
  '天刑': { name: 'Thiên Hình', group: 'sha', element: 'Hỏa', nature: 'Nghiêm minh', keywords: 'Kỷ Luật · Hình Pháp', summary: 'Kỷ luật tự giác, tính tình cương trực, có duyên với pháp luật, y thuật hoặc nghiệp quả tu hành.' },
  '天姚': { name: 'Thiên Diêu', group: 'minor', element: 'Thủy', nature: 'Đào hoa', keywords: 'Phong Lưu · Sức Hút', summary: 'Đào hoa phong tình, khiếu thẩm mỹ, thu hút người khác giới.' },
  '孤辰': { name: 'Cô Thần', group: 'minor', element: 'Hỏa', nature: 'Cô độc', keywords: 'Cô Độc · Độc Lập', summary: 'Thích sự yên tĩnh một mình, khó mở lòng, phong cách tự lực cánh sinh.' },
  '寡宿': { name: 'Quả Tú', group: 'minor', element: 'Kim', nature: 'Cô quạnh', keywords: 'Khép Kín · Ít Bạn', summary: 'Nội tâm khép kín, giữ khoảng cách với số đông, độc lập trầm lặng.' },
  '截空': { name: 'Triệt Không', group: 'sha', element: 'Hỏa', nature: 'Chặn đứng', keywords: 'Ngăn Trở · Gián Đoạn', summary: 'Cắt đứt sự thông suốt, làm giảm bớt sức mạnh của cả sao tốt lẫn sao xấu.' },
  '副截': { name: 'Phó Triệt', group: 'minor', element: 'Hỏa', nature: 'Trở ngại nhỏ', keywords: 'Dư Ba · Cản Trở Nhẹ', summary: 'Ảnh hưởng phụ của Triệt Không.' },
  '旬空': { name: 'Tuần Không', group: 'minor', element: 'Hỏa', nature: 'Lơ lửng', keywords: 'Hư Hao · Chậm Rãi', summary: 'Chậm trễ, vơi cạn dần, mang tính hư vô và chờ thời cơ phát tiết.' },
  '副旬': { name: 'Phó Tuần', group: 'minor', element: 'Hỏa', nature: 'Nhẹ', keywords: 'Ảnh Hưởng Nhẹ', summary: 'Ảnh hưởng phụ của Tuần Không.' },
  '大耗': { name: 'Đại Hao', group: 'sha', element: 'Hỏa', nature: 'Hao tán', keywords: 'Hao Hụt Lớn · Biến Động', summary: 'Tiêu hao tiền bạc lớn, không giữ được của, hay phải chi xuất.' },
  '小耗': { name: 'Tiểu Hao', group: 'minor', element: 'Hỏa', nature: 'Hao tán nhỏ', keywords: 'Chi Vặt · Mất Mát', summary: 'Chi tiêu lặt vặt, hao hụt nhỏ thường ngày.' },
  '天哭': { name: 'Thiên Khốc', group: 'sha', element: 'Kim', nature: 'Buồn bã', keywords: 'Khóc Than · Lo Âu', summary: 'Tâm tư phiền muộn, hay lo nghĩ, dễ xúc động rơi nước mắt.' },
  '天虚': { name: 'Thiên Hư', group: 'sha', element: 'Thổ', nature: 'Hư nhược', keywords: 'Hư Ảo · Thể Yếu', summary: 'Khí sắc hư hao, sức bền kém, mọi sự dễ hữu danh vô thực.' },
  '天月': { name: 'Thiên Nguyệt', group: 'minor', element: 'Thủy', nature: 'Bệnh mạn tính', keywords: 'Bệnh Vặt · Thời Tiết', summary: 'Dễ mắc bệnh mạn tính hoặc ảnh hưởng của khí hậu thời tiết.' },
  '阴煞': { name: 'Âm Sát', group: 'sha', element: 'Thổ', nature: 'Ám muội', keywords: 'Tiểu Nhân · Tâm Linh', summary: 'Tiểu nhân ngầm gièm pha, linh cảm tâm linh nhạy bén.' },
  '蜚廉': { name: 'Phi Liêm', group: 'minor', element: 'Hỏa', nature: 'Thị phi', keywords: 'Đặt Điều · Nhanh Chóng', summary: 'Thị phi truyền tai, gièm pha nói xấu sau lưng.' },
  '龙池': { name: 'Long Trì', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Thanh Nhã · Nhà Cửa Đẹp', summary: 'Dung mạo thanh tú, khiếu thẩm mỹ, môi trường sống sạch sẽ sang trọng.' },
  '凤阁': { name: 'Phượng Các', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Đài Các · Cao Quý', summary: 'Cốt cách đài các, khéo tay, có duyên với nghệ thuật kiến trúc.' },
  '三台': { name: 'Tam Thai', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Nâng Đỡ · Vững Vàng', summary: 'Tăng cường sự ổn định, thăng tiến thuận lợi.' },
  '八座': { name: 'Bát Tọa', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Vị Trí · Tiếng Tăm', summary: 'Củng cố địa vị, danh dự và sự bình ổn.' },
  '恩光': { name: 'Ân Quang', group: 'lucky', element: 'Mộc', nature: 'Cát', keywords: 'Ân Huệ · Khen Thưởng', summary: 'Được cấp trên khen thưởng, ghi nhận công lao, quý nhân chiếu cố.' },
  '天贵': { name: 'Thiên Quý', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Tôn Quý · Giữ Tín', summary: 'Lời nói được tôn trọng, có chữ tín, thanh cao.' },
  '台辅': { name: 'Đài Phụ', group: 'lucky', element: 'Kim', nature: 'Cát', keywords: 'Bằng Cấp · Chức Tước', summary: 'Có trợ lực thăng chức, đỗ đạt công danh.' },
  '封诰': { name: 'Phong Cáo', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Sắc Phong · Khen Ngợi', summary: 'Được tuyên dương, phong thưởng, có danh dự.' },
  '天官': { name: 'Thiên Quan', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Quan Lộc · Cứu Giải', summary: 'Chức vị ổn định, có duyên với công quyền, hóa giải thị phi.' },
  '天福': { name: 'Thiên Phúc', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Phúc Khí · Tuổi Thọ', summary: 'Cuộc sống an khang, phúc lộc tự nhiên đến.' },
  '天才': { name: 'Thiên Tài', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Tài Năng · Học Nhanh', summary: 'Thông minh nhanh nhạy, học một biết mười.' },
  '天寿': { name: 'Thiên Thọ', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Trường Thọ · Điềm Tĩnh', summary: 'Sống thọ, tính tình điềm đạm, không tranh đua.' },
  '解神': { name: 'Giải Thần', group: 'lucky', element: 'Mộc', nature: 'Cát', keywords: 'Giải Ách · Tiêu Tai', summary: 'Cứu giải tai họa, biến dữ hóa lành, tháo gỡ bế tắc.' },
  '年解': { name: 'Niên Giải', group: 'lucky', element: 'Mộc', nature: 'Cát', keywords: 'Hóa Giải Tai Ương', summary: 'Giải trừ vận hạn xấu theo năm.' },
  '天德': { name: 'Thiên Đức', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Đức Độ · May Mắn', summary: 'Được trời che chở, gặp hung hóa cát nhờ phúc thiện.' },
  '月德': { name: 'Nguyệt Đức', group: 'lucky', element: 'Hỏa', nature: 'Cát', keywords: 'Mẹ/Bà · Tế Nhị', summary: 'Quý nhân phái nữ giúp đỡ, lòng từ bi tế nhị.' },
  '天巫': { name: 'Thiên Vu', group: 'lucky', element: 'Thổ', nature: 'Cát', keywords: 'Tâm Linh · Thăng Tiến', summary: 'Có linh giác nhạy bén, thừa kế tài sản hoặc dễ thăng tiến.' },
  '华盖': { name: 'Hoa Cái', group: 'lucky', element: 'Kim', nature: 'Cát', keywords: 'Huyền Học · Nghệ Thuật', summary: 'Thích triết học, đạo học, có phong thái nghệ sĩ độc lập cao ngạo.' },
  '劫煞': { name: 'Kiếp Sát', group: 'sha', element: 'Hỏa', nature: 'Hung', keywords: 'Đoạt Lấy · Bất Ngờ', summary: 'Dễ bị tranh chấp bất ngờ, cản trở nửa chừng.' },
  '龙德': { name: 'Long Đức', group: 'lucky', element: 'Thủy', nature: 'Cát', keywords: 'Quý Nhân Lớn', summary: 'Gặp bậc cao nhân che chở, chuyển nguy thành an.' },
  '天使': { name: 'Thiên Sứ', group: 'sha', element: 'Thủy', nature: 'Hung', keywords: 'Sứ Giả Bệnh Tật', summary: 'Chủ quản trắc trở sức khỏe hoặc tin tức bất như ý.' },
  '天伤': { name: 'Thiên Thương', group: 'sha', element: 'Thủy', nature: 'Hung', keywords: 'Tổn Thương · Hao Hụt', summary: 'Dễ có thương tổn thể xác hoặc buồn rầu tinh thần.' },
};

// ─── 3. TỨ HÓA (4 Dạng Biến Hóa Cốt Lõi) ───────────────────────────
export interface SiHuaTranslation {
  name: string;      // Hóa Lộc, Hóa Quyền, Hóa Khoa, Hóa Kỵ
  short: string;     // Lộc, Quyền, Khoa, Kỵ
  meaning: string;   // Dịch nghĩa
  effect: string;    // Tác dụng
}

export const SIHUA_VI_MAP: Record<string, SiHuaTranslation> = {
  '禄': {
    name: 'Hóa Lộc',
    short: 'Lộc',
    meaning: 'Tài Lộc & Duyên May',
    effect: 'Chủ về cơ hội kiếm tiền, tình cảm rộng mở, sự hanh thông, sinh sôi nảy nở, tài phú sung túc.',
  },
  '权': {
    name: 'Hóa Quyền',
    short: 'Quyền',
    meaning: 'Quyền Lực & Uy Thế',
    effect: 'Chủ về quyền lực, năng lực lãnh đạo, ý chí phấn đấu mạnh mẽ, khả năng tự quyết và ảnh hưởng xã hội.',
  },
  '科': {
    name: 'Hóa Khoa',
    short: 'Khoa',
    meaning: 'Khoa Bảng & Danh Tiếng',
    effect: 'Chủ về học vấn, bằng cấp, danh tiếng tốt đẹp, quý nhân giải ách, cứu khốn phò nguy trong lúc hoạn nạn.',
  },
  '忌': {
    name: 'Hóa Kỵ',
    short: 'Kỵ',
    meaning: 'Trở Ngại & Bài Học',
    effect: 'Chủ về vướng mắc, thị phi, chấp niệm sâu sắc, bài học thử thách của kiếp người, cần tu dưỡng hóa giải.',
  },
};

// ─── 4. ĐỘ SÁNG CỦA SAO (Miếu Vượng Lợi Hãm) ───────────────────────
export interface BrightnessTranslation {
  name: string;      // Miếu, Vượng, Đắc, Lợi, Bình, Bất, Hãm
  meaning: string;   // Rực rỡ, Rất sáng, Khá sáng...
  code: string;      // M, V, Đ, L, B, Nh, H
}

export const BRIGHTNESS_VI_MAP: Record<string, BrightnessTranslation> = {
  '庙': { name: 'Miếu', meaning: 'Rực rỡ nhất (Tối cát)', code: 'M' },
  '旺': { name: 'Vượng', meaning: 'Rất sáng (Rất tốt)', code: 'V' },
  '得': { name: 'Đắc', meaning: 'Đắc địa (Sáng tốt)', code: 'Đ' },
  '利': { name: 'Lợi', meaning: 'Lợi địa (Khá sáng)', code: 'L' },
  '平': { name: 'Bình', meaning: 'Bình hòa (Trung bình)', code: 'B' },
  '闲': { name: 'Nhàn', meaning: 'Nhàn cung (Lực yếu)', code: 'Nh' },
  '不': { name: 'Bất', meaning: 'Bất đắc địa (Kém sáng)', code: 'K' },
  '地': { name: 'Địa', meaning: 'Địa vị (Vừa phải)', code: 'Đv' },
  '陷': { name: 'Hãm', meaning: 'Hãm địa (Tối tăm, dễ lộ tính xấu)', code: 'H' },
};

// ─── 5. THIÊN CAN & ĐỊA CHI ─────────────────────────────────────────
export const STEMS_VI = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'];
export const BRANCHES_VI = ['Tý', 'Sửu', 'Dần', 'Mão', 'Thìn', 'Tỵ', 'Ngọ', 'Mùi', 'Thân', 'Dậu', 'Tuất', 'Hợi'];

export const SHICHEN_VI = [
  { branch: 0, name: 'Giờ Tý', range: '23:00 - 01:00' },
  { branch: 1, name: 'Giờ Sửu', range: '01:00 - 03:00' },
  { branch: 2, name: 'Giờ Dần', range: '03:00 - 05:00' },
  { branch: 3, name: 'Giờ Mão', range: '05:00 - 07:00' },
  { branch: 4, name: 'Giờ Thìn', range: '07:00 - 09:00' },
  { branch: 5, name: 'Giờ Tỵ', range: '09:00 - 11:00' },
  { branch: 6, name: 'Giờ Ngọ', range: '11:00 - 13:00' },
  { branch: 7, name: 'Giờ Mùi', range: '13:00 - 15:00' },
  { branch: 8, name: 'Giờ Thân', range: '15:00 - 17:00' },
  { branch: 9, name: 'Giờ Dậu', range: '17:00 - 19:00' },
  { branch: 10, name: 'Giờ Tuất', range: '19:00 - 21:00' },
  { branch: 11, name: 'Giờ Hợi', range: '21:00 - 23:00' },
];

// ─── 6. NGŨ HÀNH CỤC ───────────────────────────────────────────────
export const JU_VI_MAP: Record<string, string> = {
  '水二局': 'Thủy Nhị Cục (Khởi vận năm 2 tuổi)',
  '木三局': 'Mộc Tam Cục (Khởi vận năm 3 tuổi)',
  '金四局': 'Kim Tứ Cục (Khởi vận năm 4 tuổi)',
  '土五局': 'Thổ Ngũ Cục (Khởi vận năm 5 tuổi)',
  '火六局': 'Hỏa Lục Cục (Khởi vận năm 6 tuổi)',
};

// ─── 7. ÂM DƯƠNG NAM NỮ ────────────────────────────────────────────
export const YINYANG_GENDER_VI_MAP: Record<string, string> = {
  '阳男': 'Dương Nam (Vận đi Thuận chiều kim đồng hồ)',
  '阴男': 'Âm Nam (Vận đi Nghịch chiều kim đồng hồ)',
  '阳女': 'Dương Nữ (Vận đi Nghịch chiều kim đồng hồ)',
  '阴女': 'Âm Nữ (Vận đi Thuận chiều kim đồng hồ)',
};

// ─── 8. CÁC CÁCH CỤC TỬ VI KINH ĐIỂN ──────────────────────────────
export const PATTERN_VI_MAP: Record<string, { name: string; meaning: string }> = {
  '紫府同宫格': { name: 'Tử Phủ Đồng Cung Cách', meaning: 'Tử Vi và Thiên Phủ cùng đóng tại Dần/Thân, phú quý song toàn, phúc hậu bền lâu' },
  '紫府朝垣格': { name: 'Tử Phủ Triều Viên Cách', meaning: 'Tử Vi và Thiên Phủ hội chiếu Mệnh Cung từ tam phương tứ chính, chủ đại quý' },
  '杀破狼格': { name: 'Sát Phá Tham Cách', meaning: 'Thất Sát, Phá Quân, Tham Lang tam hợp hội tụ, cuộc đời biến động lớn, khai sáng phi thường' },
  '机月同梁格': { name: 'Cơ Nguyệt Đồng Lương Cách', meaning: 'Thiên Cơ, Thái Âm, Thiên Đồng, Thiên Lương hội tụ, hợp phò tá, công chức, hành chính, mưu trí' },
  '日照雷门格': { name: 'Nhật Chiếu Lôi Môn Cách', meaning: 'Thái Dương cư Mão (cung Chấn - Lôi Môn), như mặt trời ban mai tỏa rạng rỡ, đại phú đại quý' },
  '月朗天门格': { name: 'Nguyệt Lãng Thiên Môn Cách', meaning: 'Thái Âm miếu tại cung Hợi (Thiên Môn), ánh trăng vằng vặc, chủ tài lộc sung túc, thanh cao' },
  '日月并明格': { name: 'Nhật Nguyệt Tịnh Minh Cách', meaning: 'Thái Dương ở Thìn, Thái Âm ở Tuất đồng thời miếu vượng chiếu Mệnh, tiền đồ xán lạn' },
  '巨日同宫格': { name: 'Cự Nhật Đồng Cung Cách', meaning: 'Cự Môn và Thái Dương đồng cung tại Dần/Thân, khẩu tài xuất chúng, danh tiếng vang xa' },
  '阳梁昌禄格': { name: 'Dương Lương Xương Lộc Cách', meaning: 'Thái Dương, Thiên Lương, Văn Xương, Lộc Tồn hội chiếu, đứng đầu thi cử, khoa bảng vang lừng' },
  '石中隐玉格': { name: 'Thạch Trung Ẩn Ngọc Cách', meaning: 'Cự Môn tại Tý/Ngọ, ngọc quý ẩn trong đá, trải qua tôi luyện thì tài hoa xuất chúng' },
  '金灿光辉格': { name: 'Kim Xán Quang Huy Cách', meaning: 'Thái Dương cư Ngọ, mặt trời chính ngọ rực rỡ nhất trần đời, quyền uy tôn quý' },
  '府相朝垣格': { name: 'Phủ Tướng Triều Viên Cách', meaning: 'Thiên Phủ và Thiên Tướng tam hợp chiếu Mệnh, phong túc ấm no, quý nhân phò trợ' },
  '廉贞清白格': { name: 'Liêm Trinh Thanh Bạch Cách', meaning: 'Liêm Trinh tại Dần/Thân miếu vượng, tính tình thanh cao, chính trực, nữ mệnh trinh liệt đảm đang' },
  '马头带剑格': { name: 'Mã Đầu Đới Kiếm Cách', meaning: 'Kình Dương cư Ngọ, nếu hội cát tinh thì lập kỳ công nơi biên ải, nhưng cần đề phòng hình thương' },
};

// ─── 9. CÁC HÀM FORMAT TIỆN ÍCH DÀNH CHO UI ─────────────────────────

/**
 * Format tên Cung:
 * - '命宫' -> 'Mệnh Cung' hoặc 'Mệnh (Bản thân)'
 */
export function formatPalaceName(palaceCn: string, withRole = false): string {
  const clean = palaceCn.endsWith('宫') ? palaceCn : `${palaceCn}宫`;
  const info = PALACE_VI_MAP[clean] || PALACE_VI_MAP[palaceCn];
  if (!info) return palaceCn;
  return withRole ? `${info.name} · ${info.meaning}` : info.name;
}

/**
 * Lấy tên Cung ngắn gọn:
 * - '命宫' -> 'Mệnh'
 * - '夫妻宫' -> 'Phu Thê'
 */
export function formatPalaceShort(palaceCn: string): string {
  const clean = palaceCn.endsWith('宫') ? palaceCn : `${palaceCn}宫`;
  const info = PALACE_VI_MAP[clean] || PALACE_VI_MAP[palaceCn];
  return info ? info.shortName : palaceCn.replace('宫', '');
}

/**
 * Lấy giải nghĩa chi tiết về vai trò của Cung
 */
export function getPalaceRole(palaceCn: string): string {
  const clean = palaceCn.endsWith('宫') ? palaceCn : `${palaceCn}宫`;
  const info = PALACE_VI_MAP[clean] || PALACE_VI_MAP[palaceCn];
  return info ? info.role : '';
}

/**
 * Format tên Sao sang tiếng Việt
 * - '紫微' -> 'Tử Vi'
 */
export function formatStarName(starCn: string): string {
  const info = STAR_VI_MAP[starCn];
  return info ? info.name : starCn;
}

/**
 * Lấy thông tin đầy đủ về Sao
 */
export function getStarInfo(starCn: string): StarTranslation | undefined {
  return STAR_VI_MAP[starCn];
}

/**
 * Format Tứ Hóa:
 * - '禄' -> 'Hóa Lộc' hoặc 'Lộc'
 */
export function formatSiHua(siHuaCn: string, short = false): string {
  const clean = siHuaCn.replace('化', '');
  const info = SIHUA_VI_MAP[clean];
  if (!info) return siHuaCn;
  return short ? info.short : info.name;
}

/**
 * Format Tứ Hóa kèm giải nghĩa
 */
export function formatSiHuaWithMeaning(siHuaCn: string): string {
  const clean = siHuaCn.replace('化', '');
  const info = SIHUA_VI_MAP[clean];
  if (!info) return siHuaCn;
  return `${info.name} (${info.meaning})`;
}

/**
 * Format Độ sáng sao (Miếu Vượng Hãm):
 * - '庙' -> 'Miếu (M)' hoặc 'Miếu'
 */
export function formatBrightness(brightCn?: string, withCode = false): string {
  if (!brightCn) return '';
  const info = BRIGHTNESS_VI_MAP[brightCn];
  if (!info) return brightCn;
  return withCode ? `${info.name} [${info.code}]` : info.name;
}

/**
 * Format Can Chi:
 * - stem (0-9): Giáp ... Quý
 * - branch (0-11): Tý ... Hợi
 */
export function formatGanZhi(stemIdx: number, branchIdx: number): string {
  const stem = STEMS_VI[((stemIdx % 10) + 10) % 10] ?? '';
  const branch = BRANCHES_VI[((branchIdx % 12) + 12) % 12] ?? '';
  return `${stem} ${branch}`;
}

export function formatStem(stemIdx: number): string {
  return STEMS_VI[((stemIdx % 10) + 10) % 10] ?? '';
}

export function formatBranch(branchIdx: number): string {
  return BRANCHES_VI[((branchIdx % 12) + 12) % 12] ?? '';
}

/**
 * Format Ngũ Hành Cục
 */
export function formatJuName(juNameCn: string): string {
  return JU_VI_MAP[juNameCn] || juNameCn;
}

/**
 * Format Âm Dương Giới Tính
 */
export function formatYinYangGender(val: string): string {
  return YINYANG_GENDER_VI_MAP[val] || val;
}

/**
 * Format Cách cục
 */
export function formatPatternName(nameCn: string): string {
  return PATTERN_VI_MAP[nameCn]?.name || nameCn;
}
