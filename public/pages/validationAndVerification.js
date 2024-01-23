// Handling all the tags and values
var phoneField = document.getElementById("phone");
var nameField = document.getElementById("name");
var emailField = document.getElementById("email");
var messageField = document.getElementById("message");
var verifyLink = document.getElementById("verify-link");
var submitButton = document.getElementById("submitButton");

// Msg91 Configuration
var configuration;

// Fetching environment variables from the server
fetch('/env')
  .then(response => response.json())
  .then(env => {
    console.log(env.WIDGET_ID)
    console.log(env.TOKEN_AUTH)
    // Update the configuration with fetched environment variables
    configuration = {
      widgetId: env.WIDGET_ID,
      tokenAuth: env.TOKEN_AUTH,
      identifier: "phone",
      exposeMethods: "<true | false> (optional)",
      success: (data) => {
        console.log("success response", data);
        messageField.disabled = false;
        verifyLink.innerText = "Verified";
        verifyLink.style.color = "#3dc944";
        enableFormFields();
      },
      failure: (error) => {
        console.log("failure reason", error);
        alert("Verification failed. Please try again.");
      },
      OTP: "<OTP>",
    };
  })
  .catch(error => console.error('Error fetching environment variables:', error));

function showMsg91Window() {
  validateAndDisplayStatus("phone", "phoneError");

  var phone = phoneField.value.trim();

  if (phone !== "") {
    // Updating the identifier in the configuration with the entered phone number
    // configuration.identifier = phone;
    initSendOTP(configuration);
  }
}

function enableFormFields() {
  // Enables all the input fields
  nameField.disabled = false;
  emailField.disabled = false;
  messageField.disabled = false;

  // Enables the cursor
  nameField.style.cursor = 'pointer';
  emailField.style.cursor = 'pointer';
  messageField.style.cursor = 'pointer';

  // Disable the phone field to prevent number change
  phoneField.disabled = true;

  // Enable the submit button
  submitButton.disabled = false;
  submitButton.style.cursor = 'pointer'; // Enables the cursor 
}


// Event listener for form submission
document.getElementById("supportForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Fetch the form data
  const formData = new FormData(this);

  // Send the form data to the server using fetch
  fetch("/sendData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the success response here, if needed
      console.log(data);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Form submitted successfully. We will get back to you as early as possible.",
        confirmButtonColor: "#3dc944",
      });
    })
    .catch((error) => {
      // Handle the error here, if needed
      console.error("Error submitting form:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        confirmButtonColor: "#d33",
      });
    });
});


// Function to validate and display the status for an input field
function validateAndDisplayStatus(field, errorId) {
  var value = document.getElementById(field).value.trim();
  var errorElement = document.getElementById(errorId);

  if (value === "") {
    displayStatus(errorElement, "Please enter your " + field + ".", "red");
  } else {
    displayStatus(errorElement, "Done", "green");
  }
}

// Added event listeners to update error messages when the input fields lose focus
["name", "email", "message"].forEach(function (field) {
  document.getElementById(field).addEventListener("blur", function () {
    validateAndDisplayStatus(field, field + "Error");
  });
});

// Function to display the status and style for an error message
function displayStatus(errorElement, message, color) {
  errorElement.innerText = message;
  errorElement.style.color = color;
}