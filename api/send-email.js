import nodemailer from 'nodemailer';
import 'dotenv/config';

export default async function handler (req, res) {
  if (req.method === 'POST') {
    const { name, email, message } = req.body;

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
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).json({
        message: 'Email sent successfully'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to send email', error });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
