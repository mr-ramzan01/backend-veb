const dotenv = require("dotenv");
dotenv.config();
const { connectDB, dbInstance } = require("./config/db");
const http = require("http");
const express = require("express");
let cookieParser = require("cookie-parser");
const cors = require("cors");
const passport = require("./controllers/users/googleAuth/gogleAuth");
const Passport = require("./controllers/users/facebookAuth.js/facebookAuth");
const allRoutes = require("./routes/allRoute");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const getIp = require("./middleware/auth.getIP");
const requestIp = require("request-ip");
const browser = require("browser-detect");
const loginHistoryModel = require("./models/loginHistory.schema");
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

// const { startCronJob } = require("./controllers/sms/smsReport");
const { EmailAutoSend } = require("./auto/EmailAutoSend");

const httpServer = http.createServer(app);
app.use(express.json());

// middlewares
app.use(express.json());
app.use(
  require("express-session")({
    secret: "your_secret_key",
    resave: true,
    saveUninitialized: true,
  })
);
app.set('view engine', 'ejs');
app.use(passport.initialize());
app.use(passport.session());
const corsOptions = {
  origin: ["http://localhost:3000"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use("/api", allRoutes);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  async function (req, res) {
    const clientIp = requestIp.getClientIp(req);
    const result = browser(req.headers["user-agent"]);

    let strtoken = jwt.verify(req.user.token, process.env.SECRETKEY);
    const createHistory = new loginHistoryModel({
      userId: strtoken.id,
      ip: clientIp,
      browser: result.name,
      os: result.os,
      isMobile: result.mobile,
      loginAt: dayjs().format(),
      logoutAt: "",
    });
    await createHistory.save();

    // console.log("user1", req.user);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    res
      .cookie("authToken", req.user.token, {
        expires: expirationDate,
        httpOnly: true,
      })
      .redirect(`${process.env.FRONTEND_URL}signup/verify`);
  }
);

app.get("/auth/facebook", Passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  Passport.authenticate("facebook", { failureRedirect: "/" }),
  async function (req, res) {
    const clientIp = requestIp.getClientIp(req);
    const result = browser(req.headers["user-agent"]);

    let strtoken = jwt.verify(req.user.token, process.env.SECRETKEY);
    const createHistory = new loginHistoryModel({
      userId: strtoken.id,
      ip: clientIp,
      browser: result.name,
      os: result.os,
      isMobile: result.mobile,
      loginAt: dayjs().format(),
      logoutAt: "",
    });
    await createHistory.save();

    // console.log(req.user);
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 3);
    res
      .cookie("authToken", req.user.token, {
        expires: expirationDate,
        httpOnly: true,
      })
      .redirect(`${process.env.FRONTEND_URL}signup/verify`);
  }
);

Passport.serializeUser(function (user, done) {
  done(null, user);
});

Passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.get("/fortest", async (req, res) => {
  res.send({
    msg: "Testing for webhook",
  });
});

// Error Handler middleware Do not Delete ------
app.use(errorHandler);

const startServer = () => {
  httpServer.listen(process.env.PORT || 8000, () => {
    console.log("⚙️  Server is running on port: " + process.env.PORT);
  });
};

const initialize = async () => {
  try {
    await connectDB();
    startServer();
  } catch (err) {
    console.log("Mongo db connect error: ", err);
  }
};

initialize();
