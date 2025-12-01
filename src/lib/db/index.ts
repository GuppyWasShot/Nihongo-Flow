import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres client
// Use transaction pooler connection (port 6543) for better performance
const connectionString = process.env.DATABASE_URL;

// For query purposes - use connection pooling
const queryClient = postgres(connectionString, {
    max: 10, // Maximum number of connections in pool
    idle_timeout: 20,
    connect_timeout: 10,
});

// Create drizzle instance with schema
export const db = drizzle(queryClient, { schema });

// Export schema for use in queries
export { schema };
