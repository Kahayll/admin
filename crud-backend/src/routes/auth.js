// crud-backend/src/routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../db.js'; 
const router = express.Router();

router.post('/admin/login', async (req, res) => {
    console.log('Received login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please enter both email and password' });
    }

    try {
        const user = await query('SELECT * FROM users_tb WHERE email = $1 AND isactive = TRUE', [email]);

        if (user.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid email or user is not active.' });
        }

        const currentUser = user.rows[0];

        const isMatch = await bcrypt.compare(password, currentUser.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials. Please check your password.' });
        }

        const token = jwt.sign(
            { id: currentUser.id, email: currentUser.email, role: currentUser.role },
            process.env.JWT_SECRET || 'supersecretjwtkey',
            { expiresIn: '1h' }
        );

        res.json({
            msg: 'Logged in successfully',
            token,
            email: currentUser.email,
        });

    } catch (err) {
        console.error('Login error:', err.message);
        console.error('Login stack:', err.stack);
        res.status(500).send('Server error during login');
    }
});

export default router;