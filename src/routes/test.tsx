import * as express from "express";

const router = express.Router();

/* GET home page. */
router.get("/test", function (req, res, next) {
  res.render("test", {
    title: "This Server is running!",
  });
});

module.exports = router;
