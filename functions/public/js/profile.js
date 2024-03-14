// profile.js
document.addEventListener('DOMContentLoaded', async function () {
    try {
        let token, userRole;
        if (sessionStorage.getItem("adminToken")) {
            token = sessionStorage.getItem('adminToken');
            userRole = 'admin'; // Set userRole for admin
            console.log("Admin Token: ", token);
        } else if (sessionStorage.getItem("employeeToken")) {
            token = sessionStorage.getItem('employeeToken');
            userRole = 'employee'; // Set userRole for employee
            console.log("Employee Token: ", token);
        }

        // Check if token or userRole is not available
        if (!token || !userRole) {
            throw new Error('No token or role found.');
        }

        const response = await fetch('/api/profile', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch profile.');
        }

        const data = await response.json();
        const user = data.user;

        // Update DOM elements with user data based on userRole
        if (userRole === 'admin') {
            // Display admin profile details
            // Update DOM elements with user data
            document.getElementById('firstName').textContent = user.firstName;
            document.getElementById('role').textContent = user.role;
            document.getElementById('birthday').textContent = formatDate(user.birthday);
            document.getElementById('age').textContent = calculateAge(user.birthday);
            document.getElementById('maritalStatus').textContent = user.maritalStatus;
            document.getElementById('gender').textContent = user.gender;
            document.getElementById('email').textContent = user.email;
            document.getElementById('phoneNumber').textContent = user.phoneNumber;
            document.getElementById('emergencyPhoneNumber').textContent = user.emergencyPhoneNumber;
            document.getElementById('joiningDate').textContent = formatJoiningDate(user.joiningDate);
            document.getElementById('profilePic').src = "https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50139.jpg";
            // Add other admin-specific fields here
        } else if (userRole === 'employee') {
            // Display employee profile details
            // Update DOM elements with user data
            document.getElementById('firstName').textContent = user.firstName;
            document.getElementById('role').textContent = user.role;
            document.getElementById('birthday').textContent = formatDate(user.birthday);
            document.getElementById('age').textContent = calculateAge(user.birthday);
            document.getElementById('maritalStatus').textContent = user.maritalStatus;
            document.getElementById('gender').textContent = user.gender;
            document.getElementById('email').textContent = user.email;
            document.getElementById('phoneNumber').textContent = user.phoneNumber;
            document.getElementById('emergencyPhoneNumber').textContent = user.emergencyPhoneNumber;
            document.getElementById('joiningDate').textContent = formatJoiningDate(user.joiningDate);
            document.getElementById('profilePic').src = user.photoUrl;
            // Add other employee-specific fields here
        } else {
            // Handle invalid role
            console.error('Invalid user role:', userRole);
        }

    } catch (error) {
        console.error('Error fetching profile:', error);
        // Handle error, e.g., display error message to the user
    }
});



// Function to calculate age based on date of birth
function calculateAge(dateOfBirth) {
    const dob = new Date(dateOfBirth);
    const ageDiff = Date.now() - dob.getTime();
    const ageDate = new Date(ageDiff); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// Function to format date as "Month Day, Year"
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', options);
}

// Function to format joining date
function formatJoiningDate(joiningDateResponse) {
    // Check if the response is an object and contains the '_seconds' property
    if (typeof joiningDateResponse === 'object' && joiningDateResponse.hasOwnProperty('_seconds')) {
        // Extract the seconds part from the response
        const seconds = joiningDateResponse._seconds;

        // Convert seconds to milliseconds and create a Date object
        const date = new Date(seconds * 1000);

        // Format the date as "Month Day, Year" (e.g., "February 29, 2024")
        const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

        return formattedDate;
    } else {
        return 'Invalid Date';
    }
}
