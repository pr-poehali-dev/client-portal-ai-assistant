"""
Аутентификация клиентов: регистрация и вход.
POST / с полем action='register' — создаёт нового клиента, присваивает ID вида IDV-00001.
POST / с полем action='login'    — проверяет email/пароль и возвращает данные пользователя.
"""

import json
import os
import hashlib
import psycopg2


CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token, X-Session-Id',
    'Access-Control-Max-Age': '86400',
}


def get_conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode('utf-8')).hexdigest()


def ok(data: dict) -> dict:
    return {
        'statusCode': 200,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps(data, ensure_ascii=False),
    }


def err(status: int, message: str) -> dict:
    return {
        'statusCode': status,
        'headers': {**CORS_HEADERS, 'Content-Type': 'application/json'},
        'body': json.dumps({'error': message}, ensure_ascii=False),
    }


def generate_client_id(cur, schema: str) -> str:
    cur.execute(f"SELECT nextval('{schema}.client_id_seq')")
    seq = cur.fetchone()[0]
    return 'IDV-' + str(seq).zfill(5)


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS_HEADERS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])

    action = body.get('action') or ''

    conn = get_conn()
    cur = conn.cursor()

    try:
        # ── REGISTER ──────────────────────────────────────────────────────────
        if action == 'register':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            full_name = (body.get('full_name') or '').strip().replace("'", "''")
            company = (body.get('company') or '').strip().replace("'", "''")
            phone = (body.get('phone') or '').strip().replace("'", "''")
            email_safe = email.replace("'", "''")

            if not email or not password:
                return err(400, 'Email и пароль обязательны')
            if len(password) < 6:
                return err(400, 'Пароль должен быть не менее 6 символов')

            cur.execute(f"SELECT id FROM {schema}.users WHERE email = '{email_safe}'")
            if cur.fetchone():
                return err(409, 'Пользователь с таким email уже зарегистрирован')

            client_id = generate_client_id(cur, schema)
            pw_hash = hash_password(password)

            cur.execute(
                f"""
                INSERT INTO {schema}.users (email, password_hash, full_name, company, phone, client_id)
                VALUES ('{email_safe}', '{pw_hash}', '{full_name}', '{company}', '{phone}', '{client_id}')
                RETURNING id, email, full_name, company, phone, client_id, created_at
                """
            )
            row = cur.fetchone()
            conn.commit()

            return ok({
                'success': True,
                'user': {
                    'id': row[0],
                    'email': row[1],
                    'full_name': row[2],
                    'company': row[3],
                    'phone': row[4],
                    'client_id': row[5],
                    'created_at': str(row[6]),
                },
            })

        # ── LOGIN ─────────────────────────────────────────────────────────────
        if action == 'login':
            email = (body.get('email') or '').strip().lower()
            password = body.get('password') or ''
            email_safe = email.replace("'", "''")

            if not email or not password:
                return err(400, 'Email и пароль обязательны')

            pw_hash = hash_password(password)

            cur.execute(
                f"""
                SELECT id, email, full_name, company, phone, client_id, is_admin, created_at
                FROM {schema}.users
                WHERE email = '{email_safe}' AND password_hash = '{pw_hash}'
                """
            )
            row = cur.fetchone()

            if not row:
                return err(401, 'Неверный email или пароль')

            return ok({
                'success': True,
                'user': {
                    'id': row[0],
                    'email': row[1],
                    'full_name': row[2],
                    'company': row[3],
                    'phone': row[4],
                    'client_id': row[5],
                    'is_admin': row[6],
                    'created_at': str(row[7]),
                },
            })

        return err(400, 'Укажите action: register или login')

    finally:
        cur.close()
        conn.close()
