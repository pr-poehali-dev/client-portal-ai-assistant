ALTER TABLE t_p12566032_client_portal_ai_ass.users
  ADD COLUMN IF NOT EXISTS is_blocked boolean NOT NULL DEFAULT false;
