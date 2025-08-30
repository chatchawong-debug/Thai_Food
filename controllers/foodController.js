// controllers/foodController.js

// ฟังก์ชัน getfoodPage สำหรับแสดงหน้ารายการอาหาร (food Page)
exports.getFoodPage = (req, res) => {
  // คำสั่ง SQL ดึงข้อมูลทั้งหมดจากตาราง foodthai และเรียงลำดับตาม id จากน้อยไปมาก
  let resquery = "SELECT * FROM foodthai ORDER BY id ASC";

  // ส่ง query ไปยังฐานข้อมูล เก็บผลลัพธ์ไว้ใน result
  db.query(resquery, (err, result) => {
    if (err) {
      // ถ้ามี error จะส่งข้อความกลับไปแจ้งผู้ใช้
      // และที่สำคัญคือต้องใส่ 'return' เพื่อหยุดการทำงานของโค้ด
      console.error(err); // เพิ่มบรรทัดนี้เพื่อดูว่า error คืออะไร
      return res.status(500).send("มีข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    }

    // ถ้า query สำเร็จจะ render หน้า food.ejs โดยส่งค่าตัวแปรไปด้วย:
    // - title และ food (ผลลัพธ์ข้อมูลที่ดึงมาจากตาราง foodthai)
    res.render("foodviews/food", {
      title: "รายการอาหารไทย",
      food: result,
    });
  });
};