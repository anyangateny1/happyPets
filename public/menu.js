document.addEventListener('DOMContentLoaded', function() {
    const logInLink = document.getElementById('login');
    const signUpLink = document.getElementById('signUp');
    const logOutButton = document.getElementById('logout');
    const sidePopupOverlay = document.getElementById('sidePopupOverlay');
    const menuItem = document.getElementById('Menu');
    const closeBtn = document.querySelector('.close');

    // Function to check login status and update UI
    function checkLoginStatus() {
        fetch('/mysql/check')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.userId) {
                    // User is logged in
                    logInLink.style.display = 'none';
                    signUpLink.style.display = 'none';
                    logOutButton.style.display = 'block';
                } else {
                    // User is not logged in or there was an error
                    logInLink.style.display = 'block';
                    signUpLink.style.display = 'block';
                    logOutButton.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error checking login status:', error);
            });
    }

    // Function to load user details and populate popup
    function loadUserDetails(userId) {
        fetch(`/mysql/user/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('User details:', data);

                // Update user details in the popup
                document.getElementById('user-name').textContent = data.user.email;
                document.getElementById('user-position').textContent = data.user.role;

                // Update menu items in the popup
                const menuList = document.getElementById('menu-list');
                menuList.innerHTML = '';

                data.menu.forEach(item => {
                    const li = document.createElement('li');
                    const a = document.createElement('a');
                    a.href = item.link;

                    const iconSpan = document.createElement('span');
                    iconSpan.classList.add('icon');
                    const icon = document.createElement('i');
                    icon.className = item.icon;
                    iconSpan.appendChild(icon);

                    const titleSpan = document.createElement('span');
                    titleSpan.classList.add('title');
                    titleSpan.textContent = item.title;

                    a.appendChild(iconSpan);
                    a.appendChild(titleSpan);
                    li.appendChild(a);
                    menuList.appendChild(li);

                    // Add event listener for each menu item
                    a.addEventListener('click', function(event) {
                        event.preventDefault();
                        switch (item.title.toLowerCase()) {
                            case 'edit profile':
                                window.location.href = '/Menu/profile.html';
                                break;
                            case 'announcements':
                                window.location.href = '/Menu/announcements.html';
                                break;
                            case 'manage faculties':
                                window.location.href = '/Menu/managefaculties.html';
                                break;
                            case 'view members':
                                window.location.href = '/Menu/viewmembers.html';
                                break;
                            case 'manage events':
                                window.location.href = '/Menu/manageEvents.html';
                                break;
                            default:
                                console.warn('Unknown menu item:', item.title);
                                break;
                        }
                    });
                });

                // Display the popup overlay
                sidePopupOverlay.classList.add('show');
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    }

    // Check login status on page load
    checkLoginStatus();

    // Handle menu item click
    menuItem.addEventListener('click', function(event) {
        event.preventDefault();
        sidePopupOverlay.classList.add('show');

        // Fetch user details only when the menu is clicked
        fetch('/mysql/check')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.message === 'User is logged in') {
                    loadUserDetails(data.userId);
                } else {
                    document.getElementById('user-details').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error fetching user details:', error);
            });
    });

    // Close popup
    closeBtn.addEventListener('click', function() {
        sidePopupOverlay.classList.remove('show');
    });

    // Handle logout button click
    document.getElementById('logout').addEventListener('click', function(event) {
        event.preventDefault();

        fetch('/mysql/logout', {
            method: 'POST',
            credentials: 'same-origin'
        })
        .then(response => {
            if (response.ok) {
                console.log('Logout successful');

                checkLoginStatus();

                window.location.reload();

                sidePopupOverlay.classList.remove('show');
            } else {
                console.error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error logging out:', error);
        });
    });
});


