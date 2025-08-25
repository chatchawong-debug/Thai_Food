// controllers/typeController.js
exports.getTypePage = (req, res) => {
  res.render("foodviews/type", {
    title: "ประเภท :: ยำ", //รายการที่ชอบ
  });
};