-- Seed Dimension + Question cho bkti_db
--
-- Bảng phải đã tồn tại (chạy uvicorn 1 lần để create_all, rồi mới seed).
--
--   cd backend
--   uvicorn app.main:app   # chạy 1 lần để create_all (tạo bảng)
--   psql -d bkti_db -f data.sql
--
-- Kiểm tra:
--   psql -d bkti_db -c "SELECT q.id, q.content, d.name FROM question q JOIN dimension d ON d.id = q.dimension_id;"

BEGIN;

INSERT INTO dimension (id, name) VALUES
    (0, 'Trung lập'),
    (1, 'Giao tiếp'),
    (2, 'Chuyên môn'),
    (3, 'Thói quen');

INSERT INTO Question (id, content, dimension_id) VALUES
    ('1', 'Giả sử bạn cùng những người anh em đi uống Hồng Trà Ngô Gia. Quán báo hết trân châu đen và nếu bạn muốn dùng thì phải đợi "hơi lâu" một chút. Bạn xử lý trường hợp này như thế nào?', '1'),
    ('2', 'Bạn có bao giờ bật voice chat khi đánh LoL không?', '1'),
    ('3', 'Mọi người thường tìm đến bạn để tâm sự những chuyện vui lẫn không vui của họ', '1'),
    ('4', 'Giả sử trong lúc xếp hàng đợi thang máy để lên lớp học, có người nào đó vô tình hoặc cố ý đứng lên trước bạn. Bạn sẽ làm gì?', '1'),
    ('5', 'Đã bao lâu rồi bạn chưa "chạm cỏ"?', '1'),
    ('6', 'Nhóm BTL Giải tích 2 đã lập từ lâu, nhưng Zalo vẫn chưa có động tĩnh. Chỉ còn 1 tuần nữa là deadline rồi.', '1'),
    ('7', 'Có nhiều người cho rằng Bách khoa đang dần mất chất vì điểm trung bình tốt nghiệp của các bạn sinh viên ngày càng cao, đi đâu cũng thấy người người nhà nhà flexing 3.6+. Bạn nghĩ sao về điều này?', '2'),
    ('8', 'Bạn tin rằng với sự phát triển ngày càng mạnh mẽ của AI, chúng ta không cần học quá kỹ các môn nền tảng như DSA, chỉ cần hiểu sơ sơ để biết AI làm gì là được.', '2'),
    ('9', 'Giả sử trường đang có một khoản đầu tư lớn dùng để "nâng cấp" trường. Bạn muốn khoản đầu tư đó sẽ đi vào đâu?', '2'),
    ('10', 'Trên đường đi đến cơ sở 1 của trường tại quận 10, Google Map bất ngờ chỉ bạn một lộ trình khác với thời gian di chuyển ngắn hơn.', '2'),
    ('11', 'Bạn không chỉ tham gia vào nhóm HCMUT của khóa mình, mà còn các khóa khác để hóng hớt thông tin.', '2'),
    ('12', 'Trong triết lý giáo dục của Trường Đại học Bách khoa - ĐHQG-HCM (Khai phóng - Tiên phong - Sáng tạo), đâu là điều bạn theo đuổi mạnh mẽ nhất?', '2'),
    ('13', 'Đâu là chiến lược ôn thi của bạn?', '3'),
    ('14', 'Lại một học kỳ đã qua, bạn lướt Threads để giải trí và thấy người người nhà nhà flexing gpa 3.9 4.0, họ cảm ơn Bách khoa vì tiền học bổng đã ting ting vào tài khoản, trong khi bạn đã cố gắng nhưng điểm lúc nào cũng mấp mé mức đạt học bổng một chút.', '3'),
    ('15', 'Trong lúc bàn bạc bài tập lớn, có 2 bạn trong nhóm xảy ra mâu thuẫn và var nhau rất căng. Với cương vị là người đứng ngoài, bạn chọn làm gì trong tình huống này?', '3'),
    ('16', 'Bạn biết rõ mục tiêu của mình khi chọn trường này và ngành này. Bạn lựa chọn cố gắng hết sức vì nó.', '3'),
    ('17', 'Chỉ còn chưa đầy một tiếng nữa là tới deadline nộp Bài tập lớn, nhưng bạn đột nhiên phát hiện một bug tương đối nghiêm trọng trong code của mình.', '3'),
    ('18', 'Người yêu của bạn giận dỗi vì bạn suốt ngày học và cho rằng trai Bách khoa thật tồi.', '3');

