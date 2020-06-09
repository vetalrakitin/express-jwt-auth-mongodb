const db = require("../db");
const User = db.user;

const jwt = require("jsonwebtoken");

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username
  })
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      const passwordIsValid = user.comparePasswordSync(req.body.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      var token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
      });

      res.status(200).send({
        id: user._id,
        username: user.username,
        accessToken: token
      });
    });
};
