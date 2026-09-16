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



  });
}