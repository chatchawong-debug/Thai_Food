// controllers/foodController.js

////// get food Page //////
exports.getFoodPage = (req, res) => {
  // ดึงข้อมูลทั้งหมดจากตาราง foodthai และเรียงลำดับตาม id จากน้อยไปมาก
  let resquery = `SELECT f.id, f.name, f.des,f.image,f.type_id, t.name AS type_id
  FROM foodthai f JOIN foodtype t ON f.type_id = t.type_id ORDER BY f.id ASC`;

  // ส่ง query ไปยังฐานข้อมูล เก็บผลลัพธ์ไว้ใน result
  db.query(resquery, (err, result) => {
    if (err) {
      // ถ้ามี error จะส่งข้อความกลับไปแจ้งผู้ใช้
      // และที่สำคัญคือต้องใส่ 'return' เพื่อหยุดการทำงานของโค้ด
      console.error(err);
      return res.status(500).send("มีข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล");
    }

    // ถ้า query สำเร็จจะ render หน้า food.ejs โดยส่งค่าตัวแปรไปด้วย:
    res.render("foodviews/food", {
      title: "รายการอาหาร",
      food: result,
    });
  });
};

////// add food Page //////
exports.addFoodPage = (req, res) => {
  // query รายการ type ทั้งหมดเพื่อเอาไปทํา dropdown
  let typeQuery = "SELECT * FROM foodtype ORDER BY type_id ASC";
  db.query(typeQuery, (err, typeResult) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.render("foodviews/addfood.ejs", {
      title: "Add New Food",
      message: "",
      foodtype: typeResult,
    });
  });
};

/////////////add food Item//////////////
exports.addFoodItem = (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }
  // สร้ํางรหัส เช่น ใช้เวลํา timestamp
  let code = Date.now(); // เช่น 1693401234567
  let message = "";
  let foodname = req.body.name;
  let dres = req.body.dres;
  let type = req.body.type;
  let uploadedFile = req.files.image;
  let imageName = uploadedFile.name;
  let fileExtension = uploadedFile.mimetype.split("/")[1];
  // สร้ํางชื่อไฟล์ = รหัส + _ + ชื่ออําหําร + .นํามสกุล เช่น 1693401234567ส้มต ํา.jpg
  imageName = `${code}_${foodname}.${fileExtension}`;

  let usernameQuery = "SELECT * FROM foodthai WHERE name = ?";
  db.query(usernameQuery, [foodname], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send(err);
    }
    if (result.length > 0) {
      // มีข้อมูลซ้ํา
      message = "|Username already exists";
      res.render("foodviews/addFood.ejs", {
        title: "Welcome to ThaiFood | Add a new ThaiFood",
        message,
      });
    } else {
      // Check the filetype before uploading it
      if (
        uploadedFile.mimetype === "image/png" ||
        uploadedFile.mimetype === "image/jpeg" ||
        uploadedFile.mimetype == "image/gif"
      ) {
        // upload the file to the /public/assets/img directory
        uploadedFile.mv(`public/images/${imageName}`, (err) => {
          if (err) {
            return res.status(500).send(err);
          }

          // send the food's details to the database

          let query = "INSERT INTO foodthai(name, des, type_id,image) VALUES(?, ?, ?, ?)";
          db.query(query,[foodname, dres, type, imageName],
            (err, result) => {
              if (err) {
                res.status(500).send(err);
              }
              res.redirect("/food");
            }
          );
        });
      } else {
        message ="Invalid file format. Only 'gif', 'jpeg' and 'png' images are allowed.";
        res.render("foodviews/addFood.ejs", {
          message,
          title: "Add New Food",
        });
      }
    }
  });
};

////// edit food page
exports.editFoodPage = (req, res) => {
  let foodId = req.params.id;
  // let query = "SELECT * FROM foodthai WHERE id = ?";
  let query = `SELECT f.id, f.name, f.des,f.image,f.type_id, t.name AS type_name
  FROM foodthai f JOIN foodtype t ON f.type_id = t.type_id WHERE f.id = ?`;
  // query รํายกําร type ท้งัหมด เพอื่ เอําไปทํา dropdown
  let typeQuery = "SELECT * FROM foodtype ORDER BY type_id ASC";
  db.query(query, [foodId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    db.query(typeQuery, (err, typeResult) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.render("foodviews/editFood.ejs", {
        title: "Edit Food",
        food: result[0],
        foodtype: typeResult,
        message: "",
      });
    });
  });
};

////// edit food item //////
exports.editFoodItem = (req, res) => {
  let code = Date.now();
  let foodId = req.params.id;
  let foodname = req.body.name;
  let des = req.body.des;
  let type = req.body.type;
  let oldImage = req.body.old_image; // Hidden input ในฟอร์ม
  let uploadedFile = req.files ? req.files.image : null;
  // ใช้รูปเก่าเป็นค่าเริ่มต้น
  let imageName = oldImage;
  if (uploadedFile) {
    // ตรวจสอบนามสกุลไฟล์
    if (
      uploadedFile.mimetype !== "image/png" &&
      uploadedFile.mimetype !== "image/jpeg" &&
      uploadedFile.mimetype !== "image/gif"
    ) {
      return res.render("foodviews/editFood.ejs", {
        message:
          "Invalid file format. Only 'gif', 'jpeg', and 'png' images are allowed.",
        title: "Edit Food",
      });
    }
    // สร้างชื่อไฟล์ใหม่
    let fileExtension = uploadedFile.mimetype.split("/")[1];
    imageName = `${code}_${foodname}.${fileExtension}`;

    // ย้ายไฟล์ใหม่เข้าโฟลเดอร์
    uploadedFile.mv(`public/images/${imageName}`, (err) => {
      if (err) return res.status(500).send(err);
      // ลบไฟล์เก่า (หลังจากอัปโหลดใหม่สำเร็จ)
      const fs = require("fs");
      const path = require("path");
      let oldPath = path.join(__dirname, "..", "public", "images", oldImage);

      if (oldImage && fs.existsSync(oldPath)) {
        fs.unlink(oldPath, (err) => {
          if (err) console.error("Error deleting old image:", err);
        });
      }
      // update DB หลังจากย้ายไฟล์สำเร็จ
      updateFood();
    });
  } else {
    // ถ้าไม่มีไฟล์ใหม่
    updateFood();
  }
  function updateFood() {
    let query =
      "UPDATE foodthai SET name=?, des=?, type_id=?, image=? WHERE id=?";
    db.query(query, [foodname, des, type, imageName, foodId], (err, result) => {
      if (err) return res.status(500).send(err);
      res.redirect("/food");
    });
  }
};

exports.deleteFoodItem = (req, res) => {
  let foodId = req.params.id;
  let getImageQuery = "SELECT image from foodthai WHERE id = ?";
  let deleteFoodQuery = "DELETE FROM foodthai WHERE id = ?";
  db.query(getImageQuery, [foodId], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }
    let image = result[0].image;
    fs.unlink(`public/images/${image}`, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      db.query(deleteFoodQuery, [foodId], (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.redirect("/food");
      });
    });
  });
};
