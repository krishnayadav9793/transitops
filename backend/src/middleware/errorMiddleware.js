// Global error handler middleware to prevent stack traces leaking to client

export const errorHandler = (err, req, res, next) => {
  console.error('[SERVER ERROR]:', err.stack || err.message || err);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
};
