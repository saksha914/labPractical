const express = require('express');
const Event = require('../models/Event');
const auth = require('../middleware/auth');
const router = express.Router();
router.get('/', async (req, res) => {
    try {
        const events = await Event.find()
            .populate('creator', 'username')
            .sort({ date: 1 });
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching events', error: error.message });
    }
});

// Create new event
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, date } = req.body;
        const event = new Event({
            title,
            description,
            date,
            creator: req.user.userId,
        });
        await event.save();
        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: 'Error creating event', error: error.message });
    }
});

// Register for an event
router.post('/:eventId/register', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is already registered
        if (event.registeredUsers.includes(req.user.userId)) {
            return res.status(400).json({ message: 'Already registered for this event' });
        }

        event.registeredUsers.push(req.user.userId);
        await event.save();
        res.json({ message: 'Successfully registered for event' });
    } catch (error) {
        res.status(500).json({ message: 'Error registering for event', error: error.message });
    }
});

// Cancel registration
router.delete('/:eventId/cancel/:userId', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Check if user is registered
        const userIndex = event.registeredUsers.indexOf(req.params.userId);
        if (userIndex === -1) {
            return res.status(400).json({ message: 'User not registered for this event' });
        }

        event.registeredUsers.splice(userIndex, 1);
        await event.save();
        res.json({ message: 'Registration cancelled successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error cancelling registration', error: error.message });
    }
});

module.exports = router; 