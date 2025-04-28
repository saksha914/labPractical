const express = require('express');
const User = require('../models/User');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/:userId/events', auth, async (req, res) => {
    try {
        const events = await Event.find({
            registeredUsers: req.params.userId
        })
            .populate('creator', 'username')
            .sort({ date: 1 });

        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user events', error: error.message });
    }
});

module.exports = router; 