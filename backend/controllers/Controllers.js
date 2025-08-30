import Story from '../models/stories.js'
import User from '../models/user.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'


export async function  getAllStories (req,res){
     try {
          const stories = await Story.find()
          res.status(200).json(stories)
     } catch (error) {
          console.error("Error fetching stories:", error)
          res.status(500).json({ message: "Error fetching stories", error })
     }
}

export async function getStoryById (req,res){
     try {
          const story = await Story.findById(req.params.id)
          console.log("Fetched story:", story)
          res.status(200).json(story)
     } catch (error) {
          console.error("Error fetching story:", error)
          res.status(500).json({ message: "Error fetching story", error })
     }
}

export async function createStory(req, res) {
    try {
        // Create new story
        const newStory = new Story(req.body);
        const savedStory = await newStory.save();

        // Check if user exists (debug log)
        const user = await User.findById(savedStory.owner);
        console.log('User found:', user);
        if (!user) {
            return res.status(404).json({ message: 'User not found', userId: savedStory.owner });
        }

        // Add story ID to user's stories array
        user.stories_arr.push(savedStory._id);
        await user.save();

        res.status(201).json(savedStory);
    } catch (error) {
        console.error('Error creating story:', error);
        res.status(500).json({ message: 'Error creating story', error });
    }
}



export async function updateStory(req, res) {
    try {
        const storyId = req.params.id
        const userId = req.body.userId 
        const story = await Story.findById(storyId)
        if (!story) {
            return res.status(404).json({ message: "Story not found" })
        }
        
        if (story.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not your story" })
        }
        
        const updatedStory = await Story.findByIdAndUpdate(storyId, req.body, { new: true })
        res.status(200).json(updatedStory)
        
    } catch (error) {
        res.status(500).json({ message: "Error updating story" })
    }
}

export async function deleteStory(req, res) {
    try {
        const storyId = req.params.id
        const userId = req.body.userId // assuming userId comes in request body
        
        // Find the story first
        const story = await Story.findById(storyId)
        if (!story) {
            return res.status(404).json({ message: "Story not found" })
        }
        

        if (story.owner.toString() !== userId) {
            return res.status(403).json({ message: "Not your story" })
        }
        
        await Story.findByIdAndDelete(storyId)
        res.status(204).send()
        
    } catch (error) {
        res.status(500).json({ message: "Error deleting story" })
    }
}


export async function loginFunction(req, res) {
    const { email, password } = req.body

    try {
     
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' })
        }


        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

  
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id }, 
            process.env.JWT_SECRET || 'sahil', 
            { expiresIn: '24h' }
        )

        // Send response with token and user info
        res.status(200).json({ 
            message: 'Login successful', 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (error) {
        console.error('Error logging in:', error)
        res.status(500).json({ message: 'Error logging in', error })
    }
}

export async function signupFunction(req, res) {
    const { username, email, password } = req.body

    try {
        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' })
        }

        // Check if user already exists (email or username)
        const existingUser = await User.findOne({ 
            $or: [{ email }, { username }] 
        })
        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(409).json({ message: 'User with this email already exists' })
            } else {
                return res.status(409).json({ message: 'Username already taken' })
            }
        }

        // Create new user (password will be hashed automatically by your schema)
        const newUser = new User({ 
            username, 
            email, 
            password,
            stories_arr: []
        })
        await newUser.save()

        // Create JWT token
        const token = jwt.sign(
            { id: newUser._id }, 
            process.env.JWT_SECRET || 'your-secret-key', 
            { expiresIn: '24h' }
        )

        // Send response with token and user info for frontend
        res.status(201).json({ 
            message: 'User created successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        })
    } catch (error) {
        console.error('Error signing up:', error)
        res.status(500).json({ message: 'Error signing up', error })
    }
}

export async function likeStory(req, res) {
    try {
        const storyId = req.params.id;
        const userId = req.body.userId;
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Story not found' });
        }
        if (!userId) {
            return res.status(400).json({ message: 'User ID required' });
        }
        const alreadyLiked = story.likes.includes(userId);
        if (alreadyLiked) {
            // Unlike
            story.likes = story.likes.filter(id => id.toString() !== userId);
        } else {
            // Like
            story.likes.push(userId);
        }
        await story.save();
        res.status(200).json({ likes: story.likes.length, liked: !alreadyLiked });
    } catch (error) {
        res.status(500).json({ message: 'Error liking/unliking story', error });
    }
}
