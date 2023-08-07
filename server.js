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

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'emmanuel71711@gmail.com',
      pass: 'Wealth1234',
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


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});