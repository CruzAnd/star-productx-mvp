// Base URL Backend in FastAPI
const API_URL = "http://127.0.0.1:8000";

// Main wrapping function, waitin DOM to be loaded
document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("login-form");
    const passwordInput = document.getElementById("password");
    const btnTogglePassword = document.getElementById("btn-toggle-password");
    const iconTogglePassword = document.getElementById("icon-toggle-password");
    const alertContainer = document.getElementById("alert-container");
    const btnSubmit = document.getElementById("btn-submit");

    // Hide password login form
    if (btnTogglePassword && passwordInput) {
        btnTogglePassword.addEventListener("click", (e) => {
            e.preventDefault(); // Avoid any extra behavior of the button

            //
            if (passwordInput.type === "password") {
                passwordInput.type = "text";
                iconTogglePassword.className = "bi bi-eye"; // Open eye
            } else {
                passwordInput.type = "password";
                iconTogglePassword.className = "bi bi-eye-slash"; // eye slash
            }
        });
    }

    // Login process and form submission

    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault(); // Avoid page reload

            const email = document.getElementById("email").value.trim();
            const password = passwordInput.value;

            // Aditional validations of password length
            if (password.length < 6) {
                alertContainer.innerHTML = `
                    <div class="alert alert-warning alert-dismissible fade show small" role="alert">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i><strong>Seguridad:</strong> La contraseña debe tener al menos 6 caracteres.
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
                return; // Stops the flux inmediately
            }

            // Clean previous alerts and put the button in loading state
            alertContainer.innerHTML = "";
            btnSubmit.disabled = true;
            btnSubmit.innerText = "Verificando credenciales...";

            try {
                // Build the body
                const formData = new URLSearchParams();
                formData.append("username", email);
                formData.append("password", password);

                // Do the request HTTP POST to API ( root path /login no prefix )
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: formData
                });

                const data = await response.json();

                // Manage response if it's not successful
                if (!response.ok) {
                    throw new Error(data.detail || "Correo o contraseña incorrectos.");
                }

                const token = data.access_token;

                // Split the token in three parts: header, payload, and signature using dot (.) as separator
                const base64Url = token.split('.')[1];

                // Replacing special characters of JWT format to Base64 URL standard
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

                // Decode the binary text to a legible String
                const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));

                // Convert the string to JavaScript real object
                const tokenData = JSON.parse(jsonPayload);

                const userRole = tokenData.role ? tokenData.role.toLowerCase() : "cliente";
                const userId = tokenData.user_id || "unknown";

                // Store data section into browser's local storage
                localStorage.setItem("token", token);
                localStorage.setItem("user_id", userId);
                localStorage.setItem("user_role", userRole);

                // redirection base on real role extracted from JWT
                if (userRole === "admin") {
                    window.location.href = "admin_dashboard.html";
                } else {
                    window.location.href = "client_dashboard.html";
                }

            } catch (error) {
                // In case of error, inject the error message into the alert container
                alertContainer.innerHTML = `
                    <div class="alert alert-danger alert-dismissible fade show small" role="alert">
                        <strong>Error:</strong> ${error.message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;

                // Restored the button to its original state
                btnSubmit.disabled = false;
                btnSubmit.innerText = "Ingresar al Sistema";
            }
        });
    }
});