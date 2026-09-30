const teacherOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'teacher') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Teacher role required',
    });
  }
  next();
};

const studentOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: 'Access denied: Student role required',
    });
  }
  next();
};

module.exports = {
  teacherOnly,
  studentOnly,
};
