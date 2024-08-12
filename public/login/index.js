document.getElementById('loginForm').addEventListener('submit', function(event) {

    event.preventDefault();

    const username = document.getElementById('username').value;

    fetch('/mysql/logins', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Login successful') {
            window.location.href = '/index.html';  // Redirect to home.html upon successful login
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error during login:', error);
        // Handle fetch or JSON parsing errors here

    });
});
