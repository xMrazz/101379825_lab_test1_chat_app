const express = require('express');
const { check, validationResult } = require('express-validator');
const GroupMessage = require('../models/GroupMessage');

const router = express.Router();

// Send a message to a group
router.post('/group-message', [
  check('message', 'Message text is required').not().isEmpty(),
  check('room', 'Room name is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { from_user, room, message } = req.body;

  try {
    let groupMessage = new GroupMessage({
      from_user,
      room,
      message
    });

    await groupMessage.save();
    res.status(201).json(groupMessage);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Get messages from a group
router.get('/group-messages/:room', async (req, res) => {
  try {
    const messages = await GroupMessage.find({ room: req.params.room }).sort({ date_sent: 1 });
    res.json(messages);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;