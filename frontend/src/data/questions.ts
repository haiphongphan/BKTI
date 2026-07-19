export interface Question {
  id: number;
  content: string;
  dimension_id: number;
}

export const QUESTIONS: Question[] = [
  {
    id: 1,
    content:
      'Giả sử bạn cùng những người anh em đi uống Hồng Trà Ngô Gia. Quán báo hết trân châu đen và nếu bạn muốn dùng thì phải đợi "hơi lâu" một chút. Bạn xử lý trường hợp này như thế nào?',
    dimension_id: 1,
  },
  { id: 2, content: "Bạn có bao giờ bật voice chat khi đánh LoL không?", dimension_id: 1 },
  {
    id: 3,
    content: "Mọi người thường tìm đến bạn để tâm sự những chuyện vui lẫn không vui của họ.",
    dimension_id: 1,
  },
  {
    id: 4,
    content:
      "Giả sử trong lúc xếp hàng đợi thang máy để lên lớp học, có người nào đó vô tình hoặc cố ý đứng lên trước bạn. Bạn sẽ làm gì?",
    dimension_id: 1,
  },
  { id: 5, content: 'Đã bao lâu rồi bạn chưa "chạm cỏ"?', dimension_id: 1 },
  {
    id: 6,
    content:
      "Nhóm BTL Giải tích 2 đã lập từ lâu, nhưng Zalo vẫn chưa có động tĩnh. Chỉ còn 1 tuần nữa là deadline rồi.",
    dimension_id: 1,
  },
  {
    id: 7,
    content:
      "Có nhiều người cho rằng Bách khoa đang dần mất chất vì điểm trung bình tốt nghiệp của các bạn sinh viên ngày càng cao, đi đâu cũng thấy người người nhà nhà flexing 3.6+. Bạn nghĩ sao về điều này?",
    dimension_id: 2,
  },
  {
    id: 8,
    content:
      "Bạn tin rằng với sự phát triển ngày càng mạnh mẽ của AI, chúng ta không cần học quá kỹ các môn nền tảng như DSA, chỉ cần hiểu sơ sơ để biết AI làm gì là được.",
    dimension_id: 2,
  },
  {
    id: 9,
    content:
      'Giả sử trường đang có một khoản đầu tư lớn dùng để "nâng cấp" trường. Bạn muốn khoản đầu tư đó sẽ đi vào đâu?',
    dimension_id: 2,
  },
  {
    id: 10,
    content:
      "Trên đường đi đến cơ sở 1 của trường tại quận 10, Google Map bất ngờ chỉ bạn một lộ trình khác với thời gian di chuyển ngắn hơn.",
    dimension_id: 2,
  },
  {
    id: 11,
    content: "Bạn không chỉ tham gia vào nhóm HCMUT của khóa mình, mà còn các khóa khác để hóng hớt thông tin.",
    dimension_id: 2,
  },
  {
    id: 12,
    content:
      "Trong triết lý giáo dục của Trường Đại học Bách khoa - ĐHQG-HCM (Khai phóng - Tiên phong - Sáng tạo), đâu là điều bạn theo đuổi mạnh mẽ nhất?",
    dimension_id: 2,
  },
  { id: 13, content: "Đâu là chiến lược ôn thi của bạn?", dimension_id: 3 },
  {
    id: 14,
    content:
      "Lại một học kỳ đã qua, bạn lướt Threads để giải trí và thấy người người nhà nhà flexing gpa 3.9 4.0, họ cảm ơn Bách khoa vì tiền học bổng đã ting ting vào tài khoản, trong khi bạn đã cố gắng nhưng điểm lúc nào cũng mấp mé mức đạt học bổng một chút.",
    dimension_id: 3,
  },
  {
    id: 15,
    content:
      "Trong lúc bàn bạc bài tập lớn, có 2 bạn trong nhóm xảy ra mâu thuẫn và var nhau rất căng. Với cương vị là người đứng ngoài, bạn chọn làm gì trong tình huống này?",
    dimension_id: 3,
  },
  {
    id: 16,
    content: "Bạn biết rõ mục tiêu của mình khi chọn trường này và ngành này. Bạn lựa chọn cố gắng hết sức vì nó.",
    dimension_id: 3,
  },
  {
    id: 17,
    content:
      "Chỉ còn chưa đầy một tiếng nữa là tới deadline nộp Bài tập lớn, nhưng bạn đột nhiên phát hiện một bug tương đối nghiêm trọng trong code của mình.",
    dimension_id: 3,
  },
  {
    id: 18,
    content: "Người yêu của bạn giận dỗi vì bạn suốt ngày học và cho rằng trai Bách khoa thật tồi.",
    dimension_id: 3,
  },
];
