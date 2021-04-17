import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AWS from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

import UserModal from "../models/User.js";

export const signin = async (req, res) => {
  if (req.body.email.trim() === "") {
    return res.status(400).json({ email: "Should not be empty" });
  } else {
    const regEx = /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
    if (!req.body.email.trim().match(regEx)) {
      return res.status(400).json({ email: "Enter a valid email" });
    }
  }
  if (req.body.password.trim() === "") {
    return res.status(400).json({ password: "Should not be empty" });
  }
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    if (!oldUser) {
      return res.status(404).json({ message: "User doesn't exist" });
    }
    const isPassCorrect = await bcrypt.compare(
      req.body.password,
      oldUser.password
    );
    if (!isPassCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign(
      { email: oldUser.email, id: oldUser.id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(err);
  }
};

export const signupWithoutFile = async (req, res) => {
  console.log(req.body);
  if (req.body.email.trim() === "") {
    return res.status(400).json({ email: "Should not be empty" });
  } else {
    const regEx = /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
    if (!req.body.email.trim().match(regEx)) {
      return res.status(400).json({ email: "Enter a valid email" });
    }
  }
  if (req.body.password.trim() === "") {
    return res.status(400).json({ password: "Should not be empty" });
  } else if (req.body.password.trim().length < 6) {
    return res.status(400).json({ password: "Should be atleast 6 characters" });
  }
  if (req.body.confirmPassword.trim() === "") {
    return res.status(400).json({ confirmPassword: "Should not be empty" });
  } else if (req.body.password.trim() !== req.body.confirmPassword.trim()) {
    return res.status(400).json({ confirmPassword: "Password mismatch" });
  }
  try {
    const oldUser = await UserModal.findOne({ email: req.body.email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const result = await UserModal.create({
      email: req.body.email,
      password: hashedPassword,
      profile: req.body.profile,
      isAdmin: "true" === req.body.isAdmin,
    });
    const token = jwt.sign(
      { email: result.email, id: result.id },
      process.env.SECRET,
      { expiresIn: "1h" }
    );
    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

export const signup = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  if (req.body.Email.trim() === "") {
    return res.status(400).json({ email: "Should not be empty" });
  } else {
    const regEx = /^([0-9a-zA-Z]([-.w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-w]*[0-9a-zA-Z].)+[a-zA-Z]{2,9})$/;
    if (!req.body.Email.trim().match(regEx)) {
      return res.status(400).json({ email: "Enter a valid email" });
    }
  }
  if (req.body.Password.trim() === "") {
    return res.status(400).json({ password: "Should not be empty" });
  } else if (req.body.Password.trim().length < 6) {
    return res.status(400).json({ password: "Should be atleast 6 characters" });
  }
  if (req.body.confirmpassword.trim() === "") {
    return res.status(400).json({ confirmPassword: "Should not be empty" });
  } else if (req.body.Password.trim() !== req.body.confirmpassword.trim()) {
    return res.status(400).json({ confirmPassword: "Password mismatch" });
  }
  try {
    const oldUser = await UserModal.findOne({ email: req.body.Email });
    if (oldUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(req.body.Password, 12);
    const s3FileUrl = process.env.FILE_URL;
    const s3Bucket = new AWS.S3({
      accessKeyId: process.env.ACCESS_KEY,
      secretAccessKey: process.env.SECRET_KEY,
      region: process.env.REGION,
    });
    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: req.body.Email,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: "public-read",
    };
    s3Bucket.upload(params, async (err, data) => {
      if (err) {
        res.status(500).json({ error: true, Message: err });
      } else {
        const result = await UserModal.create({
          email: req.body.Email,
          password: hashedPassword,
          profile: s3FileUrl + params.Key,
          s3Key: params.Key,
          isAdmin: "true" === req.body.usertype,
        });
        const token = jwt.sign(
          { email: result.email, id: result.id },
          process.env.SECRET,
          { expiresIn: "1h" }
        );
        res.status(201).json({ result, token });
      }
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
