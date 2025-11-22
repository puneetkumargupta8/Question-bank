const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const jwt = require('jsonwebtoken');

const router = express.Router();

const auth = (roles = []) => {
    return async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'No token provided' });

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: 'Forbidden' });
            }
            next();
        } catch (error) {
            res.status(401).json({ error: 'Invalid token' });
        }
    };
};

router.get('/', auth(['ADMIN']), async (req, res) => {
    try {
        const users = await db('users').select('id', 'email', 'role', 'lastLogin', 'createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch users' });
    }
});

router.post('/', auth(['ADMIN']), async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [id] = await db('users').insert({
            email,
            password: hashedPassword,
            role
        }); // better-sqlite3 returns rowid for insert

        // For postgres it returns object, for sqlite it returns array of ids or similar. 
        // Knex .insert() returns array of ids.

        res.json({ id, email, role });
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'User creation failed' });
    }
});

router.patch('/:id', auth(['ADMIN']), async (req, res) => {
    const { role } = req.body;
    try {
        await db('users').where({ id: req.params.id }).update({ role });
        const user = await db('users').where({ id: req.params.id }).first();
        res.json(user);
    } catch (error) {
        res.status(400).json({ error: 'Update failed' });
    }
});

module.exports = router;
