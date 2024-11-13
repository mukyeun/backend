const express = require('express');
const router = express.Router();
const Symptom = require('../models/Symptom');
const auth = require('../middleware/auth');
const logger = require('../utils/logger');
const { validate, symptomValidationRules } = require('../middleware/validators/symptomValidator');

/**
 * @swagger
 * /api/symptoms:
 *   get:
 *     summary: 사용자의 모든 증상 조회
 *     tags: [증상]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Symptom'
 *       500:
 *         description: 서버 에러
 */
router.get('/', auth, async (req, res) => {
  try {
    const symptoms = await Symptom.find({ userId: req.userId });
    res.json(symptoms);
  } catch (err) {
    logger.error('증상 조회 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/symptoms/{id}:
 *   get:
 *     summary: ID로 증상 조회
 *     tags: [증상]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 증상 ID
 *     responses:
 *       200:
 *         description: 성공
 *       404:
 *         description: 증상을 찾을 수 없음
 */
router.get('/:id', auth, async (req, res) => {
  try {
    const symptom = await Symptom.findOne({ 
      _id: req.params.id,
      userId: req.userId 
    });
    
    if (!symptom) {
      return res.status(404).json({ message: '증상을 찾을 수 없습니다' });
    }
    
    res.json(symptom);
  } catch (err) {
    logger.error('증상 조회 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/symptoms/user/{userId}:
 *   get:
 *     summary: 특정 사용자의 모든 증상 조회
 *     tags: [증상]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Symptom'
 *       500:
 *         description: 서버 에러
 */
router.get('/user/:userId', auth, async (req, res) => {
  try {
    const symptoms = await Symptom.find({ userId: req.params.userId });
    res.json(symptoms);
  } catch (err) {
    logger.error('증상 조회 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/symptoms:
 *   post:
 *     summary: 새로운 증상 추가
 *     tags: [증상]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - category
 *               - description
 *             properties:
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               severity:
 *                 type: number
 *               duration:
 *                 type: string
 *               notes:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: 증상이 성공적으로 생성됨
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', auth, symptomValidationRules(), validate, async (req, res) => {
  const symptom = new Symptom({
    userId: req.userId,
    category: req.body.category,
    description: req.body.description,
    severity: req.body.severity,
    duration: req.body.duration,
    notes: req.body.notes,
    date: req.body.date || new Date()
  });

  try {
    const newSymptom = await symptom.save();
    logger.info(`새로운 증상 기록: ${req.userId}`);
    res.status(201).json(newSymptom);
  } catch (err) {
    logger.error('증상 생성 실패:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/symptoms/{id}:
 *   put:
 *     summary: 증상 정보 수정
 *     tags: [증상]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 증상 ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Symptom'
 *     responses:
 *       200:
 *         description: 성공적으로 수정됨
 *       400:
 *         description: 잘못된 요청
 */
router.put('/:id', auth, symptomValidationRules(), validate, async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!symptom) {
      return res.status(404).json({ message: '증상을 찾을 수 없습니다' });
    }

    const updatedSymptom = await Symptom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    logger.info(`증상 정보 수정: ${req.params.id}`);
    res.json(updatedSymptom);
  } catch (err) {
    logger.error('증상 수정 실패:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/symptoms/{id}:
 *   delete:
 *     summary: 증상 삭제
 *     tags: [증상]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 증상 ID
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 *       500:
 *         description: 서버 에러
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const symptom = await Symptom.findOne({
      _id: req.params.id,
      userId: req.userId
    });

    if (!symptom) {
      return res.status(404).json({ message: '증상을 찾을 수 없습니다' });
    }

    await Symptom.findByIdAndDelete(req.params.id);
    logger.info(`증상 삭제: ${req.params.id}`);
    res.json({ message: '증상이 삭제되었습니다' });
  } catch (err) {
    logger.error('증상 삭제 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;