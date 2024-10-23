import { createTransport } from 'nodemailer';
import 'dotenv/config';

const transporter = createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
});

export const sendPasswordResetEmail = async (userEmail, resetLink) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: userEmail,
      subject: "Password Reset",
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`,
    });
  } catch (error) {
    console.error("Error sending email", error);
  }
};
