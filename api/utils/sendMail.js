import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { PassThrough } from "stream";

dotenv.config();

// Create a transporter using Ethereal email service
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: true,
    service: 'gmail',
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    },
});

// Define an async function to send emails
async function sendEmail({to, subject, text = "", html = "", attachments = []}) {
    // Create a message object
    const message = { 
        from: "DevB Blog", 
        to: to, 
        subject: subject, 
        text: text || 'DevB Blog would like to greet you', 
        html: html || "<b> Good morning, and in case I don't see ya, good afternoon, good evening, and good night. </b>"
    };

    console.log(text);

    // Add attachments if provided
    if (attachments.length > 0) {
        for (const attachment of attachments) {
            const stream = new PassThrough();
            stream.end(attachment.buffer);
            message.attachments.push({
                filename: attachment.filename,
                contentType: attachment.contentType,
                content: stream,
            });
        }
    }

  // Send the email
    try {
        const info = await transporter.sendMail(message);
        console.log(`Email sent successfully: ${info.messageId}`);
    } catch (error) {
        console.error(`Error sending email: ${error.message}`);
    }
}

export default sendEmail;