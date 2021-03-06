const aws = require("aws-sdk");
const { nanoid } = require("nanoid");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const db = require("../utils/db");
const ProfileCollection = require("../Collections/ProfileCollection");
require("dotenv").config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const s3 = new aws.S3({});

exports.create = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await db("users AS u")
      .where({ email })
      .first();
    if (!user) {
      return res.status(404).send("User does not exist");
    }
    const profile = await db("profiles AS p")
      .join("users AS u", "u.id", "=", "p.userId")
      .where({ email, teamId: req.team.id })
      .first();
    if (profile) {
      return res.status(403).send("Profile already exists");
    }
    const id = await db("profiles AS p")
      .insert({
        userId: user.id,
        teamId: req.team.id,
        shortid: nanoid(14),
        fullName: email.split("@")[0],
      })
      .returning("id")
      .then((row) => row[0]);
    const confirmation = jwt.sign({ id }, process.env.ACCESS_SECRET_TOKEN);
    const url = `${req.protocol}://${req.get("host")}/api/teams/${
      req.team.shortid
    }/profiles/confirmation/${confirmation}`;
    const mailOptions = {
      to: email,
      from: process.env.EMAIL,
      subject: `Join ${req.team.name}`,
      html: `Click this to join team <a href=${url}>${url}</a>`,
    };
    await sgMail.send(mailOptions);
    return res.status(200).send("User has been sent a confirmation email");
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};

exports.update = async (req, res) => {
  const { fullName, displayName, role } = req.body;
  try {
    const profile = await db("profiles")
      .where("id", req.profile.id)
      .update({ fullName, displayName, role })
      .returning("*")
      .then((row) => row[0]);
    return res.status(200).send({ profile: ProfileCollection(profile) });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.photo = async (req, res) => {
  try {
    const { avatar } = await db("profiles")
      .select("avatar")
      .where("userId", req.user.id)
      .andWhere("teamId", req.team.id)
      .first();
    if (avatar !== "https://flack611.s3.amazonaws.com/images/nightsky.jpg") {
      await s3
        .deleteObject({
          Bucket: "flack611",
          Key: `${decodeURIComponent(
            avatar
              .split("/")
              .slice(3, 5)
              .join("/")
          )}`,
        })
        .promise();
    }
    const profile = await db("profiles")
      .where({ userId: req.user.id, teamId: req.team.id })
      .update({ avatar: req.file.location })
      .returning("*")
      .then((row) => row[0]);
    return res.status(200).send({ profile: ProfileCollection(profile) });
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.confirmation = async (req, res) => {
  const { token } = req.params;
  try {
    const { id } = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
    await db("profiles")
      .update({ confirmed: true })
      .where({ id });
    return res.status(200).send("You have successfully joined team");
  } catch (err) {
    return res.status(500).send(err);
  }
};

exports.delete = async (req, res) => {
  const { profileId: id } = req.params;
  try {
    await db("profiles")
      .where({ id })
      .del();
    return res.status(200).send({ id });
  } catch (err) {
    return res.status(500).send(err);
  }
};
