-- Esquema de Base de Datos para MotoDoctores (Supabase)

-- 1. Perfiles (Médicos y Pacientes)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  full_name TEXT,
  avatar_url TEXT,
  role TEXT CHECK (role IN ('patient', 'doctor', 'admin')) DEFAULT 'patient',
  phone TEXT,
  specialty TEXT, -- Solo para doctores
  license_number TEXT, -- Solo para doctores
  status TEXT DEFAULT 'activo', -- activo, inactivo, disponible, en_consulta
  allergies TEXT -- Solo para pacientes
);

-- 2. Citas (Appointments)
CREATE TYPE appointment_status AS ENUM ('solicitado', 'en_camino', 'en_consulta', 'finalizado', 'cancelado');

CREATE TABLE appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  patient_id UUID REFERENCES profiles(id) NOT NULL,
  doctor_id UUID REFERENCES profiles(id),
  status appointment_status DEFAULT 'solicitado',
  description TEXT,
  address TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  total_price DECIMAL(10,2),
  prescription_url TEXT,
  diagnosis TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  review TEXT
);

-- 3. Ubicaciones en tiempo real (Locations)
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Triaje IA (Triage Logs)
CREATE TABLE triage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES profiles(id),
  symptoms TEXT,
  severity TEXT, -- Verde, Amarillo, Rojo
  recommendations TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 4. Storage Buckets (Instrucciones para Supabase Dashboard)
-- Crear bucket 'prescriptions' con acceso privado o público según necesidad.
-- Configurar políticas de storage para permitir lectura al dueño de la cita.

-- RLS (Row Level Security)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;

-- Políticas básicas
CREATE POLICY "Public profiles are viewable by everyone." ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile." ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Patients can see their own appointments." ON appointments FOR SELECT USING (auth.uid() = patient_id);
CREATE POLICY "Doctors can see assigned appointments." ON appointments FOR SELECT USING (auth.uid() = doctor_id);
CREATE POLICY "Patients can create appointments." ON appointments FOR INSERT WITH CHECK (auth.uid() = patient_id);

CREATE POLICY "Locations are viewable by assigned parties." ON locations FOR SELECT USING (true);
CREATE POLICY "Users can update their own location." ON locations FOR INSERT WITH CHECK (auth.uid() = profile_id);
