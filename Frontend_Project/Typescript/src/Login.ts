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

