/**
 * Run migrations directly using the database connection
 * This bypasses drizzle-kit push issues
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

// Use the most recent migration file
const migrationPath = path.join(process.cwd(), 'drizzle', '0003_salty_komodo.sql');

async function runMigration() {
    console.log('🚀 Running migration...\n');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL not found');
    }

    const sql = postgres(connectionString);

    try {
        // Read the migration file
        const migrationSql = fs.readFileSync(migrationPath, 'utf-8');

        // Split by statement-breakpoint and run each statement
        const statements = migrationSql
            .split('-->' + ' statement-breakpoint')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        console.log(`📝 Found ${statements.length} SQL statements\n`);

        for (let i = 0; i < statements.length; i++) {
            const stmt = statements[i];
            if (!stmt) continue;

            try {
                await sql.unsafe(stmt);
                console.log(`   ✅ Statement ${i + 1}/${statements.length} executed`);
            } catch (err: any) {
                // Ignore "already exists" errors
                if (err.code === '42P07' || err.code === '42701') {
                    console.log(`   ⏭️  Statement ${i + 1}/${statements.length} skipped (already exists)`);
                } else {
                    console.error(`   ❌ Statement ${i + 1} failed:`, err.message);
                    // Don't throw - continue with other statements
                }
            }
        }

        console.log('\n✅ Migration completed!');
    } finally {
        await sql.end();
    }
}

runMigration()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error('Migration failed:', err);
        process.exit(1);
    });
