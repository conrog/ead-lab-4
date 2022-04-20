const BASE_URL = "http://localhost:3000";
const errorToast = document.getElementById("error-toast");
const successToast = document.getElementById("success-toast");

$(() => {
  getColours();
});

function createTableRow(data) {
  let row = document.createElement("tr");
  let id = document.createElement("td");
  let hex = document.createElement("td");
  let rgb = document.createElement("td");
  let hsl = document.createElement("td");
  let name = document.createElement("td");

  id.innerText = data.colorId;
  hex.innerText = data.hexString;
  rgb.innerText = `rgb(${Object.values(data.rgb)})`;
  hsl.innerText = `hsl(${Object.values(data.hsl)})`;
  name.innerText = data.name;

  row.appendChild(id);
  row.appendChild(hex);
  row.appendChild(rgb);
  row.appendChild(hsl);
  row.appendChild(name);

  $("#colour-table-body").append(row);
}

function getColours() {
  $.ajax({
    url: `${BASE_URL}/colours`,
    type: "GET",
    success: (data) => {
      $("#colour-table-body").empty();
      for (let colour of data) {
        createTableRow(colour);
      }
    },
  });
}

function getColour(colourId) {
  $.ajax({
    url: `${BASE_URL}/colours/${colourId}`,
    type: "GET",
    statusCode: {
      404: (error) => {
        $("#error-toast-body").text(error.responseText);
        var toast = new bootstrap.Toast(errorToast);
        toast.show();
      },
    },
    success: (data) => {
      setFormInputs(data);
    },
  });
}

function deleteColour(colourId) {
  $.ajax({
    url: `${BASE_URL}/colours/${colourId}`,
    type: "DELETE",
    statusCode: {
      404: (error) => {
        $("#error-toast-body").text(error.responseText);
        var toast = new bootstrap.Toast(errorToast);
        toast.show();
      },
    },
    success: (response) => {
      $("#success-toast-body").text(response);
      var toast = new bootstrap.Toast(successToast);
      toast.show();
      setFormInputs({ hexString: "", rgb: "", hsl: "", name: "" });
      getColours();
    },
  });
}

function createColour() {
  $.ajax({
    url: `${BASE_URL}/colours`,
    type: "POST",
    data: {
      colorId: 1,
      hexString: "#800000",
      rgb: { r: 128, g: 0, b: 0 },
      hsl: { h: 0, s: 100, l: 25 },
      name: "Maroon",
    },
  });
}

function setFormInputs(colour) {
  const { hexString, rgb, hsl, name } = colour;
  $("#hex-input").val(hexString);
  $("#rgb-input").val(rgb === "" ? "" : `rgb(${Object.values(rgb)})`);
  $("#hsl-input").val(hsl === "" ? "" : `hsl(${Object.values(hsl)})`);
  $("#name-input").val(name);
  $("#colour-display").css("background-color", hexString);
}

// Button Listeners
$("#show-colour-button").on("click", () => {
  getColour($("#id-input").val());
});

$("#remove-colour-button").on("click", () => {
  deleteColour($("#id-input").val());
});

$("#insert-colour-button").on("click", () => {
  createColour();
});
