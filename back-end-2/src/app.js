const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const mainRouter = require("./routes/main.routes");
const sequelize = require("./config/database.config");

dotenv.config({ path: "../.env" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.error("Could not connect to the database", err);
  });

const port = process.env.PORT || 3001;

let app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");

	// Request methods you wish to allow
	res.setHeader("Access-Control-Allow-Methods", "POST");

	// Request headers you wish to allow
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader("Access-Control-Allow-Credentials", true);

	next();
});

app.use("/api/v1", mainRouter);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRoutes);

app.all("*", (req, res, next) => {
  res
    .status(404)
    .json({ message: `Cannot find ${req.originalUrl} on this server` });
});

app.listen(port, () => {
  console.log(`App running on port: ${port}`);
});
