const db = require('./db');
const bcrypt = require('bcryptjs');

async function seed() {
    try {
        const hashedPassword = await bcrypt.hash('admin123', 10);

        // Check if admin exists
        const existing = await db('users').where({ email: 'admin@example.com' }).first();

        if (!existing) {
            await db('users').insert({
                email: 'admin@example.com',
                password: hashedPassword,
                role: 'ADMIN'
            });
            console.log('Admin user created');
        } else {
            console.log('Admin user already exists');
        }
    } catch (error) {
        console.error('Seeding failed:', error);
    } finally {
        await db.destroy();
    }
}

seed();
