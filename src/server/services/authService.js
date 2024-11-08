import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/userModel.js';

class AuthService {
    
    static async register(userData) {
        try {
            const existingUser = await User.findOne({email: userData.email});
            
            if (existingUser) {
                throw new Error("User with that email already exists!");
            }

            const salt = await bcrypt.genSalt(12);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const verificationToken = crypto.randomBytes(32).toString('hex');

            const user = await User.create({
                ...userData,
                password: hashedPassword,
                emailVerificationToken: verificationToken,
                emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000
            });

            console.log("User created. Email: ", userData.email);
            const token = this.generateToken(user);

            return {user, token};
        }
        catch (error) {
            console.error("Error in user registration: ", error);
        }
    }

    static async login(formData) {
        try{
            console.log("AuthServices login, finding user..")
            const user = await User.findOne({username: formData.username}).select('+password');

            if (!user) {
                throw new Error("Invalid credentials.");
            }
            console.log("User: ", user);
            
            const isValid = await bcrypt.compare(formData.password, user.password);
            
            if (!isValid) {
                throw new Error("Invalid password.")
            }

            const token = this.generateToken(user);

            return {user, token};
        }
        catch (error) {
            console.error(`Error logging in user ${formData.username}: ${error}`);
        }
    }

    static generateToken(user) {
        try {
            return jwt.sign(
                {
                    id: user._id,
                    email: user.email,
                },
                process.env.JWT_SECRET,
                {
                    expiresIn: '24h',
                    issuer: 'stock-analytics'
                }
            );
        }
        catch (error) {
            console.error("Error producing JWT token: ", error);
        }
    }

    static async verifyToken(req, res, next) {
        console.log("Inside verifyToken");
        const token = req.cookies.jwt;
        console.log("Token found:", !!token); // logs true/false, not the actual token
        
        if (!token) {
          console.log("No token found, sending 401");
          return res.status(401).json({ message: 'No token provided.'});
        }

        try {
            const decoded = await jwt.verify(token, process.env.JWT_SECRET)
            console.log("Decoded token:", decoded); // Add this line to see what's in decoded
            req.decoded = decoded;
            console.log("req.decoded:", req.decoded); // And this line to confirm it's attached
            next();
        }
        catch (error) {
            console.log("Token verification failed:", err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
    }

    static sameOrigin(req, res, next) {

        const origin = req.headers.origin;
        
        if (origin !== 'https://kevinshaughnessy.ca') {
            return res.status(403).json({ message: "Request blocked: origin is not this site."});
        } else {
            next();
        }
    }


}

export default AuthService;