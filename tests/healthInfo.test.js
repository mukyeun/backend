const request = require('supertest');
const app = require('../server');
const HealthInfo = require('../models/HealthInfo');

describe('Health Info API', () => {
  const sampleHealthInfo = {
    기본정보: {
      이름: '홍길동',
      주민번호: '800101-1234567',
      연락처: '010-1234-5678',
      성별: '남',
      나이: 43,
      키: 175,
      체중: 70,
      BMI: 22.9
    },
    건강정보: {
      혈압: {
        수축기: 120,
        이완기: 80
      },
      혈당: 95,
      체온: 36.5,
      산소포화도: 98
    },
    증상: ['두통', '어지러움'],
    메모: '특이사항 없음'
  };

  describe('POST /api/health-info', () => {
    it('should create new health info', async () => {
      const response = await request(app)
        .post('/api/health-info')
        .send(sampleHealthInfo);

      expect(response.status).toBe(201);
      expect(response.body.기본정보.이름).toBe('홍길동');
      expect(response.body.건강정보.혈압.수축기).toBe(120);
    });
  });

  describe('GET /api/health-info', () => {
    it('should get all health info', async () => {
      // 테스트 데이터 생성
      await HealthInfo.create(sampleHealthInfo);

      const response = await request(app)
        .get('/api/health-info');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBeTruthy();
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/health-info/:id', () => {
    it('should get health info by id', async () => {
      // 테스트 데이터 생성
      const healthInfo = await HealthInfo.create(sampleHealthInfo);

      const response = await request(app)
        .get(`/api/health-info/${healthInfo._id}`);

      expect(response.status).toBe(200);
      expect(response.body.기본정보.이름).toBe('홍길동');
    });

    it('should return 404 if id not found', async () => {
      const response = await request(app)
        .get('/api/health-info/654321654321654321654321');

      expect(response.status).toBe(404);
    });
  });
});