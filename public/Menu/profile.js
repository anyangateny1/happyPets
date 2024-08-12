document.addEventListener('DOMContentLoaded', function() {
    fetch('/mysql/profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'User not logged in') {
            window.location.href = '/login/login.html';  // Redirect to login if not logged in
        } else {
            document.getElementById('firstName').value = data.first_name;
            document.getElementById('lastName').value = data.last_name;
            document.getElementById('email').value = data.email;
        }
    })
    .catch(error => {
        console.error('Error fetching profile:', error);
    });

    document.getElementById('profileForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;

        fetch('/mysql/profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ firstName, lastName, email })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.message);
        })
        .catch(error => {
            console.error('Error updating profile:', error);
            alert('An error occurred. Please try again later.');
        });
    });
});

