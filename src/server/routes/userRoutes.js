import AuthService from "../services/authService.js"
import { User } from '../models/userModel.js'

export const userRoutes = {
    register: {
        path: '/register',
        method: 'POST',
        description: "Handles user account registration",
        pipeline: [
            {
                name: 'createUser',
                handler: async (req, res, next) => {
                    try {
                        const { username, password, email } = req.body;
                        const result = await AuthService.register( // returns token and user pointer
                            {
                                username: username,
                                password: password,
                                email: email
                            }
                        );
                        res.status(200).json({ message: `Registration successful for user: ${username}` });
                    }
                    catch (error) {
                        next(error);
                    }
                }
            },
        ]
    },
    login: {
        path: '/login',
        method: 'POST',
        description: "login for existing user",
        pipeline: [
            {
                name: 'authenticate',
                handler: async (req, res, next) => {
                    try {
                        const { username, password } = req.body;
                        const result = await AuthService.login({
                            username: username,
                            password: password
                        });

                        req.token = result.token;
                        req.user = result.user;

                        next();
                    }
                    catch (error) {
                        next(error)
                    }
                }
            },
            {
                name: 'getToken',
                handler: (req, res, next) => {
                    res.cookie('jwt', req.token, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'strict',
                        maxAge: 3600000
                    })

                    res.json({
                        success: true
                    })
                }
            }
        ]
    },
    logout: {
        path: '/logout',
        method: 'POST',
        pipeline: [
            {
                name: 'clearCookies',
                handler: async (req, res, next) => {
                    try {
                        res.clearCookies('jwt');
                        res.status(200).json({ message: "Logout successful." });
                    }
                    catch (error) {
                        next(error);
                    }
                }
            }
        ]
    },
    getUserInfo: {
        path: '/info',
        method: 'GET',
        pipeline: [
            {
                name: 'verifyToken',
                handler: async (req, res, next) => {
                    AuthService.verifyToken(req, res, next);
                }
            },
            {
                name: 'core',
                handler: async (req, res, next) => {
                    console.log("/user/info/ endpoint reached with fields: ", req.query.fields);
                    const fields = req.query.fields?.split(',').reduce((obj, field) => {
                        obj[field] = 1;
                        return obj;
                    }, {})
                 console.log("Found field: ", fields)
                    const existingUser = await User.findById(req.decoded.id, fields);
                    console.log("Found user: ", existingUser)

                    if (!existingUser) {
                        return res.status(200).json({ guest: true });
                    }

                    return res.status(200).json(existingUser);

                }
            }
        ]
    },
    saveFeedArticle: {
        path: '/feed',
        method: 'POST',
        pipeline: [
            {
                name: 'verifyToken',
                handler: async (req, res, next) => {
                    AuthService.verifyToken(req, res, next);
                }
            },
            {
                name: 'save_feed',
                handler: async (req, res, next) => {
                    try {
                        const userId = req.decoded.id;

                        const feedItem = {
                            title: req.body.title,
                            link: req.body.link,
                            description: req.body.description
                        };

                        const updatedUser = await User.findByIdAndUpdate(
                            userId,
                            { $push: { savedFeeds: feedItem }},
                            { new: true }
                        );

                        res.status(200).json({message: 'Feed item saved to user preferences'});
                    }
                    catch (error) {
                        console.error("Error saving feed item: ", error);
                        res.status(500).json({message: 'Error saving feed item'});
                    }
                }
            }
        ]
    },
    getUserPreferences: {
        path: '/preferences',
        method: 'GET',
        pipeline: [
            {
                name: 'findUser',
                handler: async (req, res, next) => {
                    AuthService.verifyToken(req, res, next);
                }
            },
            {
                name: 'sendPreferences',
                handler: async (req, res, next) => {
                    try {
                        const userId = req.decoded.id;

                        const user = await User.findById(userId);

                        const preferences = user.savedFeeds;

                        res.status(200).json(preferences);
                        }
                    catch (error) {
                        console.error("Error getting user preferences: ", error);
                        res.status(500).json({message: error.message});
                    }
                }
            }
        ]
    },
}