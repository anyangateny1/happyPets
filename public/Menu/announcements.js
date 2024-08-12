document.addEventListener('DOMContentLoaded', function() {
    fetchAnnouncements();
    checkUserRole();

    document.getElementById('createAnnouncementBtn').addEventListener('click', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const content = document.getElementById('content').value.trim();

        if (title === '' || content === '') {
            alert('Please fill out all fields.');
            return;
        }


        const announcementData = {
            title: title,
            content: content
        };


        createAnnouncement(announcementData);
    });
});

function fetchAnnouncements() {
    fetch('/mysql/announcements')
        .then(response => response.json())
        .then(data => {
            const announcementList = document.getElementById('announcementList');
            announcementList.innerHTML = '';

            data.forEach(announcement => {
                const announcementItem = document.createElement('div');
                announcementItem.classList.add('announcement');

                const title = document.createElement('h2');
                title.textContent = announcement.title;

                const content = document.createElement('p');
                content.textContent = announcement.content;

                announcementItem.appendChild(title);
                announcementItem.appendChild(content);
                announcementList.appendChild(announcementItem);
            });
        })
        .catch(error => {
            console.error('Error fetching announcements:', error);
        });
}

function checkUserRole() {
    fetch('/mysql/role', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin'
    })
    .then(response => response.json())
    .then(data => {
        const { role } = data;


        if (role === 'Admin' || role === 'Manager') {
            document.getElementById('announcementForm').style.display = 'block';
        } else {
            document.getElementById('announcementForm').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error fetching user role:', error);
    });
}

function createAnnouncement(data) {
    fetch('/mysql/postAnn', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to create announcement');
        }

        alert('Announcement created successfully');
        
        fetchAnnouncements();

    })
    .catch(error => {
        console.error('Error creating announcement:', error);
        alert('Failed to create announcement. Please try again later.');
    });
}
