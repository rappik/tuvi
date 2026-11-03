'use client';
import { motion, AnimatePresence } from 'framer-motion';
import type { Star } from '@/lib/ziwei/types';
import {
  formatStarName,
  formatPalaceShort,
  formatSiHua,
  formatBrightness,
  STAR_VI_MAP,
} from '@/lib/ziwei/vietnamese';

interface StarDetailPanelProps {
  star: Star | null;
  palaceName?: string;
  onClose: () => void;
}

// Luận giải chi tiết 14 Chính Tinh theo hệ thống Thầy Nghê Hải Hạ 《Thiên Kỷ》 và Cổ thư 《Tử Vi Đẩu Số Toàn Thư / Cốt Tủy Phú》
const STAR_DETAIL: Record<string, {
  niHaixia: string;
  classical: string;
  bestPalace: string;
  worstPalace: string;
  career: string;
  relationship: string;
  wealth: string;
  health: string;
}> = {
  '紫微': {
    niHaixia: 'Thầy Nghê Hải Hạ giảng: Tử Vi là Hoàng Đế tinh, tọa tại Mệnh Cung thì có khí phách cô ngạo bẩm sinh, thích độc lập tự chủ, không muốn bị người khác sai khiến hay kìm kẹp. Tử Vi cần nhất có Tả Phụ, Hữu Bật giáp cung hoặc triều củng mới phát huy trọn vẹn khí chất đế vương; nếu đứng đơn độc thì chỉ là "cô quân" (vua một mình), có thể giàu mà thiếu tôn quý. Tử Vi đóng tại Thìn, Tuất là đắc địa nhất, cùng Thiên Phủ tạo thành cách cục "Tử Phủ Đồng Cung", tài quan song mỹ, xuất tướng nhập tướng. Tử Vi tối kỵ gặp Kình Dương, Đà La, Hỏa Tinh, Linh Tinh đồng cung, ngộ sát tinh ắt hóa cô quý, nắm thực quyền nhưng hao tán tài vật.',
    classical: 'Cổ quyết: "Tử Vi đế tọa lâm Mệnh chủ tôn quý, thống lĩnh chư tinh, tọa Mệnh giả chủ quyền uy hiển đạt." Nam Bắc Sơn Nhân chú: "Tử Vi thủ Mệnh tại Thìn vị, tài quan song mỹ, xuất tướng nhập tướng, vị chí tam công; tại Tý cung an Mệnh, phú quý bất nại cửu."',
    bestPalace: 'Mệnh Cung (Thìn, Tuất), Quan Lộc Cung',
    worstPalace: 'Tật Ách Cung, Phu Thê Cung',
    career: 'Chính giới, quản lý cấp cao, sáng lập doanh nghiệp tự chủ; có khí chất lãnh đạo thiên bẩm, phù hợp vị trí đầu tàu.',
    relationship: 'Trong tình cảm có phần bị động, lòng tự trọng cao, cần đối phương chủ động thấu hiểu; có xu hướng thích riêng tư, kết hôn muộn thì đại cát.',
    wealth: 'Tài vận ổn định vững chắc, khả năng giữ gìn thủ thành tốt hơn mạo hiểm xung phong; ở vị trí Thìn/Tuất tài quan trọn vẹn, hợp đầu tư tích lũy dài hạn.',
    health: 'Thuộc hành Thổ, cần chú ý tỳ vị, hệ thống tiêu hóa. Tránh làm việc quá độ, nên duy trì sinh hoạt điều độ dưỡng thân.',
  },
  '天机': {
    niHaixia: 'Thầy Nghê chỉ rõ: Thiên Cơ là Tham Mưu tinh, ngôi sao thông minh tột bậc trong Đẩu Số, nhưng nếu quá lộ liễu sự tinh ranh thì dễ tổn hao tâm lực. Thiên Cơ Hóa Kỵ là điều phiền toái nhất, tượng trưng cho "thông minh phản bị thông minh hại". Thiên Cơ ngũ hành thuộc Mộc, tính chất linh động cơ biến; đóng ở Mệnh Cung thì tư duy vô cùng nhanh nhạy, nhưng dễ rơi vào cảnh "nhiều mưu ít quyết", nên rời xa quê hương lập nghiệp mới đại phát, khả năng tùy cơ ứng biến là ưu thế lớn nhất.',
    classical: 'Cổ quyết: "Vi nhân sinh tinh hoạt, tự hảo tác kinh doanh. Thiên Cơ tinh thuộc Mộc, ly tông tất viễn thân, cơ mưu tất viễn ly thân." Nam Bắc Sơn Nhân: "Thiên Cơ cư miếu vượng địa, chủ nhân tinh minh, thiện sách hoạch; cư hãm địa tắc ảm đạm."',
    bestPalace: 'Mệnh Cung (cung Mão), Quan Lộc Cung',
    worstPalace: 'Phu Thê Cung',
    career: 'Chuyên gia kỹ thuật, quân sư chiến lược, nhà nghiên cứu, công nghệ thông tin, hoạch định dự án; dùng trí óc hơn chân tay, rất hợp lập nghiệp phương xa.',
    relationship: 'Tình cảm nhiều biến động, suy nghĩ quá nhiều nên khó chuyên nhất một mối; nên kết hôn muộn, sau hôn nhân cần học cách buông bớt âu lo tính toán.',
    wealth: 'Kiếm tiền bằng trí tuệ, mưu lược và chuyên môn sâu; không giỏi cất giữ tiền mặt tĩnh, lấy kỹ năng tay nghề và cố vấn làm gốc ắt tài vận dồi dào.',
    health: 'Thuộc Mộc, cần chú ý gan mật, hệ thần kinh. Suy nghĩ quá độ dễ dẫn đến mất ngủ, đau đầu; nên thực hành thiền định, tĩnh tâm.',
  },
  '太阳': {
    niHaixia: 'Thầy Nghê luận: Thái Dương là sao biểu trưng cho tinh thần quân tử đại trượng phu, từ Mão đến Ngọ là nhập miếu rực rỡ, quang minh chính đại; sau giờ Ngọ thì ánh sáng dần suy thoái. Người Mệnh có Thái Dương thì tính tình hào phóng, trọng danh dự thể diện; nam mệnh rất hợp, nữ mệnh thì quá mạnh mẽ độc lập. Thái Dương đại diện cho cha và chồng; tọa Mệnh thì cởi mở nhiệt tình, thích cống hiến cho số đông, hợp nhất làm việc công quyền hoặc sự nghiệp đại chúng. Rơi vào hãm địa thì trước siêng sau lười, lao lực vất vả.',
    classical: 'Cổ quyết: "Thái Dương cư Ngọ vi nhập miếu, quang huy đại phóng, chủ quý hiển, nam mệnh tối giai; lạc hãm tắc cô quả lao lục, tiên cần hậu nọa."',
    bestPalace: 'Mệnh Cung (từ Mão đến Ngọ), Quan Lộc Cung',
    worstPalace: 'Phu Thê Cung (đối với Nữ mệnh), Tật Ách Cung',
    career: 'Công chức, ngoại giao, chính trị, quản lý điều hành, truyền thông, giáo dục; thích xuất hiện trước công chúng, gánh vác trách nhiệm lớn.',
    relationship: 'Nam mệnh duyên rộng nhưng dễ đào hoa; nữ mệnh tài giỏi đảm đang lấn át chồng, hôn nhân cần bao dung thấu hiểu, nên tìm bạn đời dịu dàng.',
    wealth: 'Tài vận đến từ sự tận tụy nỗ lực, tính tình hào sảng hay giúp đỡ người khác nên khó tích cóp; nhập miếu tài vận dồi dào, hãm địa tài vận trồi sụt thất thường.',
    health: 'Thuộc Hỏa, chủ tim mạch, huyết áp, thị lực và mắt. Khi ở hãm địa dễ làm việc kiệt sức, cần chú ý nghỉ ngơi bồi bổ.',
  },
  '武曲': {
    niHaixia: 'Thầy Nghê xem Vũ Khúc là đệ nhất Tài Tinh trong Đẩu Số, tính tình cương nghị bất khuất nhưng sợ nhất cô khắc. Người Vũ Khúc tọa Mệnh ý chí sắt đá, quyết đoán mau lẹ, rất hợp lĩnh vực tài chính, kế toán ngân hàng; tuy nhiên trong giao tiếp tình cảm quá thẳng thắn, dễ làm tổn thương người khác. Vũ Khúc Hóa Kỵ cần đề phòng hình thương tai nạn đổ máu. Vũ Khúc tại Thìn, Tuất, Sửu, Mùi đắc vượng, nếu đồng cung Thất Sát tạo thành cách cục "Tướng Tài Cách", chủ đại phú đại quý.',
    classical: 'Cổ quyết: "Vũ Khúc thuộc Kim, cương cường chi tính, nhất sinh đa hình khắc; thủ Mệnh vu vượng địa, xuất tướng nhập tướng." Đồng cung Thất Sát chủ đại phú.',
    bestPalace: 'Mệnh Cung (Thìn Tuất Sửu Mùi), Tài Bạch Cung, Quan Lộc Cung',
    worstPalace: 'Phu Thê Cung',
    career: 'Tài chính ngân hàng, quân đội, công an, cơ khí chế tạo, kiểm toán; năng lực hành động và quyết đoán phi thường.',
    relationship: 'Tình cảm thẳng như ruột ngựa, thiếu sự lãng mạn mềm mỏng; cần người bạn đời thấu hiểu và sẻ chia sự khô khan của mình.',
    wealth: 'Chính tinh tài lộc bẩm sinh, năng lực quản lý dòng tiền xuất chúng, đầu tư thực tế chắc chắn, hậu vận đại phú.',
    health: 'Thuộc Kim, chú ý hệ hô hấp, phổi, mũi họng và răng xương. Khi ngộ Hóa Kỵ hoặc sát tinh cần cẩn thận va chạm thương tích kim khí.',
  },
  '天同': {
    niHaixia: 'Thầy Nghê hóm hỉnh nói: Thiên Đồng là Phúc Tinh, cũng là ngôi sao "thong thả" nhất. Thiên Đồng tọa Mệnh thích an nhàn hưởng thụ, không ham tranh quyền đoạt lợi, rất hợp môi trường ổn định. Thiên Đồng gặp Thiên Lương đồng cung là tuyệt mỹ, vừa được hưởng phúc vừa có sự che chở vững chắc. Thiên Đồng Hóa Lộc là cách Hóa Lộc êm đềm nhất trần đời, chủ cả đời no đủ, tinh thần lạc quan tự tại. Thiên Đồng sợ nhất rơi vào hãm địa làm giảm phúc khí.',
    classical: 'Cổ quyết: "Thiên Đồng vi phúc đức chi tinh, tọa Mệnh giả hưởng phúc hữu dư, chủ nhất sinh tiêu dao tự tại, bất tất lao khổ."',
    bestPalace: 'Mệnh Cung, Phúc Đức Cung',
    worstPalace: 'Quan Lộc Cung',
    career: 'Ngành dịch vụ, nghệ thuật, ẩm thực, du lịch giải trí, công tác xã hội; môi trường vui vẻ nhẹ nhàng phát huy tối đa năng lực.',
    relationship: 'Tình cảm ôn nhu hòa nhã, tính cách dễ gần đáng yêu, hôn nhân tương đối êm ấm, ghét xung đột cãi vã.',
    wealth: 'Tài lộc bình ổn, đủ đầy ấm no, không thích hợp đầu cơ mạo hiểm làm giàu cấp tốc; phúc lộc tự nhiên đến theo thời gian.',
    health: 'Thuộc Thủy, chú ý thận, bàng quang, bài tiết. Thể chất cần rèn luyện thể thao đều đặn để tránh trì trệ thụ động.',
  },
  '廉贞': {
    niHaixia: 'Thầy Nghê luận: Liêm Trinh là Thứ Đào Hoa tinh, tài hoa phát tiết nhưng đường tình cảm phong ba phức tạp. Liêm Trinh Hóa Kỵ cực kỳ hung hiểm, tượng trưng cho kiện tụng, pháp luật, tai ách bất ngờ. Nhưng nếu Liêm Trinh gặp Thiên Tướng đồng cung tại Tý/Ngọ thì chuyển hung thành cát, hóa thành "Hành Chính Ấn Thụ Cách", nắm quyền sinh quyền sát. Liêm Trinh ngũ hành thuộc Hỏa, tính khí cương liệt, cuộc đời nhiều bước ngoặt; giữ lòng ngay thẳng ắt thành đại nghiệp.',
    classical: 'Cổ quyết: "Liêm Trinh vi thứ đào hoa, tài hoa hoành dật, cảm tình đa ba triết; Liêm Tướng đồng cung, hóa hung vi cát, thành hành chính ấn thụ cách, khả chưởng quyền bính."',
    bestPalace: 'Quan Lộc Cung (hội Thiên Tướng), Mệnh Cung (khi Hóa Lộc)',
    worstPalace: 'Mệnh Cung (khi Hóa Kỵ), Phu Thê Cung',
    career: 'Luật pháp, tư pháp chính trị, nghệ thuật sáng tạo, quan hệ công chúng, quản lý cấp cao; tài nghệ xuất sắc, cần giữ chuẩn mực đạo đức.',
    relationship: 'Đào hoa vượng, tình cảm dễ vướng thị phi trắc trở; nên kết hôn muộn và lựa chọn bạn đời trầm tĩnh, chín chắn.',
    wealth: 'Tài vận thăng trầm theo vận hạn, kiếm tiền bằng tài hoa và chuyên môn; khi Hóa Kỵ phải tuyệt đối tránh rủi ro pháp lý tài chính.',
    health: 'Thuộc Hỏa, chú ý tim mạch, tuần hoàn máu và gan. Cần cẩn thận khi lái xe và chú ý kiểm tra sức khỏe định kỳ.',
  },
  '天府': {
    niHaixia: 'Thầy Nghê dạy: Thiên Phủ là Kho Bạc Trời, ngôi sao thủ thành gìn giữ sự nghiệp, không chủ động kiếm tiền bạt mạng nhưng giữ tiền cực kỳ chắc chắn. Thiên Phủ tọa Mệnh đĩnh đạc ung dung, nữ mệnh gặp Thiên Phủ là vượng phu ích tử bậc nhất. Thiên Phủ thích nhất hội cùng Tử Vi tạo thành thế "Tử Phủ Triều Viên", phú quý trọn đời. Thiên Phủ sợ nhất bị Địa Không, Địa Kiếp giáp hoặc hội chiếu, tựa như kho tiền bị thủng đáy, khó tụ tài vật.',
    classical: 'Cổ quyết: "Thiên Phủ vi tài khố chi tinh, thủ Mệnh giả ổn trọng bảo thủ, chủ tích tài vượng gia; nữ mệnh phùng chi, năng vượng phu ích tử, gia đạo hưng long."',
    bestPalace: 'Mệnh Cung, Tài Bạch Cung, Điền Trạch Cung',
    worstPalace: 'Thiên Di Cung',
    career: 'Quản trị hành chính, tài chính kế toán, ngân hàng bảo hiểm, bất động sản; nghề nghiệp mang tính quản trị và duy trì ổn định.',
    relationship: 'Tình cảm thủy chung mẫu mực, luôn chăm lo vun vén cho tổ ấm, coi trọng sự an toàn kinh tế của gia đình.',
    wealth: 'Tài vận dồi dào, khả năng quản lý chi tiêu và tích lũy tài sản đứng hàng đầu trong các chính tinh; rất có lộc về đất đai nhà cửa.',
    health: 'Thuộc Thổ, chú ý tỳ vị tiêu hóa. Thể trạng thường đẫy đà, nên chú ý chế độ ăn uống khoa học, tránh thừa cân.',
  },
  '太阴': {
    niHaixia: 'Thầy Nghê xem Thái Âm là đệ nhất Phú Tinh (chủ về giàu có tích lũy), đặc biệt hợp nữ mệnh; đối với nam mệnh đại diện cho mẹ và vợ. Thái Âm nhập miếu tại Hợi, Tý tài vận cực vượng, toát lên vẻ thanh nhã đoan trang, nội tâm phong phú sâu sắc. Rơi vào hãm địa tại Thìn, Tỵ, Ngọ thì tài vận lận đận và nhiều tâm tư u buồn. Thái Âm Hóa Kỵ cần đặc biệt chú ý sức khỏe người phụ nữ ruột thịt trong gia đình.',
    classical: 'Cổ quyết: "Thái Âm vi tài tinh, lợi nữ mệnh; Hợi Tý nhập miếu, quang huy toàn chiếu, tài vận cực vượng; Ngọ vị lạc hãm, ưu uất đa tình."',
    bestPalace: 'Mệnh Cung (Hợi, Tý), Tài Bạch Cung, Điền Trạch Cung',
    worstPalace: 'Mệnh Cung (khi hãm địa tại Ngọ, Tỵ)',
    career: 'Tài chính, bất động sản, thiết kế nghệ thuật, giáo dục, tâm lý học; hợp các công việc đòi hỏi sự kiên nhẫn, thẩm mỹ và tinh tế.',
    relationship: 'Tình cảm dịu dàng sâu lắng, giàu lòng trắc ẩn, coi trọng sự gắn kết tâm hồn và cảm giác an toàn bến đỗ.',
    wealth: 'Nhập miếu ắt giàu sang nhờ bền bỉ tích lũy; có duyên sở hữu nhiều bất động sản và tài sản dài hạn.',
    health: 'Thuộc Thủy, chú ý thận, bàng quang, phụ khoa (với nữ mệnh) và nội tiết. Tâm trạng nhạy cảm dễ ảnh hưởng giấc ngủ.',
  },
  '贪狼': {
    niHaixia: 'Thầy Nghê nhấn mạnh: Tham Lang là ngôi sao đa tài đa nghệ nhất, cũng là sao đào hoa dục vọng lớn nhất. Tham Lang Hóa Lộc vào Mệnh thì sức hút cá nhân tỏa sáng, đi đâu cũng được mọi người yêu mến giúp đỡ. Tham Lang thuộc nhóm "hậu phát" (phát đạt muộn sau tuổi 30). Tọa tại Dần/Thân nhập miếu tài năng trác tuyệt; ngộ Hỏa Tinh/Linh Tinh tạo thành "Hỏa Tham Cách", "Linh Tham Cách", chủ bạo phát tài lộc bất ngờ.',
    classical: 'Cổ quyết: "Tham Lang phát phúc hanh thông, đa tài đa nghệ, đào hoa tối trọng... Lạc hãm ngộ sát phản cát." Hỏa Tinh Linh Tinh đồng cung chủ hoạch phát.',
    bestPalace: 'Mệnh Cung (Hóa Lộc), Phúc Đức Cung, Thiên Di Cung',
    worstPalace: 'Tật Ách Cung',
    career: 'Nghệ thuật, giải trí, truyền thông, kinh doanh ngoại giao, quan hệ công chúng, ngũ thuật phong thủy; làm giàu nhờ tài năng và mạng lưới quan hệ.',
    relationship: 'Đào hoa cực vượng, nhiều người theo đuổi; nên kết hôn muộn sau khi trải nghiệm chín chắn để giữ gìn hôn nhân bền lâu.',
    wealth: 'Kiếm tiền nhạy bén nhờ nắm bắt tâm lý người khác và cơ hội thời cuộc; trung vận về sau tài vận vững vàng sung túc.',
    health: 'Thuộc Thủy đới Mộc, chú ý gan mật, hệ tiết niệu sinh dục. Cần điều hòa lối sống, tránh thức khuya và tiệc tùng quá đà.',
  },
  '巨门': {
    niHaixia: 'Thầy Nghê luận: Cự Môn là Ám Tinh, chủ về khẩu tài ăn nói và thị phi tranh cãi; nhưng khi Hóa Lộc, Hóa Quyền thì chuyển hóa thành đại cát, tạo nên cách cục "dùng miệng lưỡi kiến tạo giang sơn". Người Cự Môn tọa Mệnh tính tình đa nghi, quan sát sắc sảo, giỏi phản biện, rất hợp làm luật sư, giáo viên, diễn giả. Cự Môn sợ nhất Hóa Kỵ, chủ thị phi bủa vây, kiện tụng rắc rối. Cư Tý/Ngọ tạo thành "Thạch Trung Ẩn Ngọc Cách", ngọc quý mài dũa ắt sáng lòa.',
    classical: 'Cổ quyết: "Cự Môn vi ám diệu, chủ khẩu thiệt thị phi; hóa Lộc Quyền tắc chuyển vi dĩ khẩu tài mưu sinh, chủ phú quý."',
    bestPalace: 'Quan Lộc Cung (Hóa Lộc, Hóa Quyền), Mệnh Cung (Tý, Ngọ)',
    worstPalace: 'Phu Thê Cung, Tật Ách Cung (khi Hóa Kỵ)',
    career: 'Luật sư, nhà hùng biện, giảng viên, đàm phán viên, chuyên gia tư vấn, MC; lời ăn tiếng nói là vũ khí sinh tồn mạnh mẽ nhất.',
    relationship: 'Nội tâm hay suy nghĩ lo âu, nhạy cảm với lời nói của đối phương; giao tiếp cởi mở và tin tưởng là chìa khóa hôn nhân.',
    wealth: 'Kiếm tiền từ tài năng ăn nói, giảng giải và nghiên cứu chuyên môn sâu; cẩn trọng tiền bạc rạch ròi tránh tranh chấp thị phi.',
    health: 'Thuộc Thủy, chú ý vòm họng, răng miệng, thanh quản, tai và thận. Tránh lo nghĩ thái quá làm hao tổn nguyên khí.',
  },
  '天相': {
    niHaixia: 'Thầy Nghê giảng: Thiên Tướng là Ấn Tinh, biểu tượng của ngọc ấn thừa hành mệnh lệnh, quan chức hành chính mẫn cán. Thiên Tướng tọa Mệnh cư xử mực thước, công tâm chính trực, trọng chữ tín. Thiên Tướng mang tính phò tá, cần gặp sao quyền lực mạnh mẽ dẫn dắt; đẹp nhất khi hội cùng Liêm Trinh tạo thành "Liêm Tướng Cách" nắm quyền hành chính; tối kỵ bị Kình Dương, Hóa Kỵ giáp cung tạo thành "Hình Kỵ Giáp Ấn Cách" chủ tai ương trắc trở.',
    classical: 'Cổ quyết: "Thiên Tướng vi ấn thụ chi tinh, chủ hành chính thứ vụ; Liêm Tướng đồng cung, hóa hung vi cát, chưởng hành chính đại quyền."',
    bestPalace: 'Quan Lộc Cung, Mệnh Cung (hội Liêm Trinh)',
    worstPalace: 'Mệnh Cung (khi bị Hình Kỵ Giáp Ấn)',
    career: 'Công chức nhà nước, quản lý hành chính, thư ký trợ lý cấp cao, nhân sự, luật sư; vai trò phò tá đắc lực và đáng tin cậy.',
    relationship: 'Tình cảm chân thành chuẩn mực, bạn đời thủy chung chu đáo, luôn giữ gìn hình ảnh tốt đẹp cho gia đình.',
    wealth: 'Tài lộc ổn định từ chức vụ và lương bổng, không ham làm giàu liều lĩnh; phương thức quản lý tài chính chuẩn mực an toàn.',
    health: 'Thuộc Thủy, chú ý hệ tiết niệu, da dẻ và hệ bạch huyết. Sức khỏe bình ổn, duy trì vận động đều đặn.',
  },
  '天梁': {
    niHaixia: 'Thầy Nghê luận: Thiên Lương là Ấm Tinh, chủ về sự che chở bảo bọc, đại diện cho y dược, tôn giáo và tuổi thọ. Thiên Lương tọa Mệnh tính tình đạo mạo, nhân hậu, có duyên với bậc trưởng bối, tiền vận chịu nhiều thử thách rèn giũa để hậu vận hưởng đại phúc. Thiên Lương sợ nhất ngộ Hóa Kỵ chủ thị phi do lòng tốt bị lợi dụng. Thiên Lương hội Thái Dương đồng cung tại Mão là "Nhật Chiếu Lôi Môn Cách", cả đời có quý nhân che chở, bình an vượt mọi sóng gió.',
    classical: 'Cổ quyết: "Thiên Lương vi ấm tinh, chủ tý ấm bảo hộ; tọa Mệnh giả hữu trưởng bối duyên, tảo niên thụ ma luyện, vãn niên hưởng thanh phúc."',
    bestPalace: 'Mệnh Cung, Phụ Mẫu Cung, Phúc Đức Cung',
    worstPalace: 'Tài Bạch Cung (khi Hóa Kỵ)',
    career: 'Y dược, bác sĩ, giáo dục, pháp luật, hoạt động từ thiện, tâm lý học; có thiên hướng phụng sự cộng đồng và cứu giúp người khác.',
    relationship: 'Thường có duyên với bạn đời chênh lệch tuổi tác khá nhiều, hoặc mối duyên đến muộn nhưng rất sâu đậm, son sắt.',
    wealth: 'Tài lộc có quý nhân tương trợ, không chủ phát tài chớp nhoáng nhưng càng về hậu vận càng sung túc, có lộc thừa kế.',
    health: 'Thuộc Thổ, chú ý tỳ vị, xương khớp và cột sống. Cần chú trọng giữ gìn sức khỏe dưỡng sinh khi bước vào tuổi trung niên.',
  },
  '七杀': {
    niHaixia: 'Thầy Nghê đúc kết: Thất Sát là Đại Tướng Quân tinh, dũng khí ngút trời, quyết đoán mau lẹ nhưng mang tính cô khắc mạnh mẽ. Thất Sát tọa Mệnh rất cần các cát tinh hội tụ để hóa giải tính cô đơn sát phạt, nếu không dễ có cảm giác cô độc người thân. Thất Sát đồng cung Vũ Khúc tạo thành "Vũ Sát Tướng Tài Cách", cực kỳ uy dũng. Thất Sát sợ nhất "Trúc La Tam Hạn" (hạn gặp Kình, Đà, Hỏa, Linh), cần cẩn trọng rủi ro, kiềm chế tính nóng nảy.',
    classical: 'Cổ quyết: "Thất Sát vi tướng quân chi tinh, quả quyết xung kính cường; thủ Mệnh giả cô khắc tính trọng, lục thân duyên bạc." Tam hợp cát tụ tắc đại quý.',
    bestPalace: 'Mệnh Cung (có cát tinh phò trợ), Quan Lộc Cung',
    worstPalace: 'Phu Thê Cung, Phụ Mẫu Cung',
    career: 'Quân đội, công an, doanh nhân khai phá thị trường mới, nhà đầu tư mạo hiểm; lĩnh vực đòi hỏi tinh thần dũng cảm và quyết sách độc lập.',
    relationship: 'Tính cách mạnh mẽ độc lập nên đường tình duyên dễ gập ghềnh; cần bạn đời bao dung, thấu hiểu cá tính kiên cường của mình.',
    wealth: 'Tài vận biến động lớn, có khả năng tạo dựng cơ đồ từ hai bàn tay trắng, lúc phát thì như sấm sét; hợp tích lũy tài sản thực.',
    health: 'Thuộc Kim đới Hỏa, chú ý hô hấp, phổi, đại tràng và chấn thương cơ bắp. Cần rèn luyện tính kiên nhẫn để điều hòa huyết khí.',
  },
  '破军': {
    niHaixia: 'Thầy Nghê giảng: Phá Quân là ngôi sao tiên phong phá cũ đổi mới mạnh mẽ nhất trong Đẩu Số, cũng là sao chịu nhiều cô độc thăng trầm. Phá Quân rất mừng khi Hóa Lộc, tượng trưng cho "sau khi phá vỡ ắt tái thiết huy hoàng". Phá Quân tọa Mệnh tính tình dũng cảm, ghét sự rập khuôn lối mòn, năng lực khai sáng cực mạnh. Rất phù hợp công việc cải cách, tiên phong mở đường; Hóa Lộc thì tài vận bừng sáng, làm nên đại nghiệp.',
    classical: 'Cổ quyết: "Phá Quân vi tối năng phá cựu lập tân chi tinh... khai sáng năng lực siêu cường; hóa Lộc hậu phá nhi hậu lập, khả thành đại nghiệp."',
    bestPalace: 'Quan Lộc Cung (khi Hóa Lộc), Thiên Di Cung',
    worstPalace: 'Phu Thê Cung, Phụ Mẫu Cung',
    career: 'Khởi nghiệp đổi mới sáng tạo, nhà cách tân công nghệ, quân đội, tái cấu trúc doanh nghiệp; tiên phong trong các vùng đất mới.',
    relationship: 'Tình cảm nhiều biến động thăng trầm, không thích sự kiểm soát; cần chọn bạn đời độc lập, thấu hiểu tính cách phiêu lưu.',
    wealth: 'Tài lộc có tính chu kỳ, "tiền bạc hết rồi lại có", sau mỗi lần biến động lại tìm ra cơ hội kiếm tiền mới mẻ hơn.',
    health: 'Thuộc Thủy, chú ý thận, bài tiết và hệ thống sinh sản. Cần giữ nhịp sinh hoạt ổn định, không để lao tâm khổ tứ quá mức.',
  },
};

