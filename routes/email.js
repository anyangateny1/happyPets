const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Create a transporter object using Ethereal credentials
let transporter;

nodemailer.createTestAccount((err, account) => {
  if (err) {
    console.error('Failed to create a testing account. ' + err.message);
    return process.exit(1);
  }

  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: account.user,
      pass: account.pass,
    }
  });

  console.log('Ethereal account created successfully. You can view your email at: https://ethereal.email/messages');
});

// Function to send an email
const sendEmail = (to, subject, notificationTypes) => {
  const mailOptions = {
    from: 'no-reply@happypets.com', // Example sender email
    to: to,
    subject: subject,
    text: `Hello,

Thank you for subscribing to notifications from Happy Pets!

You have chosen to receive updates on the following topics:
${notificationTypes}

We are excited to keep you informed about our latest news, events, and updates. If you have any questions or need further assistance, please do not hesitate to contact us.

Best regards,
The Happy Pets Team

Follow us on social media:
Facebook: https://www.facebook.com/happypets
Twitter: https://twitter.com/happypets
Instagram: https://www.instagram.com/happypets

Visit our website: https://www.happypets.com
`,
    html: `<p>Hello,</p>
<p>Thank you for subscribing to notifications from <strong>Happy Pets</strong>!</p>
<p>You have chosen to receive updates on the following topics:</p>
<ul>
  ${notificationTypes.split(', ').map(type => `<li>${type}</li>`).join('')}
</ul>
<p>We are excited to keep you informed about our latest news, events, and updates.<br> If you have any questions or need further assistance, please do not hesitate to <a href="https://www.happypets.com/contact">contact us</a>.</p>
<p>Best regards,<br>
The Happy Pets Team</p>
<p><img src="https://shorturl.at/8IB5d" alt="Thank You!" style="width:300px;height:auto;"></p>
<p>Follow us on social media:</p>
<ul>
  <li><a href="https://www.facebook.com/happypets">Facebook</a></li>
  <li><a href="https://twitter.com/happypets">Twitter</a></li>
  <li><a href="https://www.instagram.com/happypets">Instagram</a></li>
</ul>
<p>Visit our website: <a href="https://www.happypets.com">www.happypets.com</a></p>`
  };

  transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
      console.error('Error:', error);
      // Optionally log error to a file or notify admin
    } else {
      console.log('Email sent: ' + nodemailer.getTestMessageUrl(info));
      // Optionally log success or notify admin
    }
  });
};

// Route to handle email signup form submission
router.post('/signup', (req, res) => {
  const email = req.body.email;
  const notifications = req.body.notifications;
  const notificationTypes = Array.isArray(notifications) ? notifications.join(', ') : notifications;

  // Send confirmation email
  sendEmail(email, 'Subscription Confirmation', notificationTypes);

  res.send('Thank you for signing up for notifications!');
});

module.exports = router;








