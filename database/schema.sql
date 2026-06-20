-- Barry Group Inc. Recruitment Portal Database Schema
-- PostgreSQL

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(30),
    country VARCHAR(100),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'applicant' CHECK (role IN ('applicant', 'admin', 'superadmin')),
    is_email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_suspended BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(10),
    verification_code_expires TIMESTAMP,
    reset_code VARCHAR(10),
    reset_code_expires TIMESTAMP,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Applicant Profiles
CREATE TABLE applicant_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    marital_status VARCHAR(30),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100),
    passport_number VARCHAR(50),
    passport_issue_date DATE,
    passport_expiry_date DATE,
    education_level VARCHAR(50),
    institution_name VARCHAR(200),
    program VARCHAR(200),
    graduation_year INTEGER,
    current_occupation VARCHAR(150),
    employer_name VARCHAR(200),
    years_of_experience INTEGER,
    previous_employers TEXT,
    profile_completion INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    location VARCHAR(200) DEFAULT 'Canada',
    employment_type VARCHAR(50) DEFAULT 'Full-Time',
    salary_min DECIMAL(10,2),
    salary_max DECIMAL(10,2),
    salary_currency VARCHAR(10) DEFAULT 'CAD',
    requirements TEXT,
    benefits TEXT,
    description TEXT,
    open_positions INTEGER DEFAULT 1,
    is_published BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Applications Table
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_number VARCHAR(20) UNIQUE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    job_id UUID REFERENCES jobs(id),
    desired_position VARCHAR(200),
    education_level VARCHAR(50),
    experience_years INTEGER,
    country_of_residence VARCHAR(100),
    preferred_province VARCHAR(100),
    additional_info TEXT,
    status VARCHAR(50) DEFAULT 'received' CHECK (status IN (
        'received','under_review','documents_required','shortlisted',
        'employer_review','approved','rejected','completed'
    )),
    submitted_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- LMIA References
CREATE TABLE lmia_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lmia_number VARCHAR(20) UNIQUE NOT NULL,
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    generated_at TIMESTAMP DEFAULT NOW(),
    generated_by UUID REFERENCES users(id),
    notes TEXT
);

-- Application Status History
CREATE TABLE application_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL,
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Documents Table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    document_type VARCHAR(50) NOT NULL CHECK (document_type IN (
        'passport','resume','degree_certificate','diploma',
        'transcript','experience_letter','reference_letter',
        'professional_certificate','additional'
    )),
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
    admin_notes TEXT,
    uploaded_at TIMESTAMP DEFAULT NOW(),
    reviewed_at TIMESTAMP,
    reviewed_by UUID REFERENCES users(id)
);

-- Messages Table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE CASCADE,
    application_id UUID REFERENCES applications(id) ON DELETE SET NULL,
    subject VARCHAR(300),
    body TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    parent_id UUID REFERENCES messages(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info','success','warning','error')),
    is_read BOOLEAN DEFAULT FALSE,
    link VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    details JSONB,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System Settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Sequences for application numbers
CREATE SEQUENCE application_seq START 1;
CREATE SEQUENCE lmia_seq START 1;

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id);
CREATE INDEX idx_notifications_user ON notifications(user_id);

-- Seed admin user (password: Admin@123456)
INSERT INTO users (first_name, last_name, email, password_hash, role, is_email_verified, is_active)
VALUES (
    'Barry', 'Group',
    'admin@barrygroup.ca',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMqJqhBXIdOZNGSmptlO3UlFIG',
    'superadmin',
    TRUE,
    TRUE
);

-- Seed default system settings
INSERT INTO system_settings (key, value, description) VALUES
('company_name', 'Barry Group Inc.', 'Company name'),
('company_email', 'recruitment@barrygroup.ca', 'Recruitment email'),
('max_file_size_mb', '10', 'Max upload size in MB'),
('application_year', '2026', 'Current application year');

