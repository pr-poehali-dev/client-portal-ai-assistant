"""
API обращений (тикетов): создание, получение списка, смена статуса.
Используется порталом и внешними интеграциями (1С, чат-боты).
"""
import json
import os
import psycopg2

SCHEMA = "t_p12566032_client_portal_ai_ass"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def next_num(cur):
    cur.execute(f"SELECT nextval('{SCHEMA}.ticket_seq')")
    return f"ОБ-{cur.fetchone()[0]}"


def resp(status, data):
    return {"statusCode": status, "headers": CORS, "body": data}


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    try:
        # POST / — создать обращение
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            for f in ["subject", "description"]:
                if not body.get(f):
                    return resp(400, {"error": f"Поле '{f}' обязательно"})

            num = next_num(cur)
            cur.execute(
                f"""INSERT INTO {SCHEMA}.tickets
                    (num, user_id, subject, description, category, priority, status)
                    VALUES (%s, %s, %s, %s, %s, %s, 'Новое')
                    RETURNING id, num, created_at""",
                (num, body.get("user_id"), body["subject"], body["description"],
                 body.get("category", "Консультация"), body.get("priority", "Средний")),
            )
            row = cur.fetchone()
            conn.commit()

            cur.execute(
                f"""INSERT INTO {SCHEMA}.webhooks (event, payload, status)
                    VALUES ('ticket.created', %s, 'pending')""",
                (json.dumps({"num": row[1], "ticket_id": row[0],
                             "subject": body["subject"], "description": body["description"],
                             "category": body.get("category", "Консультация"),
                             "priority": body.get("priority", "Средний"), "status": "Новое"}),),
            )
            conn.commit()

            return resp(201, {"id": row[0], "num": row[1], "status": "Новое",
                              "created_at": row[2].isoformat()})

        # PUT /?id= — обновить статус
        if method == "PUT":
            body = json.loads(event.get("body") or "{}")
            ticket_id = params.get("id")
            new_status = body.get("status")
            if not ticket_id or not new_status:
                return resp(400, {"error": "Нужны id и status"})

            cur.execute(
                f"""UPDATE {SCHEMA}.tickets
                    SET status = %s, onec_doc_id = COALESCE(%s, onec_doc_id), updated_at = NOW()
                    WHERE id = %s RETURNING id, num, status""",
                (new_status, body.get("onec_doc_id"), ticket_id),
            )
            row = cur.fetchone()
            conn.commit()
            if not row:
                return resp(404, {"error": "Обращение не найдено"})
            return resp(200, {"id": row[0], "num": row[1], "status": row[2]})

        # GET / — список обращений
        status_filter = params.get("status")
        category_filter = params.get("category")
        limit = min(int(params.get("limit", 50)), 200)
        offset = int(params.get("offset", 0))

        where, vals = [], []
        if status_filter:
            where.append("status = %s"); vals.append(status_filter)
        if category_filter:
            where.append("category = %s"); vals.append(category_filter)

        w = ("WHERE " + " AND ".join(where)) if where else ""
        cur.execute(
            f"""SELECT id, num, subject, category, priority, status, created_at, updated_at
                FROM {SCHEMA}.tickets {w}
                ORDER BY created_at DESC LIMIT %s OFFSET %s""",
            vals + [limit, offset],
        )
        keys = ["id", "num", "subject", "category", "priority", "status", "created_at", "updated_at"]
        tickets = []
        for r in cur.fetchall():
            d = dict(zip(keys, r))
            d["created_at"] = d["created_at"].isoformat()
            d["updated_at"] = d["updated_at"].isoformat()
            tickets.append(d)

        return resp(200, {"tickets": tickets, "total": len(tickets)})

    finally:
        cur.close()
        conn.close()