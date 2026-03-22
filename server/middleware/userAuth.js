import jwt from 'jsonwebtoken';

const userAuth = async (req, res, next) => {
    // 1. Try Authorization: Bearer <token> header first (for mobile clients)
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
    }

    // 2. Fall back to cookie (for web clients)
    if (!token && req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    if (!token) {
        return res.json({ success: false, message: 'Not authenticated. Please login again.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.id) {
            // Store on req object (NOT req.body — body may not exist on GET/DELETE)
            req.userId = decoded.id;
            // Also keep backward compat for POST routes that read req.body.userId
            if (req.body) {
                req.body.userId = decoded.id;
            }
        } else {
            return res.json({ success: false, message: 'Invalid token. Please login again.' });
        }
        next();
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

export default userAuth;