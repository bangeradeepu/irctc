# 🚆 IRCTC Train Availability Mailer

Automatically checks Indian Railways train seat availability and sends a daily email update.

Built using **Node.js + irctc-connect + Nodemailer + GitHub Actions scheduler**.

---

## ✨ Features

✅ Fetches real-time seat availability  
✅ Supports multiple trains  
✅ Sends daily email updates  
✅ GitHub Actions automation (no server needed)  
✅ Multiple email recipients  
✅ Secure via GitHub Secrets  
✅ ES Module compatible  

---

## 📦 Tech Stack

- Node.js
- [irctc-connect](https://github.com/RAJIV81205/irctc-connect)
- Nodemailer
- GitHub Actions
- dotenv

---

## 📂 Project Structure
base URL to get availability of train
https://bookmytrain.vercel.app/api/get-real-availability

payload
{
    "trainNo": "22638",
    "dateOfJourney": "20-03-2026",
    "travelClass": "SL",
    "quota": "GN",
    "source": "MAQ",
    "destination": "CBE"
}


const response = await fetch(
      "https://bookmytrain.vercel.app/api/get-real-availability",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          trainNo: trainNo,
          dateOfJourney: date,
          travelClass: coach,
          quota,
          source: fromStnCode,
          destination: toStnCode,
        }),
      }
    );
