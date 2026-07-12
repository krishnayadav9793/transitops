// Reports & Analytics Controller - Developer 4

export const getReports = async (req, res, next) => {
  try {
    // TODO: Calculate average fuel efficiency and ROI for all vehicles
    return res.status(200).json([]);
  } catch (error) {
    next(error);
  }
};
