# HappyPet

STEPS ARE NUMBERED 1 - 4, PLEASE FOLLOW CAREFULLY.

HOPE YOU ENJOY!

1. RUN IN TERMINAL:

npm install bcrypt@^5.1.1 cookie-parser@~1.4.4 debug@~2.6.9 dotenv@^16.4.5 express@^4.19.2 express-mysql-session@^2.1.8 express-session@^1.18.0 morgan@~1.9.1 mysql@^2.18.1 nodemailer@^6.9.13 session@^0.1.0

2. THEN RUN:

service mysql start

mysql start

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';

CREATE DATABASE happyPets;

exit;

3. THEN RUN IN TERMINAL:

mysql -u root -p happyPets < events.sql

input password 1234;

mysql -u root -p

input password 1234;

use happyPets;

exit;

4. RUN THIS COMMAND IN TERMINAL

node public/login/updatePasswords.js

run npm start;

YOU SHOULD NOW BE ABLE TO ACCESS THE WEBPAGE

THESE LOGINS ARE ALREADY IN THE DATABASE

ADMIN

john.doe@example.com

password123

MANAGER

jane.smith@example.com

password123

MEMBER

michael.brown@example.com

password123

OR CREATE YOUR OWN ACCOUNT FOR A MEMBER

How to test our Special Feature - Email Subscription:
Ethereal Email Account
Our application uses Ethereal for email testing. When you start the server, an Ethereal email account is created, and the details are logged in the terminal.

Follow the link provided in the terminal to access the Ethereal email account and check emails sent by the application.

Example link (replace with actual link from terminal):

Ethereal account created successfully. You can view your email at: https://ethereal.email/messages
