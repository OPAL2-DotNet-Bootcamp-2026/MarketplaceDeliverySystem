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
  } else {
    data = await response.text();
  }

if (response.ok) {
  console.log('Login succeeded:', data);

  localStorage.setItem('authToken', data.token);
  localStorage.setItem('userRole', data.role);
  localStorage.setItem('userFullName', data.fullName);

  console.log('role value is:', JSON.stringify(data.role));

  if (data.role === 'Driver') {
    window.location.href = 'DeliveredStatus.html'; // TODO: confirm real filename with team leader
  } else {
    window.location.href = 'home.html';
  }
} else {
  console.log('Login failed:', data);
  loginError.textContent = typeof data === 'string' ? data : (data.title || 'Invalid email or password.');
  loginError.style.display = 'block';
}
});