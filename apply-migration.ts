import postgres from 'postgres';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function applyMigration() {
    const sql = postgres(process.env.DATABASE_URL!);

    try {
        const migration = fs.readFileSync('drizzle/0001_cheerful_stature.sql', 'utf8');
        await sql.unsafe(migration);
        console.log('✅ Migration applied successfully!');

        // Verify columns exist
        const result = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'user_profiles' 
      AND column_name IN ('location', 'bio')
      ORDER BY column_name;
    `;

        console.log('\n📋 Verified columns:', result.map(r => r.column_name).join(', '));
    } catch (error: any) {
        console.error('❌ Error:', error.message);
    } finally {
        await sql.end();
    }
}

applyMigration();