INSERT INTO Trait (code, name, description, dimension_id) VALUES
    ('F', 'Flexer (Người hay nói)', 'Năng lực code có hạn nhưng thủ đoạn ngoại giao vô biên. Chuyên gia đi xin source code khóa trên, mail xin lùi deadline với thầy. Thích làm Leader để chia task. → extrovert', '1'),
    ('G', 'Ghoster (Người im lặng)', 'Kẻ hủy diệt tin nhắn group. "Seen" là một sự ban phước. Không ai biết mặt, chỉ hữu duyên xuất hiện đúng 1 lần lúc báo cáo hay khi tag tên rồi lại chìm vào bóng tối. Ai nói gì cũng “oke”, “tui cũng dị”. Luôn luôn lắng nghe, lâu lâu mới hiểu. → introvert', '1'),
    ('V', 'Vibecoder (Hệ vibe code đơ)', ' ChatGPT, Copilot, Claude là chân ái. Viết câu prompt tiếng Anh dài gấp 3 lần đoạn code cần viết. Quan niệm: "Đằng nào chắc AI cũng làm được cái này ròi, tui hiểu là được ". → người đi đầu xu hướng (cánh tả)', '2'),
    ('H', 'Handmade (Anh thợ đụng)', 'Cố chấp tự gõ từng dòng code, đánh giá thấp người dùng AI. Đụng đâu gõ đó, code dài như một tờ sớ nhưng rất tự hào vì đó là tư duy chất xám nguyên bản của bản thân. → người tin vào sự bền vững (cánh hữu)', '2'),
    ('C', 'Chữa lành (Healing)', 'Code 5 phút, lướt TopTop 1 tiếng. Đặt tinh thần và nhan sắc lên trên deadline. Có rớt môn cũng phải rớt trong một tâm thái đắc đạo, thơm tho và skincare đầy đủ thần sắc sáng sủa. → người sống vui vẻ, cân bằng, lên kế hoạch tốt.', '3'),
    ('M', 'Mutant (Đột biến)', 'Người đột biến tin rằng cuộc sống êm đềm là một cuộc sống thất bại. Càng sát deadline nảy số càng nhanh, cú đêm code 1 đêm bằng người ta code 1 tháng, đam mê cảm giác mạnh. → người sống YOLO, quyết tâm vì mục tiêu.', '3'),
    ('Neutral', 'Trung lập', 'Trung lập', '0');

