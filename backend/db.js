const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

mongoose.connect("mongodb+srv://workinguse5:Biresh%402005@cluster0.hlgzx3g.mongodb.net/fintechApp")

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: 3,
        maxLength: 30
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
});

userSchema.methods.createHash = async function (plainTextPassword) {
    const saltRounds = 10;
    return await bcrypt.hash(plainTextPassword, saltRounds);
};
  
userSchema.methods.validatePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balanceInPaise: {
        type: Number,
        required: true
    }
});

const User = mongoose.model('User', userSchema);
const Account = mongoose.model('Account', accountSchema);

module.exports = {
    User,
    Account
};