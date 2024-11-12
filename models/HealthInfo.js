const mongoose = require('mongoose');

const healthInfoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  height: { type: Number },
  weight: { type: Number },
  bloodPressure: {
    systolic: { type: Number },
    diastolic: { type: Number }
  },
  bloodSugar: { type: Number },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HealthInfo', healthInfoSchema);
