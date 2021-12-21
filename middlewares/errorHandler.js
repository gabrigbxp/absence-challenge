module.exports.errorHandler = fn => (req, res, next) =>
  fn(req, res, next)
    .catch(error => next(error))

module.exports.errorUse = (err, _req, res, _next) => {
  res.status(err.code && err.code < 600 ? err.code : 500).json({
    status: 'error',
    message: err.message,
  })
}
