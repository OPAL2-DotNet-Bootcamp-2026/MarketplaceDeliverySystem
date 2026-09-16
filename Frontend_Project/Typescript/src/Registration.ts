interface RegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
}

interface ApiErrorResponse {
  title: string;
}

const registerForm = document.querySelector<HTMLFormElement>('#registerForm');
const registerError = document.querySelector<HTMLElement>('#registerError');

if (!registerForm || !registerError) {
  console.error('Registration form or error element not found in the DOM.');
} else {
  registerForm.addEventListener('submit', async function (event): Promise<void> {
    event.preventDefault();
    registerError.style.display = 'none';

    const fullNameInput = document.querySelector<HTMLInputElement>('#fullName');
    const emailInput = document.querySelector<HTMLInputElement>('#email');
    const phoneInput = document.querySelector<HTMLInputElement>('#phone');
    const passwordInput = document.querySelector<HTMLInputElement>('#password');
    const addressInput = document.querySelector<HTMLInputElement>('#address');

    if (!fullNameInput || !emailInput || !phoneInput || !passwordInput || !addressInput) {
      console.error('One or more registration form fields were not found in the DOM.');
      return;
    }

    const registrationData: RegistrationData = {
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
    let data: string | ApiErrorResponse;

    if (contentType && contentType.includes('json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    
  });
}