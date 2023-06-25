const isAuthenticated = (req, res, next) => {
    try {
        let token = req.get("authorization");
        if (!token) {
            return res.status(401).json({ success: false, msg: "Token not present" });
        }
        next();
    } catch (error) {
        return res.status(401).json({ success: false, msg: error.message });
    }
};
module.exports = isAuthenticated;