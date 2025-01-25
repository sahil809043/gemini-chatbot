import admin from "../config/firebase.config.js";

class Middleware {
    async decodeToken(req, res, next) {
        try {
            const authHeader = req.headers.authorization;
            // console.log("Auth header:", authHeader);
            if (!authHeader) {
                return res.status(401).json({ message: "Authorization header missing" });
            }

            const token = authHeader.split(" ")[1];
            // console.log("Token:", token);
            if (!token) {
                return res.status(401).json({ message: "Token not found in Authorization header" });
            }

            const decodedToken = await admin.auth().verifyIdToken(token);
            // console.log("Decoded token:", decodedToken);
            if (decodedToken) {
                req.auth = decodedToken;
                return next();
            }

            return res.status(401).json({ message: "Unauthorized" });
        } catch (err) {
            console.error("Error verifying token:", err);
            res.status(401).json({ message: "Internal Error" });
        }
    }
}

export default new Middleware();
