const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Info API',
      version: '1.0.0',
      description: '건강 정보 관리 시스템 API 문서',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: '개발 서버',
      },
    ],
    components: {
      schemas: {
        HealthInfo: {
          type: 'object',
          properties: {
            기본정보: {
              type: 'object',
              properties: {
                이름: { type: 'string' },
                주민번호: { type: 'string' },
                연락처: { type: 'string' },
                성별: { type: 'string' },
                나이: { type: 'number' },
                키: { type: 'number' },
                체중: { type: 'number' },
                BMI: { type: 'number' }
              }
            },
            건강정보: {
              type: 'object',
              properties: {
                혈압: {
                  type: 'object',
                  properties: {
                    수축기: { type: 'number' },
                    이완기: { type: 'number' }
                  }
                },
                혈당: { type: 'number' },
                체온: { type: 'number' },
                산소포화도: { type: 'number' }
              }
            },
            증상: {
              type: 'array',
              items: { type: 'string' }
            },
            메모: { type: 'string' },
            userId: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        User: {
          type: 'object',
          properties: {
            username: { type: 'string' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Symptom: {
          type: 'object',
          properties: {
            userId: { type: 'string' },
            category: { type: 'string' },
            description: { type: 'string' },
            severity: { type: 'string' },
            duration: { type: 'string' },
            notes: { type: 'string' },
            date: { type: 'string', format: 'date-time' }
          }
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './models/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;