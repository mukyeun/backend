const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { validate, registerValidationRules, loginValidationRules } = require('../middleware/validators/userValidator');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 조회
 *     tags: [사용자]
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: 서버 에러
 */
router.get('/', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    logger.error('사용자 조회 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: 새로운 사용자 등록
 *     tags: [사용자]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *               - name
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: 사용자가 성공적으로 등록됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       400:
 *         description: 잘못된 요청
 */
router.post('/register', registerValidationRules(), validate, async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
      name: req.body.name
    });
    
    const newUser = await user.save();
    
    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    logger.info(`새로운 사용자 등록: ${newUser.email}`);
    res.status(201).json({ user: newUser, token });
  } catch (err) {
    logger.error('사용자 등록 실패:', err);
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: 사용자 로그인
 *     tags: [사용자]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: 로그인 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 token:
 *                   type: string
 *       401:
 *         description: 인증 실패
 */
router.post('/login', loginValidationRules(), validate, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: '이메일 또는 비밀번호가 잘못되었습니다' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    logger.info(`사용자 로그인: ${user.email}`);
    res.json({
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        name: user.name
      },
      token
    });
  } catch (err) {
    logger.error('로그인 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: 사용자 프로필 조회
 *     tags: [사용자]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: 인증되지 않은 접근
 *       500:
 *         description: 서버 에러
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    logger.error('프로필 조회 실패:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;