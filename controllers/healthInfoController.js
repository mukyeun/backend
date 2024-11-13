const HealthInfo = require('../models/HealthInfo');

// 건강 정보 생성
exports.create = async (req, res) => {
  try {
    const healthInfo = new HealthInfo({
      ...req.body,
      userId: req.body.userId
    });
    const savedInfo = await healthInfo.save();
    res.status(201).json(savedInfo);
  } catch (error) {
    res.status(400).json({ 
      message: '건강 정보 저장 실패', 
      error: error.message 
    });
  }
};

// 모든 건강 정보 조회
exports.getAll = async (req, res) => {
  try {
    const userId = req.query.userId;
    const query = userId ? { userId } : {};
    const healthInfos = await HealthInfo.find(query)
      .sort({ createdAt: -1 });
    res.json(healthInfos);
  } catch (error) {
    res.status(500).json({ 
      message: '건강 정보 조회 실패', 
      error: error.message 
    });
  }
};

// 특정 건강 정보 조회
exports.getById = async (req, res) => {
  try {
    const healthInfo = await HealthInfo.findOne({
      _id: req.params.id,
      userId: req.query.userId
    });
    if (!healthInfo) {
      return res.status(404).json({ message: '건강 정보를 찾을 수 없습니다.' });
    }
    res.json(healthInfo);
  } catch (error) {
    res.status(500).json({ 
      message: '건강 정보 조회 실패', 
      error: error.message 
    });
  }
};

// 건강 정보 검색
exports.search = async (req, res) => {
  try {
    const { type, keyword, startDate, endDate, userId } = req.query;
    let query = userId ? { userId } : {};

    if (type && keyword) {
      switch (type) {
        case 'name':
          query['기본정보.이름'] = new RegExp(keyword, 'i');
          break;
        case 'id':
          query['기본정보.주민번호'] = keyword;
          break;
        case 'phone':
          query['기본정보.연락처'] = keyword;
          break;
        case 'symptom':
          query['증상'] = new RegExp(keyword, 'i');
          break;
      }
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const healthInfos = await HealthInfo.find(query)
      .sort({ createdAt: -1 });
      
    res.json(healthInfos);
  } catch (error) {
    res.status(500).json({ 
      message: '건강 정보 검색 실패', 
      error: error.message 
    });
  }
};

// 건강 정보 수정
exports.update = async (req, res) => {
  try {
    const healthInfo = await HealthInfo.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.body.userId
      },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!healthInfo) {
      return res.status(404).json({ message: '건강 정보를 찾을 수 없습니다.' });
    }
    
    res.json(healthInfo);
  } catch (error) {
    res.status(400).json({ 
      message: '건강 정보 수정 실패', 
      error: error.message 
    });
  }
};

// 건강 정보 삭제
exports.delete = async (req, res) => {
  try {
    const healthInfo = await HealthInfo.findOneAndDelete({
      _id: req.params.id,
      userId: req.query.userId
    });
    
    if (!healthInfo) {
      return res.status(404).json({ message: '건강 정보를 찾을 수 없습니다.' });
    }
    
    res.json({ message: '건강 정보가 삭제되었습니다.' });
  } catch (error) {
    res.status(500).json({ 
      message: '건강 정보 삭제 실패', 
      error: error.message 
    });
  }
};