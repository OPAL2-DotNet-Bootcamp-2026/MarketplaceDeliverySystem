"use strict";
const loginForm = document.querySelector('#loginForm');
const loginError = document.querySelector('#loginError');
const registerSuccessMessage = document.querySelector('#registerSuccessMessage');
const params = new URLSearchParams(window.location.search);
if (params.get('registered') === 'true' && registerSuccessMessage) {
    registerSuccessMessage.style.display = 'block';
}
if (!loginForm || !loginError) {
    console.error('Login form or error element not found in the DOM.');
}
else {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        loginError.style.display = 'none';
        const emailInput = document.querySelector('#email');
        const passwordInput = document.querySelector('#password');
        if (!emailInput || !passwordInput) {
            console.error('One or more login form fields were not found in the DOM.');
            return;
        }
        const loginData = {
            email: emailInput.value,
            password: passwordInput.value
        };
        const response = await fetch('https://localhost:7299/api/User/Login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        });
        const contentType = response.headers.get('content-type');
        let data;
        if (contentType && contentType.includes('json')) {
            data = await response.json();
        }
        else {
            data = await response.text();
        }
        if (response.ok) {
            console.log('Login succeeded:', data);
            if (typeof data === 'string' || !data.token || !data.role || !data.fullName) {
                console.error('Login response did not contain the expected user data.');
                loginError.textContent = 'Something went wrong. Please try again.';
                loginError.style.display = 'block';
                return;
            }
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userFullName', data.fullName);
            if (data.role === 'Driver') {
                window.location.href = 'DeliveredStatus.html';
            }
            else {
                window.location.href = 'home.html';
            }
        }
        else {
            console.log('Login failed:', data);
            loginError.textContent = typeof data === 'string' ? data : (data.title || 'Invalid email or password.');
            loginError.style.display = 'block';
        }
    });
}
