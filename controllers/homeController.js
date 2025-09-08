exports.getHomePage = (req, res) => {
  res.render("index.ejs", {
    title: "Welcome to thaifood Information",
    homeImages: [
      "/images/1756817039328_ข้าวมันไก่.jpeg", 
      "/images/1756819888309_ไก่ย่าง.jpeg", 
      "/images/1757056224321_ข้าวหมกไก่ทอด.jpeg"
    ] // ส่ง Array ของรูปภาพ
  });
};
