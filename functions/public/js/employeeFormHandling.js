document.getElementById("employeeLoginForm").addEventListener("submit", async function (event) {
    event.preventDefault();

    const phoneNumber = document.getElementById("phoneNumber").value;
    const pin = document.getElementById("pin").value;

    try {
        const response = await fetch("/api/employee-login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ employeePhoneNumber: phoneNumber, pin: pin })
        });

        const data = await response.json();

        if (response.ok) {
            // Success
            Swal.fire({
                icon: 'success',
                title: 'Login Successful',
                text: data.message
            }).then(() => {
                // Redirect or perform any other action after successful login
                window.location.href = "/";
            });
        } else {
            // Error
            Swal.fire({
                icon: 'error',
                title: 'Login Failed',
                text: data.message
            });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'An error occurred while processing your request. Please try again later.'
        });
    }
});


// Handle registration form submission
document.getElementById("employeeRegistrationForm").addEventListener("submit", function (event) {
    event.preventDefault();

    Swal.fire({
        title: 'Please wait...',
        html: 'Submitting form',
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading();
        }
    });

    const formData = new FormData(this);

    fetch("/api/employee-registration", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        // Close the loading animation
        Swal.close();
        // Check if the response indicates success
        if (data.message === "Data sent successfully.") {
            // Display success message using SweetAlert
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: "Form submitted successfully.",
                confirmButtonColor: "#3dc944",
            }).then(() => {
                // Clear form fields or redirect to another page
                // document.getElementById("employeeRegistrationForm").reset();
                // Redirect or perform any other action after successful registration
                window.location.href = "/employee/employee-login";
            });
        } else {
            // Display error message using SweetAlert
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Failed to submit form. Please try again later.",
                confirmButtonColor: "#d33",
            });
        }
    })
    .catch(error => {
        // Close the loading animation
        Swal.close();
        // Display error message using SweetAlert
        console.error("Error submitting form:", error);
        Swal.fire({
            icon: "error",
            title: "Error!",
            text: "Something went wrong. Please try again later.",
            confirmButtonColor: "#d33",
        });
    });
});