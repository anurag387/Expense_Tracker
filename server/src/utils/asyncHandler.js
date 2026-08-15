// Wraps an async route handler so thrown errors reach Express's error
// handler instead of crashing the process / hanging the request.
export function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
