const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');

// Get all symptoms for a user
router.get('/user/:userId', async (req, res) => {
  try {
    const symptoms = await Symptom.find({ userId: req.params.userId });
    res.json(symptoms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new symptom
router.post('/', async (req, res) => {
  const symptom = new Symptom({
    userId: req.body.userId,
    category: req.body.category,
    description: req.body.description,
    severity: req.body.severity,
    duration: req.body.duration,
    notes: req.body.notes,
    date: req.body.date || new Date()
  });

  try {
    const newSymptom = await symptom.save();
    res.status(201).json(newSymptom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update symptom
router.put('/:id', async (req, res) => {
  try {
    const updatedSymptom = await Symptom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedSymptom);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete symptom
router.delete('/:id', async (req, res) => {
  try {
    await Symptom.findByIdAndDelete(req.params.id);
    res.json({ message: 'Symptom deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
