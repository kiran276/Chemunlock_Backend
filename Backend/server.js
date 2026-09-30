require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

// Start Server for local/traditional host environments
const startServer = async () => {
  try {
    await connectDB();
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT} (PID: ${process.pid})`);
      });
    }
  } catch (err) {
    console.error('Failed to start server:', err.message);
  }
};

startServer();

module.exports = app;

