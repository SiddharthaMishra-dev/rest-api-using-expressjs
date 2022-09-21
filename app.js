const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/wikiDB");

const wikiSchema = {
  title: String,
  content: String,
};

const Wiki = mongoose.model("wiki", wikiSchema);

app
  .route("/articles")
  .get(function (req, res) {
    Wiki.find(function (err, foundArticles) {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    const newArticle = new Wiki({
      title: req.body.title,
      content: req.body.content,
    });
    newArticle.save(function (err) {
      if (!err) {
        res.send("New article has been added successfully.");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    Wiki.deleteMany(function (err) {
      if (!err) {
        res.send("Successfully deleted all the item!");
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleName")
  .get(function (req, res) {
    Wiki.findOne({ title: req.params.articleName }, function (err, foundItem) {
      if (!err) {
        res.send(foundItem);
      } else {
        res.send("No article found!");
      }
    });
  })
  .put(function (req, res) {
    Wiki.replaceOne(
      { title: req.params.articleName },
      {
        title: req.body.title,
        content: req.body.content,
      },
      function (err) {
        if (!err) {
          res.send("successfully updated the article");
        }
      }
    );
  })
  .patch(function (req, res) {
    Wiki.updateOne(
      { title: req.params.articleName },
      { $set: req.body },
      function (err) {
        if (!err) {
          res.send("Successfully updated the article");
        } else {
          res.send(err);
        }
      }
    );
  })
  .delete(function (req, res) {
    Wiki.deleteOne({ title: req.params.articleName }, function (err) {
      if (!err) {
        res.send("Article has been deleted successfully");
      } else {
        res.send(err);
      }
    });
  });

app.listen(3000, function () {
  console.log("Server has been started on port 3000");
});
