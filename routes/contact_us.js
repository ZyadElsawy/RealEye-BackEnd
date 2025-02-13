const router = require("express").Router();
const Contacts = require("../models/Contact_us");

router.post("/", async (req, res) => {
  try {
    const contact = await Contacts.create(req.body);
    res.status(201).json({ success: "True" });
  } catch (error) {
    res.status(400).json({ success: "False" });
  }
});

router.get("/", async (req, res) => {
  try {
    const contacts = await Contacts.find();
    res.status(200).json({ success: "True", contacts: contacts });
  } catch (error) {
    res.status(400).json({ success: "False" });
  }
});

module.exports = router;
