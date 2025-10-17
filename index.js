const express = require("express");
const methodOverride = require("method-override");
const app = express();
const port = 8080;
const path = require("path");
const { v4: uuidv4 } = require("uuid");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use method-override middleware
// Override with the X-HTTP-Method-Override header in the request
app.use(methodOverride("X-HTTP-Method-Override"));

// Or override with POST having ?_method=http-verb in the query string
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

let posts = [];

// The fix is in this route handler
app.get("/posts", (req, res) => {
  // Pass an object where the key 'posts' holds the posts array
  res.render("index", { posts: posts });
});

app.get("/posts/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/posts", (req, res) => {
  let { username, content } = req.body;
  let id = uuidv4();
  posts.push({ id, username, content });
  res.redirect("/posts");
});

app.get("/posts/:id", (req, res) => {
  let id = req.params.id;
  let post = posts.find((p) => id === p.id);
  res.render("show.ejs", { post: post });
});

app.patch("/posts/:id", (req, res) => {
  let { id } = req.params;
  let newContent = req.body.content;
  let post = posts.find((p) => id === p.id);
  if (post) {
    post.content = newContent;
    console.log("Post updated successfully!");
  } else {
    console.log("Post not found!");
  }
  res.redirect("/posts");
});

app.get("/posts/:id/edit", (req, res) => {
  let id = req.params.id;
  let post = posts.find((p) => id === p.id);
  res.render("edit.ejs", { post: post });
});

app.delete("/posts/:id", (req, res) => {
  let id = req.params.id;
  posts = posts.filter((p) => id != p.id);
  res.redirect("/posts");
});

app.listen(port, () => {
  console.log(`Listening to port : ${port}`);
});
