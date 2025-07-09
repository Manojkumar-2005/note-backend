const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Root route for health check
app.get("/", (req, res) => {
  res.send("✅ Backend is running successfully!");
});

// ✅ Example API route
app.get("/api/notes", (req, res) => {
  res.json([{ id: 1, title: "Test Note", content: "This is a test" }]);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
