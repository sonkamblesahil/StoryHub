import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const user = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    stories_arr: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Story'
    }]
}, {
    timestamps: true
})

// Hash password before saving
user.pre('save', async function(next) {
    if (!this.isModified('password')) return next()
    this.password = await bcrypt.hash(this.password, 12)
    next()
})

const User = mongoose.model('User', user, 'userinfo')

export default User
