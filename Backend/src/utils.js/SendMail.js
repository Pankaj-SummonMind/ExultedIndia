// utils/sendMail.js
import nodemailer from "nodemailer";

export const sendAdminNotification = async (user) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", 
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password (not your real password)
      },
    });

    const mailOptions = {
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New User Registered 🚀",
      html: `
        <h2>New User Registration</h2>
        <p><strong>Name:</strong> ${user.name}</p>
        <p><strong>Email:</strong> ${user.email}</p>
        <p><strong>ID:</strong> ${user._id}</p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Mail Error:", error);
  }
};