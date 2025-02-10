import start from "./gmail.ts";

import dotenv from "dotenv";
import nodemailer from "nodemailer";


dotenv.config();


// Send an email
async function send_email()
{
  // SMTP server configuration
  const transporter = nodemailer.createTransport(
  {
    /* host: "smtp.gmail.com",
    port: process.env.PORT,
    secure: false,
    tls: { rejectUnauthorized: false, }, */

    service: "gmail",
    auth: {
      user: process.env.MAIL_NAME,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try
  {
    const info = await transporter.sendMail({
      from: `"Your Name" <${process.env.MAIL_SENDER}>`,
      to: process.env.MAIL_RECIEVER,
      subject: "test email",                        // Email subject
      text: "Hello, this is a test email!",         // Plain text body
      html: "<b>Hello, this is a test email!</b>",  // HTML body
    });

    console.log("Message sent: %s", info.messageId);

  } catch (error) { console.error("[ERROR]: sending email: ", error); }
}

start()






