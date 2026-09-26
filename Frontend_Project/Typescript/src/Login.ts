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

