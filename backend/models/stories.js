import mongoose from 'mongoose'

const stories = new mongoose.Schema({
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    bookmarks:{
        type: Boolean,
        default: false
    }
    

},
 {
       timestamps: true
   })

export default mongoose.model('Story', stories, 'stories')
