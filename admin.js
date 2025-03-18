function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      document.getElementById('loginMessage').textContent = 'Login successful!';
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      document.getElementById('loginMessage').textContent = "Invalid credentials!";
    });
}
