-- Seed sample opportunities
INSERT INTO public.opportunities (title, slug, organization, location, country, category, description, funding, duration, remote, featured)
VALUES
('Leadership Fellowship','leadership-fellowship','Be Independent Gal','Lagos, NG','Nigeria','Fellowships','A cohort-based leadership program for emerging women leaders.','$10,000','6 months', false, true),
('Women in Tech Scholarship','women-in-tech-scholarship','TechPartner','Remote','Global','Scholarships','Scholarship for women pursuing tech education.','$2,000','3 months', true, false),
('Small Business Grant','small-business-grant','BIG Fund','Nairobi, KE','Kenya','Grants','Grant for early-stage women-led businesses.','$5,000','One-time', false, false);
