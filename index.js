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

  const recipients = ['deepu.program@gmail.com'];
  
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: recipients,
    subject: '🚆 Train Availability Alert',
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
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
          font-family: 'Google Sans', 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
        }
        
        body {
          background: #f8f9fa;
          line-height: 1.5;
          color: #202124;
          padding: 24px;
        }
        
        .email-container {
          max-width: 680px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 1px 3px rgba(60,64,67,0.1), 0 4px 8px rgba(60,64,67,0.15);
          overflow: hidden;
        }
        
        .header {
          padding: 32px 32px 24px;
          border-bottom: 1px solid #e8eaed;
          background: white;
        }
        
        .title {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 8px;
        }
        
        .title h1 {
          font-size: 28px;
          font-weight: 400;
          color: #1a73e8;
          letter-spacing: -0.5px;
        }
        
        .subtitle {
          color: #5f6368;
          font-size: 15px;
          font-weight: 400;
        }
        
        .train-card {
          padding: 32px;
          border-bottom: 1px solid #e8eaed;
          transition: all 0.2s ease;
        }
        
        .train-card:hover {
          background: #f8f9fa;
        }
        
        .train-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 20px;
        }
        
        .train-info h2 {
          font-size: 20px;
          font-weight: 500;
          color: #202124;
          margin-bottom: 4px;
        }
        
        .train-number {
          font-size: 14px;
          color: #5f6368;
          font-weight: 400;
        }
        
        .route-display {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #f1f3f4;
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 14px;
          color: #5f6368;
          margin-top: 12px;
        }
        
        .date-chip {
          background: #e8f0fe;
          color: #1a73e8;
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 14px;
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        
        .status-section {
          background: white;
          border: 1px solid #dadce0;
          border-radius: 12px;
          padding: 24px;
          margin-top: 16px;
        }
        
        .status-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .date-label {
          font-size: 16px;
          color: #5f6368;
          font-weight: 400;
        }
        
        .status-badge {
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 15px;
          font-weight: 500;
          display: inline-block;
        }
        
        .status-wl {
          background: #fef7e0;
          color: #e37400;
          border: 1px solid #fde293;
        }
        
        .status-available {
          background: #e6f4ea;
          color: #137333;
          border: 1px solid #a8dab5;
        }
        
        .details-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-top: 20px;
        }
        
        .detail-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        
        .detail-label {
          font-size: 13px;
          color: #5f6368;
          font-weight: 400;
        }
        
        .detail-value {
          font-size: 15px;
          color: #202124;
          font-weight: 400;
        }
        
        .detail-value.prediction {
          color: #1a73e8;
          font-weight: 500;
        }
        
        .detail-value.raw-status {
          font-family: 'Roboto Mono', monospace;
          background: #f8f9fa;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 13px;
        }
        
        .fare-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
          margin-top: 24px;
        }
        
        .fare-title {
          font-size: 14px;
          color: #5f6368;
          font-weight: 500;
          margin-bottom: 16px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .fare-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e8eaed;
        }
        
        .fare-row:last-child {
          border-bottom: none;
        }
        
        .fare-total {
          font-weight: 500;
          color: #202124;
          font-size: 16px;
        }
        
        .metadata {
          display: flex;
          gap: 20px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #5f6368;
        }
        
        .footer {
          padding: 32px;
          text-align: center;
          color: #5f6368;
          font-size: 14px;
          background: #f8f9fa;
        }
        
        .timestamp {
          font-size: 13px;
          color: #9aa0a6;
          margin-top: 8px;
        }
        
        .icon {
          font-size: 18px;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 12px;
          }
          
          .train-card,
          .header {
            padding: 24px;
          }
          
          .train-header {
            flex-direction: column;
            gap: 12px;
          }
          
          .details-grid {
            grid-template-columns: 1fr;
          }
          
          .metadata {
            flex-direction: column;
            gap: 12px;
          }
          
          .title h1 {
            font-size: 24px;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <div class="title">
            <h1>Train Availability</h1>
          </div>
          <div class="subtitle">Your requested dates status</div>
        </div>
  `;

  for (const t of trains) {
    try {
      const res = await checkTrain(t);
      const trainData = res.data;
      
      // Find only the exact date mentioned in the trains array
      const targetAvailability = trainData.availability.find(avail => 
        avail.date === t.date
      );
      
      if (!targetAvailability) continue;

      // Determine status class
      const statusClass = targetAvailability.status === 'AVAILABLE' 
        ? 'status-available' 
        : 'status-wl';

      emailContent += `
        <div class="train-card">
          <div class="train-header">
            <div class="train-info">
              <h2>${trainData.train.trainName}</h2>
              <div class="train-number">Train ${t.trainNo}</div>
              <div class="route-display">
                <span>${t.from}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 13H16.17L11.29 17.88C10.9 18.27 10.9 18.91 11.29 19.3C11.68 19.69 12.31 19.69 12.7 19.3L19.29 12.71C19.68 12.32 19.68 11.69 19.29 11.3L12.71 4.7C12.32 4.31 11.69 4.31 11.3 4.7C10.91 5.09 10.91 5.72 11.3 6.11L16.17 11H5C4.45 11 4 11.45 4 12C4 12.55 4.45 13 5 13Z" fill="#5f6368"/>
                </svg>
                <span>${t.to}</span>
              </div>
            </div>
            <div class="date-chip">
              <span class="icon">📅</span>
              <span>${t.date}</span>
            </div>
          </div>
          
          <div class="status-section">
            <div class="status-header">
              <div class="date-label">Seat availability for ${t.date}</div>
              <div class="status-badge ${statusClass}">
                ${targetAvailability.availabilityText}
              </div>
            </div>
            
            <div class="details-grid">
              <div class="detail-item">
                <div class="detail-label">CONFIRMATION CHANCE</div>
                <div class="detail-value prediction">
                  ${targetAvailability.prediction}
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">RAW STATUS</div>
                <div class="detail-value raw-status">
                  ${targetAvailability.rawStatus}
                </div>
              </div>
              
              <div class="detail-item">
                <div class="detail-label">BOOKING STATUS</div>
                <div class="detail-value" style="color: ${targetAvailability.canBook ? '#137333' : '#d93025'}">
                  ${targetAvailability.canBook ? 'Can book now ✓' : 'Booking not available ✗'}
                </div>
              </div>
            </div>
          </div>
          
          <div class="metadata">
            <div class="meta-item">
              <span>Class:</span>
              <strong>${trainData.train.travelClass}</strong>
            </div>
            <div class="meta-item">
              <span>Quota:</span>
              <strong>${trainData.train.quota}</strong>
            </div>
            <div class="meta-item">
              <span>Distance:</span>
              <strong>${trainData.train.distance} km</strong>
            </div>
          </div>
          
          <div class="fare-card">
            <div class="fare-title">Fare Details</div>
            <div class="fare-row">
              <span>Base Fare</span>
              <span>₹${trainData.fare.baseFare}</span>
            </div>
            <div class="fare-row">
              <span>Reservation Charge</span>
              <span>₹${trainData.fare.reservationCharge}</span>
            </div>
            <div class="fare-row">
              <span>Superfast Charge</span>
              <span>₹${trainData.fare.superfastCharge}</span>
            </div>
            <div class="fare-row">
              <span>Service Tax</span>
              <span>₹${trainData.fare.serviceTax}</span>
            </div>
            <div class="fare-row fare-total">
              <span>Total Fare</span>
              <span>₹${trainData.fare.totalFare}</span>
            </div>
          </div>
        </div>
      `;
    } catch (error) {
      console.error(`Error checking train ${t.trainNo}:`, error);
      // Optional: Add error card to email
      emailContent += `
        <div class="train-card">
          <div class="train-info">
            <h2>Train ${t.trainNo}</h2>
            <div class="route-display">
              <span>${t.from} → ${t.to}</span>
            </div>
            <div style="color: #d93025; margin-top: 12px; font-size: 14px;">
              Unable to fetch availability data for ${t.date}
            </div>
          </div>
        </div>
      `;
    }
  }

  emailContent += `
        <div class="footer">
          <div>Train Availability Report</div>
          <div class="timestamp">
            Generated on ${new Date().toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(emailContent);
  console.log('Email sent!');
}

main();
