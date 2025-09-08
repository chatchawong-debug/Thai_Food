const express = require("express");
const fileUpload = require('express-fileupload');
const path = require("path");
const app = express();
const mysql = require('mysql');
const homeRoutes = require("./routes/homeRoutes");
const foodRoutes = require("./routes/foodRoutes");
const typeRoutes = require("./routes/typeRoutes");

// configure middleware
app.set("views", __dirname + "/views"); // set express to look inthis folder to render our view
app.set("view engine", "ejs"); // configure template engine
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload({createParentPath: true }));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); // สำหรับข้อมูลจากฟอร์ม HTML
app.use(express.static(path.join(__dirname, 'public')));

// routes for the app
app.use("/", homeRoutes);
app.use("/food", foodRoutes);
app.use("/type", typeRoutes);

// สร้างการเชื่อมต่อกับฐานข้อมลู MySQL
const db = mysql.createConnection({
  host: "localhost", // ชื่อโฮสต์ของฐานข้อมูล (ปกติใช้ localhost ถ้าฐานข้อมูลอยู่ในเครื่องเดียวกัน )
  user: "root", // ชื่อผู้ใช้งานฐานข้อมูล (ค่า default ของ MySQL คือ root)
  password: "", // รหัสผ่านของผู้ใช้ฐานข้อมูล
  database: "foodthaidb", // ชื่อฐานข้อมูลที่ใช้งาน
  port: 3306
});

// เชื่อมต่อกับฐานข้อมูล
db.connect((err) => {
  if (err) {
    // ถ้าเกิดข้อผิดพลาด จะโยน error ออกมา
    throw err;
  }
  // ถ้าเชื่อมต่อสำเร็จ จะแสดงข้อความใน console
  console.log("connect db success :)");
});

// กำหนดให้ db เป็นตัวแปร global
// เพื่อให้ไฟล์อื่น ๆ สามารถเรียกใช้งาน db ได้โดยไม่ต้องสร้างการเชื่อมต่อใหม่
global.db = db;

// เปิดเซิร์ฟเวอร์ที่ port 3000
app.listen(3000, () => console.log("Server running athttp://localhost:3000"));