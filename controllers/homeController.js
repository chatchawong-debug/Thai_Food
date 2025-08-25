exports.getHomePage = (req, res) => {
  res.render("index.ejs", {
    title: "Welcome to thaifood Information | View food",
  });
};