// controllers/typeController.js
exports.getTypePage = (req, res) => {
  // คำสั่ง SQL ดึงข้อมูลจากตาราง 'foodtype'
  let query = "SELECT * FROM foodtype ORDER BY type_id ASC";

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching food types: ", err);
      return res.status(500).send("ไม่สามารถดึงข้อมูลประเภทอาหารได้");
    }

    // ส่งข้อมูลที่ได้ไปยังหน้า type.ejs
    res.render("foodviews/type", {
      title: "รายการประเภทอาหาร",
      types: result, // ส่งข้อมูลในตัวแปรชื่อ 'types'
    });
  });
};