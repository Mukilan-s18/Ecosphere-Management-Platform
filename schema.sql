-- Create users table
CREATE TABLE users (
  id serial primary key, 
  name text, 
  xp int default 0, 
  department text
);

-- Create challenges table
CREATE TABLE challenges (
  id serial primary key, 
  title text, 
  xp_reward int, 
  type text
);

-- Create participations table
CREATE TABLE participations (
  id serial primary key, 
  user_id int, 
  challenge_id int, 
  proof_url text, 
  status text default 'pending'
);
