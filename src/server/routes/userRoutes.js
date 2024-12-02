import AuthService from "../services/authService.js";
import { User } from "../models/userModel.js";
import { useAuthStore } from "../../client/authStore.js";

export const userRoutes = {
	register: {
		path: "/register",
		method: "POST",
		description: "Handles user account registration",
		pipeline: [
			{
				name: "createUser",
				handler: async (req, res, next) => {
					try {
						const { username, password, email } = req.body;
						const result = await AuthService.register(
							// returns token and user pointer
							{
								username: username,
								password: password,
								email: email,
							}
						);
						res.status(200).json({
							message: `Registration successful for user: ${username}`,
						});
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
	login: {
		path: "/login",
		method: "POST",
		description: "login for existing user",
		pipeline: [
			{
				name: "authenticate",
				handler: async (req, res, next) => {
					try {
						const { username, password } = req.body;
						const result = await AuthService.login({
							username: username,
							password: password,
						});

						console.log("got result");

						if (!result) {
							console.log("no such user");
							res.json({
								isAuthenticated: false,
							});
						} else {
							req.token = result.token;
							req.isAuthenticated = true;
							next();
						}
					} catch (error) {
						console.log("Error logging in: ", error);
					}
				},
			},
			{
				name: "getToken",
				handler: async (req, res, next) => {
					console.log("I bet it's here. token: ", req.token);
					if (req.isAuthenticated) {
						res.cookie("jwt", req.token, {
							httpOnly: true,
							secure: true,
							sameSite: "strict",
							maxAge: 3600000,
						});
						console.log("did we get here");
						res.json({
							isAuthenticated: true,
							userInfo: await AuthService.getUserInfo(req.token),
						});
					}
				},
			},
		],
	},
	logout: {
		path: "/logout",
		method: "POST",
		pipeline: [
			{
				name: "clearCookies",
				handler: async (req, res, next) => {
					try {
						res.clearCookie("jwt");
						res.status(200).json({ message: "Logout successful." });
					} catch (error) {
						next(error);
					}
				},
			},
		],
	},
	verifyUser: {
		path: "/auth/verify",
		method: "GET",
		pipeline: [
			{
				name: "sendResponse",
				handler: async (req, res, next) => {
					console.log("this: ", req.cookies.jwt);
					if (req.cookies.jwt) {
						console.log("sending confirmation...");
						res.status(200).json({
							success: true,
							message: `user: ${req.decoded.id} authenticated`,
							userInfo: await AuthService.getUserInfo(
								req.cookies.jwt
							),
						});
					} else {
						res.status(400).json({
							success: false,
							message: "Server could not verify user token",
						});
					}
				},
			},
		],
	},
	getUserInfo: {
		path: "/info",
		method: "GET",
		pipeline: [
			{
				name: "core",
				handler: async (req, res, next) => {
					console.log(
						"/user/info/ endpoint reached with fields: ",
						req.query.fields
					);

					if (!req.decoded) {
						res.status(200).json({ guest: true });
					} else {
						const fields = req.query.fields
							?.split(",")
							.reduce((obj, field) => {
								obj[field] = 1;
								return obj;
							}, {});
						console.log("Found field: ", fields);
						const userInfo = await User.findById(
							req.decoded.id,
							fields
						);
						console.log("Found user: ", userInfo);

						if (!userInfo) {
							return res.status(200).json({ guest: true });
						}

						return res.status(200).json(userInfo);
					}
				},
			},
		],
	},
	saveFeedArticle: {
		path: "/feed",
		method: "POST",
		pipeline: [
			{
				name: "save_feed",
				handler: async (req, res, next) => {
					try {
						const userId = req.decoded.id;

						const feedItem = {
							title: req.body.title,
							link: req.body.link,
							description: req.body.description,
						};
						console.log("Feed item: ", feedItem);
						const updatedUser = await User.findByIdAndUpdate(
							userId,
							{ $push: { savedFeeds: feedItem } },
							{ new: true }
						);

						res.status(200).json({
							message: "Feed item saved to user preferences",
						});
					} catch (error) {
						console.error("Error saving feed item: ", error);
						res.status(500).json({
							message: "Error saving feed item",
						});
					}
				},
			},
		],
	},
	getUserPreferences: {
		path: "/preferences",
		method: "GET",
		pipeline: [
			{
				name: "sendPreferences",
				handler: async (req, res, next) => {
					try {
						const userId = req.decoded.id;

						const user = await User.findById(userId);

						const preferences = user.savedFeeds;

						res.status(200).json(preferences);
					} catch (error) {
						console.error(
							"Error getting user preferences: ",
							error
						);
						res.status(500).json({ message: error.message });
					}
				},
			},
		],
	},
};
