// Function to show details of the selected animal type
function showDetails(animalType) {
    const details = document.getElementById('animal-details');
    const animalTypes = document.querySelectorAll('.animal-type');
    animalTypes.forEach(type => type.style.display = 'none');
    document.getElementById(animalType).style.display = 'block';
    details.style.display = 'block';
    filterAnimals();
}

// Function to filter displayed animals based on search input
function filterAnimals() {
    const input = document.getElementById('search-input');
    const filter = input.value.toLowerCase();
    const visibleAnimalType = document.querySelector('.animal-type:not([style*="display: none"])');
    if (visibleAnimalType) {
        const animalItems = visibleAnimalType.querySelectorAll('.animal-item');
        animalItems.forEach(item => {
            const name = item.getAttribute('data-name').toLowerCase();
            if (name.includes(filter)) {
                item.style.display = 'inline-block';
            } else {
                item.style.display = 'none';
            }
        });
    }
}

// Function to show adoption form for a selected animal
function showAdoptionForm(animalName) {
    const popup = document.getElementById('popup-form');
    const animalInput = document.getElementById('animal-name');
    animalInput.value = animalName;
    popup.style.display = 'flex';
}

// Function to close the adoption form
function closeAdoptionForm() {
    const popup = document.getElementById('popup-form');
    popup.style.display = 'none';
}

//// Event listener for adoption form submission
document.getElementById('adoption-form').addEventListener('submit', function(event) {
    event.preventDefault();
    alert('Adoption inquiry submitted for ' + document.getElementById('animal-name').value);
    closeAdoptionForm();
});
