-- Seed Users
INSERT INTO users (name, xp, department) VALUES
  ('Aditi Rao', 1500, 'Marketing'),
  ('Karan Shah', 1200, 'Engineering'),
  ('Mukilan S', 900, 'Product'),
  ('Priya Sharma', 600, 'Design'),
  ('Rahul Desai', 300, 'Sales');

-- Seed Challenges
INSERT INTO challenges (title, xp_reward, type) VALUES
  ('Tree Plantation', 500, 'Environmental'),
  ('Zero Waste Sprint', 300, 'Environmental'),
  ('Beach Cleanup', 400, 'Community'),
  ('Code for Good', 800, 'Volunteering');

-- Optionally, seed some participations
-- INSERT INTO participations (user_id, challenge_id, proof_url, status) VALUES
--   (1, 1, 'https://example.com/proof1.jpg', 'approved'),
--   (2, 2, 'https://example.com/proof2.jpg', 'pending');
