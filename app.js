const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();

//view enguine setup
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// Public/Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.render('contact');
});

app.post('/send', (req, res) => {
    console.log(req.body);
    const output = `
    <h3>You have a new email from your form</h3>
    <ul>
        <li><u>Name<u>: ${req.body.name}</li>
        <li>Email: ${req.body.email}</li>
        <li>Message: ${req.body.message}</li>
    </ul>`;
//credentials for server

    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: '',
            pass: ''
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    
      // setup email data with unicode symbols
      let mailOptions = {
        from: '"Nodemailer Contact" <>', // sender address
        to: "", // list of receivers
        subject: "Contact Form", // Subject line
        text: "Hello world?", // plain text body
        html: output // html body
      };
    
  // send mail with defined transport object
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);   
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));

    res.render('contact', {msg:'Email has been sent'});
});
});

app.listen(3010, () => console.log('Server started on port 3010...'));