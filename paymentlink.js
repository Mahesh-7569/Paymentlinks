const express = require("express");
const Razorpay = require("razorpay");
const bodyParser = require("body-parser");

const app = express();

// Razorpay API credentials
const razorpayInstance = new Razorpay({
  key_id: "rzp_test_eZdA2CVbz2SCok",  // Replace with your Razorpay Key ID
  key_secret: "uQ0mDYJtI5oUeaNWlgsut4DQ"  // Replace with your Razorpay Key Secret
});

// Middleware
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Razorpay Payment Link Integration");
});

// Create Payment Link Route
app.post("/create-payment-link", async (req, res) => {
  try {
    const { amount, description, customerName, customerEmail } = req.body;

    // Create Razorpay payment link
    const paymentLink = await razorpayInstance.paymentLink.create({
      amount: amount * 100,  // Convert to paise
      currency: "INR",
      description: description,
      customer: {
        name: customerName,
        email: customerEmail,
      },
      notify: {
        email: true,
        sms: true,
      },
      callback_url: "https://yourwebsite.com/callback",
      callback_method: "get",
    });

    // Send payment link to client
    res.json({
      message: "Payment link created successfully",
      paymentLink: paymentLink.short_url,
    });
  } catch (error) {
    console.error("Error creating payment link:", error);
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});





