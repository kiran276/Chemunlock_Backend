const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
} = require('../controllers/courseController');
const { verifyToken } = require('../middleware/authMiddleware');
const { teacherOnly } = require('../middleware/roleMiddleware');
const { uploadCourseImages } = require('../middleware/uploadMiddleware');

// Public Course Routes
router.get('/', getAllCourses);

// Teacher Course Routes (Defined before /:id)
router.get('/teacher/my-courses', verifyToken, teacherOnly, getMyCourses);

// Public Single Course Details
router.get('/:id', getCourseById);

// Teacher CRUD Routes
router.post('/', verifyToken, teacherOnly, uploadCourseImages, createCourse);
router.put('/:id', verifyToken, teacherOnly, uploadCourseImages, updateCourse);
router.delete('/:id', verifyToken, teacherOnly, deleteCourse);

module.exports = router;
