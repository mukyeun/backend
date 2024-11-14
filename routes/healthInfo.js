const express = require('express');
const router = express.Router();
const healthInfoController = require('../controllers/healthInfoController');
const auth = require('../middleware/auth');
const { validate, healthInfoValidationRules } = require('../middleware/validators/healthInfoValidator');
const logger = require('../utils/logger');

/**
 * @swagger
 * /api/health-info:
 *   post:
 *     summary: 새로운 건강 정보 생성
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthInfo'
 *     responses:
 *       201:
 *         description: 건강 정보가 성공적으로 생성됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/HealthInfo'
 *       400:
 *         description: 잘못된 요청
 *       401:
 *         description: 인증 실패
 */
router.post('/', auth, healthInfoValidationRules(), validate, healthInfoController.create);

/**
 * @swagger
 * /api/health-info:
 *   get:
 *     summary: 모든 건강 정보 조회
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userId
 *         schema:
 *           type: string
 *         description: 사용자 ID로 필터링
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HealthInfo'
 *       401:
 *         description: 인증 실패
 */
router.get('/', auth, healthInfoController.getAll);

/**
 * @swagger
 * /api/health-info/search:
 *   get:
 *     summary: 건강 정보 검색
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [name, id, phone, symptom]
 *         description: 검색 유형
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 시작 날짜
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: 종료 날짜
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/HealthInfo'
 *       401:
 *         description: 인증 실패
 */
router.get('/search', auth, healthInfoController.search);

/**
 * @swagger
 * /api/health-info/{id}:
 *   get:
 *     summary: 특정 건강 정보 조회
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: 건강 정보 ID
 *     responses:
 *       200:
 *         description: 성공
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/HealthInfo'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.get('/:id', auth, healthInfoController.getById);

/**
 * @swagger
 * /api/health-info/{id}:
 *   put:
 *     summary: 건강 정보 수정
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthInfo'
 *     responses:
 *       200:
 *         description: 성공적으로 수정됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   $ref: '#/components/schemas/HealthInfo'
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.put('/:id', auth, healthInfoValidationRules(), validate, healthInfoController.update);

/**
 * @swagger
 * /api/health-info/{id}:
 *   delete:
 *     summary: 건강 정보 삭제
 *     tags: [건강정보]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: 건강정보가 성공적으로 삭제되었습니다
 *       401:
 *         description: 인증 실패
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.delete('/:id', auth, healthInfoController.delete);

module.exports = router;