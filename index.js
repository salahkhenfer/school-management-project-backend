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

// Uncomment these lines when you have the routes implemented
// app.use("/check_Auth", require("./Routes/Auth/check_Auth"));
// app.use("/Login", require("./Routes/Auth/Login"));
// app.use("/Logout", require("./Routes/Auth/Logout"));
app.use("/auth", require("./Routes/authRouter"));
// handel errors
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