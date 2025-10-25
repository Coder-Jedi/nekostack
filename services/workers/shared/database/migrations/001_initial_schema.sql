-- Migration: 001_initial_schema.sql
-- Description: Initial database schema for NekoStack
-- Created: 2024-12-03

-- This migration creates the initial database schema
-- Run this after creating the D1 database

-- Note: The main schema is in schema.sql
-- This file is for migration tracking purposes

-- Migration tracking table
CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert this migration record
INSERT OR IGNORE INTO migrations (name) VALUES ('001_initial_schema');

-- The actual schema is imported from schema.sql
-- This ensures proper migration tracking
