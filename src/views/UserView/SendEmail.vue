<template>
  <div class="send-email-form">
    <h2>Send Email</h2>
    <form @submit.prevent="sendEmail">
      <div class="form-group">
        <label for="to">To:</label>
        <input v-model="emailData.to" id="to" type="email" required />
      </div>
      
      <div class="form-group">
        <label for="subject">Subject:</label>
        <input v-model="emailData.subject" id="subject" type="text" required />
      </div>
  
      <div class="form-group">
        <label for="text">Message:</label>
        <textarea v-model="emailData.text" id="text" required></textarea>
      </div>
  
      <div class="form-group">
        <label for="attachment">Attachment:</label>
        <input type="file" @change="handleFileUpload" id="attachment" />
      </div>
  
      <div class="button-group">
        <button type="submit">Send Email</button>
      </div>
    </form>
  
    <div v-if="statusMessage" class="status-message">
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

<style scoped>
.send-email-form {
    max-width: 600px;
    margin: 50px auto;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #f9f9f9;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}

input[type="email"],
input[type="text"],
textarea,
input[type="file"] {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    transition: border-color 0.3s;
}

input[type="email"]:focus,
input[type="text"]:focus,
textarea:focus {
    border-color: #007bff;
    outline: none;
}

textarea {
    height: 100px;
    resize: vertical;
}

.button-group {
    text-align: center;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    border: none;
    border-radius: 4px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
}

button:hover {
    background-color: #0056b3;
}

.status-message {
    margin-top: 20px;
    text-align: center;
    color: #28a745; /* Green color for success messages */
}

.status-message p {
    margin: 0;
}
</style>
