document.addEventListener("DOMContentLoaded", function() {
    const eventContainer = document.querySelector('.event-container');

    fetch('/mysql/events')
        .then(response => response.json())
        .then(events => {
            events.forEach(event => {
                const eventSquare = document.createElement('div');
                eventSquare.classList.add('event-square');

                const eventContent = document.createElement('div');
                eventContent.classList.add('event-content');

                const image = document.createElement('img');
                image.src = event.image;
                image.alt = event.title;

                const title = document.createElement('h2');
                title.textContent = event.title;

                const details = document.createElement('p');
                details.textContent = event.details;

                const rsvpButton = document.createElement('button');
                rsvpButton.type = 'button';
                rsvpButton.classList.add('rsvp-button');
                rsvpButton.classList.add(`event-id-${event.id}`);
                rsvpButton.textContent = 'RSVP';

                rsvpButton.addEventListener('click', function() {
                    const eventId = event.id;

                    const data = {
                        event_id: eventId
                    };

                    fetch('/mysql/rsvp', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    })
                    .then(response => response.json())
                    .then(result => {
                        console.log(result);
                        alert('RSVP successful!');
                    })
                    .catch(error => {
                        console.error('Error:', error);
                        alert('RSVP failed. Please try again.');
                    });
                });

                eventContent.appendChild(image);
                eventContent.appendChild(title);
                eventContent.appendChild(details);
                eventContent.appendChild(rsvpButton);

                eventSquare.appendChild(eventContent);
                eventContainer.appendChild(eventSquare);
            });
        })
        .catch(error => {
            console.error('Error fetching events:', error);
        });
});
