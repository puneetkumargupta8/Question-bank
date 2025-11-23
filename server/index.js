const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
// const { PrismaClient } = require('@prisma/client');

dotenv.config();

const app = express();
// const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const path = require('path');

// Basic health check
app.get('/health', (req, res) => {
    res.send('Examination Cell API is running');
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    app.get('*', (req, res) => {
        // Don't intercept API routes
        if (req.path.startsWith('/api')) return res.status(404).send('API not found');
        res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
}

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
