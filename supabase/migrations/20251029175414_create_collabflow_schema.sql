/*
  # CollabFlow Platform Database Schema

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `user_type` (text) - 'brand' or 'influencer'
      - `avatar_url` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `brands`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `company_name` (text)
      - `tier` (text) - 'A', 'B', 'C'
      - `industry` (text)
      - `description` (text)
      - `website` (text)
      - `budget_range` (text)
      - `created_at` (timestamptz)
    
    - `influencers`
      - `id` (uuid, primary key)
      - `profile_id` (uuid, references profiles)
      - `display_name` (text)
      - `tier` (text) - 'A', 'B', 'C'
      - `niche` (text)
      - `bio` (text)
      - `follower_count` (integer)
      - `avg_views` (integer)
      - `rating` (numeric)
      - `created_at` (timestamptz)
    
    - `campaigns`
      - `id` (uuid, primary key)
      - `brand_id` (uuid, references brands)
      - `title` (text)
      - `description` (text)
      - `budget` (text)
      - `required_reach` (text)
      - `status` (text) - 'active', 'completed', 'draft'
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `collaborations`
      - `id` (uuid, primary key)
      - `campaign_id` (uuid, references campaigns)
      - `influencer_id` (uuid, references influencers)
      - `status` (text) - 'pending', 'accepted', 'rejected', 'completed'
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
    - Brands can view influencers
    - Influencers can view campaigns
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  full_name text,
  user_type text NOT NULL CHECK (user_type IN ('brand', 'influencer')),
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  company_name text NOT NULL,
  tier text DEFAULT 'C' CHECK (tier IN ('A', 'B', 'C')),
  industry text,
  description text,
  website text,
  budget_range text,
  created_at timestamptz DEFAULT now()
);

-- Create influencers table
CREATE TABLE IF NOT EXISTS influencers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  display_name text NOT NULL,
  tier text DEFAULT 'C' CHECK (tier IN ('A', 'B', 'C')),
  niche text,
  bio text,
  follower_count integer DEFAULT 0,
  avg_views integer DEFAULT 0,
  rating numeric(3,2) DEFAULT 0.0,
  created_at timestamptz DEFAULT now()
);

-- Create campaigns table
CREATE TABLE IF NOT EXISTS campaigns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  brand_id uuid REFERENCES brands(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  budget text,
  required_reach text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create collaborations table
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id uuid REFERENCES campaigns(id) ON DELETE CASCADE NOT NULL,
  influencer_id uuid REFERENCES influencers(id) ON DELETE CASCADE NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Brands policies
CREATE POLICY "Brands can view own data"
  ON brands FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Brands can update own data"
  ON brands FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Brands can insert own data"
  ON brands FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Authenticated users can view all brands"
  ON brands FOR SELECT
  TO authenticated
  USING (true);

-- Influencers policies
CREATE POLICY "Influencers can view own data"
  ON influencers FOR SELECT
  TO authenticated
  USING (profile_id = auth.uid());

CREATE POLICY "Influencers can update own data"
  ON influencers FOR UPDATE
  TO authenticated
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Influencers can insert own data"
  ON influencers FOR INSERT
  TO authenticated
  WITH CHECK (profile_id = auth.uid());

CREATE POLICY "Authenticated users can view all influencers"
  ON influencers FOR SELECT
  TO authenticated
  USING (true);

-- Campaigns policies
CREATE POLICY "Brands can manage own campaigns"
  ON campaigns FOR ALL
  TO authenticated
  USING (
    brand_id IN (
      SELECT id FROM brands WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    brand_id IN (
      SELECT id FROM brands WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Authenticated users can view active campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (status = 'active');

-- Collaborations policies
CREATE POLICY "Brands can view collaborations for their campaigns"
  ON collaborations FOR SELECT
  TO authenticated
  USING (
    campaign_id IN (
      SELECT c.id FROM campaigns c
      JOIN brands b ON c.brand_id = b.id
      WHERE b.profile_id = auth.uid()
    )
  );

CREATE POLICY "Influencers can view their collaborations"
  ON collaborations FOR SELECT
  TO authenticated
  USING (
    influencer_id IN (
      SELECT id FROM influencers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Influencers can update their collaboration status"
  ON collaborations FOR UPDATE
  TO authenticated
  USING (
    influencer_id IN (
      SELECT id FROM influencers WHERE profile_id = auth.uid()
    )
  )
  WITH CHECK (
    influencer_id IN (
      SELECT id FROM influencers WHERE profile_id = auth.uid()
    )
  );

CREATE POLICY "Brands can create collaborations"
  ON collaborations FOR INSERT
  TO authenticated
  WITH CHECK (
    campaign_id IN (
      SELECT c.id FROM campaigns c
      JOIN brands b ON c.brand_id = b.id
      WHERE b.profile_id = auth.uid()
    )
  );