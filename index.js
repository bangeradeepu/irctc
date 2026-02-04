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

// Simple UI
// async function main() {
//   const trains = [
//     {
//       trainNo: '22638',
//       from: 'MAQ',
//       to: 'CBE',
//       date: '20-03-2026',
//       coach: 'SL',
//       quota: 'GN',
//     },
//     {
//       trainNo: '22610',
//       from: 'CBE',
//       to: 'MAQ',
//       date: '22-03-2026',
//       coach: '2S',
//       quota: 'GN',
//     },
//   ];

//   let emailContent = `<h2>🚆 Train Availability</h2>`;

//   for (const t of trains) {
//     const res = await checkTrain(t);

//     const today = res.data.availability[0];

//     emailContent += `
//       <h3>${res.data.train.trainName} (${t.trainNo})</h3>
//       Route: ${t.from} → ${t.to}<br/>
//       Date: ${today.date}<br/>
//       Status: <b>${today.availabilityText}</b><br/><br/>
//     `;
//   }

//   await sendMail(emailContent);

//   console.log('Email sent!');
// }


// Updated UI
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

  let cards = "";

  for (const t of trains) {
    const res = await checkTrain(t);
    const today = res.data.availability[0];

    // Status color
    let bg = "#e8f5e9"; // green
    let color = "#2e7d32";

    if (today.status === "WAITLIST") {
      bg = "#fdecea";
      color = "#c62828";
    }

    if (today.status === "RAC") {
      bg = "#fff8e1";
      color = "#f9a825";
    }

    cards += `
      <div style="
        border:1px solid #e0e0e0;
        border-radius:12px;
        padding:16px;
        margin-bottom:16px;
      ">
        <h3 style="margin:0; font-weight:500;">
          ${res.data.train.trainName} (${t.trainNo})
        </h3>

        <p style="margin:6px 0; color:#5f6368;">
          ${res.data.train.fromStationName} → ${res.data.train.toStationName}
        </p>

        <div style="
          display:inline-block;
          padding:6px 12px;
          border-radius:20px;
          background:${bg};
          color:${color};
          font-weight:700;
          font-size:14px;
        ">
          ${today.availabilityText}
        </div>

        <p style="margin-top:8px; font-size:13px; color:#5f6368;">
          📅 ${today.date} | Prediction: ${today.prediction}
        </p>
      </div>
    `;
  }

  const emailContent = `
  <div style="
    font-family: Roboto, Arial, sans-serif;
    background:#f1f3f4;
    padding:10px;
  ">

    <div style="
      max-width:520px;
      margin:auto;
      background:white;
      border-radius:16px;
      padding:24px;
      box-shadow:0 1px 3px rgba(0,0,0,0.1);
    ">

      <h2 style="
        text-align:center;
        font-weight:500;
        color:#202124;
      ">
        🚆 Train Availability
      </h2>

      <p style="
        text-align:center;
        color:#5f6368;
        font-size:14px;
      ">
        Daily Seat Update
      </p>

      ${cards}

      <p style="
        text-align:center;
        font-size:12px;
        color:#9aa0a6;
        margin-top:20px;
      ">
        Automated update • IRCTC Mailer
      </p>

    </div>
  </div>
  `;

  await sendMail(emailContent);
  console.log("✅ Email sent!");
}

main();
