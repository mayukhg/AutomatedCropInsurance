/**
 * Database Connection Setup
 * 
 * This file configures the PostgreSQL database connection using Neon serverless
 * with Drizzle ORM for type-safe database operations.
 */

import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure Neon to use WebSocket for serverless environments
neonConfig.webSocketConstructor = ws;

// Validate database URL is provided
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool for PostgreSQL database
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Initialize Drizzle ORM with schema for type-safe database operations
export const db = drizzle({ client: pool, schema });