const multer = require("multer");
const path = require("path");

const userRepository = require("../repositories/user.repository");

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

const imageFilter = (req, file, cb) => {
  // Chỉ chấp nhận tệp có định dạng hình ảnh
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/gif"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

var upload = multer({ storage: storage, fileFilter: imageFilter});

exports.getUserById = async function (req, res, next) {
  const user = await userRepository.findUserById(req.params.id);

  if (user.length === 0) {
    res.status(404).json({
      status: "fail",
      message: "User not found with that id",
    });
  } else {
    res.status(200).json({
      data: user,
    });
  }
};

exports.updateUser = async function (req, res, next) {
  upload.single("profilePicture")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }
    const dataUser = {
      name: req.body.name,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
    };

    if (req.file) {
      let convertedPath = "/" + path.relative("src/public", req.file.path);
      dataUser.profilePicture = convertedPath;
    }
    console.log(req.params.id);
    
    await userRepository.updateUser(req.params.id, dataUser);

    const newUser = await userRepository.findUserById(req.params.id);
    console.log("newUser:", newUser);

    res.status(200).json({
      data: newUser,
    });
  });
};
