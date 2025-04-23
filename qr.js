const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

const app = express();

// Razorpay API credentials
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_eZdA2CVbz2SCok",  // Replace with your Razorpay Key ID
  key_secret: "uQ0mDYJtI5oUeaNWlgsut4DQ"  // Replace with your Razorpay Key Secret
});

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Razorpay QR Code Integration");
});

app.post("/create-qr-code", async (req, res) => {
  try {
    const { name, amount } = req.body;

    const qrCode = await razorpayInstance.qrCode.create({
      type: "upi_qr",
      name: name || "Test QR Code",
      usage: "single_use",
      fixed_amount: true,
      payment_amount: amount * 100, // in paise
      description: "Payment using QR code",
      close_by: Math.floor(Date.now() / 1000) + 3600, // QR code will expire in 1 hour
    });

    res.json({
      message: "QR code created successfully",
      qr_code_id: qrCode.id,
      qr_image_url: qrCode.image_url,
    });
  } catch (error) {
    console.error("Error creating QR code:", error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
