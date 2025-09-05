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

exports.addTypePage = (req, res) => {
  res.render("foodviews/addType.ejs", {
    title: "Welcome to ThaiFood | Add Type Food",
    message: "",
  });
};

/////////////add type Item//////////////
exports.addTypeItem = (req, res) => {
  // ดึงชื่อประเภทจาก body ของ request
  let typeName = req.body.name;
  let message = "";

  // ตรวจสอบว่ามีชื่อประเภทซ้ำในฐานข้อมูลหรือไม่
  let checkQuery = "SELECT * FROM foodtype WHERE name = ?";
  db.query(checkQuery, [typeName], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    if (result.length > 0) {
      // ถ้ามีชื่อประเภทซ้ำ
      message = "ชื่อประเภทนี้มีอยู่แล้ว";
      res.render("typeviews/add_type", {
        title: "เพิ่มประเภทอาหาร",
        message,
      });
    } else {
      // ถ้าชื่อไม่ซ้ำ ให้เพิ่มข้อมูลลงในฐานข้อมูล
      let insertQuery = "INSERT INTO foodtype (name) VALUES (?)";
      db.query(insertQuery, [typeName], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send(err);
        }
        // เมื่อเพิ่มสำเร็จ ให้ redirect กลับไปหน้าประเภทอาหาร
        res.redirect("/type");
      });
    }
  });
};


exports.editTypePage = (req, res) => {
  // ดึง ID ของประเภทอาหารจาก URL
  let typeId = req.params.id;
  // คำสั่ง SQL เพื่อดึงข้อมูลของประเภทอาหารนั้นๆ จากตาราง foodtype
  let query = "SELECT * FROM foodtype WHERE type_id = ?";
  // ใช้ db.query แทน db.execute เพื่อความเข้ากันได้
  db.query(query, [typeId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching type for editing");
    }
    // ถ้าไม่พบข้อมูล ให้ redirect หรือส่ง error
    if (result.length === 0) {
      return res.status(404).send("Type not found.");
    }
    // ส่งข้อมูลที่ได้ไปยังหน้า EJS สำหรับแก้ไขประเภทอาหาร
    res.render("foodviews/editType.ejs", {
      title: "Edit Type",
      type: result[0], // ส่งข้อมูลแถวแรกและแถวเดียวที่ได้
      message: "",
    });
  });
};

exports.editTypeItem = (req, res) => {
  // ดึง ID ของประเภทจาก URL และชื่อใหม่จาก body ของ request
  let typeId = req.params.id;
  let newTypeName = req.body.name;
  // สร้างคำสั่ง SQL สำหรับอัปเดตข้อมูล
  // เราใช้ WHERE เพื่อระบุว่าต้องอัปเดตข้อมูลของประเภทที่มี ID ตรงกันเท่านั้น
  let query = "UPDATE foodtype SET name = ? WHERE type_id = ?";
  // ใช้ db.query เพื่อรันคำสั่ง SQL
  db.query(query, [newTypeName, typeId], (err, result) => {
    if (err) {
      console.error("Error updating type: ", err);
      // แสดงข้อผิดพลาดให้ผู้ใช้ทราบ หรือ redirect ไปหน้า error
      return res.status(500).send("มีข้อผิดพลาดในการแก้ไขข้อมูลประเภท");
    }
    // ถ้าการอัปเดตสำเร็จ ให้ redirect กลับไปหน้ารายการประเภท
    res.redirect("/type");
  });
};