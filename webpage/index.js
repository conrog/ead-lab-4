const BASE_URL = "http://localhost:3000";
const errorToast = document.getElementById("error-toast");
const successToast = document.getElementById("success-toast");

//On page load
$(() => {
  handleCookieSettings();
  getColours();
});

//Helper Functions
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

  row.onclick = () => {
    getColour(data.colorId);
  };
  $("#colour-table-body").append(row);
}

function removeInvalidInputStyle(inputId) {
  if ($(`#${inputId}`).hasClass("is-invalid")) {
    $(`#${inputId}`).removeClass("is-invalid");
  }
}

function removeFormInputValidationStyle() {
  let elemendIds = ["id-input", "hex-input", "rgb-input", "hsl-input", "name-input"];
  for (let element of elemendIds) {
    removeInvalidInputStyle(element);
  }
}

function setFormInputs(colour) {
  const { colorId, hexString, rgb, hsl, name } = colour;
  $("#id-input").val(colorId);
  $("#hex-input").val(hexString);
  $("#rgb-input").val(rgb === "" ? "" : `rgb(${Object.values(rgb)})`);
  $("#hsl-input").val(hsl === "" ? "" : `hsl(${Object.values(hsl)})`);
  $("#name-input").val(name);
  $("#colour-display").css("background-color", hexString);
}

function isInputValid(inputId) {
  let valid = false;

  if (!document.getElementById(inputId).checkValidity()) {
    $(`#${inputId}`).addClass("is-invalid");
  } else {
    removeInvalidInputStyle(inputId);
    valid = true;
  }

  return valid;
}

function formatInput() {
  let regex = /\(([^)]+)\)/;
  let rgbString = $("#rgb-input").val();
  let hslString = $("#hsl-input").val();

  let rgbValues = rgbString.match(regex)[1].split(",");
  let hslValues = hslString.match(regex)[1].split(",");

  return {
    colorId: $("#id-input").val(),
    hexString: $("#hex-input").val(),
    rgb: { r: rgbValues[0], g: rgbValues[1], b: rgbValues[2] },
    hsl: { h: hslValues[0], s: hslValues[1], l: hslValues[2] },
    name: $("#name-input").val(),
  };
}

function handleCookieSettings() {
  let rawCookieString = document.cookie;
  let cookies = rawCookieString.split(" ");
  for (let cookie of cookies) {
    if (cookie.includes("backgroundColour")) {
      const [key, value] = cookie.split("=");

      value.includes(";")
        ? $("body").css("background-color", `#${value.substring(0, value.indexOf(";"))}`)
        : $("body").css("background-color", `#${value}`);
    }

    if (cookie.includes("colourId")) {
      const [key, value] = cookie.split("=");
      value.includes(";") ? getColour(value.substring(0, value.indexOf(";"))) : getColour(value);
    }
  }
}

//API Requests
function getColours() {
  $.ajax({
    url: `${BASE_URL}/colours`,
    type: "GET",
    success: (data) => {
      $("#colour-table-body").empty();
      data.sort((a, b) => a.colorId - b.colorId);
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
      document.cookie = `colourId=${$("#id-input").val()}`;
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

function createColour(body) {
  $.ajax({
    url: `${BASE_URL}/colours`,
    type: "POST",
    data: body,
    statusCode: {
      409: (error) => {
        $("#error-toast-body").text(error.responseText);
        var toast = new bootstrap.Toast(errorToast);
        toast.show();
      },
    },
    success: (response) => {
      $("#success-toast-body").html(response.message + "<br/> URI: " + response.uri);
      var toast = new bootstrap.Toast(successToast);
      toast.show();
      setFormInputs({ hexString: "", rgb: "", hsl: "", name: "" });
      getColours();
    },
  });
}

function updateColour(body) {
  $.ajax({
    url: `${BASE_URL}/colours/${body.colorId}`,
    type: "PUT",
    data: body,
    success: (response) => {
      $("#success-toast-body").html(response.message + "<br/> URI: " + response.uri);
      var toast = new bootstrap.Toast(successToast);
      toast.show();
      getColours();
    },
  });
}

// Button Listeners
$("#show-colour-button").on("click", () => {
  removeFormInputValidationStyle();
  let isIdValid = isInputValid("id-input");
  if (isIdValid) {
    getColour($("#id-input").val());
  }
});

$("#remove-colour-button").on("click", () => {
  removeFormInputValidationStyle();
  let isIdValid = isInputValid("id-input");
  if (isIdValid) deleteColour($("#id-input").val());
});

$("#insert-colour-button").on("click", () => {
  removeFormInputValidationStyle();

  let isIdValid = isInputValid("id-input");
  let isHexValid = isInputValid("hex-input");
  let isRgbValid = isInputValid("rgb-input");
  let isHslValid = isInputValid("hsl-input");
  let isNameValid = isInputValid("name-input");

  if (isIdValid && isHexValid && isRgbValid && isHslValid && isNameValid) {
    let body = formatInput();
    createColour(body);
  }
});

$("#modify-colour-button").on("click", () => {
  removeFormInputValidationStyle();

  let isIdValid = isInputValid("id-input");
  let isHexValid = isInputValid("hex-input");
  let isRgbValid = isInputValid("rgb-input");
  let isHslValid = isInputValid("hsl-input");
  let isNameValid = isInputValid("name-input");

  if (isIdValid && isHexValid && isRgbValid && isHslValid && isNameValid) {
    let body = formatInput();
    updateColour(body);
  }
});

$("#background-colour-button").on("click", () => {
  let isHexValid = isInputValid("hex-input");
  if (isHexValid) {
    let hexValue = $("#hex-input").val().substring(1);
    document.cookie = `backgroundColour=${hexValue}`;
    $("body").css("background-color", `#${hexValue}`);
  }
});
