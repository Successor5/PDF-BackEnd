const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const multer = require('multer');

const app = express();
const port = 5000;

app.use(cors());


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


app.post('/send-email', upload.single('pdf'), (req, res) => {
  const { email } = req.body;
  const pdfBuffer = req.file.buffer;

  // Configure the email transporter (replace with your email service and credentials)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME, 
        pass: process.env.EMAIL_PASSWORD, 
    },
  });

  const mailOptions = {
    from: 'emmanuel71711@gmail.com',
    to: email,
    subject: 'PDF Report',
    text: 'Attached is the PDF report',
    attachments: [
      {
        filename: 'report.pdf',
        content: pdfBuffer,
      },
    ],
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error occurred:', error);
      res.status(500).json({ error: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ message: 'Email sent successfully' });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});