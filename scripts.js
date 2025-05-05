function createErrorElement(fieldId) {
    const errorElement = document.createElement("span");
    errorElement.id = fieldId + "Error";
    errorElement.className = "error-message";
    document.getElementById(fieldId).parentNode.appendChild(errorElement);
    return errorElement;
}

function showError(field, errorElement, message) {
    errorElement.textContent = message;
    field.classList.add("error");
    return false;
}

function clearError(field, errorElement) {
    errorElement.textContent = "";
    field.classList.remove("error");
    return true;
}

function validateFirstName() {
    const field = document.getElementById("firstName");
    const error = document.getElementById("firstNameError") || createErrorElement("firstName");
    const value = field.value.trim();
    const regex = /^[A-Za-z'-]{1,30}$/;

    if (!regex.test(value)) {
        return showError(field, error, "Enter 1-30 letters, apostrophes or dashes only.");
    }
    return clearError(field, error);
}

function validateMiddleInitial() {
    const field = document.getElementById("middleInitial");
    const error = document.getElementById("middleInitialError") || createErrorElement("middleInitial");
    const value = field.value.trim();

    if (value === "") return clearError(field, error);
    if (!/^[A-Za-z]$/.test(value)) {
        return showError(field, error, "Must be just one letter.");
    }
    return clearError(field, error);
}

function validateLastName() {
    const field = document.getElementById("lastName");
    const error = document.getElementById("lastNameError") || createErrorElement("lastName");
    const value = field.value.trim();

    if (value === "") {
        return showError(field, error, "Last name is required.");
    }
    if (!/^[A-Za-z'-]+$/.test(value)) {
        return showError(field, error, "Only letters, apostrophes, or hyphens.");
    }
    return clearError(field, error);
}

function validateSSN() {
    const field = document.getElementById("ssn");
    const error = document.getElementById("ssnError") || createErrorElement("ssn");
    const value = field.value.trim();
    const regex = /^\d{3}-\d{2}-\d{4}$/;

    if (value === "") {
        return showError(field, error, "SSN is required.");
    }
    if (!regex.test(value)) {
        return showError(field, error, "Format: 123-45-6789");
    }
    return clearError(field, error);
}

function validatePhone() {
    const field = document.getElementById("Phone#");
    const error = document.getElementById("phoneError") || createErrorElement("Phone#");
    const value = field.value.trim();
    const regex = /^\d{3}-\d{3}-\d{4}$/;

    if (value === "") {
        return showError(field, error, "Phone number is required.");
    }
    if (!regex.test(value)) {
        return showError(field, error, "Format: 123-456-7890");
    }
    return clearError(field, error);
}

function validateUserID() {
    const field = document.getElementById("UserID");
    const error = document.getElementById("userIDError") || createErrorElement("UserID");
    let value = field.value.trim();
    
    value = value.replace(/[^a-zA-Z0-9_-]/g, '');
    field.value = value; 
    
    if (value.length === 0) {
        return showError(field, error, "User ID is required.");
    }
    if (!/^[a-zA-Z]/.test(value)) {
        return showError(field, error, "Must start with a letter.");
    }
    if (value.length < 4) {
        return showError(field, error, "Must be at least 4 characters.");
    }
    return clearError(field, error);
}

function validatePasswords() {
    const password = document.getElementById("password");
    const confirm = document.getElementById("confirmPassword");
    const error = document.getElementById("passwordError") || createErrorElement("password");
    const passwordValue = password.value;
    const confirmValue = confirm.value;

    password.classList.remove("error");
    confirm.classList.remove("error");
    error.textContent = "";

    if (passwordValue.length < 8) {
        return showError(password, error, "Must be at least 8 characters.");
    }
    if (!/[A-Z]/.test(passwordValue)) {
        return showError(password, error, "Needs 1 uppercase letter.");
    }
    if (!/[a-z]/.test(passwordValue)) {
        return showError(password, error, "Needs 1 lowercase letter.");
    }
    if (!/\d/.test(passwordValue)) {
        return showError(password, error, "Needs 1 number.");
    }
    if (passwordValue === document.getElementById("UserID").value) {
        return showError(password, error, "Cannot match User ID.");
    }
    if (passwordValue !== confirmValue) {
        showError(confirm, error, "Passwords don't match.");
        return showError(password, error, "Passwords don't match.");
    }
    return clearError(password, error) && clearError(confirm, error);
}

function validateAllFields() {
    const validations = [
        validateFirstName(),
        validateMiddleInitial(),
        validateLastName(),
        validateSSN(),
        validatePhone(),
        validateUserID(),
        validatePasswords()
    ];
    
    const allValid = validations.every(v => v === true);
    document.getElementById("submitButton").style.display = allValid ? "inline-block" : "none";
    return allValid;
}

function clearForm() {
    document.querySelectorAll('input:not([type="button"]), textarea, select').forEach(el => {
        el.value = '';
        el.classList.remove("error");
    });
    
    document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(el => {
        el.checked = false;
    });
    
    document.getElementById("painLevel").value = 0;
    document.getElementById("painValue").textContent = "0 (No Pain)";
    
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    document.getElementById("submitButton").style.display = "none";
}

function showDateTime() {
    document.getElementById('datetime').textContent = new Date().toLocaleString();
}

document.addEventListener("DOMContentLoaded", function() {
    showDateTime();
    setInterval(showDateTime, 1000);

    const dobField = document.getElementById('DOB');
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 120);
    dobField.setAttribute('max', yesterday.toISOString().split('T')[0]);
    dobField.setAttribute('min', minDate.toISOString().split('T')[0]);
    dobField.addEventListener('change', function() {
        const selectedDate = new Date(this.value);
        if (selectedDate > yesterday) {
            this.value = '';
            alert("Date of birth cannot be in the future.");
        }
    });
    
    document.getElementById("ssn").addEventListener("input", function() {
        const digits = this.value.replace(/\D/g, "");
        this.value = digits.replace(/(\d{3})(\d{2})(\d{4})/, "$1-$2-$3").slice(0, 11);
        validateSSN();
    });
    
    document.getElementById("Phone#").addEventListener("input", function() {
        const digits = this.value.replace(/\D/g, "");
        this.value = digits.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3").slice(0, 12);
        validatePhone();
    });
    
    document.getElementById("zip").addEventListener("input", function() {
        this.value = this.value.replace(/[^0-9-]/g, '').split('-')[0];
    });
    
    document.getElementById("painLevel").addEventListener("input", function() {
        const pain = this.value;
        let desc = "No Pain";
        if (pain >= 1 && pain <= 3) desc = "Mild Pain";
        else if (pain >= 4 && pain <= 6) desc = "Moderate Pain";
        else if (pain >= 7 && pain <= 9) desc = "Severe Pain";
        else if (pain == 10) desc = "Worst Pain";
        document.getElementById("painValue").textContent = `${pain} (${desc})`;
    });
    
    const fields = [
        "firstName", "middleInitial", "lastName", "ssn", "Phone#", 
        "UserID", "password", "confirmPassword"
    ];
    fields.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("blur", window[`validate${id.charAt(0).toUpperCase() + id.slice(1)}`]);
        }
    });
    
    document.getElementById("validateButton").addEventListener("click", function() {
        validateAllFields();
    });
    
    document.getElementById("clearButton").addEventListener("click", clearForm);
    
    document.getElementById("submitButton").addEventListener("click", function(e) {
        if (!validateAllFields()) {
            e.preventDefault();
        }
    });
    
    document.getElementById("submitButton").style.display = "none";
});
document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("header");
    const form = document.getElementById("userForm");
    const fnameInput = document.getElementById("firstName");
    const rememberMe = document.getElementById("rememberMe");
    const clearBtn = document.getElementById("clearBtn");

    const storedName = getCookie("firstName");

    if (storedName) {
        header.innerHTML = `
            <h1>Welcome back, ${storedName}!</h1>
            <label class="new-user-box">
                <input type="checkbox" id="newUserToggle"> 
                Not ${storedName}? Click HERE to start as a NEW USER
            </label>
        `;
        fnameInput.value = storedName;

        document.getElementById("newUserToggle").addEventListener("change", () => {
            deleteCookie("firstName");
            location.reload(); 
        });
    } else {
        header.innerHTML = `<h1>Welcome New User</h1>`;
    }

    form.addEventListener("submit", (e) => {
    e.preventDefault(); 

    const name = fnameInput.value.trim();

    if (rememberMe.checked && name) {
        setCookie("firstName", name, 2);
    } else {
        deleteCookie("firstName");
    }

    window.location.href = "thankyou.html";
});

    clearBtn.addEventListener("click", () => {
        deleteCookie("firstName");
        location.reload(); 
    });
});

