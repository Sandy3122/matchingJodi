var configuration = {
  widgetId: "34616c746f61383137363438",
  tokenAuth: "381781T3dHu7YQ658dc8e8P1",
  identifier: "phone",
  exposeMethods: "<true | false> (optional)",
  success: (data) => {
      console.log('success response', data);
      document.getElementById('message').disabled = false;
      document.getElementById('verify-link').innerText = 'Verified';
      document.getElementById('verify-link').style.color = '#3dc944';
      enableFormFields();
  },
  failure: (error) => {
      console.log('failure reason', error);
      alert('Verification failed. Please try again.');
  },
  "OTP": "<OTP>"
};

function showMsg91Window() {
  validateAndDisplayStatus('phone', 'phoneError');

  var phone = document.getElementById('phone').value.trim();

  if (phone !== "") {
      // Updating the identifier in the configuration with the entered phone number
      configuration.identifier = phone;
      initSendOTP(configuration);
  }
}

function enableFormFields() {
  document.getElementById("name").disabled = false;
  document.getElementById("email").disabled = false;
  document.getElementById("message").disabled = false;

  // Disable the phone field to prevent number change
  document.getElementById('phone').disabled = true;

  // Enable the submit button
  document.getElementById("submitButton").disabled = false;
}

document.getElementById("supportForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Validate and display status for the message field
  validateAndDisplayStatus('message', 'messageError');

  // Check if all fields are filled
  if (document.getElementById("name").value.trim() !== "" &&
      document.getElementById("email").value.trim() !== "" &&
      document.getElementById("message").value.trim() !== "") {

      // Alert for demonstration purposes (you can remove this in production)
      alert("Form is now ready for submission");

      // Log form values after successful verification
      var formData = {
          name: document.getElementById("name").value.trim(),
          email: document.getElementById("email").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          message: document.getElementById("message").value.trim()
      };
      console.log('Form Data after OTP verification:', formData);
      // Clear the form fields
      document.getElementById("supportForm").reset();
  } else {
      alert("Please fill in all fields before submission.");
  }
});

// Function to validate and display the status for an input field
function validateAndDisplayStatus(field, errorId) {
  var value = document.getElementById(field).value.trim();
  var errorElement = document.getElementById(errorId);

  if (value === "") {
      displayStatus(errorElement, 'Please enter your ' + field + '.', 'red');
  } else {
      displayStatus(errorElement, 'Done', 'green');
  }
}

// Added event listeners to update error messages when the input fields lose focus
['name', 'email', 'message'].forEach(function (field) {
  document.getElementById(field).addEventListener('blur', function () {
      validateAndDisplayStatus(field, field + 'Error');
  });
});

// Function to display the status and style for an error message
function displayStatus(errorElement, message, color) {
  errorElement.innerText = message;
  errorElement.style.color = color;
}