const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const PORT = 3000;

//Express middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const colours = require("./routes/colors");

app.use("/colours", colours);

app.get("/index.html", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/index.html"));
});

app.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/index.js"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/styles.css"));
});

app.listen(PORT, () => {
  console.log("Server listening on port 3000...");
});
