const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function (event) 
{
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const address = document.getElementById('address').value;

  console.log(fullName, email, phoneNumber, password, address);
});