export class ResponseFactory {
  static success(res, data = null, message = 'Success', statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, errorCode = 'INTERNAL_ERROR') {
    return res.status(statusCode).json({
      success: false,
      message,
      code: errorCode
    });
  }
}
