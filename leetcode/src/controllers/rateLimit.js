const redisClient = require("../models/redis")

const SubmitRateLimiter=async(req,res,next)=>{
    const userId = req.result._id
    const redisKey = `submit_cooldown:${userId}`
    try {
    // Try to set with NX (only if not exists) and expiration
    // The set returns a string 'OK' if it actually set, or null if key existed
    const setResult = await redisClient.set(redisKey, 'cooldown_active', {
      NX: true,
      EX: 10,  // expire after 10 seconds
    });

    if (setResult === null) {
      // Key already existed -> user must wait
      return res.status(429).json({
        error: "Please wait for 10 seconds before submission"
      });
    }

    // Key was set, so no cooldown currently, proceed
    next();
  } catch (err) {
    console.error("Rate limiter error:", err);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

module.exports = SubmitRateLimiter