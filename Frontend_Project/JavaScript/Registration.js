const registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', function (event) {
  event.preventDefault();
  console.log('Registration form intercepted!');
});