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
  try {
    const { colorId, hexString, rgb, hsl, name } = req.body;

    for (let colour of colours) {
      if (colour.colorId == colorId) {
        return res.status(409).send(`Colour with ID ${colorId} already exists.`);
      }
    }

    colours.push({ colorId, hexString, rgb, hsl, name });

    return res.status(201).send({
      message: `Colour with ID ${colorId} has been created.`,
      uri: `http://localhost:3000/colours/${colorId}`,
    });
  } catch (error) {
    console.log("[POST /colours] Error: " + error);
  }
});

router.put("/:id([0-9]+)", (req, res) => {
  try {
    const { colorId, hexString, rgb, hsl, name } = req.body;

    for (let index in colours) {
      if (colours[index].colorId == colorId) {
        colours[index].hexString = hexString;
        colours[index].rgb = rgb;
        colours[index].hsl = hsl;
        colours[index].name = name;

        return res.status(200).send({
          message: `Colour with ID ${colorId} has been updated.`,
          uri: `http://localhost:3000/colours/${colorId}`,
        });
      }
    }

    colours.push(req.body);
    return res.status(201).send({
      message: `Colour with ID ${colorId} has been created.`,
      uri: `http://localhost:3000/colours/${colorId}`,
    });
  } catch (error) {
    console.log("[PUT /colours/:id] Error: " + error);
  }
});

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
