// Custom OTP verification script

// Function to show OTP form and initialize MSG91 widget
function showOTPForm() {
    var mobileNumber = '+91' + document.getElementById("exampleInputNumber").value.trim();
  
    if (mobileNumber === "") {
      alert("Please enter your mobile number.");
      return;
    }
  
    // Show the OTP form
    document.getElementById("customOTPForm").style.display = "block";
  
    // Initialize MSG91 widget
    initSendOTP({
      widgetId: "34616c746f61383137363438",
      tokenAuth: "381781T3dHu7YQ658dc8e8P1",
      identifier: mobileNumber, // Set the identifier as the mobile number
      exposeMethods: true,
      success: (data) => {
        console.log('Success response', data);
      },
      failure: (error) => {
        console.log('Failure reason', error);
      },
      "OTP": "<OTP>"
    });
  }
  
  // Your other functions remain unchanged
  