interface LoginData {
  email: string;
  password: string;
}

interface LoginResponse {
  token?: string;
  role?: string;
  fullName?: string;
  title?: string;
}

const loginForm = document.querySelector<HTMLFormElement>('#loginForm');
const loginError = document.querySelector<HTMLElement>('#loginError');
const registerSuccessMessage = document.querySelector<HTMLElement>('#registerSuccessMessage');

const params = new URLSearchParams(window.location.search);

if (params.get('registered') === 'true' && registerSuccessMessage) {
  registerSuccessMessage.style.display = 'block';
}

if (!loginForm || !loginError) {
  console.error('Login form or error element not found in the DOM.');
} else {
  loginForm.addEventListener('submit', async function (event): Promise<void> {
    event.preventDefault();
    loginError.style.display = 'none';

    const emailInput = document.querySelector<HTMLInputElement>('#email');
    const passwordInput = document.querySelector<HTMLInputElement>('#password');

    if (!emailInput || !passwordInput) {
      console.error('One or more login form fields were not found in the DOM.');
      return;
    }

    const loginData: LoginData = {
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
    let data: string | LoginResponse;

    if (contentType && contentType.includes('json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    
  });
}