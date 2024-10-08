import express from 'express';
import bodyParser from 'body-parser';
import sendgridMail from '@sendgrid/mail';
import cors from 'cors';
import dotenv from 'dotenv'; 

dotenv.config(); 

const app = express();

// initialize SendGrid API
sendgridMail.setApiKey(process.env.SENDGRID_API_KEY); 

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:5173',
}));

// define API router to send email
app.post('/api/send-email', async (req, res) => {
    const { to, subject, text, attachment } = req.body;

    try {
        const message = {
            to: to,
            from: 'Xxz6507@gmail.com', 
            subject: subject,
            text: text,
            attachments: attachment ? [{
                content: attachment.content,
                filename: attachment.filename,
                type: attachment.type,
                disposition: 'attachment',
            }] : [],
        };

        await sendgridMail.send(message);
        res.status(200).send({ message: 'Email sent successfully!' });
    } catch (error) {
        console.error('Error sending email:', error.response ? error.response.body : error);
        res.status(500).send({ error: 'Failed to send email', details: error.message });
    }
});

// Set the port on which the server listens
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