-- Seed Jobs
INSERT INTO jobs (title, department, location, employment_type, salary_min, salary_max, requirements, benefits, description, open_positions, is_published) VALUES
('Seafood Processing Worker', 'Seafood Processing', 'Nova Scotia, Canada', 'Full-Time', 38000, 48000, 'No experience required, training provided, ability to work in cold environments', 'Health benefits, housing support, overtime pay, career advancement', 'Process seafood products on production lines following quality and safety standards.', 5, TRUE),
('Fish Cutter', 'Seafood Processing', 'Nova Scotia, Canada', 'Full-Time', 40000, 52000, '1+ year fish processing experience preferred', 'Health benefits, housing support, overtime pay', 'Cut and prepare fish products to exact specifications for export markets.', 3, TRUE),
('Fish Trimmer', 'Seafood Processing', 'Nova Scotia, Canada', 'Full-Time', 38000, 48000, 'Basic knife skills, attention to detail', 'Full benefits package, overtime pay', 'Trim and clean fish products to meet quality standards.', 4, TRUE),
('Seafood Packer', 'Seafood Processing', 'Nova Scotia, Canada', 'Full-Time', 37000, 46000, 'Ability to work fast-paced environment', 'Benefits, overtime, paid vacation', 'Pack seafood products for domestic and international shipping.', 6, TRUE),
('Seafood Grader', 'Seafood Processing', 'Nova Scotia, Canada', 'Full-Time', 40000, 50000, 'Quality assessment experience preferred', 'Health and dental benefits', 'Grade seafood products by size and quality standards.', 2, TRUE),
('Quality Inspection Assistant', 'Quality Control', 'Nova Scotia, Canada', 'Full-Time', 42000, 55000, 'Food safety knowledge, attention to detail', 'Full benefits, advancement opportunities', 'Inspect seafood products to ensure compliance with quality standards.', 3, TRUE),
('Packaging Worker', 'Packaging', 'Nova Scotia, Canada', 'Full-Time', 37000, 46000, 'No experience required', 'Benefits, overtime, paid vacation', 'Package seafood products for retail and export.', 8, TRUE),
('Packaging Machine Operator', 'Packaging', 'Nova Scotia, Canada', 'Full-Time', 42000, 54000, '1+ year machine operation experience', 'Full benefits package', 'Operate automated packaging machinery.', 3, TRUE),
('Warehouse Associate', 'Warehouse', 'Nova Scotia, Canada', 'Full-Time', 39000, 50000, 'Physical fitness, forklift license an asset', 'Benefits, overtime, training provided', 'Manage warehouse inventory and shipping operations.', 5, TRUE),
('Logistics Coordinator', 'Logistics', 'Nova Scotia, Canada', 'Full-Time', 50000, 65000, '2+ years logistics experience, export knowledge', 'Full benefits, performance bonuses', 'Coordinate domestic and international shipping logistics.', 2, TRUE),
('Maintenance Technician', 'Equipment and Maintenance', 'Nova Scotia, Canada', 'Full-Time', 52000, 68000, 'Technical diploma, 2+ years maintenance experience', 'Full benefits, tool allowance', 'Maintain and repair processing equipment.', 2, TRUE),
('Cold Storage Worker', 'Cold Storage', 'Nova Scotia, Canada', 'Full-Time', 40000, 52000, 'Ability to work in cold environments (-25°C)', 'Cold environment allowance, full benefits', 'Operate in cold storage facilities managing frozen seafood inventory.', 4, TRUE),
('Quality Control Technician', 'Quality Control', 'Nova Scotia, Canada', 'Full-Time', 48000, 62000, 'Food science background, HACCP knowledge', 'Full benefits, professional development', 'Monitor quality control processes throughout production.', 2, TRUE),
('Sanitation Worker', 'Sanitation', 'Nova Scotia, Canada', 'Full-Time', 36000, 45000, 'Chemical handling certificate an asset', 'Benefits, overtime', 'Maintain cleanliness and sanitation in processing facilities.', 6, TRUE),
('Production Supervisor', 'Management', 'Nova Scotia, Canada', 'Full-Time', 65000, 85000, '3+ years supervisory experience, seafood industry preferred', 'Executive benefits, performance bonus, housing assistance', 'Oversee production line operations and staff management.', 2, TRUE),
('Warehouse Supervisor', 'Management', 'Nova Scotia, Canada', 'Full-Time', 60000, 78000, '3+ years warehouse management experience', 'Full benefits, performance bonus', 'Supervise warehouse team and operations.', 1, TRUE),
('Administrative Assistant', 'Administrative', 'Nova Scotia, Canada', 'Full-Time', 40000, 52000, 'Administrative experience, MS Office proficiency', 'Full benefits, professional environment', 'Provide administrative support to management teams.', 3, TRUE),
('Human Resources Assistant', 'Administrative', 'Nova Scotia, Canada', 'Full-Time', 42000, 55000, 'HR experience or education', 'Full benefits, HR career growth', 'Support HR functions including recruitment and employee relations.', 2, TRUE);
