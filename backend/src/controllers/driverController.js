// Driver Controller - Developer 3

export const getDrivers = async (req, res, next) => {
  try {
    // TODO: Retrieve drivers from DB
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};

export const createDriver = async (req, res, next) => {
  try {
    // TODO: Add a new driver profile with validation checks
    return res.status(201).json({ message: 'Create driver endpoint template' });
  } catch (error) {
    next(error);
  }
};

export const updateDriver = async (req, res, next) => {
  try {
    // TODO: Update driver profile details
    return res.status(200).json({ message: 'Update driver endpoint template' });
  } catch (error) {
    next(error);
  }
};

export const deleteDriver = async (req, res, next) => {
  try {
    // TODO: Delete a driver profile
    return res.status(200).json({ message: 'Delete driver endpoint template' });
  } catch (error) {
    next(error);
  }
};
