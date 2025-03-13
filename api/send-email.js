import nodemailer from 'nodemailer';
import 'dotenv/config';

function validateInput ({ name, email, message }) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name || name.length < 2 || name.length > 50) {
    return 'Invalid name';
  }
  if (!email || !emailRegex.test(email)) {
    return 'Invalid email';
  }
  if (!message || message.length <= 0 || message.length > 1000) {
    return 'Invalid message length (1 - 1000 characters)';
  }
  return null;
}

export default async function handler (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { name, email, message } = req.body;

  const validationError = validateInput({ name, email, message });
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAIL_HOST,
    port: process.env.NODEMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.NODEMAIL_LOGIN,
      pass: process.env.NODEMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAIL_SENDER,
    replyTo: email,
    to: process.env.NODEMAIL_RECEIVER,
    subject: `New Contact Form Submission from ${name}`,
    text: message,
    headers: {
      'X-Origin-IP': req.headers['x-forwarded-for'] || 'unknown',
      'X-Timestamp': Date.now().toString()
    }
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      message: 'Email sent successfully'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send email', error });
  }
}

// Vercel configuration
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb' // Prevent large payload attacks
    }
  }
};
