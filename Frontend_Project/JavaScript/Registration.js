const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function (event) 
{
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phoneNumber = document.getElementById('phone').value;
  const password = document.getElementById('password').value;
  const address = document.getElementById('address').value;

  const registrationData = {
    fullName : fullName,
    email : email,
    phoneNumber : phoneNumber,
    password : password,
    address: address
  };

  console.log(registrationData);
});