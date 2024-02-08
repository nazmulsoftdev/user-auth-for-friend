const AsyncHandler = (requestHandler) => async (req, res, next) => {
  try {
    await requestHandler(req, res, next);
  } catch (error) {
    console.log(error.message);
    res.status(error.statusCode || 5000).json({
      success: false,
      message: error.message,
    });
  }
};

export default AsyncHandler;
