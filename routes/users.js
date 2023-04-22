var express = require("express");
var router = express.Router();
const { UserModel } = require("../schemas/userSchema");
const mongoose = require("mongoose");
const { dbURL } = require("../common/dbConfig");
const { hashPassword, hashCompare, createToken, validate, roleAdminGuard } = require("../common/auth");

mongoose.connect(dbURL);

/* GET users listing. */

//POST
router.post("/signup", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      let hashedPassword = await hashPassword(req.body.password);
      req.body.password = hashedPassword;

      let user = await UserModel.create(req.body);

      res.status(201).send({ message: "User SignedUp Successfully" });
    } else {
      res.status(400).send({ message: "User Already Exists" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//signin
router.post("/login", async (req, res) => {
  try {
    let user = await UserModel.findOne({ email: req.body.email });
    if (user) {
      if (await hashCompare(req.body.password, user.password)) {
        let token= await createToken({
          name:user.name,
          email:user.email,
          id:user._id,
          role:user.role
        })
        res.status(200).send({token , message: "User Logged In Successfully" });
      }
    } else {
      res.status(402).send({ message: "Invalid Credentials" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//GET ALL
router.get("/", validate, roleAdminGuard ,async (req, res) => {
  try {
    let users = await UserModel.find();
    res.status(200).send({
      users,
      message: "Users Data Fetch Successfully",
    });
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//GET BY ID
router.get("/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    if (user) {
      res.status(200).send({
        user,
        message: "User Data Fetch Successfully",
      });
    } else {
      res.status(400).send({
        user,
        message: "Invalid id",
      });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//PUT
router.put("/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    console.log(user);
    if (user) {
      user.name = req.body.name;
      user.email = req.body.email;
      user.password = req.body.password;

      await user.save();

      res.status(200).send({ message: "User Updated Successfully" });
    } else {
      res.status(400).send({ message: "Invalid Exists" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

//DELETE BY ID
router.delete("/:id", async (req, res) => {
  try {
    let user = await UserModel.findOne({ _id: req.params.id });
    console.log(user);
    if (user) {
      let user = await UserModel.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: "User Deleted Successfully" });
    } else {
      res.status(400).send({ message: "User Doesn't Exists" });
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = router;
