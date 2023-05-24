const ctrlWrapper = (ctrl) => {
  const creatingWrapper = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      next(error);
    }
  };

  return creatingWrapper;
};

module.exports = ctrlWrapper;


