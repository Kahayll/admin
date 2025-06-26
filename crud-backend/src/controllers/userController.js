
import * as userServices from '../services/userServices.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await userServices.getUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const createNewUser = async (req, res) => {
    try {
        const { name, email, position, age, isactive, password } = req.body;
        const defaultPassword = 'admin'; 

      
        const passwordToUse = password || defaultPassword;

        if (!name || !email || !position || age === undefined || isactive === undefined) {
           
            return res.status(400).json({ message: 'All fields (name, email, position, age, isactive) are required.' });
        }

        
        const newUser = await userServices.createUser({ name, email, position, age, isactive, password: passwordToUse });
        res.status(201).json(newUser);
    } catch (error) {
        console.error('Error creating user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const updateExistingUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, position, age, isactive, password } = req.body;
        const updatedUser = await userServices.updateUser(id, { name, email, position, age, isactive, password });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteUserById = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await userServices.deleteUser(id);
        if (!deleted) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(204).send();
    } catch (error) {
        console.error('Error deleting user:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search term is required.' });
        }
        const users = await userServices.searchUser(q);
        res.json(users);
    } catch (error) {
        console.error('Error searching users:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};