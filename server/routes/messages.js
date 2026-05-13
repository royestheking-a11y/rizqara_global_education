const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper to get user ID from token
const getUserId = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

// Get all messages for current user (either as sender or receiver)
router.get('/', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all conversations (grouped by student)
router.get('/admin/conversations', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    // This is a simplified version. For a real app, we'd use aggregation.
    const allMessages = await Message.find()
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .sort({ createdAt: -1 });

    // Group by student ID
    const conversations = {};
    allMessages.forEach(msg => {
      const student = msg.isAdmin ? msg.receiver : msg.sender;
      if (!student) return;
      const studentId = student._id.toString();
      if (!conversations[studentId]) {
        conversations[studentId] = {
          student: student,
          lastMessage: msg,
          unreadCount: 0
        };
      }
      if (!msg.isRead && !msg.isAdmin && msg.receiver && msg.receiver._id && msg.receiver._id.toString() === userId.toString()) {
        conversations[studentId].unreadCount++;
      }
    });

    res.json(Object.values(conversations));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get specific student conversation
router.get('/admin/:studentId', async (req, res) => {
  const adminId = getUserId(req);
  const { studentId } = req.params;
  if (!adminId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const messages = await Message.find({
      $or: [
        { sender: adminId, receiver: studentId },
        { sender: studentId, receiver: adminId }
      ]
    })
    .populate('sender', 'name email')
    .populate('receiver', 'name email')
    .sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Send a message
router.post('/', async (req, res) => {
  const senderId = getUserId(req);
  if (!senderId) return res.status(401).json({ message: 'Unauthorized' });

  let { receiverId, content, isAdmin, toAdmin } = req.body;

  try {
    // If toAdmin is true, find an admin user to receive the message
    if (toAdmin && !receiverId) {
      const admin = await User.findOne({ role: 'admin' });
      if (!admin) return res.status(404).json({ message: 'No admin found' });
      receiverId = admin._id;
    }

    if (!receiverId) return res.status(400).json({ message: 'Receiver required' });

    const message = new Message({
      sender: senderId,
      receiver: receiverId,
      content,
      isAdmin: isAdmin || false
    });

    const savedMsg = await message.save();
    const populatedMsg = await Message.findById(savedMsg._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email');
      
    res.status(201).json(populatedMsg);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Mark as read
router.put('/read/:senderId', async (req, res) => {
  const userId = getUserId(req);
  if (!userId) return res.status(401).json({ message: 'Unauthorized' });

  try {
    await Message.updateMany(
      { sender: req.params.senderId, receiver: userId, isRead: false },
      { isRead: true }
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
