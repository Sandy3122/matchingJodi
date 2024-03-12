// getAllEmployees.js

// Define updateStatus function
function updateStatus(employeeId, status) {
    fetch(`/api/employee-status/${employeeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update status");
        }
        return response.json();
    })
    .then((data) => {
        // Reload employee data after status update
        fetchEmployees();
        console.log("Status updated successfully:", data);
        // Update the status in the table cell
        const statusCell = document.querySelector(`#status-${employeeId}`);
        statusCell.textContent = status;
        statusCell.className = status === "active" ? "status-active" : "status-inactive";
    })
    .catch((error) => console.error("Error updating status:", error));
}
// Define updateRole function
function updateRole(employeeId, role) {
    fetch(`/api/updateRole/${employeeId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error("Failed to update role");
        }
        return response.json();
    })
    .then((data) => {
        // Reload employee data after role update
        fetchEmployees();
        console.log("Role updated successfully:", data);
    })
    .catch((error) => console.error("Error updating role:", error));
}
// Define fetchEmployees function
function fetchEmployees() {
    const employeeTableBody = document.getElementById("employeeTableBody");
    fetch("/api/getall-employees")
    .then((response) => response.json())
    .then((data) => {
        // Clear existing table rows
        employeeTableBody.innerHTML = "";
        // Iterate over employee data and populate table
        data.forEach((employee) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${employee.employeeId}</td>
                <td>${employee.firstName}</td>
                <td>${employee.lastName}</td>
                <td>${employee.phoneNumber}</td>
                <td id="role-${employee.employeeId}" class="role-${employee.role.toLowerCase()}">${employee.role}</td>
                <td id="status-${employee.employeeId}" class="${employee.accountStatus === "active" ? "status-active" : "status-inactive"}">${employee.accountStatus}</td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="actionsDropdown-${employee.employeeId}" data-bs-toggle="dropdown" aria-expanded="false">
                            Actions
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="actionsDropdown-${employee.employeeId}">
                            <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.employeeId}', 'active')">Active</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateStatus('${employee.employeeId}', 'inactive')">Inactive</a></li>
                        </ul>
                    </div>
                </td>
                <td>
                    <div class="dropdown">
                        <button class="btn btn-secondary dropdown-toggle" type="button" id="roleDropdown-${employee.employeeId}" data-bs-toggle="dropdown" aria-expanded="false">
                            Assign Role
                        </button>
                        <ul class="dropdown-menu" aria-labelledby="roleDropdown-${employee.employeeId}">
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'user')">User</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'employee')">Employee</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'manager')">Manager</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'admin')">Admin</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'superAdmin')">Super Admin</a></li>
                            <li><a class="dropdown-item" href="#" onclick="updateRole('${employee.employeeId}', 'thirdPartyAgent')">Third Party Agent</a></li>
                        </ul>
                    </div>
                </td>`;
            employeeTableBody.appendChild(row);
        });
    })
    .catch((error) => console.error("Error fetching employees:", error));
}
// Initial fetch of employee data
fetchEmployees();