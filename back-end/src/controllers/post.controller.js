const multer = require("multer");
const path = require("path");

const postService = require("../service/post.service");
const commentService = require("../service/comment.service");

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

exports.getAllPosts = async function (req, res, next) {
  const date = Date.now();

  const posts = await postService.findAllPosts();

  console.log("Find all: ", Date.now() - date);
  //   const jwt = res.headers['jwt'];
  res.status(200).json({
    status: "success",
    length: posts.length,
    data: posts,
  });
};

exports.getPostById = async function (req, res, next) {
  const time = Date.now();
  const post = await postService.findPostById(req.params.id);
  if (post.length === 0) {
    return res.status(404).json({
      status: "fail",
      message: "Post not found with that ID",
    });
  }
  const comments = await commentService.findAllCommentsByPost(req.params.id);
  console.log(comments);
  console.log("Time to find post by ID: ", Date.now() - time);
  res.status(200).json({
    status: "success",
    data: post,
  });
};

exports.getAllPostsByUserId = async function (req, res, next) {
  const posts = await postService.getPostsByUser({ author: req.params.userId });

  res.status(200).json({
    status: "success",
    length: posts.length,
    data: posts,
  });
};

exports.createPost = async function (req, res, next) {
  if (!req.body.author) req.body.author = req.user.id;
  console.log(req.body);

  upload.single("postPicture")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }

    let convertedPath = "/" + path.relative("src/public", req.file.path);

    const post = await postService.addNewPost({
      title: req.body.title,
      content: req.body.content,
      postPicture: convertedPath,
      author: req.user.id,
    });
    res.status(200).json({
      post
    })

    // res.redirect("/view/posts");
  });
};

exports.updatePost = async function (req, res, next) {
  upload.single("postPicture")(req, res, async (err) => {
    if (err) {
      // Handle the error if the file upload fails
      console.error(err);
      return next(err);
    }

    let convertedPath = "/" + path.relative("src/public", req.file.path);

    const post = await postService.updatePostById(req.params.id, {
      title: req.body.title,
      content: req.body.content,
      postPicture: convertedPath,
      author: req.body.author,
    });
    // res.redirect("/view/posts");

    res.status(200).json({
      post
    })
  });
};
