<template>
  <div class="container mt-5">
    <div class="col-md-8 offset-md-2" id="content-to-export">
      <h1 class="text-center mb-4">Health Care Tips and Advice</h1>
      <p class="health-tips">
        It's important to maintain a healthy lifestyle, especially as we age. Here are some tips:
      </p>
      <ul class="list-unstyled">
        <li><strong>1. Balanced Diet:</strong> Older adults should focus on a diverse diet that includes fresh fruits, vegetables, whole grains, lean proteins, and low-fat dairy. It's important to reduce the intake of processed foods and those high in sugar and salt.</li>

        <li><strong>2. Regular Exercise:</strong> Aim for at least 150 minutes of moderate-intensity exercise per week, such as walking, swimming, or yoga. Strength training and flexibility exercises also help improve stability and mobility.</li>

        <li><strong>3. Stay Hydrated:</strong> Older adults are at a higher risk of dehydration, so it's essential to drink enough water daily, especially in hot weather or after exercise.</li>

        <li><strong>4. Regular Check-ups:</strong> Schedule regular health check-ups and screenings to catch potential health issues early.</li>

        <li><strong>5. Mental Health:</strong> Engage in social activities and maintain a positive social circle to support mental well-being. Activities like reading, writing, or learning new skills can help keep the brain active.</li>

        <li><strong>6. Adequate Sleep:</strong> Ensure you get enough sleep each night, typically recommended to be 7 to 9 hours. Good sleep aids in recovery and helps maintain mental alertness.</li>

        <li><strong>7. Avoid Smoking and Limit Alcohol:</strong> If you smoke, quitting is advisable. Alcohol consumption should be moderate, as excessive drinking can negatively affect health.</li>

        <li><strong>8. Manage Chronic Conditions:</strong> If you have chronic conditions (such as high blood pressure or diabetes), follow your doctor's advice regarding medication and monitoring your health.</li>

        <li><strong>9. Good Posture:</strong> Pay attention to posture during daily activities. Avoid staying in one position for too long, and take breaks to stretch.</li>

        <li><strong>10. Nutritional Supplements:</strong> Consider taking vitamins and minerals as recommended by your doctor, such as calcium and vitamin D, to maintain bone health.</li>
      </ul>
    </div>

    <div class="col-md-8 offset-md-2 d-flex justify-content-center mt-3">
      <button @click="exportToPDF" class="btn btn-primary btn-lg">Export to PDF</button>
    </div>

    <div class="col-md-8 offset-md-2">
      <p class="text-success text-center mt-3">If you think these tips are helpful, feel free to export them to your local machine.</p>
    </div>
  </div>
</template>

<script>
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default {
  methods: {
    async exportToPDF() {
      const element = document.getElementById('content-to-export');

      if (!element) {
        console.error('Element not found!');
        return;
      }

      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');

      // create pdf file
      const pdf = new jsPDF();
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('care-tips-and-advice.pdf');
    }
  }
};
</script>

<style>
.health-tips {
  font-size: 1.1em;
  line-height: 1.6;
  margin-bottom: 1.5em;
}
button {
  background-color: #007bff; /* Bootstrap primary color */
  color: white;
  border: none;
  border-radius: 0.25rem;
  padding: 0.75rem 1.5rem;
  transition: background-color 0.3s;
}
button:hover {
  background-color: #0056b3; /* Darker shade for hover */
}
</style>
