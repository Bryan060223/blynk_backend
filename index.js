import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 3000;  // ✅ use Railway's port

// Use Railway environment variable instead of hardcoding the token
const BLYNK_TOKEN = process.env.BLYNK_TOKEN;

// Middleware
app.use(express.json());

// Root
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Status route
app.get("/status", (req, res) => {
  res.json({ status: "ok", message: "Server connected successfully" });
});

// ✅ Get data from Blynk
app.get("/blynk/get/:pin", async (req, res) => {
  const pin = req.params.pin;
  try {
    const response = await axios.get(
      `https://blynk.cloud/external/api/get?token=${BLYNK_TOKEN}&V${pin}`
    );
    res.json({ pin: `V${pin}`, value: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to get data from Blynk" });
  }
});

// ✅ Set data in Blynk
app.post("/blynk/set/:pin", async (req, res) => {
  const pin = req.params.pin;
  const { value } = req.body;
  try {
    await axios.get(
      `https://blynk.cloud/external/api/update?token=${BLYNK_TOKEN}&V${pin}=${value}`
    );
    res.json({ pin: `V${pin}`, value: value, status: "updated" });
  } catch (error) {
    res.status(500).json({ error: "Failed to set data in Blynk" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
