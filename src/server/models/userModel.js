import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'An email is required.'],
        unique: true,
        lowercase: true,
        trim: true,
        validate: {
            validator: validator.isEmail,
            message: 'Please enter a valid email format.'
        }
    },
    password: {
        type: String,
        required: [true, 'A password is required'],
        minlength: [8, 'Password must be at least 8 characters.'],
        select: false
    },
    username: {
        type: String,
        required: [true, 'A username is required.'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters.'],
        maxlength: [30, "Username can't be more than 30 characters."]
    },
    savedFeeds: [{
        title: {
            type: String,
            required: true
        },
        link: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        savedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Profiles
    // https://claude.ai/chat/aa7bb8bb-9f5c-4a30-9c03-bd3cfc0d7de6

    // Security
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
    emailVerificationToken: String,
    emailVerificationExpires: Date,
    
 }, {
        timeStamps: true,
        collection: 'users'
});

userSchema.index({email: 1});
userSchema.index({username: 1});
// Profile first name  - last name

userSchema.methods.toJSON = function () {
    const user = this.toObject();
    delete user.password;
    return user;
}

// Remember this returns a promise
userSchema.methods.addSavedUser = function (feedItem) {
    if (this.savedFeeds.some(feed => feed.link === feedItem.link)) {
        return;
    } else {
        this.savedFeeds.push(feedItem);
        return this.save();
    }
}

export const User = mongoose.model('User', userSchema);