INSERT INTO Answer (id, content, trait_code, question_id) VALUES
    -- Nhóm tính cách: G-F (Người im lặng - Người hay nói)
    (1, 'Ừ thì trận châu nào cũng là trận châu mà, chịu khó uống trân châu trắng một bữa...', 'G', 1),
    (2, 'Tổ chức vote nhanh với những người anh em, chọn ý kiến của số đông.', 'Neutral', 1),
    (3, '"Các bạn đi nấu trân châu đen ngay cho mình."', 'F', 1),

    (4, 'Ôi ngại lắm, bật làm gì, cay thì chat thôi là được rồi.', 'G', 2),
    (5, 'Khi chơi với bạn bè thì sẽ bật, với người lạ thì không.', 'Neutral', 2),
    (6, 'Biết nguyên tắc vàng làm nên chiến thắng là gì không? LÀ GIAO TIẾP, GIAO TIẾP ĐỐI KHÁNG TRỰC TIẾP!', 'F', 2),

    (7, 'Đồng ý', 'G', 3),
    (8, 'Thỉnh thoảng thôi, không có nhiều lần đâu.', 'Neutral', 3),
    (9, 'Không đồng ý.', 'F', 3),

    (10, 'Cũng không cần căng thẳng quá, lên tới lớp sau một chút cũng được.', 'G', 4),
    (11, 'Lườm nhẹ đối phương, sau đó phốt họ trên group HCMUT.', 'Neutral', 4),
    (12, 'Nhẹ nhàng vỗ vai đối phương "bạn ơi chưa tới đây đâu, mình tới trước bạn đấy nhé"', 'F', 4),

    (13, 'Larp larp larp 67 67 67 gogogoogoggg', 'G', 5),
    (14, 'Chạm cỏ là cái jz...', 'Neutral', 5),
    (15, 'Ở trong nhà cả ngày không thấy chán à?', 'F', 5),

    (16, 'Thì chắc người ta cũng áp lực, kiểu gì cũng sẽ có một người nào đó lên tiếng thôi...', 'G', 6),
    (17, '"Mọi người ơi mình có nên làm gì đó không nhỉ..."', 'Neutral', 6),
    (18, 'Phá băng, nắm quyền nhóm trưởng, đưa mọi thứ vào khuôn khổ. Tất cả cũng là vì mình thôi!', 'F', 6),

    -- Nhóm tính cách: V-H (Vibecoder - Handmade)
    (19, 'Sao không nghĩ là sinh viên ngày nay giỏi hơn trước mà cứ đổ lỗi cho hệ thống?', 'V', 7),
    (20, 'Mình không biết nữa, thấy phe nào cũng đúng.', 'Neutral', 7),
    (21, 'Đồng ý. Không thể phủ nhận là đạo nhái bằng giỏi bằng xuất sắc nhiều hơn hẳn.', 'H', 7),

    (22, 'Đồng ý, biết AI làm gì để nó không quay ngược lại điều khiển mình là ok rồi.', 'V', 8),
    (23, 'Trung lập', 'Neutral', 8),
    (24, 'Không đồng ý, dù gì nắm vững nền vẫn hơn.', 'H', 8),

    (25, 'Vào cơ sở vật chất và các hoạt động chăm sóc đời sống tinh thần cho sinh viên', 'V', 9),
    (26, 'Cái gì cũng được, cải thiện thì đều là điều tốt.', 'Neutral', 9),
    (27, 'Vào học bổng khuyến khích học tập và các phần mềm bản quyền.', 'H', 9),

    (28, 'Đi thử xem sao, có Google Map hỗ trợ mà.', 'V', 10),
    (29, 'X', 'Neutral', 10),
    (30, 'Thôi ngại lắm, đường nào chả là đường tới trường là được rồi, đi xong lạc thì lại khổ.', 'H', 10),

    (31, 'Có, chính là mình đây! 10 Group thì 9 group có mặt mình rồi', 'V', 11),
    (32, 'Mình có tham gia nhưng không nhiều và cũng không hóng mấy.', 'Neutral', 11),
    (33, 'Ý là tại sao phải làm như vậy ý?', 'H', 11),

    (34, 'Khai phóng', 'V', 12),
    (35, 'Sáng tạo', 'Neutral', 12),
    (36, 'Tiên phong', 'H', 12),

    -- Nhóm tính cách: C-M (Chữa lành - Mutant)
    (37, 'Chuẩn sách giáo khoa, xuất phát từ sớm, không vội vàng', 'C', 13),
    (38, 'Tùy, cứ học thôi, chiến lược gì giờ...', 'Neutral', 13),
    (39, '"CHI MOT DEM LA DU 🦧"', 'M', 13),

    (40, 'Không có thành công nào là dễ dàng, để được vậy chắc các bạn cũng đánh đổi thời gian và sức khỏe nhiều lắm, thôi mình cứ học tốt sống khỏe là được không cần cố quá hihi.', 'C', 14),
    (41, 'Ôi học bổng dù gì cũng là trò chơi may rủi mà, gặp giáo viên dễ thì điểm lại cao thôi chả bù cho mình nữa!', 'Neutral', 14),
    (42, 'Không có lời bào chữa nào ngoài việc mình chưa đủ cố gắng và chưa dám đánh đổi, kì sau mình sẽ cố gắng hơn nữa!', 'M', 14),

    (43, 'Hóa cô tiên thiện lành hòa giải cả 2 bên.', 'C', 15),
    (44, 'Bật chế độ ngồi xem chứ can dựa vào khói lửa chiến trường làm gì...', 'Neutral', 15),
    (45, 'Chọn về phe mà lý trí bạn thấy là đúng. Dù gì thì kết quả đầu ra vẫn là ưu tiên số 1, không nên ngại việc tranh cãi.', 'M', 15),

    (46, 'Không đồng ý lắm, mình vào vì nó hot/ được người thân khuyên/ vì điểm nó cao flex nó đã...', 'C', 16),
    (47, 'Trung lập', 'Neutral', 16),
    (48, 'Đồng ý', 'M', 16),

    (49, 'Thôi nộp đi, còn một tiếng nữa fix vội vội vàng vàng rồi lại sai thêm lại khổ.', 'C', 17),
    (50, 'X', 'Neutral', 17),
    (51, 'Không có gì là không thể. Bật chế độ Max Verstappen lên!', 'M', 17),

    (52, 'Ừ chắc là do mình tồi thật, mình nên dành thời gian cho cô ấy nhiều hơn.', 'C', 18),
    (53, 'Người đang làm bài test này là nữ bạn ơi...', 'Neutral', 18),
    (54, 'Nhưng mà tôi cũng đâu có muốn học nhiều? Sao có thể kết luận chụp mũ như thế?', 'M', 18);

SELECT setval(pg_get_serial_sequence('dimension', 'id'), (SELECT MAX(id) FROM dimension));
SELECT setval(pg_get_serial_sequence('question', 'id'), (SELECT MAX(id) FROM question));
SELECT setval(pg_get_serial_sequence('answer', 'id'), (SELECT MAX(id) FROM answer));

COMMIT;
