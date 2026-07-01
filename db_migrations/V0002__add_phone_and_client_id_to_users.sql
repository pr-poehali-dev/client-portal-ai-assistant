ALTER TABLE t_p12566032_client_portal_ai_ass.users
  ADD COLUMN IF NOT EXISTS phone character varying(30) NULL,
  ADD COLUMN IF NOT EXISTS client_id character varying(20) NULL UNIQUE;

CREATE SEQUENCE IF NOT EXISTS t_p12566032_client_portal_ai_ass.client_id_seq START 1;
