const mongoose = require('mongoose');

const healthInfoSchema = new mongoose.Schema({
  기본정보: {
    이름: { type: String, required: true },
    주민번호: { type: String, required: true },
    연락처: { type: String, required: true },
    성별: { type: String },
    나이: { type: Number },
    키: { type: Number },
    체중: { type: Number },
    BMI: { type: Number }
  },
  건강정보: {
    혈압: {
      수축기: { type: Number },
      이완기: { type: Number }
    },
    혈당: { type: Number },
    체온: { type: Number },
    산소포화도: { type: Number }
  },
  증상: [{ type: String }],
  메모: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// 인덱스 추가
healthInfoSchema.index({ '기본정보.이름': 1 });
healthInfoSchema.index({ '기본정보.주민번호': 1 }, { unique: true });
healthInfoSchema.index({ createdAt: -1 });

module.exports = mongoose.model('HealthInfo', healthInfoSchema);