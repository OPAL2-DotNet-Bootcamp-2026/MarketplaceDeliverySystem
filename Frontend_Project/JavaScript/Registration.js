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


  const response = await fetch('https://localhost:7299/api/Customer/Register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(registrationData)
  });

  console.log(response);

});