-- Seed data for NekoStack tools

-- Image Compressor & Converter
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('image-compressor', 'Image Compressor & Converter', 'Compress and convert images to reduce file size while maintaining quality', 'media', '/icons/image-compressor.svg', '["Compress images", "Convert formats", "Batch processing", "Quality control", "WebP support", "AVIF support"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('image-compressor', 'Basic Compression', 'Compress images up to 5MB', 0),
('image-compressor', 'Format Conversion', 'Convert between JPEG, PNG, WebP', 0),
('image-compressor', 'Batch Processing', 'Process multiple images at once', 1),
('image-compressor', 'Advanced Compression', 'Advanced algorithms for maximum compression', 1),
('image-compressor', 'Custom Quality Settings', 'Fine-tune compression parameters', 1);

-- QR Code & Barcode Generator
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('qr-generator', 'QR Code & Barcode Generator', 'Generate QR codes and barcodes for various purposes', 'utilities', '/icons/qr-generator.svg', '["QR codes", "Barcodes", "Custom styling", "Bulk generation", "API access", "Analytics"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('qr-generator', 'Basic QR Codes', 'Generate standard QR codes', 0),
('qr-generator', 'Custom Colors', 'Customize QR code colors and styling', 0),
('qr-generator', 'Bulk Generation', 'Generate multiple codes at once', 1),
('qr-generator', 'API Access', 'Programmatic access via API', 1),
('qr-generator', 'Analytics Tracking', 'Track QR code scans and usage', 1);

-- Markdown Editor & Converter
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('markdown-editor', 'Markdown Editor & Converter', 'Write and convert Markdown documents with live preview', 'productivity', '/icons/markdown-editor.svg', '["Live preview", "Export to PDF", "Export to HTML", "Syntax highlighting", "Table support", "Math equations"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('markdown-editor', 'Basic Editor', 'Write and preview Markdown', 0),
('markdown-editor', 'Export to HTML', 'Convert Markdown to HTML', 0),
('markdown-editor', 'Export to PDF', 'Convert Markdown to PDF', 1),
('markdown-editor', 'Math Support', 'LaTeX math equation support', 1),
('markdown-editor', 'Collaboration', 'Real-time collaborative editing', 1);

-- Unit & Currency Converter
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('unit-converter', 'Unit & Currency Converter', 'Convert between different units and currencies with real-time rates', 'utilities', '/icons/unit-converter.svg', '["Length conversion", "Weight conversion", "Temperature conversion", "Currency conversion", "Real-time rates", "Historical data"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('unit-converter', 'Basic Units', 'Convert length, weight, temperature', 0),
('unit-converter', 'Currency Conversion', 'Convert between currencies', 0),
('unit-converter', 'Real-time Rates', 'Live currency exchange rates', 1),
('unit-converter', 'Historical Data', 'Historical conversion rates', 1),
('unit-converter', 'API Access', 'Programmatic access to conversion rates', 1);

-- Signature Creator
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('signature-creator', 'Signature Creator', 'Create digital signatures for documents and contracts', 'business', '/icons/signature-creator.svg', '["Draw signatures", "Upload signatures", "Multiple formats", "Document signing", "Secure storage", "Legal compliance"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('signature-creator', 'Draw Signature', 'Create signature by drawing', 0),
('signature-creator', 'Upload Signature', 'Upload existing signature image', 0),
('signature-creator', 'Document Signing', 'Sign PDF documents', 1),
('signature-creator', 'Secure Storage', 'Encrypted signature storage', 1),
('signature-creator', 'Legal Compliance', 'Legally binding signatures', 1);

-- Resume Builder
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('resume-builder', 'Resume Builder', 'Create professional resumes with templates and ATS optimization', 'business', '/icons/resume-builder.svg', '["Professional templates", "ATS optimization", "Multiple formats", "Cover letter builder", "Skills assessment", "Job matching"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('resume-builder', 'Basic Templates', 'Free resume templates', 0),
('resume-builder', 'PDF Export', 'Export resume as PDF', 0),
('resume-builder', 'ATS Optimization', 'Optimize for Applicant Tracking Systems', 1),
('resume-builder', 'Cover Letter Builder', 'Create matching cover letters', 1),
('resume-builder', 'Job Matching', 'Match with relevant job postings', 1);

-- ATS Checker
INSERT OR IGNORE INTO tools (id, name, description, category, icon_url, features, pricing_tier, is_active) VALUES
('ats-checker', 'ATS Checker', 'Check resume compatibility with Applicant Tracking Systems', 'business', '/icons/ats-checker.svg', '["ATS compatibility", "Keyword analysis", "Format checking", "Score improvement", "Detailed feedback", "Industry insights"]', 'free', 1);

INSERT OR IGNORE INTO tool_features (tool_id, feature_name, description, is_premium) VALUES
('ats-checker', 'Basic Check', 'Basic ATS compatibility check', 0),
('ats-checker', 'Keyword Analysis', 'Analyze keyword usage', 0),
('ats-checker', 'Detailed Feedback', 'Comprehensive improvement suggestions', 1),
('ats-checker', 'Industry Insights', 'Industry-specific recommendations', 1),
('ats-checker', 'Multiple Format Support', 'Check various resume formats', 1);
