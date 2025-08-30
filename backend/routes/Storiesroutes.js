import express from 'express'

import { Router } from 'express'
import { getAllStories,getStoryById,createStory,updateStory,deleteStory,loginFunction, signupFunction, likeStory } from '../controllers/Controllers.js';

const router = Router();

router.post('/login', loginFunction)
router.post('/signup', signupFunction)
router.get('/story/:id', getStoryById)
router.get('/', getAllStories)
router.post('/create', createStory)
router.put('/edit/:id', updateStory)
router.put('/:id', updateStory)
router.delete('/:id', deleteStory)
router.post('/story/:id/like', likeStory)

export default router;