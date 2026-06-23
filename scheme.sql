-- 2026-06-04 10:49:59.6250
-- =============================================================
-- FitTrack — Teljes PostgreSQL séma
-- NextAuth v5 (@auth/pg-adapter) + alkalmazás táblák
-- =============================================================


-- =============================================================
-- 1. NEXTAUTH KÖTELEZŐ TÁBLÁK (@auth/pg-adapter elvárása)
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255),
  email          VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:49:59.6600
CREATE TABLE IF NOT EXISTS accounts (
  id                  SERIAL PRIMARY KEY,
  "userId"            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                VARCHAR(255) NOT NULL,
  provider            VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          BIGINT,
  id_token            TEXT,
  scope               TEXT,
  session_state       TEXT,
  token_type          TEXT
);

-- 2026-06-04 10:49:59.6880
CREATE TABLE IF NOT EXISTS sessions (
  id             SERIAL PRIMARY KEY,
  "userId"       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE
);

-- 2026-06-04 10:49:59.7130
CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  token      TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 2026-06-04 10:49:59.7400
-- =============================================================
-- 2. FELHASZNÁLÓI PROFIL
-- (onboarding adatok — külön tábla, nem piszkáljuk a NextAuth users-t)
-- =============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Alapadatok
  display_name     VARCHAR(100),
  date_of_birth    DATE,
  gender           VARCHAR(20),           -- 'male' | 'female' | 'other'

  -- Mértékegység preferencia
  units            VARCHAR(10) NOT NULL DEFAULT 'metric',  -- 'metric' | 'imperial'

  -- Testméretek (onboarding)
  height_cm        NUMERIC(5,1),
  weight_kg        NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),

  -- Cél és aktivitás
  goal             VARCHAR(30),           -- 'lose_weight' | 'build_muscle' | 'maintain'
  activity_level   VARCHAR(30),           -- 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'

  -- Számított kalóriacél (TDEE alapján, frissül ha profilt módosítanak)
  daily_calorie_goal   INTEGER,
  daily_protein_goal_g INTEGER,
  daily_carbs_goal_g   INTEGER,
  daily_fat_goal_g     INTEGER,
  daily_water_goal_ml  INTEGER DEFAULT 2500,

  -- Onboarding státusz
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:49:59.7690
-- =============================================================
-- 3. GYAKORLAT ADATBÁZIS
-- =============================================================

CREATE TABLE IF NOT EXISTS exercises (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- NULL = globális

  name            VARCHAR(150) NOT NULL,
  name_hu         VARCHAR(150),

  -- Kategorizálás
  muscle_group    VARCHAR(50) NOT NULL,
  -- 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  -- 'legs' | 'glutes' | 'core' | 'cardio' | 'full_body'

  secondary_muscles VARCHAR(150),         -- vesszővel elválasztva

  equipment       VARCHAR(50) NOT NULL,
  -- 'barbell' | 'dumbbell' | 'machine' | 'bodyweight'
  -- 'cable' | 'resistance_band' | 'kettlebell' | 'other'

  exercise_type   VARCHAR(20) NOT NULL DEFAULT 'strength',
  -- 'strength' | 'cardio' | 'stretching'

  instructions    TEXT,
  image_url       TEXT,                   -- V2: képfelismerés

  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,  -- felhasználó által hozzáadott
  is_archived     BOOLEAN NOT NULL DEFAULT FALSE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:49:59.7880
-- Index a kereséshez
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);

-- 2026-06-04 10:49:59.8120
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);

-- 2026-06-04 10:49:59.8420
-- =============================================================
-- 4. EDZÉS SABLONOK
-- =============================================================

CREATE TABLE IF NOT EXISTS workout_templates (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(150) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:49:59.8670
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id           SERIAL PRIMARY KEY,
  template_id  INTEGER NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  default_sets SMALLINT DEFAULT 3,
  default_reps SMALLINT DEFAULT 10,
  default_weight_kg NUMERIC(6,2)
);

-- 2026-06-04 10:49:59.8950
-- =============================================================
-- 5. EDZÉSNAPLÓK
-- =============================================================

