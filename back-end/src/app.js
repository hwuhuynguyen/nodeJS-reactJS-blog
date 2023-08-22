const path = require("path");
const dotenv = require("dotenv");
const express = require("express");
const multer = require("multer");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRouter = require("./routes/auth.routes");
const userRouter = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const commentRoutes = require("./routes/comment.routes");
const viewRoutes = require("./routes/view.routes");
const mainRouter = require("./routes/main.routes");
const connection = require("./config/database.config");

dotenv.config({ path: "../.env" });

connection.connect((err) => {
	if (err) throw err;
	console.log("Connected to the database");
});

connection.query("SELECT id, email FROM users", (err, results) => {
	if (err) throw err;
	console.log(results);
});

const port = process.env.PORT || 3001;

let app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/public/img");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

var upload = multer({ storage: storage });

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

app.use("", viewRoutes);

app.use("/api/v1", mainRouter);

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);

app.post("/api/upload", upload.single("file"), (req, res) => {
	console.log(req.body);
	res.status(200).json("File uploaded successfully");
});

app.all("*", (req, res, next) => {
	res
		.status(404)
		.json({ message: `Cannot find ${req.originalUrl} on this server` });
});

app.listen(port, () => {
	console.log(`App running on port: ${port}`);
});
