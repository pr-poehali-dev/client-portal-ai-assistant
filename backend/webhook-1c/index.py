"""
Webhook-эндпоинт для интеграции с 1С:Предприятие.
1С вызывает этот URL при изменении документа «Обращение» в базе.
Также портал отправляет сюда события для передачи в 1С (ticket.created, ticket.answered).
"""
import json
import os
import psycopg2

SCHEMA = "t_p12566032_client_portal_ai_ass"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Api-Key, X-1C-Auth",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "POST")
    params = event.get("queryStringParameters") or {}

    conn = get_conn()
    cur = conn.cursor()

    try:
        # GET /pending — получить очередь событий для 1С (1С забирает сама)
        if method == "GET" and params.get("action") == "pending":
            cur.execute(
                f"""SELECT id, event, payload, created_at
                    FROM {SCHEMA}.webhooks
                    WHERE status = 'pending'
                    ORDER BY created_at
                    LIMIT 50"""
            )
            rows = cur.fetchall()
            events = [
                {"id": r[0], "event": r[1], "payload": r[2],
                 "created_at": r[3].isoformat()}
                for r in rows
            ]
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": {"events": events, "count": len(events)},
            }

        # POST /ack — 1С подтверждает обработку события
        if method == "POST" and params.get("action") == "ack":
            body = json.loads(event.get("body") or "{}")
            ids = body.get("ids", [])
            if ids:
                cur.execute(
                    f"""UPDATE {SCHEMA}.webhooks
                        SET status = 'sent', sent_at = NOW()
                        WHERE id = ANY(%s::int[])""",
                    (ids,),
                )
                conn.commit()
            return {
                "statusCode": 200,
                "headers": CORS,
                "body": {"acked": len(ids)},
            }

        # POST / — входящее событие от 1С (смена статуса, ответ специалиста)
        body = json.loads(event.get("body") or "{}")
        event_type = body.get("event")
        payload = body.get("payload", {})

        if not event_type:
            return {"statusCode": 400, "headers": CORS,
                    "body": {"error": "Field 'event' is required"}}

        # ticket.status_changed — 1С сообщает об изменении статуса
        if event_type == "ticket.status_changed":
            ticket_num = payload.get("num")
            new_status = payload.get("status")
            onec_doc_id = payload.get("onec_doc_id")
            if ticket_num and new_status:
                cur.execute(
                    f"""UPDATE {SCHEMA}.tickets
                        SET status = %s,
                            onec_doc_id = COALESCE(%s, onec_doc_id),
                            updated_at = NOW()
                        WHERE num = %s""",
                    (new_status, onec_doc_id, ticket_num),
                )
                conn.commit()

        # ticket.comment — специалист из 1С добавил комментарий
        if event_type == "ticket.comment":
            ticket_num = payload.get("num")
            comment = payload.get("comment")
            author = payload.get("author", "Специалист")
            if ticket_num and comment:
                cur.execute(
                    f"SELECT id FROM {SCHEMA}.tickets WHERE num = %s",
                    (ticket_num,),
                )
                row = cur.fetchone()
                if row:
                    cur.execute(
                        f"""INSERT INTO {SCHEMA}.messages
                            (ticket_id, role, content, author_name)
                            VALUES (%s, 'specialist', %s, %s)""",
                        (row[0], comment, author),
                    )
                    conn.commit()

        cur.execute(
            f"""INSERT INTO {SCHEMA}.webhooks (event, payload, status)
                VALUES (%s, %s, 'received')""",
            (event_type, json.dumps(payload)),
        )
        conn.commit()

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": {"ok": True, "event": event_type},
        }

    finally:
        cur.close()
        conn.close()