CREATE TABLE IF NOT EXISTS workouts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES workout_templates(id) ON DELETE SET NULL,

  name        VARCHAR(150) NOT NULL,
  notes       TEXT,

  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,

  -- Összesítők (lementjük, hogy ne kelljen mindig számolni)
  total_volume_kg   NUMERIC(10,2),        -- összes kg * ismétlés
  total_sets        INTEGER,
  duration_seconds  INTEGER,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:49:59.9140
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);

-- 2026-06-04 10:49:59.9390
CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at DESC);

-- 2026-06-04 10:49:59.9690
CREATE TABLE IF NOT EXISTS workout_exercises (
  id          SERIAL PRIMARY KEY,
  workout_id  INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  notes       TEXT
);

-- 2026-06-04 10:49:59.9940
CREATE TABLE IF NOT EXISTS sets (
  id                   SERIAL PRIMARY KEY,
  workout_exercise_id  INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,

  set_number    SMALLINT NOT NULL,
  set_type      VARCHAR(20) DEFAULT 'normal',   -- 'normal' | 'warmup' | 'dropset' | 'failure'

  -- Erő
  weight_kg     NUMERIC(6,2),
  reps          SMALLINT,

  -- Kardió
  duration_seconds INTEGER,
  distance_meters  NUMERIC(8,2),

  -- RPE (Rate of Perceived Exertion) opcionális
  rpe           NUMERIC(3,1),              -- 1.0 - 10.0

  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ
);

-- 2026-06-04 10:50:00.0230
-- =============================================================
-- 6. TÁPLÁLKOZÁS
-- =============================================================

CREATE TABLE IF NOT EXISTS foods (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- NULL = globális

  name            VARCHAR(200) NOT NULL,
  name_hu         VARCHAR(200),
  brand           VARCHAR(100),
  barcode         VARCHAR(50),

  -- Tápértékek 100g-ra vonatkoztatva
  calories_per_100g  NUMERIC(7,2) NOT NULL,
  protein_per_100g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_per_100g     NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_per_100g       NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_per_100g     NUMERIC(6,2),
  sugar_per_100g     NUMERIC(6,2),

  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.0420
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods USING gin(to_tsvector('simple', name));

-- 2026-06-04 10:50:00.0700
CREATE TABLE IF NOT EXISTS meals (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  date        DATE NOT NULL,              -- melyik napra
  meal_type   VARCHAR(20) NOT NULL,       -- 'breakfast' | 'lunch' | 'dinner' | 'snack'

  -- Összesítők (lementjük)
  total_calories NUMERIC(8,2),
  total_protein  NUMERIC(6,2),
  total_carbs    NUMERIC(6,2),
  total_fat      NUMERIC(6,2),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.0930
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date DESC);

-- 2026-06-04 10:50:00.1200
CREATE TABLE IF NOT EXISTS meal_items (
  id          SERIAL PRIMARY KEY,
  meal_id     INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id     INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,

  quantity_g  NUMERIC(7,2) NOT NULL,      -- adagméret grammban

  -- Számított értékek (quantity_g / 100 * per_100g)
  calories    NUMERIC(7,2),
  protein     NUMERIC(6,2),
  carbs       NUMERIC(6,2),
  fat         NUMERIC(6,2)
);

-- 2026-06-04 10:50:00.1470
-- =============================================================
-- 7. VÍZBEVITEL
-- =============================================================

CREATE TABLE IF NOT EXISTS water_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  amount_ml   INTEGER NOT NULL,           -- egy bejegyzés = egy pohár/adag
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.1700
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, date DESC);

-- 2026-06-04 10:50:00.2010
-- =============================================================
-- 8. TESTMÉRÉSEK (HALADÁSKÖVETÉS)
-- =============================================================

