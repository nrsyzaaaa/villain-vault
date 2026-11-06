
const form = document.getElementById("recommendationForm");

// Get input elements
const nameInput = document.getElementById("customerName");
const emailInput = document.getElementById("email");
const occupantsInput = document.getElementById("occupants");

// STEP 1: Function to display error messages
function showError(input, errorId, message) {
    document.getElementById(errorId).textContent = message;
    input.classList.add("input-error");
}

// STEP 2: Function to clear error messages
function clearError(input, errorId) {
    document.getElementById(errorId).textContent = "";
    input.classList.remove("input-error");
}

// STEP 3: Clear errors when user starts correcting input
nameInput.addEventListener("input", function() {
    clearError(nameInput, "nameError");
});

emailInput.addEventListener("input", function() {
    clearError(emailInput, "emailError");
});

occupantsInput.addEventListener("input", function() {
    clearError(occupantsInput, "occupantsError");
});

document.querySelectorAll('input[name="security"]').forEach(function(input) {
    input.addEventListener("change", function() {
        document.getElementById("securityError").textContent = "";
    });
});

// STEP 4: Form submission
form.addEventListener("submit", function(event) {

    event.preventDefault();

    // Get customer information
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const occupants = Number(occupantsInput.value);

    const securityInput = document.querySelector(
        'input[name="security"]:checked'
    );

    const facilitiesInput = document.querySelectorAll(
        'input[name="facilities"]:checked'
    );

    // Clear previous errors
    clearError(nameInput, "nameError");
    clearError(emailInput, "emailError");
    clearError(occupantsInput, "occupantsError");
    document.getElementById("securityError").textContent = "";

    let isValid = true;

    // Validate customer name
    if (name === "") {
        showError(nameInput, "nameError",
            "Please enter your name.");
        isValid = false;
    }

    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        showError(emailInput, "emailError",
            "Please enter your email address.");
        isValid = false;

    } else if (!emailPattern.test(email)) {
        showError(emailInput, "emailError",
            "Please enter a valid email address.");
        isValid = false;
    }

    // Validate occupants
    if (occupantsInput.value.trim() === "") {
        showError(occupantsInput, "occupantsError",
            "Please enter the number of occupants.");
        isValid = false;

    } else if (!Number.isInteger(occupants) ||
               occupants < 1 || occupants > 15) {
        showError(occupantsInput, "occupantsError",
            "Occupants must be between 1 and 15.");
        isValid = false;
    }

    // Validate security selection
    if (!securityInput) {
        document.getElementById("securityError").textContent =
            "Please select a security level.";
        isValid = false;
    }

    // Stop if there are validation errors
    if (!isValid) {
        const firstError = document.querySelector(".input-error");

        if (firstError) {
            firstError.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
        }

        return;
    }

    // Get selected options
    const security = securityInput.value;

    const facilities = Array.from(facilitiesInput).map(
        function(item) {
            return item.value;
        }
    );

    const facilityCount = facilities.length;

    // Prepare package variables
    let packageName = "";
    let price = 0;
    let packageDescription = "";

    // Recommend a package
    if (
        occupants >= 9 ||
        security === "Maximum" ||
        facilityCount === 3
    ) {
        packageName = "Ultimate Lair";
        price = 2500;
        packageDescription =
            "Premium hideout with maximum security and facilities.";

    } else if (
        occupants >= 4 ||
        security === "High" ||
        facilityCount >= 2
    ) {
        packageName = "Elite Lair";
        price = 1200;
        packageDescription =
            "Advanced hideout with enhanced security and facilities.";

    } else {
        packageName = "Starter Lair";
        price = 500;
        packageDescription =
            "Basic hideout suitable for smaller villain teams.";
    }

    // Display recommendation
    const result = document.getElementById("result");

    result.innerHTML = `
        <h2>YOUR RECOMMENDED PACKAGE</h2>

        <h3>${packageName}</h3>

        <h2>RM${price.toFixed(2)} / month</h2>

        <p><strong>Customer:</strong> ${escapeHTML(name)}</p>
        <p><strong>Email:</strong> ${escapeHTML(email)}</p>
        <p><strong>Occupants:</strong> ${occupants}</p>
        <p><strong>Security:</strong> ${escapeHTML(security)}</p>

        <p><strong>Facilities:</strong>
        ${facilities.length > 0
            ? facilities.map(escapeHTML).join(", ")
            : "None selected"}
        </p>

        <p>${packageDescription}</p>

        <p><strong>Rental Duration:</strong> 1 month</p>

        <p>Thank you for choosing Villain Vault!</p>
    `;

    result.hidden = false;

    result.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

});

// Escape customer text before inserting into HTML
function escapeHTML(value) {
    return value.replace(/[&<>"']/g, function(character) {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}
