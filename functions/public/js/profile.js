// profile.js
document.addEventListener('DOMContentLoaded', async function () {
    try {
        let token, userRole; // Define userRole variable
        if (sessionStorage.getItem("adminToken")) {
            token = sessionStorage.getItem('adminToken');
            userRole = 'admin'; // Assign userRole as admin
            console.log("Admin Role: ", userRole);
            console.log("Admin Token: ", token);
        } else if (sessionStorage.getItem("employeeToken")) {
            token = sessionStorage.getItem('employeeToken');
            userRole = 'employee'; // Assign userRole as employee
            console.log("Employee Role: ", userRole);
            console.log("Employee Token: ", token);
        }

        // Check if userRole is available
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

        

// Update DOM elements with user data based on userRole
if (userRole === 'admin') {
    const data = await response.json();
    const adminData = data.adminData;
    if (!adminData) {
        throw new Error('Admin data not found in response.');
    }
    console.log(adminData.role)
    // Display admin profile details
    document.getElementById('firstName').textContent = adminData.firstName;
    document.getElementById('role').textContent = adminData.role;
    document.getElementById('birthday').textContent = formatDate(adminData.birthday);
    document.getElementById('age').textContent = calculateAge(adminData.birthday);
    document.getElementById('maritalStatus').textContent = adminData.maritalStatus;
    document.getElementById('gender').textContent = adminData.gender;
    document.getElementById('email').textContent = adminData.email;
    document.getElementById('phoneNumber').textContent = adminData.phoneNumber;
    document.getElementById('emergencyPhoneNumber').textContent = adminData.emergencyPhoneNumber;
    document.getElementById('joiningDate').textContent = formatJoiningDate(adminData.joiningDate);
    document.getElementById('profilePic').src = 'https://img.freepik.com/premium-vector/businessman-avatar-cartoon-character-profile_18591-50139.jpg';
    // Add other admin-specific fields here
} else if (userRole === 'employee') {
    const data = await response.json();
    const employeeData = data.employeeData;
    if (!employeeData) {
        throw new Error('Employee data not found in response.');
    }
    console.log(employeeData.role);
    // Display employee profile details
    document.getElementById('firstName').textContent = employeeData.firstName;
    document.getElementById('role').textContent = employeeData.role;
    document.getElementById('birthday').textContent = formatDate(employeeData.birthday);
    document.getElementById('age').textContent = calculateAge(employeeData.birthday);
    document.getElementById('maritalStatus').textContent = employeeData.maritalStatus;
    document.getElementById('gender').textContent = employeeData.gender;
    document.getElementById('email').textContent = employeeData.email;
    document.getElementById('phoneNumber').textContent = employeeData.phoneNumber;
    document.getElementById('emergencyPhoneNumber').textContent = employeeData.emergencyPhoneNumber;
    document.getElementById('joiningDate').textContent = formatJoiningDate(employeeData.joiningDate);
    document.getElementById('profilePic').src = employeeData.photoUrl;
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