CREATE TABLE IF NOT EXISTS body_measurements (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  date        DATE NOT NULL,
  weight_kg   NUMERIC(5,2),               -- testsúly

  -- Körméretek (cm)
  neck_cm     NUMERIC(5,1),
  chest_cm    NUMERIC(5,1),
  waist_cm    NUMERIC(5,1),
  hips_cm     NUMERIC(5,1),
  arm_cm      NUMERIC(5,1),               -- bicepsz összeszorítva
  thigh_cm    NUMERIC(5,1),
  calf_cm     NUMERIC(5,1),

  body_fat_pct NUMERIC(4,1),             -- testzsír %

  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.2210
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, date DESC);

-- 2026-06-04 10:50:00.2490
-- =============================================================
-- 9. CÉLOK & STREAK
-- =============================================================

CREATE TABLE IF NOT EXISTS user_goals (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  goal_type   VARCHAR(50) NOT NULL,
  -- 'daily_calories' | 'daily_workouts' | 'weekly_workouts'
  -- 'target_weight' | 'daily_water' | 'daily_steps'

  target_value NUMERIC(10,2) NOT NULL,
  unit         VARCHAR(20),              -- 'kcal' | 'workouts' | 'kg' | 'ml'

  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.2770
CREATE TABLE IF NOT EXISTS streaks (
  id                   SERIAL PRIMARY KEY,
  user_id              INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  current_streak       INTEGER NOT NULL DEFAULT 0,   -- jelenlegi sorozat (napok)
  longest_streak       INTEGER NOT NULL DEFAULT 0,   -- valaha volt leghosszabb
  last_activity_date   DATE,                         -- utolsó aktív nap
  streak_updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.3040
-- =============================================================
-- 10. PERSONAL RECORDS (PR) — automatikusan frissül
-- =============================================================

CREATE TABLE IF NOT EXISTS personal_records (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  record_type  VARCHAR(20) NOT NULL,      -- 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'
  value        NUMERIC(10,2) NOT NULL,
  set_id       INTEGER REFERENCES sets(id) ON DELETE SET NULL,
  achieved_at  TIMESTAMPTZ NOT NULL,

  UNIQUE(user_id, exercise_id, record_type)
);

-- 2026-06-04 10:50:00.3250
-- =============================================================
-- HASZNOS NÉZETEK (VIEWS)
-- =============================================================

-- Napi kalória összesítő (dashboard-hoz)
CREATE OR REPLACE VIEW daily_nutrition_summary AS
SELECT
  m.user_id,
  m.date,
  COALESCE(SUM(mi.calories), 0)  AS total_calories,
  COALESCE(SUM(mi.protein), 0)   AS total_protein,
  COALESCE(SUM(mi.carbs), 0)     AS total_carbs,
  COALESCE(SUM(mi.fat), 0)       AS total_fat
FROM meals m
LEFT JOIN meal_items mi ON mi.meal_id = m.id
GROUP BY m.user_id, m.date;

-- 2026-06-04 10:50:00.3480
-- Heti edzés heatmap (dashboard GitHub-style)
CREATE OR REPLACE VIEW weekly_workout_activity AS
SELECT
  user_id,
  DATE_TRUNC('day', started_at)::DATE AS activity_date,
  COUNT(*)                             AS workout_count,
  COALESCE(SUM(total_volume_kg), 0)   AS total_volume_kg
FROM workouts
WHERE finished_at IS NOT NULL
GROUP BY user_id, DATE_TRUNC('day', started_at)::DATE;

-- 2026-06-04 10:50:00.3750
-- =============================================================
-- SEED: ALAP GYAKORLATOK (részlet)
-- =============================================================

INSERT INTO exercises (name, name_hu, muscle_group, equipment, exercise_type) VALUES
-- Mellkas
('Bench Press',            'Fekvenyomás',              'chest',     'barbell',    'strength'),
('Incline Bench Press',    'Emelkedő fekvenyomás',      'chest',     'barbell',    'strength'),
('Dumbbell Flye',          'Pillangó súlyzóval',        'chest',     'dumbbell',   'strength'),
('Push-up',                'Fekvőtámasz',               'chest',     'bodyweight', 'strength'),
('Cable Crossover',        'Kábel crossover',           'chest',     'cable',      'strength'),
-- Hát
('Deadlift',               'Felhúzás',                  'back',      'barbell',    'strength'),
('Pull-up',                'Húzódzkodás',               'back',      'bodyweight', 'strength'),
('Bent Over Row',          'Előrehajolt evezés',        'back',      'barbell',    'strength'),
('Lat Pulldown',           'Lehúzás',                   'back',      'machine',    'strength'),
('Seated Cable Row',       'Ülő kábel evezés',          'back',      'cable',      'strength'),
-- Váll
('Overhead Press',         'Nyomás fej felett',         'shoulders', 'barbell',    'strength'),
('Dumbbell Lateral Raise', 'Oldalemelés',               'shoulders', 'dumbbell',   'strength'),
('Face Pull',              'Archoz húzás',              'shoulders', 'cable',      'strength'),
-- Bicepsz
('Barbell Curl',           'Rúd bicepsz hajlítás',      'biceps',    'barbell',    'strength'),
('Dumbbell Curl',          'Súlyzós bicepsz hajlítás',  'biceps',    'dumbbell',   'strength'),
('Hammer Curl',            'Kalapács hajlítás',         'biceps',    'dumbbell',   'strength'),
-- Tricepsz
('Tricep Pushdown',        'Tricepsz lenyomás',         'triceps',   'cable',      'strength'),
('Skull Crusher',          'Fekvő tricepsz',            'triceps',   'barbell',    'strength'),
('Dips',                   'Tolódzkodás',               'triceps',   'bodyweight', 'strength'),
-- Láb
('Squat',                  'Guggolás',                  'legs',      'barbell',    'strength'),
('Leg Press',              'Lábtoló',                   'legs',      'machine',    'strength'),
('Romanian Deadlift',      'Román felhúzás',            'legs',      'barbell',    'strength'),
('Leg Curl',               'Fekvő lábhajlítás',         'legs',      'machine',    'strength'),
('Leg Extension',          'Lábnyújtás gépen',          'legs',      'machine',    'strength'),
('Lunges',                 'Kitörés',                   'legs',      'bodyweight', 'strength'),
('Calf Raise',             'Lábujjhegyre emelkedés',    'legs',      'machine',    'strength'),
-- Core
('Plank',                  'Deszka',                    'core',      'bodyweight', 'strength'),
('Crunch',                 'Hasprés',                   'core',      'bodyweight', 'strength'),
('Hanging Leg Raise',      'Lógó lábemeléss',           'core',      'bodyweight', 'strength'),
-- Kardió
('Running',                'Futás',                     'cardio',    'other',      'cardio'),
('Cycling',                'Kerékpározás',              'cardio',    'other',      'cardio'),
('Rowing Machine',         'Evezőgép',                  'cardio',    'machine',    'cardio'),
('Jump Rope',              'Ugrókötél',                 'cardio',    'other',      'cardio')
ON CONFLICT DO NOTHING;

-- 2026-06-04 10:50:00.6600
-- =============================================================
-- FitTrack — Teljes PostgreSQL séma
-- NextAuth v5 (@auth/pg-adapter) + alkalmazás táblák
-- =============================================================


-- =============================================================
-- 1. NEXTAUTH KÖTELEZŐ TÁBLÁK (@auth/pg-adapter elvárása)
-- =============================================================

CREATE TABLE IF NOT EXISTS users (
  id             SERIAL PRIMARY KEY,
  name           VARCHAR(255),
  email          VARCHAR(255) UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image          TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.6940
CREATE TABLE IF NOT EXISTS accounts (
  id                  SERIAL PRIMARY KEY,
  "userId"            INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type                VARCHAR(255) NOT NULL,
  provider            VARCHAR(255) NOT NULL,
  "providerAccountId" VARCHAR(255) NOT NULL,
  refresh_token       TEXT,
  access_token        TEXT,
  expires_at          BIGINT,
  id_token            TEXT,
  scope               TEXT,
  session_state       TEXT,
  token_type          TEXT
);

-- 2026-06-04 10:50:00.7220
CREATE TABLE IF NOT EXISTS sessions (
  id             SERIAL PRIMARY KEY,
  "userId"       INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires        TIMESTAMPTZ NOT NULL,
  "sessionToken" VARCHAR(255) NOT NULL UNIQUE
);

-- 2026-06-04 10:50:00.7480
CREATE TABLE IF NOT EXISTS verification_token (
  identifier TEXT NOT NULL,
  expires    TIMESTAMPTZ NOT NULL,
  token      TEXT NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 2026-06-04 10:50:00.7750
-- =============================================================
-- 2. FELHASZNÁLÓI PROFIL
-- (onboarding adatok — külön tábla, nem piszkáljuk a NextAuth users-t)
-- =============================================================

CREATE TABLE IF NOT EXISTS user_profiles (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  -- Alapadatok
  display_name     VARCHAR(100),
  date_of_birth    DATE,
  gender           VARCHAR(20),           -- 'male' | 'female' | 'other'

  -- Mértékegység preferencia
  units            VARCHAR(10) NOT NULL DEFAULT 'metric',  -- 'metric' | 'imperial'

  -- Testméretek (onboarding)
  height_cm        NUMERIC(5,1),
  weight_kg        NUMERIC(5,2),
  target_weight_kg NUMERIC(5,2),

  -- Cél és aktivitás
  goal             VARCHAR(30),           -- 'lose_weight' | 'build_muscle' | 'maintain'
  activity_level   VARCHAR(30),           -- 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active'

  -- Számított kalóriacél (TDEE alapján, frissül ha profilt módosítanak)
  daily_calorie_goal   INTEGER,
  daily_protein_goal_g INTEGER,
  daily_carbs_goal_g   INTEGER,
  daily_fat_goal_g     INTEGER,
  daily_water_goal_ml  INTEGER DEFAULT 2500,

  -- Onboarding státusz
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,

  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.8010
-- =============================================================
-- 3. GYAKORLAT ADATBÁZIS
-- =============================================================

CREATE TABLE IF NOT EXISTS exercises (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- NULL = globális

  name            VARCHAR(150) NOT NULL,
  name_hu         VARCHAR(150),

  -- Kategorizálás
  muscle_group    VARCHAR(50) NOT NULL,
  -- 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps'
  -- 'legs' | 'glutes' | 'core' | 'cardio' | 'full_body'

  secondary_muscles VARCHAR(150),         -- vesszővel elválasztva

  equipment       VARCHAR(50) NOT NULL,
  -- 'barbell' | 'dumbbell' | 'machine' | 'bodyweight'
  -- 'cable' | 'resistance_band' | 'kettlebell' | 'other'

  exercise_type   VARCHAR(20) NOT NULL DEFAULT 'strength',
  -- 'strength' | 'cardio' | 'stretching'

  instructions    TEXT,
  image_url       TEXT,                   -- V2: képfelismerés

  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,  -- felhasználó által hozzáadott
  is_archived     BOOLEAN NOT NULL DEFAULT FALSE,

  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.8270
-- Index a kereséshez
CREATE INDEX IF NOT EXISTS idx_exercises_muscle_group ON exercises(muscle_group);

-- 2026-06-04 10:50:00.8540
CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);

-- 2026-06-04 10:50:00.8800
-- =============================================================
-- 4. EDZÉS SABLONOK
-- =============================================================

CREATE TABLE IF NOT EXISTS workout_templates (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(150) NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.9070
CREATE TABLE IF NOT EXISTS workout_template_exercises (
  id           SERIAL PRIMARY KEY,
  template_id  INTEGER NOT NULL REFERENCES workout_templates(id) ON DELETE CASCADE,
  exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order   SMALLINT NOT NULL DEFAULT 0,
  default_sets SMALLINT DEFAULT 3,
  default_reps SMALLINT DEFAULT 10,
  default_weight_kg NUMERIC(6,2)
);

-- 2026-06-04 10:50:00.9330
-- =============================================================
-- 5. EDZÉSNAPLÓK
-- =============================================================

CREATE TABLE IF NOT EXISTS workouts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id INTEGER REFERENCES workout_templates(id) ON DELETE SET NULL,

  name        VARCHAR(150) NOT NULL,
  notes       TEXT,

  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at TIMESTAMPTZ,

  -- Összesítők (lementjük, hogy ne kelljen mindig számolni)
  total_volume_kg   NUMERIC(10,2),        -- összes kg * ismétlés
  total_sets        INTEGER,
  duration_seconds  INTEGER,

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:00.9600
CREATE INDEX IF NOT EXISTS idx_workouts_user_id ON workouts(user_id);

-- 2026-06-04 10:50:00.9870
CREATE INDEX IF NOT EXISTS idx_workouts_started_at ON workouts(started_at DESC);

-- 2026-06-04 10:50:01.0140
CREATE TABLE IF NOT EXISTS workout_exercises (
  id          SERIAL PRIMARY KEY,
  workout_id  INTEGER NOT NULL REFERENCES workouts(id) ON DELETE CASCADE,
  exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
  sort_order  SMALLINT NOT NULL DEFAULT 0,
  notes       TEXT
);

-- 2026-06-04 10:50:01.0410
CREATE TABLE IF NOT EXISTS sets (
  id                   SERIAL PRIMARY KEY,
  workout_exercise_id  INTEGER NOT NULL REFERENCES workout_exercises(id) ON DELETE CASCADE,

  set_number    SMALLINT NOT NULL,
  set_type      VARCHAR(20) DEFAULT 'normal',   -- 'normal' | 'warmup' | 'dropset' | 'failure'

  -- Erő
  weight_kg     NUMERIC(6,2),
  reps          SMALLINT,

  -- Kardió
  duration_seconds INTEGER,
  distance_meters  NUMERIC(8,2),

  -- RPE (Rate of Perceived Exertion) opcionális
  rpe           NUMERIC(3,1),              -- 1.0 - 10.0

  is_completed  BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at  TIMESTAMPTZ
);

-- 2026-06-04 10:50:01.0690
-- =============================================================
-- 6. TÁPLÁLKOZÁS
-- =============================================================

CREATE TABLE IF NOT EXISTS foods (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER REFERENCES users(id) ON DELETE CASCADE,  -- NULL = globális

  name            VARCHAR(200) NOT NULL,
  name_hu         VARCHAR(200),
  brand           VARCHAR(100),
  barcode         VARCHAR(50),

  -- Tápértékek 100g-ra vonatkoztatva
  calories_per_100g  NUMERIC(7,2) NOT NULL,
  protein_per_100g   NUMERIC(6,2) NOT NULL DEFAULT 0,
  carbs_per_100g     NUMERIC(6,2) NOT NULL DEFAULT 0,
  fat_per_100g       NUMERIC(6,2) NOT NULL DEFAULT 0,
  fiber_per_100g     NUMERIC(6,2),
  sugar_per_100g     NUMERIC(6,2),

  is_custom       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.0960
CREATE INDEX IF NOT EXISTS idx_foods_name ON foods USING gin(to_tsvector('simple', name));

-- 2026-06-04 10:50:01.1230
CREATE TABLE IF NOT EXISTS meals (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  date        DATE NOT NULL,              -- melyik napra
  meal_type   VARCHAR(20) NOT NULL,       -- 'breakfast' | 'lunch' | 'dinner' | 'snack'

  -- Összesítők (lementjük)
  total_calories NUMERIC(8,2),
  total_protein  NUMERIC(6,2),
  total_carbs    NUMERIC(6,2),
  total_fat      NUMERIC(6,2),

  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.1500
CREATE INDEX IF NOT EXISTS idx_meals_user_date ON meals(user_id, date DESC);

-- 2026-06-04 10:50:01.1770
CREATE TABLE IF NOT EXISTS meal_items (
  id          SERIAL PRIMARY KEY,
  meal_id     INTEGER NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
  food_id     INTEGER NOT NULL REFERENCES foods(id) ON DELETE CASCADE,

  quantity_g  NUMERIC(7,2) NOT NULL,      -- adagméret grammban

  -- Számított értékek (quantity_g / 100 * per_100g)
  calories    NUMERIC(7,2),
  protein     NUMERIC(6,2),
  carbs       NUMERIC(6,2),
  fat         NUMERIC(6,2)
);

-- 2026-06-04 10:50:01.2040
-- =============================================================
-- 7. VÍZBEVITEL
-- =============================================================

CREATE TABLE IF NOT EXISTS water_logs (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date        DATE NOT NULL,
  amount_ml   INTEGER NOT NULL,           -- egy bejegyzés = egy pohár/adag
  logged_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.2310
CREATE INDEX IF NOT EXISTS idx_water_logs_user_date ON water_logs(user_id, date DESC);

-- 2026-06-04 10:50:01.2580
-- =============================================================
-- 8. TESTMÉRÉSEK (HALADÁSKÖVETÉS)
-- =============================================================

CREATE TABLE IF NOT EXISTS body_measurements (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  date        DATE NOT NULL,
  weight_kg   NUMERIC(5,2),               -- testsúly

  -- Körméretek (cm)
  neck_cm     NUMERIC(5,1),
  chest_cm    NUMERIC(5,1),
  waist_cm    NUMERIC(5,1),
  hips_cm     NUMERIC(5,1),
  arm_cm      NUMERIC(5,1),               -- bicepsz összeszorítva
  thigh_cm    NUMERIC(5,1),
  calf_cm     NUMERIC(5,1),

  body_fat_pct NUMERIC(4,1),             -- testzsír %

  notes       TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.2870
CREATE INDEX IF NOT EXISTS idx_body_measurements_user_date ON body_measurements(user_id, date DESC);

-- 2026-06-04 10:50:01.3140
-- =============================================================
-- 9. CÉLOK & STREAK
-- =============================================================

CREATE TABLE IF NOT EXISTS user_goals (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

  goal_type   VARCHAR(50) NOT NULL,
  -- 'daily_calories' | 'daily_workouts' | 'weekly_workouts'
  -- 'target_weight' | 'daily_water' | 'daily_steps'

  target_value NUMERIC(10,2) NOT NULL,
  unit         VARCHAR(20),              -- 'kcal' | 'workouts' | 'kg' | 'ml'

  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.3420
CREATE TABLE IF NOT EXISTS streaks (
  id                   SERIAL PRIMARY KEY,
  user_id              INTEGER NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,

  current_streak       INTEGER NOT NULL DEFAULT 0,   -- jelenlegi sorozat (napok)
  longest_streak       INTEGER NOT NULL DEFAULT 0,   -- valaha volt leghosszabb
  last_activity_date   DATE,                         -- utolsó aktív nap
  streak_updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2026-06-04 10:50:01.3700
-- =============================================================
-- 10. PERSONAL RECORDS (PR) — automatikusan frissül
-- =============================================================

CREATE TABLE IF NOT EXISTS personal_records (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  exercise_id  INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,

  record_type  VARCHAR(20) NOT NULL,      -- 'max_weight' | 'max_reps' | 'max_volume' | 'estimated_1rm'
  value        NUMERIC(10,2) NOT NULL,
  set_id       INTEGER REFERENCES sets(id) ON DELETE SET NULL,
  achieved_at  TIMESTAMPTZ NOT NULL,

  UNIQUE(user_id, exercise_id, record_type)
);

-- 2026-06-04 10:50:01.4000
-- =============================================================
-- HASZNOS NÉZETEK (VIEWS)
-- =============================================================

-- Napi kalória összesítő (dashboard-hoz)
CREATE OR REPLACE VIEW daily_nutrition_summary AS
SELECT
  m.user_id,
  m.date,
  COALESCE(SUM(mi.calories), 0)  AS total_calories,
  COALESCE(SUM(mi.protein), 0)   AS total_protein,
  COALESCE(SUM(mi.carbs), 0)     AS total_carbs,
  COALESCE(SUM(mi.fat), 0)       AS total_fat
FROM meals m
LEFT JOIN meal_items mi ON mi.meal_id = m.id
GROUP BY m.user_id, m.date;

-- 2026-06-04 10:50:01.4270
-- Heti edzés heatmap (dashboard GitHub-style)
CREATE OR REPLACE VIEW weekly_workout_activity AS
SELECT
  user_id,
  DATE_TRUNC('day', started_at)::DATE AS activity_date,
  COUNT(*)                             AS workout_count,
  COALESCE(SUM(total_volume_kg), 0)   AS total_volume_kg
FROM workouts
WHERE finished_at IS NOT NULL
GROUP BY user_id, DATE_TRUNC('day', started_at)::DATE;

-- 2026-06-04 10:50:01.4560
-- =============================================================
-- SEED: ALAP GYAKORLATOK (részlet)
-- =============================================================

INSERT INTO exercises (name, name_hu, muscle_group, equipment, exercise_type) VALUES
-- Mellkas
('Bench Press',            'Fekvenyomás',              'chest',     'barbell',    'strength'),
('Incline Bench Press',    'Emelkedő fekvenyomás',      'chest',     'barbell',    'strength'),
('Dumbbell Flye',          'Pillangó súlyzóval',        'chest',     'dumbbell',   'strength'),
('Push-up',                'Fekvőtámasz',               'chest',     'bodyweight', 'strength'),
('Cable Crossover',        'Kábel crossover',           'chest',     'cable',      'strength'),
-- Hát
('Deadlift',               'Felhúzás',                  'back',      'barbell',    'strength'),
('Pull-up',                'Húzódzkodás',               'back',      'bodyweight', 'strength'),
('Bent Over Row',          'Előrehajolt evezés',        'back',      'barbell',    'strength'),
('Lat Pulldown',           'Lehúzás',                   'back',      'machine',    'strength'),
('Seated Cable Row',       'Ülő kábel evezés',          'back',      'cable',      'strength'),
-- Váll
('Overhead Press',         'Nyomás fej felett',         'shoulders', 'barbell',    'strength'),
('Dumbbell Lateral Raise', 'Oldalemelés',               'shoulders', 'dumbbell',   'strength'),
('Face Pull',              'Archoz húzás',              'shoulders', 'cable',      'strength'),
-- Bicepsz
('Barbell Curl',           'Rúd bicepsz hajlítás',      'biceps',    'barbell',    'strength'),
('Dumbbell Curl',          'Súlyzós bicepsz hajlítás',  'biceps',    'dumbbell',   'strength'),
('Hammer Curl',            'Kalapács hajlítás',         'biceps',    'dumbbell',   'strength'),
-- Tricepsz
('Tricep Pushdown',        'Tricepsz lenyomás',         'triceps',   'cable',      'strength'),
('Skull Crusher',          'Fekvő tricepsz',            'triceps',   'barbell',    'strength'),
('Dips',                   'Tolódzkodás',               'triceps',   'bodyweight', 'strength'),
-- Láb
('Squat',                  'Guggolás',                  'legs',      'barbell',    'strength'),
('Leg Press',              'Lábtoló',                   'legs',      'machine',    'strength'),
('Romanian Deadlift',      'Román felhúzás',            'legs',      'barbell',    'strength'),
('Leg Curl',               'Fekvő lábhajlítás',         'legs',      'machine',    'strength'),
('Leg Extension',          'Lábnyújtás gépen',          'legs',      'machine',    'strength'),
('Lunges',                 'Kitörés',                   'legs',      'bodyweight', 'strength'),
('Calf Raise',             'Lábujjhegyre emelkedés',    'legs',      'machine',    'strength'),
-- Core
('Plank',                  'Deszka',                    'core',      'bodyweight', 'strength'),
('Crunch',                 'Hasprés',                   'core',      'bodyweight', 'strength'),
('Hanging Leg Raise',      'Lógó lábemeléss',           'core',      'bodyweight', 'strength'),
-- Kardió
('Running',                'Futás',                     'cardio',    'other',      'cardio'),
('Cycling',                'Kerékpározás',              'cardio',    'other',      'cardio'),
('Rowing Machine',         'Evezőgép',                  'cardio',    'machine',    'cardio'),
('Jump Rope',              'Ugrókötél',                 'cardio',    'other',      'cardio')
ON CONFLICT DO NOTHING