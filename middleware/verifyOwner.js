const user = require("../models/users");

async function verifyOwner(req, res, next) {
  try {
    const userId = req.user?._id; // `req.user` is populated via authentication middleware

    if (!userId) {
      return res
        .status(403)
        .json({ status: 403, message: "Unauthorized access" });
    }

    const userData = await user.findById(userId);
    if (!userData || userData.user_type !== "owner") {
      return res.status(403).json({
        status: 403,
        message: "Only owners are authorized to access this resource.",
      });
    }

    next(); // Proceed to the next middleware
  } catch (err) {
    return res.status(500).json({ status: 500, message: "Server error" });
  }
}

module.exports = verifyOwner;
