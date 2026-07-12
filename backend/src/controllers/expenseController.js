// Expenses & Fuel Logs Controller - Developer 3

export const getFuelLogs = async (req, res, next) => {
  try {
    // TODO: Retrieve fuel logs
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};

export const createFuelLog = async (req, res, next) => {
  try {
    // TODO: Create a fuel log record
    return res.status(201).json({ message: 'Create fuel log template' });
  } catch (error) {
    next(error);
  }
};

export const getExpenses = async (req, res, next) => {
  try {
    // TODO: Retrieve general expense entries
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};

export const createExpense = async (req, res, next) => {
  try {
    // TODO: Create a general expense record
    return res.status(201).json({ message: 'Create expense template' });
  } catch (error) {
    next(error);
  }
};
