const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const PORT = 3000;

//Express middleware
app.use(cors({ origin: "*" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Routes
const colours = require("./routes/colors");
app.use("/colours", colours);

//Function for creating cookies on first fetch of index.html
function myCookieFunction(req, res, next) {
  let backgroundColourCookie = req.cookies.backgroundColour;
  let colourIdCookie = req.cookies.colourId;

  if (backgroundColourCookie === undefined) {
    res.cookie("backgroundColour", "ffffff");
  }
  if (colourIdCookie === undefined) {
    res.cookie("colourId", "0");
  }

  next();
}

app.get("/index.html", myCookieFunction, (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/index.html"));
});

app.get("/index.js", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/index.js"));
});

app.get("/styles.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/styles.css"));
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/webpage/404.html"));
});

app.listen(PORT, () => {
  console.log("Server listening on port 3000...");
});
