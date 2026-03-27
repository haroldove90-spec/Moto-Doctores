-- 1. INSERTAR PERFILES (Admin, Médicos y Pacientes)
INSERT INTO profiles (id, full_name, role, avatar_url, specialty, license_number, status, allergies)
VALUES 
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Harold Ove', 'admin', 'https://i.pravatar.cc/150?u=admin', NULL, NULL, 'activo', NULL),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Dr. García', 'doctor', 'https://i.pravatar.cc/150?u=garcia', 'Urgencias', 'MED-778899', 'disponible', NULL),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Dra. Sánchez', 'doctor', 'https://i.pravatar.cc/150?u=sanchez', 'Pediatría', 'MED-112233', 'en_consulta', NULL),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Dr. Ruiz', 'doctor', 'https://i.pravatar.cc/150?u=ruiz', 'General', 'MED-445566', 'disponible', NULL),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Juan Pérez', 'patient', 'https://i.pravatar.cc/150?u=juan', NULL, NULL, 'activo', 'Penicilina'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'María García', 'patient', 'https://i.pravatar.cc/150?u=maria', NULL, NULL, 'activo', 'Ninguna'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Carlos Slim', 'patient', 'https://i.pravatar.cc/150?u=carlos', NULL, NULL, 'activo', 'Polen'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'Lucía Méndez', 'patient', 'https://i.pravatar.cc/150?u=lucia', NULL, NULL, 'activo', 'Lactosa'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'Roberto Gómez', 'patient', 'https://i.pravatar.cc/150?u=roberto', NULL, NULL, 'activo', 'Ninguna');

-- 2. INSERTAR UBICACIONES (Motos en CDMX)
INSERT INTO locations (profile_id, latitude, longitude)
VALUES 
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 19.4326, -99.1332),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 19.4284, -99.1276),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 19.4400, -99.1450);

-- 3. INSERTAR CITAS (Historial y Activas)
INSERT INTO appointments (patient_id, doctor_id, status, address, total_price, diagnosis, prescription_url, rating, review, created_at)
VALUES 
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'finalizado', 'Av. Reforma 222', 1500, 'Gripe estacional', 'https://storage.moto.doc/receta1.pdf', 5, 'Excelente servicio, llegó muy rápido.', NOW() - INTERVAL '5 days'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'finalizado', 'Colonia Roma Norte', 1500, 'Infección estomacal', 'https://storage.moto.doc/receta2.pdf', 5, 'Muy profesional la doctora.', NOW() - INTERVAL '4 days'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'finalizado', 'Polanco III Sección', 1500, 'Migraña tensional', 'https://storage.moto.doc/receta3.pdf', 5, 'La moto evitó todo el tráfico.', NOW() - INTERVAL '3 days'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'finalizado', 'Condesa', 1500, 'Faringitis aguda', 'https://storage.moto.doc/receta4.pdf', 5, 'Recomendado 100%.', NOW() - INTERVAL '2 days'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'finalizado', 'Santa Fe', 1500, 'Alergia cutánea', 'https://storage.moto.doc/receta5.pdf', 5, 'Atención de primer nivel.', NOW() - INTERVAL '1 day'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'en_camino', 'Insurgentes Sur', 1500, NULL, NULL, NULL, NULL, NOW()),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'en_camino', 'Coyoacán Centro', 1500, NULL, NULL, NULL, NULL, NOW()),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', NULL, 'solicitado', 'Lomas de Chapultepec', 1500, NULL, NULL, NULL, NULL, NOW()),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', NULL, 'solicitado', 'Narvarte Poniente', 1500, NULL, NULL, NULL, NULL, NOW());

-- 4. INSERTAR LOGS DE TRIAJE IA
INSERT INTO triage_logs (patient_id, symptoms, severity, recommendations)
VALUES 
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Dolor de cabeza leve y congestión', 'Verde', 'Mantener hidratación y reposo.'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'Fiebre de 38.5 y dolor abdominal', 'Amarillo', 'Tener termómetro a la mano y no ingerir alimentos.'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Tos seca persistente', 'Verde', 'Evitar cambios bruscos de temperatura.'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'Mareos y presión baja', 'Amarillo', 'Recostarse con las piernas elevadas.'),
('p0eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'Dolor de garganta fuerte', 'Verde', 'Gárgaras con agua tibia y sal.');
