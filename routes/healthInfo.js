const express = require('express');
const router = express.Router();
const healthInfoController = require('../controllers/healthInfoController');

/**
 * @swagger
 * /api/health-info:
 *   post:
 *     summary: 새로운 건강 정보 생성
 *     tags: [건강정보]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HealthInfo'
 *     responses:
 *       201:
 *         description: 건강 정보가 성공적으로 생성됨
 *       400:
 *         description: 잘못된 요청
 */
router.post('/', healthInfoController.create);

/**
 * @swagger
 * /api/health-info:
 *   get:
 *     summary: 모든 건강 정보 조회
 *     tags: [건강정보]
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
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/HealthInfo'
 */
router.get('/', healthInfoController.getAll);

/**
 * @swagger
 * /api/health-info/search:
 *   get:
 *     summary: 건강 정보 검색
 *     tags: [건강정보]
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
 */
router.get('/search', healthInfoController.search);

/**
 * @swagger
 * /api/health-info/{id}:
 *   get:
 *     summary: 특정 건강 정보 조회
 *     tags: [건강정보]
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
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.get('/:id', healthInfoController.getById);

/**
 * @swagger
 * /api/health-info/{id}:
 *   put:
 *     summary: 건강 정보 수정
 *     tags: [건강정보]
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
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.put('/:id', healthInfoController.update);

/**
 * @swagger
 * /api/health-info/{id}:
 *   delete:
 *     summary: 건강 정보 삭제
 *     tags: [건강정보]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 성공적으로 삭제됨
 *       404:
 *         description: 정보를 찾을 수 없음
 */
router.delete('/:id', healthInfoController.delete);

module.exports = router;