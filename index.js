// import express from 'express';
// import { getAvailability } from 'irctc-connect';

// const app = express();
// app.use(express.json());

// app.post('/checkAvailability', async (req, res) => {
//   try {
//     const { trainNo, from, to, date, coach, quota } = req.body;

//     const result = await getAvailability(trainNo, from, to, date, coach, quota);
//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ error: err.toString() });
//   }
// });

// app.listen(3000, () => console.log('Server running on port 3000'));

import { getAvailability } from "irctc-connect";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function checkTrain(train) {
  return await getAvailability(
    train.trainNo,
    train.from,
    train.to,
    train.date,
    train.coach,
    train.quota
  );
}

async function sendMail(content) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // const recipients = ['idigitalmithra@gmail.com', 'deepu.program@gmail.com', 'sboss781@gmail.com'];
  const recipients = ['deepu.program@gmail.com'];


  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: '🚆 Daily Train Seat Availability',
    html: content,
  });
}

async function main() {
  const trains = [
    {
      trainNo: '22638',
      from: 'MAQ',
      to: 'CBE',
      date: '20-03-2026',
      coach: 'SL',
      quota: 'GN',
    },
    {
      trainNo: '22610',
      from: 'CBE',
      to: 'MAQ',
      date: '22-03-2026',
      coach: '2S',
      quota: 'GN',
    },
  ];

  let emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Train Availability Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        body {
          background-color: #f5f7fa;
          padding: 20px;
        }
        
        .email-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .header {
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          color: white;
          padding: 25px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 15px;
        }
        
        .header h1 i {
          font-size: 32px;
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.9);
          font-size: 16px;
          margin-top: 5px;
        }
        
        .train-card {
          margin: 25px;
          border: 1px solid #e1e5eb;
          border-radius: 10px;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .train-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
        }
        
        .train-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .train-info h3 {
          font-size: 20px;
          margin-bottom: 5px;
        }
        
        .train-no {
          background: rgba(255, 255, 255, 0.2);
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 500;
        }
        
        .train-details {
          padding: 15px 20px;
          background: #f8f9fa;
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          font-size: 14px;
          color: #495057;
        }
        
        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .detail-label {
          font-weight: 600;
          color: #343a40;
        }
        
        .route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 600;
          color: #2c3e50;
        }
        
        .route-arrow {
          color: #667eea;
          font-size: 20px;
        }
        
        .availability-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .availability-table th {
          background: #f1f3f4;
          padding: 15px;
          text-align: left;
          font-weight: 600;
          color: #2c3e50;
          border-bottom: 2px solid #dee2e6;
        }
        
        .availability-table td {
          padding: 15px;
          border-bottom: 1px solid #e9ecef;
        }
        
        .status-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-align: center;
          min-width: 80px;
        }
        
        .status-waitlist {
          background: #fff3cd;
          color: #856404;
          border: 1px solid #ffeaa7;
        }
        
        .status-available {
          background: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .prediction-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .prediction-high {
          background: linear-gradient(135deg, #d4fc79 0%, #96e6a1 100%);
          color: #155724;
        }
        
        .prediction-medium {
          background: linear-gradient(135deg, #f6d365 0%, #fda085 100%);
          color: #856404;
        }
        
        .prediction-low {
          background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%);
          color: #721c24;
        }
        
        .can-book {
          display: inline-block;
          padding: 6px 12px;
          background: #28a745;
          color: white;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .fare-summary {
          padding: 20px;
          background: linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%);
          border-radius: 8px;
          margin: 20px 25px;
        }
        
        .fare-summary h4 {
          color: #2c3e50;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .fare-details {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }
        
        .fare-item {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border-bottom: 1px dashed #dee2e6;
        }
        
        .total-fare {
          font-size: 20px;
          font-weight: 700;
          color: #2c3e50;
        }
        
        .footer {
          text-align: center;
          padding: 20px;
          background: #f8f9fa;
          color: #6c757d;
          font-size: 14px;
          border-top: 1px solid #e9ecef;
        }
        
        .footer a {
          color: #667eea;
          text-decoration: none;
        }
        
        @media (max-width: 600px) {
          .train-header {
            flex-direction: column;
            text-align: center;
            gap: 10px;
          }
          
          .availability-table {
            display: block;
            overflow-x: auto;
          }
          
          .fare-details {
            grid-template-columns: 1fr;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>🚆 Train Availability Report</h1>
          <div class="subtitle">Real-time seat availability and predictions</div>
        </div>
  `;

  for (const t of trains) {
    const res = await checkTrain(t);
    const trainData = res.data;
    const today = trainData.availability[0];

    // Determine prediction class based on percentage
    const getPredictionClass = (percentage) => {
      if (percentage >= 60) return 'prediction-high';
      if (percentage >= 40) return 'prediction-medium';
      return 'prediction-low';
    };

    // Determine status class
    const getStatusClass = (status) => {
      return status === 'AVAILABLE' ? 'status-available' : 'status-waitlist';
    };

    emailContent += `
        <div class="train-card">
          <div class="train-header">
            <div class="train-info">
              <h3>${trainData.train.trainName}</h3>
              <div class="train-no">${t.trainNo}</div>
            </div>
            <div class="route">
              <span>${trainData.train.fromStationName} (${t.from})</span>
              <span class="route-arrow">→</span>
              <span>${trainData.train.toStationName} (${t.to})</span>
            </div>
          </div>
          
          <div class="train-details">
            <div class="detail-item">
              <span class="detail-label">Distance:</span>
              <span>${trainData.train.distance} km</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Class:</span>
              <span>${trainData.train.travelClass}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Quota:</span>
              <span>${trainData.train.quota}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Current Status:</span>
              <span class="status-badge ${getStatusClass(today.status)}">${today.availabilityText}</span>
            </div>
          </div>
          
          <div style="padding: 20px;">
            <h4 style="color: #2c3e50; margin-bottom: 15px; font-size: 16px;">📅 Availability for Next 6 Days</h4>
            <table class="availability-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Raw Status</th>
                  <th>Prediction</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
    `;

    // Add rows for each availability date
    for (const avail of trainData.availability) {
      emailContent += `
                <tr>
                  <td><strong>${avail.date}</strong></td>
                  <td><span class="status-badge ${getStatusClass(avail.status)}">${avail.availabilityText}</span></td>
                  <td><code>${avail.rawStatus}</code></td>
                  <td><span class="prediction-badge ${getPredictionClass(avail.predictionPercentage)}">${avail.prediction}</span></td>
                  <td>${avail.canBook ? '<span class="can-book">BOOK NOW</span>' : 'Not Available'}</td>
                </tr>
      `;
    }

    emailContent += `
              </tbody>
            </table>
          </div>
          
          <div class="fare-summary">
            <h4>💰 Fare Breakdown</h4>
            <div class="fare-details">
              <div class="fare-item">
                <span>Base Fare:</span>
                <span>₹${trainData.fare.baseFare}</span>
              </div>
              <div class="fare-item">
                <span>Reservation Charge:</span>
                <span>₹${trainData.fare.reservationCharge}</span>
              </div>
              <div class="fare-item">
                <span>Superfast Charge:</span>
                <span>₹${trainData.fare.superfastCharge}</span>
              </div>
              <div class="fare-item">
                <span>Service Tax:</span>
                <span>₹${trainData.fare.serviceTax}</span>
              </div>
              <div class="fare-item total-fare">
                <span>Total Fare:</span>
                <span>₹${trainData.fare.totalFare}</span>
              </div>
            </div>
          </div>
        </div>
    `;
  }

  emailContent += `
        <div class="footer">
          <p>This report was generated on ${new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} at ${new Date().toLocaleTimeString('en-IN')}</p>
          <p>For bookings, visit <a href="https://www.irctc.co.in">IRCTC Official Website</a></p>
          <p style="margin-top: 10px; font-size: 12px; color: #adb5bd;">
            Note: Predictions are estimates based on historical data. Actual confirmation may vary.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(emailContent);
  console.log('Email sent!');
}

main();
