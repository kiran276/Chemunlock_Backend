const Course = require('../models/Course');

// @desc    Get all public courses (without pdfUrl)
// @route   GET /api/courses
// @access  Public //
const getAllCourses = async (req, res, next) => {
  try {
    const courses = await Course.find()
      .select('-pdfUrl') // Exclude PDF URL from public response
      .populate('teacher', 'name email');

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single course details by ID (without pdfUrl)
// @route   GET /api/courses/:id
// @access  Public
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id)
      .select('-pdfUrl') // Exclude PDF URL from public response
      .populate('teacher', 'name email');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    res.status(200).json({
      success: true,
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new course with preview images
// @route   POST /api/courses
// @access  Private (Teacher only)
const createCourse = async (req, res, next) => {
  try {
    const { title, description, price, pdfUrl } = req.body;

    // Validate required fields
    if (!title || !description || price === undefined || !pdfUrl) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, price, and pdfUrl',
      });
    }

    const previewImages = req.files && Array.isArray(req.files)
      ? req.files.map((file) => `/uploads/previews/${file.filename}`)
      : [];

    const course = await Course.create({
      title,
      description,
      price: Number(price),
      pdfUrl,
      previewImages,
      teacher: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update course details and/or images
// @route   PUT /api/courses/:id
// @access  Private (Teacher + Owner only)
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Verify course ownership
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only edit your own courses',
      });
    }

    const { title, description, price, pdfUrl } = req.body;

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = Number(price);
    if (pdfUrl) course.pdfUrl = pdfUrl;

    // Handle new previewImages if uploaded
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({
          success: false,
          message: 'Maximum 5 preview images are allowed',
        });
      }
      course.previewImages = req.files.map(
        (file) => `/uploads/previews/${file.filename}`
      );
    }

    const updatedCourse = await course.save();

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: updatedCourse,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a course
// @route   DELETE /api/courses/:id
// @access  Private (Teacher + Owner only)
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found',
      });
    }

    // Verify course ownership
    if (course.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own courses',
      });
    }

    await course.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all courses created by the logged-in teacher
// @route   GET /api/courses/teacher/my-courses
// @access  Private (Teacher only)
const getMyCourses = async (req, res, next) => {
  try {
    const courses = await Course.find({ teacher: req.user._id });

    res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
};
