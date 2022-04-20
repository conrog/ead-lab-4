const express = require("express");
const router = express.Router();

// Load colours array from JSON file
const colours = require("../data/data.json");

router.get("/", (req, res) => {
  try {
    return res.json(colours);
  } catch (error) {
    console.log("[GET /colours] Error: " + error);
  }
});

router.get("/:id([0-9]+)", (req, res) => {
  try {
    const { id } = req.params;

    for (let colour of colours) {
      if (colour.colorId == id) {
        return res.json(colour);
      }
    }

    return res.status(404).send(`Colour with ID of ${id} does not exist!`);
  } catch (error) {
    console.log("[GET /colours/:id] Error: " + error);
  }
});

router.post("/", (req, res) => {
  const { colorId, hexString, rgb, hsl, name } = req.body;
  console.log(colorId);
  console.log(hexString);
  console.log(rgb);
  console.log(hsl);
  console.log(name);

  res.send("ok");
  //check if id is not used
  //insert colour with id
});

// {
//   "colorId": 1,
//   "hexString": "#800000",
//   "rgb": { "r": 128, "g": 0, "b": 0 },
//   "hsl": { "h": 0, "s": 100, "l": 25 },
//   "name": "Maroon"
// }

router.delete("/:id([0-9]+)", (req, res) => {
  try {
    const { id } = req.params;
    let index = -1;

    for (let i in colours) {
      if (colours[i].colorId == id) {
        index = i;
        break;
      }
    }

    if (index === -1) return res.status(404).send(`Colour with ID of ${id} does not exist!`);

    colours.splice(index, 1);

    return res.status(200).send(`Successfully Deleted Colour ${id}!`);
  } catch (error) {
    console.log("[DELETE /colours/:id] Error: " + error);
  }
});

module.exports = router;
