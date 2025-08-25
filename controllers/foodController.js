// controllers/foodController.js
exports.getFoodPage = (req, res) => {
  res.render("foodviews/food", {
    title: "อาหารที่ชอบคือ => ส้มตำา🤤", //รายการที่ชอบ
  });
};