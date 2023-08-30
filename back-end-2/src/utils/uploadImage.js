const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "src/public/img");
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	},
});

const imageFilter = (req, file, cb) => {
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

var upload = multer({ storage: storage, fileFilter: imageFilter });
