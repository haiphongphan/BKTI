import "./FAQstyle.css";

function Faq({onClose} : any) {
  return (
    <div className="FAQ">
      <h2 className="faq-title">Giải đáp thắc mắc (FAQ)</h2>
      {onClose && (
        <button className="FAQ-close-btn-absolute" onClick={onClose} aria-label="Close">
          &times;
        </button>
      )}
      <div className="faq-item">
        <p className="text-wrapper">BKTI là gì vậy nhỉ?</p>
        <p className="vi-t-t-t-c-a-bach">
            Viết tắt của Bach Khoa Type Indicator, BKTI là bài khảo sát tâm lý châm
            biếm, mô phỏng bài khảo sát nổi tiếng MBTI. Với 21 câu hỏi, 3 trục tâm
            lý, BKTI ghép mỗi người khảo sát vào 1 trong 10 hình mẫu sinh viên Bách
            khoa hài hước.
        </p>
      </div>
      <div className="faq-item">
        <p className="div">Tôi có thể tin BKTI không?</p>
        <p className="p">
            Tin hay không là phụ thuộc vào bạn. Nếu bạn muốn tin, thì chúng tôi đã ở
            Bách khoa hơn 2 năm rồi. Tin xấu là chúng tôi không biết gì về Tâm lý
            học cả.
        </p>
      </div>
      <div className="faq-item">
        <p className="div">Mất bao lâu để hoàn thành bài khảo sát?</p>
        <p className="text-wrapper-2">
            21 câu, chỉ mất khoảng 3 - 5 phút để hoàn thành.
        </p>
      </div>
      <div className="faq-item">
        <p className="text-wrapper-3">
            Tôi có cần cung cấp thông tin hay chi phí gì để làm khảo sát không?
        </p>
        <p className="text-wrapper-4">
            Không, khảo sát là hoàn toàn miễn phí và ẩn danh. Vì là sản phẩm phục vụ
            mục đích truyền thông, trước khi vào khảo sát, chúng tôi sẽ đề xuất bạn
            ghé thăm trang fanpage của Ban Truyền thông khoa Khoa học và Kỹ thuật
            Máy tính để xem một số sản phẩm tuyệt vời khác mà chúng tôi đã làm,
            nhưng nếu bạn chọn không xem và không follow thì cũng không sao cả
            (chúng tôi sẽ buồn lắm nếu bạn làm vậy đó huhu follow us pls).
        </p>
      </div>
      <div className="faq-item">
        <p className="text-wrapper-5">
            Tôi có thể chia sẻ kết quả của bài test đến bạn bè không?
        </p>
        <p className="text-wrapper-6">
            Hoàn toàn có thể. Chúng tôi có lựa chọn lưu hình ảnh minh họa cho tính
            cách của bạn dưới dạng PDF.
        </p>
      </div>
      <div className="faq-item">
        <p className="text-wrapper-5">
            Cái cục bột có mắt mũi kia dùng để minh họa là gì đấy?
        </p>
        <p className="text-wrapper-7">
            Đó là Mochi - linh vật của Ban Truyền thông chúng tôi. Mochi có thể là
            một cục bột đáng yêu nếu bạn cưng chiều nó.
        </p>
      </div>
      <div className="faq-item">
        <p className="text-wrapper-5">Cách chấm điểm như thế nào?</p>
        <p className="text-wrapper-8">
            Mỗi trục có 2 chiều hướng, 7 câu hỏi, mỗi câu hỏi có 2 đáp án, đánh dấu
            bằng lệch trái - lệch phải, kèm cơ chế tính điểm riêng biệt.
            Chúng tôi cộng điểm của tất cả các câu của mỗi trục, ghép 3 trục lại với
            nhau cho ra tổng cộng 8 kiểu tính cách, kèm thêm 2 kiểu tính cách ẩn.
        </p>
      </div>
      <div className="faq-item">
        <p className="text-wrapper-9">
            Vì sao tôi làm 2 lần lại cho ra 2 kết quả khác nhau? Bài test không
            chuẩn à?
        </p>
        <div className="text-wrapper-10">hehe</div>
        </div>
      </div>
  );
};
export default Faq;