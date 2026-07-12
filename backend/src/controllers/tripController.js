// Trip Controller - Developer 4

export const getTrips = async (req, res, next) => {
  try {
    // TODO: Retrieve trips
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};

export const createTrip = async (req, res, next) => {
  try {
    // TODO: Create a new draft trip
    return res.status(201).json({ message: 'Create trip template' });
  } catch (error) {
    next(error);
  }
};

export const dispatchTrip = async (req, res, next) => {
  try {
    // TODO: Enforce validations (vehicle availability, driver license status, cargo capacity)
    // and transition driver/vehicle status to "On Trip"
    return res.status(200).json({ message: 'Dispatch trip template' });
  } catch (error) {
    next(error);
  }
};

export const completeTrip = async (req, res, next) => {
  try {
    // TODO: Transition to "Completed", record final odometer and fuel logs,
    // and restore driver and vehicle status to "Available"
    return res.status(200).json({ message: 'Complete trip template' });
  } catch (error) {
    next(error);
  }
};

export const cancelTrip = async (req, res, next) => {
  try {
    // TODO: Cancel trip and restore driver/vehicle status to "Available"
    return res.status(200).json({ message: 'Cancel trip template' });
  } catch (error) {
    next(error);
  }
};
