const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {

    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}

const authGarageOwner = (req, res, next) => {

    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 

        if (req.user.role !== "garageowner") {
            return res.status(403).json({ message: "Access denied: Only garage owners allowed" });
        }

        next();
    } catch(err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

const authUsers = (req, res, next) => {

    const authHeader = req.header("Authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; 

        if (req.user.role !== "user") {
            return res.status(403).json({ message: "Access denied: Only garage owners allowed" });
        }

        next();
    } catch(err) {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = {verifyToken, authGarageOwner, authUsers}