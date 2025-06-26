
import express from 'express';
import {
    getAllUsers, 
    createNewUser,
    updateExistingUser,
    deleteUserById,
    searchUsers
} from '../controllers/userController.js';

const router = express.Router();

router.get('/users', getAllUsers); 
router.post('/users', createNewUser);
router.put('/users/:id', updateExistingUser);
router.delete('/users/:id', deleteUserById);
router.get('/users/search', searchUsers);

export default router;