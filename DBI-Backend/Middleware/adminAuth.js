// Guards admin-only routes: the caller must present the exact admin
// name + email from .env via headers, mirroring the login validation.
const adminAuth = (req, res, next) => {
    const email = (req.header("x-admin-email") || "").trim().toLowerCase();
    const name = (req.header("x-admin-name") || "").trim().toLowerCase();

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminName = (process.env.ADMIN_NAME || "").trim().toLowerCase();

    if (!adminEmail || !email || !name || email !== adminEmail || name !== adminName) {
        return res.status(403).json({
            success: false,
            message: "Admin access denied",
        });
    }

    next();
};

module.exports = adminAuth;
