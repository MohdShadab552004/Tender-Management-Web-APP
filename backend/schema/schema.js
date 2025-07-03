// migration: create_all_tables.js

export async function up(knex) {
  // Users table
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 100).notNullable().unique();
    table.text('password').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Companies table
  await knex.schema.createTable('companies', (table) => {
    table.increments('id').primary();
    table
      .integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE');
    table.string('name', 150).notNullable();
    table.string('industry', 100);
    table.text('description');
    table.text('logo_url');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Goods & Services
  await knex.schema.createTable('goods_services', (table) => {
    table.increments('id').primary();
    table
      .integer('company_id')
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');
    table.string('name', 150).notNullable();
  });

  // Tenders
  await knex.schema.createTable('tenders', (table) => {
    table.increments('id').primary();
    table
      .integer('company_id')
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');
    table.string('title', 150).notNullable();
    table.text('description');
    table.date('deadline');
    table.decimal('budget');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });

  // Applications
  await knex.schema.createTable('applications', (table) => {
    table.increments('id').primary();
    table
      .integer('tender_id')
      .references('id')
      .inTable('tenders')
      .onDelete('CASCADE');
    table
      .integer('company_id')
      .references('id')
      .inTable('companies')
      .onDelete('CASCADE');
    table.text('name').notNullable();
    table.text('email').notNullable();
    table.decimal('bid_amount', 12, 2).notNullable();
    table.text('proposal').notNullable();
    table.timestamp('submitted_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex) {
  await knex.schema.dropTableIfExists('applications');
  await knex.schema.dropTableIfExists('tenders');
  await knex.schema.dropTableIfExists('goods_services');
  await knex.schema.dropTableIfExists('companies');
  await knex.schema.dropTableIfExists('users');
}
