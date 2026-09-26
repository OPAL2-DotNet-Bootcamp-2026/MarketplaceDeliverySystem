"use strict";
const registerForm = document.querySelector('#registerForm');
const registerError = document.querySelector('#registerError');
if (!registerForm || !registerError) {
    console.error('Registration form or error element not found in the DOM.');
}
else {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        registerError.style.display = 'none';
        const fullNameInput = document.querySelector('#fullName');
        const emailInput = document.querySelector('#email');
        const phoneInput = document.querySelector('#phone');
        const passwordInput = document.querySelector('#password');
        const addressInput = document.querySelector('#address');
        if (!fullNameInput || !emailInput || !phoneInput || !passwordInput || !addressInput) {
            console.error('One or more registration form fields were not found in the DOM.');
            return;
        }
        const registrationData = {
            fullName: fullNameInput.value,
            email: emailInput.value,
            phoneNumber: phoneInput.value,
            password: passwordInput.value,
            address: addressInput.value
        };
        const response = await fetch('https://localhost:7299/api/Customer/Register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(registrationData)
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
            console.log('Registration succeeded:', data);
            window.location.href = 'Login.html?registered=true';
        }
        else {
            console.log('Registration failed:', data);
            registerError.textContent = typeof data === 'string' ? data : (data.title || 'Something went wrong. Please try again.');
            registerError.style.display = 'block';
        }
    });
}
