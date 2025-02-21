const express = require("express");
const cors = require("cors");
const sequelize = require("./config/database");
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

// Sync Database and Start Server
sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database synced");
  app.listen(PORT, () =>
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  );
});
