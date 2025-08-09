-- Update existing admin user with correct credentials
-- This will set the admin login to use your actual foundation email
UPDATE admin_users 
SET 
  email = 'admin@adlaiheroesfoundation.com.ng',
  password_hash = '$2b$12$fdLMdlssDPKoYqre/MY6QedmgPAiegJeWxqhqaH.0CCN11d.IabB2'
WHERE role = 'super_admin'
OR email = 'admin@example.com';

-- If no admin exists, insert one
INSERT INTO admin_users (email, password_hash, role, permissions) 
VALUES ('admin@adlaiheroesfoundation.com.ng', '$2b$12$fdLMdlssDPKoYqre/MY6QedmgPAiegJeWxqhqaH.0CCN11d.IabB2', 'super_admin', ARRAY['all'])
ON CONFLICT (email) 
DO UPDATE SET password_hash = EXCLUDED.password_hash;