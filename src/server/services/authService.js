import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { User } from "../models/userModel.js";
import { useAuthStore } from "../../client/authStore.js";

class AuthService {
	static async register(userData) {
		try {
			const existingUser = await User.findOne({ email: userData.email });

			if (existingUser) {
				throw new Error("User with that email already exists!");
			}

			const salt = await bcrypt.genSalt(12);
			const hashedPassword = await bcrypt.hash(userData.password, salt);

			const verificationToken = crypto.randomBytes(32).toString("hex");

			const user = await User.create({
				...userData,
				password: hashedPassword,
				emailVerificationToken: verificationToken,
				emailVerificationExpires: Date.now() + 24 * 60 * 60 * 1000,
			});

			console.log("User created. Email: ", userData.email);
			const token = this.generateToken(user);

			return { user, token };
		} catch (error) {
			console.error("Error in user registration: ", error);
		}
	}

	static async login(formData) {
		try {
			console.log("AuthServices login, finding user..");
			const user = await User.findOne({
				username: formData.username,
			}).select("+password");

			if (!user) {
				return false;
			}
			console.log("User: ", user);

			const isValid = await bcrypt.compare(
				formData.password,
				user.password
			);

			console.log("isValid: ", isValid);

			if (!isValid) {
				throw new Error("Invalid password.");
			}

			const token = this.generateToken(user);
			console.log("returning from login...");
			return { user, token };
		} catch (error) {
			console.error(
				`Error logging in user ${formData.username}: ${error}`
			);
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
					expiresIn: "24h",
					issuer: "stock-analytics",
				}
			);
		} catch (error) {
			console.error("Error producing JWT token: ", error);
		}
	}

	static async verifyToken(req, res, next) {
		const token = req.cookies.jwt;
		console.log("Token found:", !!token); // logs true/false, not the actual token

		try {
			if (!token) {
				return next();
			}

			const decoded = await jwt.verify(token, process.env.JWT_SECRET);
			req.decoded = decoded;

			return next();
		} catch (error) {
			console.log("Token verification failed:", error.message);
			return next();
		}
	}

	static async getUserInfo(token) {
		console.log("decoding token");
		const decoded = await jwt.verify(token, process.env.JWT_SECRET);
		console.log("decoded, finding user");
		const existingUser = await User.findById(decoded.id, {
			username: 1,
		});
		console.log("user found, creating userInfo");
		const userInfo = {
			username: existingUser.username,
			token: token,
		};
		console.log(
			"userInfo created, returning it: ",
			JSON.stringify(userInfo)
		);

		return userInfo;
	}

	static sameOrigin(req, res, next) {
		const origin = req.headers.origin;

		if (origin !== "https://kevinshaughnessy.ca") {
			return res
				.status(403)
				.json({ message: "Request blocked: origin is not this site." });
		} else {
			next();
		}
	}
}

export default AuthService;
