document.addEventListener("DOMContentLoaded", function() {
    const membersTableBody = document.querySelector('#members-table tbody');
    let members = [];
    let faculties = [];

    function loadFacultiesAndRoles() {
        fetch('/mysql/faculties')
            .then(response => response.json())
            .then(data => {
                faculties = data;
                const facultyDropdown = document.getElementById('add-faculty');
                const editFacultyDropdown = document.getElementById('faculty');
                facultyDropdown.innerHTML = '<option value="">Select Faculty</option>';
                editFacultyDropdown.innerHTML = '<option value="">Select Faculty</option>';

                faculties.forEach(faculty => {
                    const option = new Option(faculty.name, faculty.name);
                    facultyDropdown.appendChild(option.cloneNode(true));
                    editFacultyDropdown.appendChild(option.cloneNode(true));
                });
            })
            .catch(error => {
                console.error('Failed to fetch faculties:', error);
            });
    }

    function loadMembers() {
        fetch('/mysql/members')
            .then(response => response.json())
            .then(data => {
                members = data;
                displayMembers(members);
            })
            .catch(error => {
                console.error('Error fetching members:', error);
            });
    }

    function displayMembers(members) {
        membersTableBody.innerHTML = '';
        members.forEach(member => {
            appendMemberRow(member);
        });
    }

    function appendMemberRow(member) {
        const row = document.createElement('tr');
        const fields = ['first_name', 'last_name', 'email', 'faculty', 'position'];
        fields.forEach(field => {
            const cell = document.createElement('td');
            cell.textContent = member[field];
            row.appendChild(cell);
        });

        const actionCell = document.createElement('td');
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
        editButton.onclick = () => editMember(member);
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => deleteMember(member.id, row);
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        membersTableBody.appendChild(row);
    }

    function deleteMember(id, row) {
        if (confirm("Are you sure you want to delete this member?")) {
            fetch(`/mysql/delete-member/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    row.remove();
                    members = members.filter(member => member.id !== id);
                } else {
                    console.error('Error deleting member:', data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting member:', error);
            });
        }
    }


    function editMember(member) {
        const form = document.querySelector('#editMemberForm');
        form.dataset.memberId = member.id;
        Object.keys(member).forEach(key => {
            if (form[key]) {
                form[key].value = member[key];
            }
        });

        // Populate position dropdown
        const positions = ['Admin', 'Manager', 'Member'];
        const positionDropdown = form.querySelector('#position');
        positionDropdown.innerHTML = '<option value="">Select Position</option>';
        positions.forEach(position => {
            const option = document.createElement('option');
            option.value = position;
            option.textContent = position;
            if (position === member.position) {
                option.selected = true;
            }
            positionDropdown.appendChild(option);
        });

        setTimeout(() => {
            form.faculty.value = member.faculty;
            form.position.value = member.position;
        }, 100);

        document.querySelector('#editModal').style.display = 'block';

        form.onsubmit = function(event) {
            event.preventDefault();
            submitEdit(member.id);
        };
    }


    function submitEdit(id) {
        const form = document.querySelector('#editMemberForm');
        const updatedMember = {
            first_name: form.first_name.value,
            last_name: form.last_name.value,
            email: form.email.value,
            faculty: form.faculty.value,
            position: form.position.value
        };

        fetch(`/mysql/update-member/${id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(updatedMember)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadMembers();
                document.querySelector('#editModal').style.display = 'none';
            } else {
                console.error('Error updating member:', data.error);
            }
        })
        .catch(error => {
            console.error('Error updating member:', error);
        });
    }

    document.getElementById('add-member-form').addEventListener('submit', function(event) {
        event.preventDefault();
        const newMember = {
            first_name: document.getElementById('add-first-name').value,
            last_name: document.getElementById('add-last-name').value,
            email: document.getElementById('add-email').value,
            faculty: document.getElementById('add-faculty').value,
            position: document.getElementById('add-position').value,
            password: document.getElementById('add-password').value
        };

        fetch('/mysql/add-member', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(newMember)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Member added successfully!');
                loadMembers();
            } else {
                console.error('Failed to add new member:', data.error);
                alert('Failed to add member: ' + data.error);
            }
        })
        .catch(error => {
            console.error('Error adding new member:', error);
            alert('Error adding member: ' + error.message);
        });
    });

    document.getElementById('search-button-member').addEventListener('click', function() {
        const searchTerm = document.getElementById('search-term-member').value.toLowerCase();
        const filteredMembers = members.filter(member => {
            return member.first_name.toLowerCase().includes(searchTerm) ||
                   member.last_name.toLowerCase().includes(searchTerm) ||
                   member.email.toLowerCase().includes(searchTerm);
        });
        displayMembers(filteredMembers);
    });


    loadFacultiesAndRoles();
    loadMembers();
});