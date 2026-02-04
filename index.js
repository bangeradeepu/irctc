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

const { getAvailability } = require("irctc-connect");
const {nodemailer} = require("nodemailer");
const {dotenv} = require("dotenv");

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

  const recipients = ['idigitalmithra@gmail.com', 'deepu.program@gmail.com'];

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

  let emailContent = `<h2>🚆 Train Availability</h2>`;

  for (const t of trains) {
    const res = await checkTrain(t);

    const today = res.data.availability[0];

    emailContent += `
      <h3>${res.data.train.trainName} (${t.trainNo})</h3>
      Route: ${t.from} → ${t.to}<br/>
      Date: ${today.date}<br/>
      Status: <b>${today.availabilityText}</b><br/><br/>
    `;
  }

  await sendMail(emailContent);

  console.log('Email sent!');
}

main();
