const express = require("express");
const User = require("../Models/User");
const Message = require("../Models/Message");
const router = express.Router();
// Function to send a message to all admins and sub-admins
async function sendMessage(senderId, content) {
  try {
    const sender = await User.findByPk(senderId);

    if (!sender) {
      throw new Error("Sender not found");
    }

    const message = await Message.create({
      content,
      senderId,
    });

    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

// Function to get all messages
async function getAllMessages(userRole) {
  try {
    let whereClause = {};

    const messages = await Message.findAll({
      where: whereClause,
      include: [{ model: User, as: "Sender" }],
      order: [["createdAt", "DESC"]],
    });

    return messages;
  } catch (error) {
    console.error("Error retrieving messages:", error);
    throw error;
  }
}
// Middleware to check if user is authenticated and attach role
// This is a placeholder - replace with your actual authentication middleware
// Route to send a message
router.post("/send", async (req, res) => {
  try {
    const { content, id } = req.body;
    const message = await sendMessage(id, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Route to get all messages
router.get("/all", async (req, res) => {
  try {
    const messages = await getAllMessages();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
