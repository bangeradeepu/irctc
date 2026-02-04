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
      primary: true // Marking this as primary date
    },
    {
      trainNo: '22610',
      from: 'CBE',
      to: 'MAQ',
      date: '22-03-2026',
      coach: '2S',
      quota: 'GN',
      primary: true // Marking this as primary date
    },
  ];

  let emailContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f8f9fa;
        }
        
        .container {
          background: white;
          border-radius: 12px;
          padding: 30px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #eaeaea;
        }
        
        .header h1 {
          color: #1a73e8;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
        }
        
        .train-card {
          background: white;
          border: 1px solid #e0e0e0;
          border-radius: 10px;
          margin-bottom: 25px;
          overflow: hidden;
        }
        
        .train-header {
          background: linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%);
          padding: 20px;
          border-bottom: 1px solid #e0e0e0;
        }
        
        .train-name {
          font-size: 20px;
          font-weight: 600;
          color: #202124;
          margin-bottom: 5px;
        }
        
        .train-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          color: #5f6368;
          font-size: 14px;
          margin-top: 10px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        
        .primary-date {
          background: #1a73e8;
          color: white;
          padding: 4px 12px;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 500;
          margin-left: auto;
        }
        
        .highlight-section {
          background: #e8f0fe;
          padding: 20px;
          margin: 0;
          border-bottom: 1px solid #d2e3fc;
        }
        
        .highlight-title {
          font-size: 16px;
          font-weight: 600;
          color: #1a73e8;
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .primary-info {
          background: white;
          padding: 15px;
          border-radius: 8px;
          border: 2px solid #1a73e8;
          margin-bottom: 15px;
        }
        
        .availability-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 14px;
        }
        
        .wl-badge {
          background: #fef3c7;
          color: #92400e;
          border: 1px solid #fde68a;
        }
        
        .available-badge {
          background: #d1fae5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }
        
        .prediction {
          font-size: 13px;
          color: #6b7280;
          margin-top: 5px;
        }
        
        .other-dates {
          padding: 20px;
        }
        
        .other-dates-title {
          font-size: 14px;
          font-weight: 600;
          color: #5f6368;
          margin-bottom: 15px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .dates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
          gap: 12px;
        }
        
        .date-card {
          background: #f8f9fa;
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
          transition: all 0.2s;
        }
        
        .date-card:hover {
          border-color: #1a73e8;
          box-shadow: 0 2px 4px rgba(26, 115, 232, 0.1);
        }
        
        .date-label {
          font-size: 13px;
          color: #6b7280;
          margin-bottom: 4px;
        }
        
        .date-value {
          font-weight: 600;
          color: #374151;
          margin-bottom: 8px;
        }
        
        .fare-info {
          background: #f9fafb;
          padding: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
        }
        
        .fare-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        
        .total-fare {
          font-weight: 600;
          color: #1a73e8;
          font-size: 16px;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px dashed #d1d5db;
        }
        
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #eaeaea;
          color: #6b7280;
          font-size: 13px;
        }
        
        .route {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-weight: 500;
          color: #1a73e8;
          margin: 10px 0;
        }
        
        .route-arrow {
          font-size: 20px;
          color: #9ca3af;
        }
        
        @media (max-width: 600px) {
          body {
            padding: 10px;
          }
          
          .container {
            padding: 20px;
          }
          
          .dates-grid {
            grid-template-columns: 1fr;
          }
          
          .train-meta {
            flex-direction: column;
            gap: 8px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🚆 Train Availability</h1>
          <p style="color: #6b7280;">Daily seat status report</p>
        </div>
  `;

  for (const t of trains) {
    const res = await checkTrain(t);
    const trainData = res.data;
    
    // Find the primary date from availability array
    const primaryDate = trainData.availability.find(avail => 
      avail.date === t.date
    ) || trainData.availability[0];
    
    // Other dates (excluding primary)
    const otherDates = trainData.availability.filter(avail => 
      avail.date !== t.date
    );

    // Get status badge class
    const getStatusClass = (status) => {
      return status === 'AVAILABLE' ? 'available-badge' : 'wl-badge';
    };

    emailContent += `
        <div class="train-card">
          <div class="train-header">
            <div style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div>
                <div class="train-name">${trainData.train.trainName}</div>
                <div style="font-size: 14px; color: #5f6368;">Train No: ${t.trainNo}</div>
              </div>
              <div class="primary-date">Your Date: ${t.date}</div>
            </div>
            
            <div class="route">
              <span>${t.from} → ${t.to}</span>
            </div>
            
            <div class="train-meta">
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
          </div>
          
          <div class="highlight-section">
            <div class="highlight-title">
              📅 <span>Primary Date Availability</span>
            </div>
            
            <div class="primary-info">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <div>
                  <strong style="font-size: 16px;">${primaryDate.date}</strong>
                  <div style="font-size: 13px; color: #6b7280;">Your selected travel date</div>
                </div>
                <div>
                  <span class="availability-badge ${getStatusClass(primaryDate.status)}">
                    ${primaryDate.availabilityText}
                  </span>
                </div>
              </div>
              
              <div style="display: flex; gap: 15px; font-size: 14px;">
                <div>
                  <span style="color: #6b7280;">Raw Status:</span>
                  <code style="background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 12px;">${primaryDate.rawStatus}</code>
                </div>
                <div>
                  <span style="color: #6b7280;">Prediction:</span>
                  <strong>${primaryDate.prediction}</strong>
                </div>
                <div>
                  <span style="color: #6b7280;">Booking:</span>
                  <strong style="color: ${primaryDate.canBook ? '#10b981' : '#ef4444'}">
                    ${primaryDate.canBook ? 'Available ✓' : 'Not Available ✗'}
                  </strong>
                </div>
              </div>
            </div>
          </div>
          
          ${otherDates.length > 0 ? `
          <div class="other-dates">
            <div class="other-dates-title">📅 Other Available Dates</div>
            <div class="dates-grid">
          ` : ''}
          
          ${otherDates.map(date => `
              <div class="date-card">
                <div class="date-label">Date</div>
                <div class="date-value">${date.date}</div>
                <span class="availability-badge ${getStatusClass(date.status)}" style="font-size: 12px; padding: 4px 8px;">
                  ${date.availabilityText}
                </span>
                <div class="prediction">${date.prediction}</div>
              </div>
          `).join('')}
          
          ${otherDates.length > 0 ? `
            </div>
          </div>
          ` : ''}
          
          <div class="fare-info">
            <div class="fare-row">
              <span>Base Fare:</span>
              <span>₹${trainData.fare.baseFare}</span>
            </div>
            <div class="fare-row">
              <span>Reservation Charge:</span>
              <span>₹${trainData.fare.reservationCharge}</span>
            </div>
            <div class="fare-row">
              <span>Superfast Charge:</span>
              <span>₹${trainData.fare.superfastCharge}</span>
            </div>
            <div class="fare-row total-fare">
              <span>Total Fare:</span>
              <span>₹${trainData.fare.totalFare}</span>
            </div>
          </div>
        </div>
    `;
  }

  emailContent += `
        <div class="footer">
          <p>Report generated on ${new Date().toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
          <p style="font-size: 12px; margin-top: 10px; color: #9ca3af;">
            Note: All fares are approximate. Check IRCTC for exact details.
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