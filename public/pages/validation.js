// Variable to store the randomly generated OTP
var generatedOTP;

// Function to simulate getting OTP (for demonstration purposes)
function getOTP() {
  // Generate a random 6-digit OTP
  generatedOTP = Math.floor(100000 + Math.random() * 900000);

  // Display the OTP
  alert("OTP sent successfully! Your OTP is: " + generatedOTP);

  // Enable the submit button
  document.getElementById("submitButton").disabled = false;

  // Assuming you have an input field for OTP, you can set its value
  document.getElementById("exampleInputOTP").value = "";
}

// Function to validate the OTP form
function validateOTPForm(event) {
  // Validation logic
  var mobileNumber = document.getElementById("exampleInputNumber").value.trim();
  var enteredOTP = document.getElementById("exampleInputOTP").value.trim();

  // Checking if the mobile number and OTP are not empty
  if (mobileNumber === "" || enteredOTP === "") {
    alert("Please enter both mobile number and OTP.");
    return false; // Returning false to prevent form submission
  }

  // Check if the entered OTP matches the generated OTP
  if (enteredOTP !== generatedOTP.toString()) {
    alert("Incorrect OTP. Please enter the correct OTP.");
    return false;
  }

  // Assume that the mobile number and OTP are valid for demonstration purposes
  document.getElementById("contactForm").style.display = "block";
  document.getElementById("validateForm").style.display = "none";

  if (event) {
    event.preventDefault(); // Prevent the default form submission behavior
  }

  return true;
}

// Function to validate the contact form
function validateContactForm() {
  // Validate email address
  var emailInput = document.getElementById("exampleFormControlInput1");
  var emailValue = emailInput.value.trim();
  var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(emailValue)) {
    alert("Please enter a valid email address.");
    return false;
  }

  // Validate message length
  var messageInput = document.getElementById("exampleFormControlTextarea1");
  var messageValue = messageInput.value.trim();

  if (messageValue.length < 10) {
    alert("Please enter a message with at least 10 characters.");
    return false;
  }

  // If all validations pass, show success message and clear the form
  alert("Form submitted successfully! Thank you.");

  // Reset the form fields
  var contactForm = document.getElementById("contactForm");
  contactForm.reset();

  return true;
}
