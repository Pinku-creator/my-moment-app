const express = require("express");
const app = express();
const port = process.env.PORT || 8080; // <-- use PORT from env
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const methodOverride = require("method-override");
const { log } = require("console");

const multer = require("multer");
const fs = require("fs");

app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // add this

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(methodOverride("_method"));

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});
const upload = multer({ storage: storage });

let posts = [
  {
    id: uuidv4(),
    user: "aanya",
    // profilePic: "https://i.pravatar.cc/150?u=aanya",
    profilePic: "https://api.multiavatar.com/arjun.png",
    imageUrl: "/uploads/Ganeshay.avif",
    caption: "Ganesh Ji ki aarti ✨🙏",
    location: "Mumbai, India",
    likes: 1245,
    mood: "🪔 Spiritual",
  },
  {
    id: uuidv4(),
    user: "rahul",
    profilePic: "https://i.pravatar.cc/150?u=rahul",
    imageUrl: "/uploads/coffeeTime.png",
    caption: "Nothing beats a hot coffee on a lazy morning ☕",
    location: "Bangalore, India",
    likes: 876,
    mood: "☕ Cozy",
  },
  {
    id: uuidv4(),
    user: "zara",
    profilePic: "https://i.pravatar.cc/150?u=zara",
    imageUrl: "/uploads/sunset.avif",
    caption: "Golden hour sunsets are pure magic 🌅",
    location: "Jaipur, India",
    likes: 942,
    mood: "🌅 Dreamy",
  },
  {
    id: uuidv4(),
    user: "mira",
    profilePic: "https://i.pravatar.cc/150?u=mira",
    imageUrl: "/uploads/pizza.avif",
    caption: "Pizza night with friends = happiness 🍕",
    location: "Delhi, India",
    likes: 1103,
    mood: "🍕 Fun",
  },
  {
    id: uuidv4(),
    user: "arjun",
    profilePic: "https://i.pravatar.cc/150?u=arjun",
    imageUrl: "/uploads/winter.png",
    caption: "Winter mornings + blanket + chai = ❤️",
    location: "Shimla, India",
    likes: 789,
    mood: "❄️ Chill",
  },
  {
    id: uuidv4(),
    user: "leo",
    profilePic: "https://i.pravatar.cc/150?u=leo",
    imageUrl: "/uploads/chessGame.png",
    caption: "Intense chess game tonight ♟️",
    location: "Kolkata, India",
    likes: 654,
    mood: "♟️ Focused",
  },
];

app.get("/", (req, res) => {
  res.redirect("/posts"); // root pe jaane se /posts dikhe
});

app.get("/posts", (req, res) => {
  res.render("index.ejs", { posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});
// app.post("/posts", (req, res) => {
//   let { user, imageUrl, caption, likes, location, mood } = req.body;
//   let id = uuidv4();
//   posts.push({ id, user, imageUrl, caption, likes, location, mood });
//   res.redirect("/posts");
// });
app.post("/posts", upload.single("imageFile"), (req, res) => {
  let { user, caption, likes, location, mood } = req.body;
  let id = uuidv4();

  // if image uploaded, save path
  let imageUrl = req.file ? "/uploads/" + req.file.filename : "/default.png";

  posts.push({
    id,
    user,
    imageUrl,
    caption,
    likes,
    location,
    mood,
    profilePic: `https://i.pravatar.cc/150?u=${user}`, // auto profile
  });

  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).send("Post not found!");
  }
  res.render("show.ejs", { post });
});

app.get("/posts/:id/edit", (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);
  res.render("edit.ejs", { post });
});

app.patch("/posts/:id", upload.single("imageFile"), (req, res) => {
  let { id } = req.params;
  let post = posts.find((p) => p.id === id);

  if (!post) return res.status(404).send("Post not found!");

  // Update fields
  if (req.file) {
    post.imageUrl = "/uploads/" + req.file.filename; // use uploaded image path
  } else if (req.body.imageUrl) {
    post.imageUrl = req.body.imageUrl; // fallback to URL
  }

  post.caption = req.body.caption || post.caption;
  post.location = req.body.location || post.location;
  post.likes = req.body.likes || post.likes;
  post.mood = req.body.mood || post.mood;

  res.redirect("/posts");
});

app.delete("/posts/:id", (req, res) => {
  let { id } = req.params;
  posts = posts.filter((p) => p.id != id);
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log("server is working on", port);
});
