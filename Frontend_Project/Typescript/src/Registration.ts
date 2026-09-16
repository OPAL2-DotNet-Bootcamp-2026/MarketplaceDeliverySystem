interface RegistrationData {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  address: string;
}

const registerForm = document.querySelector<HTMLFormElement>('#registerForm');
const registerError = document.querySelector<HTMLElement>('#registerError');

if (!registerForm || !registerError) {
  console.error('Registration form or error element not found in the DOM.');
} else {
  registerForm.addEventListener('submit', async function (event) {
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

  });
}