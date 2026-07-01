"""
Административный API портала.
GET  /?action=stats        — общая аналитика по тикетам и пользователям
GET  /?action=clients      — список всех клиентов
GET  /?action=tickets      — все тикеты с данными клиентов
POST / action=update_client — обновить данные клиента
POST / action=toggle_block  — заблокировать / разблокировать клиента
POST / action=delete_client — удалить клиента
POST / action=update_ticket — изменить статус тикета
GET  /?action=client_tickets&user_id=X — тикеты конкретного клиента
"""

import json
import os
import psycopg2

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
    'Access-Control-Max-Age': '86400',
}


def conn():
    return psycopg2.connect(os.environ['DATABASE_URL'])


def ok(data):
    return {'statusCode': 200, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps(data, ensure_ascii=False, default=str)}


def err(status, msg):
    return {'statusCode': status, 'headers': {**CORS, 'Content-Type': 'application/json'}, 'body': json.dumps({'error': msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    if event.get('httpMethod') == 'OPTIONS':
        return {'statusCode': 200, 'headers': CORS, 'body': ''}

    schema = os.environ.get('MAIN_DB_SCHEMA', 'public')
    method = event.get('httpMethod', 'GET')
    params = event.get('queryStringParameters') or {}
    action = params.get('action') or ''

    body = {}
    if event.get('body'):
        body = json.loads(event['body'])
        if not action:
            action = body.get('action', '')

    db = conn()
    cur = db.cursor()

    try:
        # ── АНАЛИТИКА ────────────────────────────────────────────────────────
        if action == 'stats':
            cur.execute(f"SELECT COUNT(*) FROM {schema}.tickets")
            total = cur.fetchone()[0]

            cur.execute(f"SELECT status, COUNT(*) FROM {schema}.tickets GROUP BY status")
            by_status = {r[0]: r[1] for r in cur.fetchall()}

            cur.execute(f"SELECT category, COUNT(*) FROM {schema}.tickets GROUP BY category")
            by_category = {r[0]: r[1] for r in cur.fetchall()}

            cur.execute(f"SELECT priority, COUNT(*) FROM {schema}.tickets GROUP BY priority")
            by_priority = {r[0]: r[1] for r in cur.fetchall()}

            cur.execute(f"SELECT COUNT(*) FROM {schema}.users WHERE is_admin = false")
            clients_count = cur.fetchone()[0]

            cur.execute(f"""
                SELECT TO_CHAR(created_at, 'Mon') as mon, COUNT(*)
                FROM {schema}.tickets
                WHERE created_at >= NOW() - INTERVAL '6 months'
                GROUP BY TO_CHAR(created_at, 'Mon'), DATE_TRUNC('month', created_at)
                ORDER BY DATE_TRUNC('month', created_at)
            """)
            by_month = [{'m': r[0], 'v': r[1]} for r in cur.fetchall()]

            return ok({
                'total': total,
                'by_status': by_status,
                'by_category': by_category,
                'by_priority': by_priority,
                'clients_count': clients_count,
                'by_month': by_month,
            })

        # ── СПИСОК КЛИЕНТОВ ───────────────────────────────────────────────────
        if action == 'clients':
            cur.execute(f"""
                SELECT u.id, u.email, u.full_name, u.company, u.phone,
                       u.client_id, u.is_admin, u.created_at,
                       COALESCE(u.is_blocked, false) as is_blocked,
                       COUNT(t.id) as tickets_count
                FROM {schema}.users u
                LEFT JOIN {schema}.tickets t ON t.user_id = u.id
                GROUP BY u.id
                ORDER BY u.created_at DESC
            """)
            cols = ['id','email','full_name','company','phone','client_id','is_admin','created_at','is_blocked','tickets_count']
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok({'clients': rows})

        # ── ВСЕ ТИКЕТЫ ────────────────────────────────────────────────────────
        if action == 'tickets':
            cur.execute(f"""
                SELECT t.id, t.num, t.subject, t.category, t.priority, t.status,
                       t.created_at, t.updated_at,
                       u.full_name, u.email, u.client_id, u.company
                FROM {schema}.tickets t
                LEFT JOIN {schema}.users u ON t.user_id = u.id
                ORDER BY t.created_at DESC
            """)
            cols = ['id','num','subject','category','priority','status','created_at','updated_at','full_name','email','client_id','company']
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok({'tickets': rows})

        # ── ТИКЕТЫ КОНКРЕТНОГО КЛИЕНТА ────────────────────────────────────────
        if action == 'client_tickets':
            user_id = params.get('user_id') or body.get('user_id')
            if not user_id:
                return err(400, 'user_id обязателен')
            cur.execute(f"""
                SELECT id, num, subject, category, priority, status, created_at, updated_at
                FROM {schema}.tickets
                WHERE user_id = {int(user_id)}
                ORDER BY created_at DESC
            """)
            cols = ['id','num','subject','category','priority','status','created_at','updated_at']
            rows = [dict(zip(cols, r)) for r in cur.fetchall()]
            return ok({'tickets': rows})

        # ── ОБНОВИТЬ ДАННЫЕ КЛИЕНТА ───────────────────────────────────────────
        if action == 'update_client':
            uid = int(body.get('id', 0))
            full_name = (body.get('full_name') or '').replace("'", "''")
            company = (body.get('company') or '').replace("'", "''")
            phone = (body.get('phone') or '').replace("'", "''")
            email = (body.get('email') or '').replace("'", "''")
            if not uid:
                return err(400, 'id обязателен')
            cur.execute(f"""
                UPDATE {schema}.users
                SET full_name='{full_name}', company='{company}', phone='{phone}', email='{email}'
                WHERE id={uid}
            """)
            db.commit()
            return ok({'success': True})

        # ── БЛОКИРОВКА / РАЗБЛОКИРОВКА ────────────────────────────────────────
        if action == 'toggle_block':
            uid = int(body.get('id', 0))
            blocked = bool(body.get('blocked', False))
            if not uid:
                return err(400, 'id обязателен')
            cur.execute(f"UPDATE {schema}.users SET is_blocked={blocked} WHERE id={uid}")
            db.commit()
            return ok({'success': True, 'is_blocked': blocked})

        # ── УДАЛИТЬ КЛИЕНТА ───────────────────────────────────────────────────
        if action == 'delete_client':
            uid = int(body.get('id', 0))
            if not uid:
                return err(400, 'id обязателен')
            cur.execute(f"DELETE FROM {schema}.tickets WHERE user_id={uid}")
            cur.execute(f"DELETE FROM {schema}.users WHERE id={uid} AND is_admin=false")
            db.commit()
            return ok({'success': True})

        # ── ОБНОВИТЬ СТАТУС ТИКЕТА ────────────────────────────────────────────
        if action == 'update_ticket':
            tid = int(body.get('id', 0))
            status = (body.get('status') or '').replace("'", "''")
            priority = (body.get('priority') or '').replace("'", "''")
            if not tid:
                return err(400, 'id обязателен')
            sets = []
            if status:
                sets.append(f"status='{status}'")
            if priority:
                sets.append(f"priority='{priority}'")
            if sets:
                cur.execute(f"UPDATE {schema}.tickets SET {', '.join(sets)}, updated_at=NOW() WHERE id={tid}")
                db.commit()
            return ok({'success': True})

        return err(400, 'Неизвестный action')

    finally:
        cur.close()
        db.close()
