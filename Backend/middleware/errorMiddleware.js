const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  let status = res.statusCode === 200 ? 500 : res.statusCode;

  if (err.name === "ValidationError") {
    status = 400;
  }

  if (err.name === "CastError") {
    status = 400;
  }

  if (err.code === 11000) {
    status = 409;
  }

  if (err.name === "MulterError") {
    status = 400;
  }

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

module.exports = { notFound, errorHandler };