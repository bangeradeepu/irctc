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
      trainNo: "22638",
      from: "MAQ",
      to: "CBE",
      date: "20-03-2026",
      coach: "SL",
      quota: "GN",
    },
    {
      trainNo: "22610",
      from: "CBE",
      to: "MAQ",
      date: "22-03-2026",
      coach: "2S",
      quota: "GN",
    },
  ];

  let rows = "";

  for (const t of trains) {
    const res = await checkTrain(t);
    const today = res.data.availability[0];

    // Status color logic
    let statusColor = "#28a745"; // green
    if (today.availabilityText.includes("WL")) statusColor = "#dc3545";
    if (today.availabilityText.includes("RAC")) statusColor = "#ffc107";

    rows += `
      <tr>
        <td>${res.data.train.trainName} (${t.trainNo})</td>
        <td>${t.from} → ${t.to}</td>
        <td>${today.date}</td>
        <td style="color:${statusColor}; font-weight:bold;">
          ${today.availabilityText}
        </td>
      </tr>
    `;
  }

  const emailContent = `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:20px;">
    
    <div style="max-width:600px; margin:auto; background:white; padding:20px; border-radius:10px; box-shadow:0 4px 10px rgba(0,0,0,0.1);">
      
      <h2 style="text-align:center; color:#2c3e50;">
        🚆 Train Seat Availability
      </h2>

      <p style="text-align:center; color:#777;">
        Daily automated update
      </p>

      <table style="width:100%; border-collapse:collapse; margin-top:20px;">
        <thead>
          <tr style="background:#2c3e50; color:white;">
            <th style="padding:10px;">Train</th>
            <th>Route</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          ${rows}
        </tbody>
      </table>

      <div style="margin-top:25px; text-align:center; font-size:14px; color:#666;">
        <p>✅ Green = Available</p>
        <p>🟡 Yellow = RAC</p>
        <p>🔴 Red = Waiting List</p>
      </div>

      <hr style="margin:25px 0;"/>

      <p style="text-align:center; font-size:12px; color:#999;">
        This is an automated email from IRCTC Mailer<br/>
        Developed by Deepesh M Bangera
      </p>

    </div>

  </div>
  `;

  await sendMail(emailContent);
  console.log("✅ Email sent!");
}


main();
