
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const path = require("path");
const { connectDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const incomeRoutes = require("./routes/incomeRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();



app.use(cors({
  origin: "http://localhost:5173",       // → Vite React app’inin gerçek adresi
  methods: ["GET","POST","PUT","DELETE","OPTIONS"],
  credentials: true,                     // Access-Control-Allow-Credentials: true
  allowedHeaders: ["Content-Type","Authorization"],
}));

connectDB();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/income", incomeRoutes);
app.use("/api/v1/expense", expenseRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);

//server uploaded files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
});
