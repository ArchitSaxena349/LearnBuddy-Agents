-- 001_init.sql
-- Initial schema for LearnBuddy (designed for Supabase / Postgres)

-- Enable needed extensions
create extension if not exists "pgcrypto";

-- Profiles (linked to Supabase Auth users via `auth.uid`)
create table if not exists profiles (
  id uuid primary key default gen_random_uuid(),
  auth_id uuid unique,
  full_name text,
  email text unique,
  role text default 'student', -- student | instructor | admin
  created_at timestamptz default now()
);

-- Courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique,
  title text not null,
  description text,
  published boolean default false,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz default now()
);

-- Lessons (belongs to course)
create table if not exists lessons (
  id uuid primary key default gen_random_uuid(),
  course_id uuid references courses(id) on delete cascade,
  title text not null,
  content text,
  position int default 0,
  created_at timestamptz default now()
);

-- Enrollments (many-to-many users <-> courses)
create table if not exists enrollments (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  course_id uuid references courses(id) on delete cascade,
  role text default 'student', -- student | instructor
  enrolled_at timestamptz default now(),
  unique(profile_id, course_id)
);

-- Companion messages / chat history for learner-bot
create table if not exists companion_messages (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  role text not null, -- user | assistant | system
  content text not null,
  metadata jsonb,
  created_at timestamptz default now()
);

-- Simple session table (optional)
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  refresh_token text,
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- Indexes for common lookups
create index if not exists idx_profiles_auth_id on profiles(auth_id);
create index if not exists idx_courses_slug on courses(slug);
create index if not exists idx_enrollments_profile on enrollments(profile_id);
