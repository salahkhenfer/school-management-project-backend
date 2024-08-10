const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const sequelize = require("./config/db");
const { notFound, handelError } = require("./Middlewares/error");
require("dotenv").config();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error(`Not allowed by CORS, origin: ${origin}`));
    }
  },
  optionsSuccessStatus: 200,
  credentials: true, // Allow credentials
};

const credentials = (req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Credentials", true);
  }
  next();
};

app.use(cookieParser());
app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World from Db");
});

app.use("/api/auth", require("./Routes/authRoutes"));
app.use("/api/students", require("./Routes/studentRoutes"));
app.use("/api/languages", require("./Routes/languagesRoutes"));
app.use("/api/groups", require("./Routes/groupRoutes"));
app.use("/api/teachers", require("./Routes/teacherRouter"));
app.use("/api/schedules", require("./Routes/scheduleRouters"));
app.use("/api/courses", require("./Routes/courseRoutes"));
app.use("/api/parents", require("./Routes/parentRoutes"));
app.use("/api/payments", require("./Routes/paymentRoutes"));
app.use("/api/paymentTeacher", require("./Routes/paymentTeacherRoutes"));
app.use("/api/paymentEmployer", require("./Routes/PaymentEmployerRouters"));
app.use("/api/permissions", require("./routes/permissionRoutes"));
app.use("/api", require("./Routes/protectedRoutes"));

//error handling middleware
app.use(notFound);
app.use(handelError);

// Sync the models and start the server
sequelize
  .sync()
  .then(() => {
    app.listen(3000, () => {
      console.log(`Server is running on port ${3000}`);
    });
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });
