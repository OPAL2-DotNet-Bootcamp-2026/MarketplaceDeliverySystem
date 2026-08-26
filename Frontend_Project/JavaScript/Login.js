const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');

loginForm.addEventListener('submit', async function (event) {

    event.preventDefault();

    loginError.style.display = 'none';

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const loginData = {
        email: email,
        password: password
    };

    try {

        const response = await fetch(
            'https://localhost:7299/api/User/Login',
            {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify(loginData)
            }
        );

        const data = await response.json();

        if (response.ok) {

            console.log("Login succeeded:", data);

            // Save JWT token
            localStorage.setItem(
                "authToken",
                data.token
            );

            // Save user information
            localStorage.setItem(
                "userRole",
                data.role
            );

            localStorage.setItem(
                "userFullName",
                data.fullName
            );

            console.log("Token saved.");

            // Go to home
            if (data.role === "Driver") {

                window.location.href =
                    "DeliveredStatus.html";

            } else {

                window.location.href =
                    "home.html";
            }

        } else {

            console.log("Login failed:", data);

            loginError.textContent =
                data.title ||
                "Invalid email or password.";

            loginError.style.display =
                "block";
        }

    } catch (error) {

        console.error("Login error:", error);

        loginError.textContent =
            "Cannot connect to the server.";

        loginError.style.display =
            "block";
    }

});