const express = require("express");
const router = express.Router();

const user_model = require("../MongoDB/model");

// Create User
router.post("/", async (req, res) => {
  try {
    const create_user = new user_model({
      fullname: req.body.fullname,
      email: req.body.email,
      address: req.body.address,
      message: req.body.message,
    });

    const save_user = await create_user.save();

    res
      .status(200)
      .send({ _message: "Successfully submitted", data: save_user });
  } catch (err) {
    res.status(400).send({ _message: "Failed submission", error: err.message });
  }
});

module.exports = router;
