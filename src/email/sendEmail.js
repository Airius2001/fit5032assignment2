import sgMail from '@sendgrid/mail';
sgMail.setApiKey(process.env.SENDGRID_API_KEY); // store API Key

const sendEmailWithAttachment = async (to, subject, text, attachment) => {
  const msg = {
    to: to,
    from: 'Xxz6507@gmail.com',
    subject,
    text,
    attachments: [
        {
          content: attachment.content, 
          filename: attachment.filename, 
          type: attachment.type, 
          disposition: 'attachment',
        },
      ],
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error.response.body.errors);
  }
};

module.exports = sendEmailWithAttachment;