const levelConfig = {
  major: { label: 'Chính Tinh (14 Chủ Tinh)', color: 'text-amber-400 border-amber-500/30 bg-amber-500/10' },
  lucky: { label: 'Cát Tinh (Quý Tinh Phụ Tá)', color: 'text-sky-400 border-sky-500/30 bg-sky-500/10' },
  sha:   { label: 'Sát Tinh (Lục Sát / Hung Tinh)', color: 'text-red-400 border-red-500/30 bg-red-500/10' },
  minor: { label: 'Bàng Tinh (Tạp Diệu Thần Sát)', color: 'text-slate-400 border-slate-500/25 bg-slate-500/10' },
};

export default function StarDetailPanel({ star, palaceName, onClose }: StarDetailPanelProps) {
  const starInfoVi = star ? STAR_VI_MAP[star.name] : null;
  const starNameVi = star ? formatStarName(star.name) : '';
  const detail = star ? (STAR_DETAIL[star.name] || STAR_DETAIL[starNameVi]) : null;
  const typeConfig = star ? levelConfig[star.type] : null;
  const palaceNameVi = palaceName ? formatPalaceShort(palaceName) : '';

  return (
    <AnimatePresence>
      {star && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="card-glass rounded-xl overflow-hidden"
        >
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--t-border)' }}>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl font-bold" style={{ color: 'var(--t-gold)' }}>
                {starNameVi}
              </span>
              {typeConfig && (
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full border ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              )}
              {star.siHua && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-semibold text-emerald-400 bg-emerald-500/10 border-emerald-500/30">
                  Hóa {formatSiHua(star.siHua, true)}
                </span>
              )}
            </div>
            <button onClick={onClose} className="transition-colors text-xl leading-none px-1 hover:text-white" style={{ color: 'var(--t-faint)' }}>×</button>
          </div>

          <div className="p-4 space-y-4 overflow-y-auto max-h-[560px]">
            {/* 基本信息 */}
            {starInfoVi && (
              <div className="flex flex-wrap gap-1.5">
                {[
                  `Ngũ Hành · ${starInfoVi.element}`,
                  `Tính Chất · ${starInfoVi.nature}`,
                  ...(palaceNameVi ? [`Vị Trí · ${palaceNameVi} Cung`] : []),
                  ...(star.brightnessRaw ? [`Độ Sáng · ${formatBrightness(star.brightnessRaw)}`] : []),
                ].map(tag => (
                  <div key={tag} className="text-[10px] px-2 py-1 rounded-full font-medium"
                    style={{
                      border: '1px solid var(--t-border)',
                      color: tag.includes('Miếu') || tag.includes('Vượng') ? '#eab308' : tag.includes('Hãm') ? '#ef4444' : 'var(--t-text2)',
                    }}>
                    {tag}
                  </div>
                ))}
              </div>
            )}

            {/* Từ khóa cốt lõi */}
            {starInfoVi && (
              <div>
                <div className="text-[10px] tracking-widest mb-1.5 font-medium" style={{ color: 'var(--t-faint)' }}>ĐẶC TÍNH TINH DIỆU</div>
                <div className="flex flex-wrap gap-1.5">
                  {starInfoVi.keywords.split('·').map(k => (
                    <span key={k} className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                      style={{ color: 'var(--t-gold)', border: '1px solid rgba(212,168,67,0.25)', background: 'rgba(212,168,67,0.06)' }}>
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Trích dẫn cổ thư */}
            {detail && (
              <div className="rounded-xl p-3" style={{ background: 'rgba(212,168,67,0.04)', border: '1px solid rgba(212,168,67,0.15)' }}>
                <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1 font-semibold" style={{ color: 'var(--t-gold)', opacity: 0.9 }}>
                  CỔ THƯ KINH ĐIỂN
                </div>
                <p className="text-[11px] leading-relaxed italic" style={{ color: 'var(--t-gold)', opacity: 0.85 }}>{detail.classical}</p>
              </div>
            )}

            {/* Luận giải của Thầy Nghê Hải Hạ */}
            {detail && (
              <>
                <div>
                  <div className="text-[10px] tracking-widest mb-1.5 flex items-center gap-1.5 font-semibold" style={{ color: 'var(--t-faint)' }}>
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                    LỜI GIẢNG THẦY NGHÊ HẢI HẠ 《THIÊN KỶ》
                    <span className="w-3 h-px inline-block" style={{ background: 'var(--t-border-acc)' }} />
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>{detail.niHaixia}</p>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  {[
                    { label: 'Phương Hướng Sự Nghiệp', value: detail.career, icon: '◈' },
                    { label: 'Đặc Tính Tình Cảm', value: detail.relationship, icon: '♡' },
                    { label: 'Phân Tích Tài Vận', value: detail.wealth, icon: '◆' },
                    { label: 'Lưu Ý Sức Khỏe', value: detail.health, icon: '☯' },
                  ].map(item => (
                    <div key={item.label} className="card-inner rounded-lg p-3">
                      <div className="text-[10px] mb-1 flex items-center gap-1 font-medium" style={{ color: 'var(--t-faint)' }}>
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed" style={{ color: 'var(--t-text2)' }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(74,222,128,0.2)', background: 'rgba(74,222,128,0.05)' }}>
                    <div className="text-emerald-400 mb-0.5 font-semibold">Cung Vị Đắc Cách Nhất</div>
                    <div className="text-emerald-300/80">{detail.bestPalace}</div>
                  </div>
                  <div className="text-[10px] p-2.5 rounded-lg" style={{ border: '1px solid rgba(248,113,113,0.2)', background: 'rgba(248,113,113,0.05)' }}>
                    <div className="text-red-400 mb-0.5 font-semibold">Cung Vị Cần Lưu Ý</div>
                    <div className="text-red-300/80">{detail.worstPalace}</div>
                  </div>
                </div>
              </>
            )}

            {/* Phụ tinh / Sát tinh tóm tắt */}
            {!detail && star.type !== 'major' && starInfoVi && (
              <div className="card-inner rounded-lg p-3.5 space-y-2">
                <div className="text-[10px] font-semibold text-amber-400">Ý NGHĨA TINH DIỆU</div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--t-text2)' }}>
                  {starInfoVi.summary}
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
