const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a course title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a course description'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Please provide a course price'],
      min: [0, 'Price cannot be negative'],
    },
    previewImages: {
      type: [String],
      default: [],
      validate: {
        validator: function (images) {
          return images.length <= 5;
        },
        message: 'Maximum 5 preview images are allowed.',
      },
    },
    pdfUrl: {
      type: String,
      required: [true, 'Please provide a PDF URL'],
      trim: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// const Course = mongoose.model('Course', courseSchema);

// module.exports = Course;
module.exports = mongoose.model('Course', courseSchema);
