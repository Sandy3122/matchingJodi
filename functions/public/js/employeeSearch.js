$(document).ready(function () {
    // Function to handle employee search
    $("#searchBtn").click(function () {
      var query = $("#searchInput").val();
      console.log("Query:", query); // Check the value of query

      // Show loading animation
      Swal.fire({
        title: "Loading",
        html: "Searching for employees...",
        allowOutsideClick: false,
        showConfirmButton: false,
        onBeforeOpen: () => {
          Swal.showLoading();
        },
      });

      // Clear previous search results
      $("#userDataContainer").empty();

      // Get token from cookie
      var token = getCookie("token");

      // AJAX request to search for employees
      $.ajax({
        url: "/api/employee-search",
        type: "GET",
        data: { query: query },
        beforeSend: function (xhr) {
          xhr.setRequestHeader("Authorization", "Bearer " + token); // Pass the token in the Authorization header
        },
        success: function (data) {
          // Close loading animation
          Swal.close();
          console.log(data); // Check the response data
        },
        error: function (xhr, status, error) {
          // Close loading animation
          Swal.close();
          // Display error message with SweetAlert
          Swal.fire({
            icon: "error",
            title: "Error",
            text:
              "An error occurred while searching for employees: " + error,
          });
        },
      });
    });

    // Function to format date and time
    function formatDateTime(dateTime) {
      const date = new Date(dateTime._seconds * 1000);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();
      return formattedDate + " " + formattedTime;
    }

    // Function to display employee data and documents
    function displayEmployeeData(employees) {
      $("#userDataContainer").empty();

      employees.forEach(function (employee, index) {
        // Create a new container for each employee
        var userContainer = $("<div class='container mt-3'></div>");

        // Append employee details to the container
        var userDetailsTable = $(
          "<table class='table table-striped'></table>"
        );
        var userDetailsHtml =
          "<thead><tr><th>Field</th><th>Value</th></tr></thead><tbody>";
        for (const [key, value] of Object.entries(employee)) {
          if (
            key !== "kycDocumentUrl" &&
            key !== "resumeUrl" &&
            key !== "photoUrl" &&
            key !== "pin"
          ) {
            if (key === "joiningDate" || key === "timestamp") {
              userDetailsHtml +=
                "<tr><td>" +
                key +
                "</td><td>" +
                formatDateTime(value) +
                "</td></tr>";
            } else {
              userDetailsHtml +=
                "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
            }
          }
        }
        userDetailsHtml += "</tbody>";
        userDetailsTable.append(userDetailsHtml);

        // Append file boxes with previews
        var fileBoxes = $("<div class='row'></div>");
        var fileBoxHtml =
          "<div class='col-4'><div class='file-box'><h5>KYC Document</h5><a href='" +
          employee.kycDocumentUrl +
          "' target='_blank'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png' class='file-preview' alt='KYC Document'></a></div></div>";
        fileBoxHtml +=
          "<div class='col-4'><div class='file-box'><h5>Profile Photo</h5><a href='" +
          employee.photoUrl +
          "' target='_blank'><img src='" +
          employee.photoUrl +
          "' class='file-preview' alt='Profile Photo'></a></div></div>";
        fileBoxHtml +=
          "<div class='col-4'><div class='file-box'><h5>Resume</h5><a href='" +
          employee.resumeUrl +
          "' target='_blank'><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/PDF_file_icon.svg/1200px-PDF_file_icon.svg.png' class='file-preview' alt='Resume'></a></div></div>";
        fileBoxes.append(fileBoxHtml);

        // Append details and files to the user container
        userContainer.append(
          "<h2 class='text-center'>Employee " + (index + 1) + "</h2>"
        );
        userContainer.append(userDetailsTable);
        userContainer.append(fileBoxes);

        // Append the user container to the main container
        $("#userDataContainer").append(userContainer);
      });
    }

    // Function to get cookie value by name
    function getCookie(name) {
      var value = "; " + document.cookie;
      var parts = value.split("; " + name + "=");
      if (parts.length == 2) return parts.pop().split(";").shift();
    }
  });

