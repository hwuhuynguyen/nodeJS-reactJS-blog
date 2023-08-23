const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");

const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const userService = require("../service/user.service");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/img");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, uniqueSuffix + "." + fileExtension);
  },
});

var upload = multer({ storage: storage });

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user.id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.cookie("jwt", token, cookieOptions);
  console.log("jwt token created successfully");

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  upload.single("profilePicture")(req, res, async (err) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    let newUser;
    if (req.file !== undefined) {
      let convertedPath = "/" + path.relative("src/public", req.file.path);

      newUser = await userService.addNewUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        profilePicture: convertedPath,
        dateOfBirth: req.body.dateOfBirth,
      });
    } else {
      newUser = await userService.addNewUser({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        gender: req.body.gender,
        dateOfBirth: req.body.dateOfBirth,
      });
    }

    const row = await userService.findUserByEmail(req.body.email);
    // Convert the RowDataPacket object to JSON string and then parse it
    const rowJson = JSON.stringify(row);
    newUser = JSON.parse(rowJson)[0];
    console.log(newUser);

    this.createSendToken(newUser, 201, res);
  });
});

exports.login = catchAsync(async (req, res, next) => {
  console.log("POSTID: ", req.postId);
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Please provide email and password!"), 400);
  }
  const row = await userService.findUserByEmail(email).catch((err) => {});
  if (row?.length > 0) {
    // Convert the RowDataPacket object to JSON string and then parse it
    const rowJson = JSON.stringify(row);
    const user = JSON.parse(rowJson)[0];
    if (user.length === 0 || user.password !== password) {
      return next(new AppError("Incorrect username or password!"), 401);
    }
    this.createSendToken(user, 200, res);
  } else {
    return next(new AppError("Incorrect username or password!"), 401);
  }
});

exports.logout = catchAsync(async (req, res, next) => {
  const cookieOptions = {
    expires: new Date(Date.now()),
    httpOnly: true,
  };
  res.cookie("jwt", "log-out", cookieOptions);
  res.clearCookie("jwt");
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do not have permission to perform this action."),
        403
      );
    }
    next();
  };

exports.protect = catchAsync(async (req, res, next) => {
  const date = Date.now();
  // 1. Getting token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }
  console.log("token: " + token);
  // 2. Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3. Check if the user still exists
  const row = await userService.findUserById(decoded.id).catch(err => {});
  if (row?.length > 0) {
    // Convert the RowDataPacket object to JSON string and then parse it
    const rowJson = JSON.stringify(row);
    const currentUser = JSON.parse(rowJson)[0];

    // GRANT ACCESS TO PROTECTED ROUTE
    res.locals.user = currentUser;
    req.user = currentUser;
    console.log("Auth: ", Date.now() - date);
    console.log("User:", req.user);
  } else {
    return next(
      new AppError(
        "The user belonging to this token does no longer exist!",
        401
      )
    );
  }
  next();
});

exports.isLoggedIn = async (req, res, next) => {
  try {
    // 1. Getting token and check if it's there
    let token = req.cookies.jwt;

    if (!token) {
      return next();
    }
    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3. Check if the user still exists
    const row = await userService.findUserById(decoded.id);
    if (row.length > 0) {
      // Convert the RowDataPacket object to JSON string and then parse it
      const rowJson = JSON.stringify(row);
      const currentUser = JSON.parse(rowJson)[0];
      console.log("User:", currentUser);
      if (!currentUser) {
        return next();
      }
      // GRANT ACCESS TO PROTECTED ROUTE
      res.locals.user = currentUser;
      req.user = currentUser;
    }
    return next();
  } catch (err) {
    next();
  }
};

exports.checkLoggedIn = async (req, res, next) => {
  let token = req.cookies.jwt;

  if (!token) {
    return next();
  } else {
    res.redirect("/view/home-page");
  }
};

exports.showLoginPage = (req, res, next) => {
  res.render("auth/login");
};

exports.showRegisterPage = (req, res, next) => {
  res.render("auth/register");
};
