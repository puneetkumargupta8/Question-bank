const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const nodemailer = require('nodemailer');

const router = express.Router();

// Temporary storage for verification codes
const verificationCodes = new Map();

const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendVerificationEmail = async (email, code) => {
    console.log(`[EMAIL] To: ${email}, Code: ${code}`);
};

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await db('users').where({ email }).first();
        if (!user) return res.status(401).json({ error: 'Invalid credentials' });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: 'Invalid credentials' });

        const code = generateCode();
        verificationCodes.set(email, { code, expires: Date.now() + 300000 });
        await sendVerificationEmail(email, code);

        res.json({ message: 'Verification code sent', email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});

router.post('/verify', async (req, res) => {
    const { email, code } = req.body;

    const stored = verificationCodes.get(email);
    if (!stored || stored.code !== code || Date.now() > stored.expires) {
        return res.status(400).json({ error: 'Invalid or expired code' });
    }

    try {
        const user = await db('users').where({ email }).first();

        await db('users').where({ id: user.id }).update({ lastLogin: new Date() });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        verificationCodes.delete(email);
        res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
