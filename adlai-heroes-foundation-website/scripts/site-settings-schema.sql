-- Create site settings table for contact details and payment information
CREATE TABLE IF NOT EXISTS site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  display_name VARCHAR(200),
  description TEXT,
  input_type VARCHAR(50) DEFAULT 'text', -- text, url, textarea, image, etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at_trigger
    BEFORE UPDATE ON site_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_site_settings_updated_at();

-- Insert default settings for contact and payment information
INSERT INTO site_settings (setting_key, setting_value, category, display_name, description, input_type) VALUES
-- Contact Information
('contact_email', 'admin@adlaiheroesfoundation.com.ng', 'contact', 'Contact Email', 'Main contact email address', 'email'),
('contact_phone', '+234 708 306 0892', 'contact', 'Contact Phone', 'Primary phone number', 'tel'),
('contact_address', 'Nigeria', 'contact', 'Contact Address', 'Physical address', 'textarea'),

-- Social Media URLs (empty by default - will be hidden if empty)
('facebook_url', '', 'social', 'Facebook URL', 'Facebook page URL', 'url'),
('twitter_url', '', 'social', 'Twitter URL', 'Twitter/X profile URL', 'url'),
('instagram_url', '', 'social', 'Instagram URL', 'Instagram profile URL', 'url'),
('linkedin_url', '', 'social', 'LinkedIn URL', 'LinkedIn profile URL', 'url'),
('youtube_url', '', 'social', 'YouTube URL', 'YouTube channel URL', 'url'),

-- Payment Information
('bank_name', '', 'payment', 'Bank Name', 'Name of the bank for donations', 'text'),
('account_number', '', 'payment', 'Account Number', 'Bank account number for donations', 'text'),
('account_name', '', 'payment', 'Account Name', 'Name on the bank account', 'text'),
('payment_qr_code', '', 'payment', 'QR Code Image', 'QR code for mobile payments', 'image'),

-- Action Links
('donate_button_url', '/donate', 'links', 'Donate Button URL', 'URL for the main donate button', 'url'),
('volunteer_button_url', '/volunteer', 'links', 'Volunteer Button URL', 'URL for the volunteer signup', 'url'),

-- Website Information
('site_description', 'Empowering futures through education, healthcare, and community development', 'general', 'Site Description', 'Main site description for footer', 'textarea')

ON CONFLICT (setting_key) DO NOTHING;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow read access to all users" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow full access to service role" ON site_settings USING (auth.role() = 'service_role');

COMMENT ON TABLE site_settings IS 'Store site-wide configuration settings for contact, payment, and social media information';