const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async function (event) {
  event.preventDefault();

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

  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (response.ok) {
    console.log('Login succeeded:', data);
  } else {
    console.log('Login failed:', data);
  }
});