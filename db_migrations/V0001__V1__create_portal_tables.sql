CREATE TABLE t_p12566032_client_portal_ai_ass.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  company VARCHAR(255),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p12566032_client_portal_ai_ass.tickets (
  id SERIAL PRIMARY KEY,
  num VARCHAR(20) UNIQUE NOT NULL,
  user_id INTEGER REFERENCES t_p12566032_client_portal_ai_ass.users(id),
  subject VARCHAR(512) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'Консультация',
  priority VARCHAR(20) NOT NULL DEFAULT 'Средний',
  status VARCHAR(30) NOT NULL DEFAULT 'Новое',
  onec_doc_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p12566032_client_portal_ai_ass.messages (
  id SERIAL PRIMARY KEY,
  ticket_id INTEGER REFERENCES t_p12566032_client_portal_ai_ass.tickets(id),
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  author_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE t_p12566032_client_portal_ai_ass.webhooks (
  id SERIAL PRIMARY KEY,
  event VARCHAR(50) NOT NULL,
  payload JSONB NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  target_url VARCHAR(512),
  sent_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE SEQUENCE t_p12566032_client_portal_ai_ass.ticket_seq START 10001;