function setCookie(name, value, days) {
    const expires = new Date(Date.now() + days * 86400000).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
}

function getCookie(name) {
    return document.cookie.split("; ").reduce((acc, cookie) => {
        const [key, val] = cookie.split("=");
        return key === name ? decodeURIComponent(val) : acc;
    }, null);
}

function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
}
document.getElementById("userForm").addEventListener("submit", function (e) {
  e.preventDefault(); 

  grecaptcha.ready(function () {
    console.log("reCAPTCHA is ready!");
    
    grecaptcha.execute("6Ld7SS4rAAAAAPHBvMV2yUz-AJVyAzMB7zZCVySq", { action: 'submit' }).then(function (token) {
      console.log("Token generated:", token);
      
      let form = document.getElementById("userForm");
      let input = document.createElement("input");
      input.setAttribute("type", "hidden");
      input.setAttribute("name", "g-recaptcha-response");
      input.setAttribute("value", token);
      form.appendChild(input);

      form.submit(); 
    }).catch(function(error) {
      console.error("Error during reCAPTCHA execution:", error);
    });
  });
});
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lon;
}

getLocation();

function changeLanguage() {
    const lang = document.getElementById("language").value;
    if (lang === "es") {
        document.getElementById("label-name").textContent = "Nombre completo:";
        document.getElementById("label-email").textContent = "Correo electrónico:";
    } else if (lang === "fr") {
        document.getElementById("label-name").textContent = "Nom complet:";
        document.getElementById("label-email").textContent = "E-mail:";
    } else {
        document.getElementById("label-name").textContent = "Full Name:";
        document.getElementById("label-email").textContent = "Email:";
    }
}

