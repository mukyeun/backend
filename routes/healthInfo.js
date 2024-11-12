const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const HealthInfo = require('../models/HealthInfo');
const auth = require('../middleware/auth');

// Get all health info records for a user
router.get('/', auth, async (req, res) => {
  try {
    const healthInfos = await HealthInfo.find({ userId: req.userId });
    res.json(healthInfos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new health info record
router.post('/', auth, async (req, res) => {
  const healthInfo = new HealthInfo({
    userId: req.userId,
    height: req.body.height,
    weight: req.body.weight,
    bloodPressure: {
      systolic: req.body.bloodPressure?.systolic,
      diastolic: req.body.bloodPressure?.diastolic
    },
    bloodSugar: req.body.bloodSugar
  });

  try {
    const newHealthInfo = await healthInfo.save();
    res.status(201).json(newHealthInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update health info record
router.put('/:id', auth, async (req, res) => {
  try {
    const healthInfo = await HealthInfo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.userId
      },
      {
        $set: req.body
      },
      {
        new: true,
        runValidators: true
      }
    );

    if (!healthInfo) {
      return res.status(404).json({ message: 'Health info not found' });
    }

    res.json(healthInfo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
