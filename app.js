const express = require("express");
const path = require("path");
const app = express();
const homeRoutes = require("./routes/homeRoutes");
const foodRoutes = require("./routes/foodRoutes");
const typeRoutes = require("./routes/typeRoutes");

// configure middleware
app.set("views", __dirname + "/views"); // set express to look inthis folder to render our view
app.set("view engine", "ejs"); // configure template engine
app.use(express.static(path.join(__dirname, "public")));

// routes for the app
app.use("/", homeRoutes);
app.use("/food", foodRoutes);
app.use("/type", typeRoutes);

// เปิดเซิร์ฟเวอร์ที่ port 3000
app.listen(3000, () => console.log("Server running athttp://localhost:3000"));
