document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.volunteer-form');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const role = document.getElementById('role').value;


        let facultyId;
        switch (role) {
            case 'Animal-Care':
                facultyId = 1;
                break;
            case 'Dog-Training':
                facultyId = 2;
                break;
            case 'Foster-Care':
                facultyId = 3;
                break;
            case 'Animal-Rescue':
                facultyId = 4;
                break;
            case 'Gardening-Maintenance':
                facultyId = 5;
                break;
            default:
                facultyId = null;
        }

        // Prepare data to send to server
        const data = {
            facultyId: facultyId
        };

        // Make an AJAX request
        fetch('/mysql/volunteer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Application submitted successfully:', data);
            alert('Application submitted successfully!');
            form.reset();
        })
        .catch(error => {
            console.error('Error submitting application:', error);
            alert('Failed to submit application. Please try again later.');
        });
    });
});
