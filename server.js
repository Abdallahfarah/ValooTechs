const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
const path = require('path');
const xss = require('xss');
const validator = require('validator');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting to prevent spam (max 5 requests per 15 minutes per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: {
    message: 'Too many contact requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(express.json());

// Apply rate limiting specifically to the contact endpoint
app.use('/api/contact', apiLimiter);

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message, ownerName, ownerEmail } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: 'Invalid email address.' });
    }

    if (message.trim().length < 10) {
      return res.status(400).json({ message: 'Message must be at least 10 characters long.' });
    }

    // Input sanitization to prevent XSS
    const cleanName = xss.clean(name);
    const cleanEmail = xss.clean(email);
    const cleanSubject = xss.clean(subject);
    const cleanMessage = xss.clean(message);
    const cleanOwnerName = xss.clean(ownerName || 'Abdallah Abdirahman');
    const cleanOwnerEmail = xss.clean(ownerEmail || 'valodev14@gmail.com');

    // Email configuration using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: parseInt(process.env.EMAIL_PORT) === 465, // true for port 465, false for others
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${cleanName}" <${process.env.EMAIL_USER}>`,
      replyTo: cleanEmail,
      to: process.env.EMAIL_TO || 'valodev14@gmail.com',
      subject: 'New Contact Form Submission',
      text: `--------------------------------

New message from VALO website

Visitor Name:
${cleanName}

Visitor Email:
${cleanEmail}

Subject:
${cleanSubject}

Message:
${cleanMessage}

--------------------------------

Owner:

${cleanOwnerName}

Website:

VALO TECH`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ message: 'Message sent successfully!' });

  } catch (error) {
    console.error('Email delivery error:', error);
    return res.status(500).json({ message: 'Unable to send your message. Please try again later.' });
  }
});

// Serve static build files in production environment
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
