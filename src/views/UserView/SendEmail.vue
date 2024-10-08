<template>
    <div class="send-email-form">
      <h2>Send Email</h2>
      <form @submit.prevent="sendEmail">
        <label for="to">To:</label>
        <input v-model="emailData.to" id="to" type="email" required />
        
        <label for="subject">Subject:</label>
        <input v-model="emailData.subject" id="subject" type="text" required />
  
        <label for="text">Message:</label>
        <textarea v-model="emailData.text" id="text" required></textarea>
  
        <label for="attachment">Attachment:</label>
        <input type="file" @change="handleFileUpload" id="attachment" />
  
        <button type="submit">Send Email</button>
      </form>
  
      <div v-if="statusMessage">
        <p>{{ statusMessage }}</p>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        emailData: {
          to: '',
          subject: '',
          text: '',
          attachment: null,
        },
        statusMessage: null,
      };
    },
    methods: {
      handleFileUpload(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        
        reader.onload = (e) => {
          this.emailData.attachment = {
            content: btoa(e.target.result), 
            filename: file.name,
            type: file.type,
          };
        };
  
        reader.readAsBinaryString(file);
      },
      async sendEmail() {
        try {
          const response = await axios.post('http://localhost:3000/api/send-email', this.emailData);
          this.statusMessage = 'Email sent successfully';
        } catch (error) {
          this.statusMessage = 'Failed to send email';
        }
      },
    },
  };
  </script>
  