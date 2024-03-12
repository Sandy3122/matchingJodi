// Function to show the add role rights modal
function showAddRoleRightsModal() {
    $('#addRoleRightsModal').modal('show');
}

// Function to handle form submission for adding role rights
document.getElementById('addRoleRightsForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const role = document.getElementById('role').value;
    const status = document.getElementById('status').value;

    try {
        const response = await fetch('/api/access-rights', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role, status })
        });

        if (!response.ok) {
            throw new Error('Failed to add role rights');
        }

        $('#addRoleRightsModal').modal('hide');
        // Refresh the access rights table
        fetchAccessRights();
    } catch (error) {
        console.error('Error adding role rights:', error);
    }
});

async function updateAccessRightStatus(accessRightId, status) {
    try {
        const response = await fetch(`/api/access-rights/${accessRightId}/status`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error("Failed to update access right status");
        }

        const data = await response.json();

        // Update the status in the table cell
        const statusCell = document.querySelector(`#status-${accessRightId}`);
        statusCell.textContent = status;
        statusCell.className = status === "active" ? "status-active" : "status-inactive";
        console.log("Access right status updated successfully:", data);
    } catch (error) {
        console.error("Error updating access right status:", error);
    }
}

async function updateAccessRightRoutes(accessRightId) {
    const routeName = [];
    document.querySelectorAll(`#routeCheckbox-${accessRightId}:checked`).forEach(checkbox => {
        routeName.push(checkbox.value);
    });

    try {
        const response = await fetch(`/api/access-rights/${accessRightId}/routes`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ routeName }),
        });

        if (!response.ok) {
            throw new Error("Failed to update access right routes");
        }

        const data = await response.json();

        // Update the displayed route names without checkboxes
        const routeNamesCell = document.querySelector(`#routeNames-${accessRightId}`);
        routeNamesCell.textContent = routeName.join(", ");
        console.log("Access right routes updated successfully:", data);
    } catch (error) {
        console.error("Error updating access right routes:", error);
    }
}

// Add event listeners to checkboxes to trigger updateAccessRightRoutes function
function addCheckboxEventListeners() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('click', function() {
            const accessRightId = this.id.split('-')[1];
            updateAccessRightRoutes(accessRightId);
        });
    });
}

// Call addCheckboxEventListeners after fetching access rights to ensure checkboxes are properly initialized
async function fetchAccessRights() {
    const accessRightsTableBody = document.getElementById("accessRightsTableBody");
    try {
        const response = await fetch("/api/access-rights");
        const data = await response.json();
        accessRightsTableBody.innerHTML = "";

        data.forEach((accessRight, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${index + 1}</td>
        <td>${accessRight.role}</td>
        <td id="status-${accessRight.id}" class="${accessRight.status === "active" ? "status-active" : "status-inactive"}">${accessRight.status}</td>
        <td id="routeNames-${accessRight.id}">${generateRouteName(accessRight.routeName)}</td>
        <td style="text-align: center;">
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" id="actionsDropdown-${accessRight.id}" data-bs-toggle="dropdown" aria-expanded="false">
                    Actions
                </button>
                <ul class="dropdown-menu dropdown-menu-start position-absolute" aria-labelledby="actionsDropdown-${accessRight.id}">
                    <li><a class="dropdown-item" href="#" onclick="updateAccessRightStatus('${accessRight.id}', 'active')">Activate</a></li>
                    <li><a class="dropdown-item" href="#" onclick="updateAccessRightStatus('${accessRight.id}', 'inactive')">Inactive</a></li>
                </ul>
            </div>
        </td>
        <td>
            ${generateRouteCheckboxes(accessRight.routeName, accessRight.id)}
        </td>
        <td style="text-align: center;">
            <button class="btn btn-danger" onclick="deleteAccessRight('${accessRight.id}')">Delete</button>
        </td>

    `;
    accessRightsTableBody.appendChild(row);
});

        // Add event listeners to checkboxes
        addCheckboxEventListeners();
    } catch (error) {
        console.error("Error fetching access rights:", error);
    }
}

async function deleteAccessRight(accessRightId) {
    alert("Are you  sure? This action cannot be undone.");
    try {
        const response = await fetch(`/api/access-rights/${accessRightId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete access right');
        }

        // Refresh the access rights table after deletion
        fetchAccessRights();
    } catch (error) {
        console.error('Error deleting access right:', error);
    }
}


function generateRouteCheckboxes(routeName, accessRightId) {
    let checkboxesHTML = "";
    employeeRoutes.forEach(route => {
        checkboxesHTML += `
            <div class="checkbox-wrapper">
                <label class="checkbox-inline">
                    <input type="checkbox" id="routeCheckbox-${accessRightId}" value="${route}" ${routeName.includes(route) ? 'checked' : ''}> ${route}
                </label>
            </div>
        `;
    });
    return checkboxesHTML;
}

function generateRouteName(routeName) {
    let routeHTML = "";
    routeName.forEach(route => {
        routeHTML += `<span style="display: block;">${route}</span>`;
    });
    return routeHTML;
}

fetchAccessRights();