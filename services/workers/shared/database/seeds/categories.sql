-- Seed data for tool categories

INSERT OR IGNORE INTO tool_categories (id, name, description, icon, sort_order) VALUES
('productivity', 'Productivity', 'Tools to boost your productivity and efficiency', 'zap', 1),
('media', 'Media & Design', 'Image, video, and design tools', 'image', 2),
('development', 'Development', 'Developer tools and utilities', 'code', 3),
('business', 'Business', 'Business and professional tools', 'briefcase', 4),
('education', 'Education', 'Learning and educational tools', 'book-open', 5),
('utilities', 'Utilities', 'General purpose utility tools', 'tool', 6);
