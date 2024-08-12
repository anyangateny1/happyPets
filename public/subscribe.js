document.addEventListener('DOMContentLoaded', function() {
    var subscribeForm = document.getElementById('subscribeForm');

    subscribeForm.addEventListener('submit', function(event) {
      event.preventDefault();

      var emailInput = document.getElementById('email');
      var notifications = document.querySelectorAll('input[name="notifications"]:checked');
      var email = emailInput.value;
      var selectedNotifications = Array.from(notifications).map(notification => notification.value);

      // Clear previous error messages
      var errorElement = document.getElementById('error-message');
      if (errorElement) {
        errorElement.remove();
      }

      // Validate email
      if (!email) {
        var emailError = document.createElement('div');
        emailError.id = 'error-message';
        emailError.style.color = 'red';
        emailError.innerText = 'Please enter your email.';
        emailInput.insertAdjacentElement('afterend', emailError);
        return;
      }

      // Validate notifications
      if (selectedNotifications.length === 0) {
        var notificationError = document.createElement('div');
        notificationError.id = 'error-message';
        notificationError.style.color = 'red';
        notificationError.innerText = 'Please select at least one notification type.';
        subscribeForm.insertAdjacentElement('afterend', notificationError);
        return;
      }

      var formData = new FormData(subscribeForm);
      var data = {};
      formData.forEach(function(value, key) {
        if (!data[key]) {
          data[key] = value;
        } else {
          if (!Array.isArray(data[key])) {
            data[key] = [data[key]];
          }
          data[key].push(value);
        }
      });

      fetch('/email/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(function(response) {
        if (response.ok) {
          alert('Thank you for signing up for notifications!');
          subscribeForm.reset();
        } else {
          alert('There was a problem with your subscription. Please try again.');
        }
      })
      .catch(function(error) {
        alert('There was a problem with your subscription. Please try again.');
      });
    });
  });



