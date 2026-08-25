registerForm.addEventListener('submit', async function (event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const address = document.getElementById('address').value;

  const registrationData = {
    fullName: fullName,
    email: email,
    phoneNumber: phoneNumber,
    password: password,
    address: address
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

if (contentType && contentType.includes('application/json')) {
  data = await response.json();
} else {
  data = await response.text();
}

if (response.ok) {
  console.log('Registration succeeded:', data);
  window.location.href = 'Login.html';
} else {
  console.log('Registration failed:', data);
}
});