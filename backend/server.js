const express = require("express");
const { PrismaClient } = require("./generated/prisma");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Allow frontend to access backend
app.use(express.json()); // Parse JSON requests

//Route to send email to all users
app.post("/api/send-email", async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { email: true } });

    if (!users.length) return res.status(404).json({ error: "No users found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        // get the email and password from env
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email to each user
    for (const user of users) {
      await transporter.sendMail({
        from: "Replace this with the location (RDP)",
        to: user.email,
        subject: "Hello from Wayfinder",
        text: "It works!",
      });
    }

    res.json({ success: true, emailsSent: users.map((u) => u.email) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// 5. Start server
app.listen(5000, () => console.log("Server running on port 5000"));
