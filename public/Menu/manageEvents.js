document.addEventListener("DOMContentLoaded", function() {
    // Handle create event form submission
    document.getElementById("create-event-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const eventData = {
            image_url: formData.get("image_url"),
            title: formData.get("title"),
            details: formData.get("details")
        };

        fetch('/mysql/events', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Event created successfully!");
            location.reload(); // Reload the page to show the new event
        })
        .catch(error => {
            console.error('Error creating event:', error);
            alert("Failed to create event.");
        });
    });

    // Handle update event form submission
    document.getElementById("update-event-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const eventId = formData.get("event_id");
        const eventData = {
            image_url: formData.get("image_url"),
            title: formData.get("title"),
            details: formData.get("details")
        };

        fetch(`/mysql/events/${eventId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(eventData)
        })
        .then(response => response.json())
        .then(data => {
            alert("Event updated successfully!");
            location.reload(); // Reload the page to show the updated event
        })
        .catch(error => {
            console.error('Error updating event:', error);
            alert("Failed to update event.");
        });
    });

    // Handle delete event form submission
    document.getElementById("delete-event-form").addEventListener("submit", function(event) {
        event.preventDefault();
        const formData = new FormData(this);
        const eventId = formData.get("event_id");

        fetch(`/mysql/events/${eventId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            alert("Event deleted successfully!");
            location.reload(); // Reload the page to remove the deleted event
        })
        .catch(error => {
            console.error('Error deleting event:', error);
            alert("Failed to delete event.");
        });
    });
});





