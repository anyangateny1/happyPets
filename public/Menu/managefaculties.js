document.addEventListener("DOMContentLoaded", function() {
    const facultiesTableBody = document.querySelector('#faculties-table tbody');
    const addFacultyForm = document.getElementById('add-faculty-form');
    const searchButton = document.getElementById('search-button');
    const searchTermInput = document.getElementById('search-term');
    let faculties = [];

    function loadFaculties() {
        fetch('/mysql/faculties')
            .then(response => response.json())
            .then(data => {
                faculties = data;
                displayFaculties(faculties);
            })
            .catch(error => {
                console.error('Error fetching faculties:', error);
            });
    }

    function displayFaculties(faculties) {
        facultiesTableBody.innerHTML = '';
        faculties.forEach(faculty => {
            appendFacultyRow(faculty);
        });
    }

    function appendFacultyRow(faculty) {
        const row = document.createElement('tr');
        row.dataset.id = faculty.id;

        const facultyNameCell = document.createElement('td');
        facultyNameCell.textContent = faculty.name;

        const facultyMembersCountCell = document.createElement('td');
        facultyMembersCountCell.textContent = faculty.members_count;

        const actionCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.type = 'button';
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => editFaculty(faculty, row));
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteFaculty(faculty.id, row));
        actionCell.appendChild(deleteButton);

        row.appendChild(facultyNameCell);
        row.appendChild(facultyMembersCountCell);
        row.appendChild(actionCell);

        facultiesTableBody.appendChild(row);
    }

    addFacultyForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const facultyName = document.getElementById('faculty-name').value;

        fetch('/mysql/add-faculty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: facultyName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                appendFacultyRow({ id: data.id, name: facultyName, members_count: 0 });

                addFacultyForm.reset();
            } else {
                console.error('Error adding faculty:', data.error);
            }
        })
        .catch(error => {
            console.error('Error adding faculty:', error);
        });
    });

    searchButton.addEventListener('click', function() {
        const searchTerm = searchTermInput.value.toLowerCase();
        const filteredFaculties = faculties.filter(faculty => faculty.name.toLowerCase().includes(searchTerm));
        displayFaculties(filteredFaculties);
    });

    function editFaculty(faculty, row) {
        const facultyName = prompt("Enter new faculty name:", faculty.name);

        if (facultyName !== null) {
            fetch(`/mysql/update-faculty/${faculty.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name: facultyName })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    row.children[0].textContent = facultyName;
                    faculty.name = facultyName;
                } else {
                    console.error('Error updating faculty:', data.error);
                }
            })
            .catch(error => {
                console.error('Error updating faculty:', error);
            });
        }
    }

    function deleteFaculty(id, row) {
        if (confirm("Are you sure you want to delete this faculty?")) {
            fetch(`/mysql/delete-faculty/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    row.remove();
                    faculties = faculties.filter(faculty => faculty.id !== id);
                } else {
                    console.error('Error deleting faculty:', data.error);
                }
            })
            .catch(error => {
                console.error('Error deleting faculty:', error);
            });
        }
    }

    loadFaculties();
});
