const jwt = require('jsonwebtoken');

class AuthController {
    constructor(userModel) {
        this.User = userModel;
    }

    async loginUser(req, res) {
        try {
            const { email, password } = req.body;
            const user = await this.User.findOne({ email });
            if (user && await user.authenticate(password)) {
                const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                res.json({ message: "Login successful", token });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Other authentication-related methods
}

module.exports = AuthController;
