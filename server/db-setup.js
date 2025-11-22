const knex = require('knex')(require('./knexfile').development);

async function up() {
    try {
        // Users Table
        if (!(await knex.schema.hasTable('users'))) {
            await knex.schema.createTable('users', (table) => {
                table.increments('id').primary();
                table.string('email').unique().notNullable();
                table.string('password').notNullable();
                table.string('role').defaultTo('FACULTY');
                table.timestamp('lastLogin');
                table.timestamp('createdAt').defaultTo(knex.fn.now());
            });
            console.log('Created users table');
        }

        // Questions Table
        if (!(await knex.schema.hasTable('questions'))) {
            await knex.schema.createTable('questions', (table) => {
                table.increments('id').primary();
                table.text('text').notNullable();
                table.text('options').notNullable(); // JSON string
                table.string('answer').notNullable();
                table.string('subject').notNullable();
                table.string('difficulty').notNullable();
                table.string('image');
                table.string('status').defaultTo('ACTIVE');
                table.integer('usageCount').defaultTo(0);
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.timestamp('updatedAt').defaultTo(knex.fn.now());
                table.integer('createdById').references('id').inTable('users');
            });
            console.log('Created questions table');
        }

        // Question Papers Table
        if (!(await knex.schema.hasTable('question_papers'))) {
            await knex.schema.createTable('question_papers', (table) => {
                table.increments('id').primary();
                table.string('title').notNullable();
                table.string('status').defaultTo('DRAFT');
                table.text('comments');
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.timestamp('updatedAt').defaultTo(knex.fn.now());
                table.integer('createdById').references('id').inTable('users');
            });
            console.log('Created question_papers table');
        }

        // Exams Table
        if (!(await knex.schema.hasTable('exams'))) {
            await knex.schema.createTable('exams', (table) => {
                table.increments('id').primary();
                table.string('name').notNullable();
                table.timestamp('date').notNullable();
                table.string('type').notNullable();
                table.timestamp('createdAt').defaultTo(knex.fn.now());
                table.integer('paperId').references('id').inTable('question_papers');
            });
            console.log('Created exams table');
        }

        console.log('Database setup complete');
    } catch (error) {
        console.error('Error setting up database:', error);
    } finally {
        await knex.destroy();
    }
}

up();
