"""
API чата с ИИ-ассистентом. Принимает сообщение, сохраняет историю, возвращает ответ.
Совместим с чат-ботами (Telegram, WhatsApp) и внешними системами через стандартный JSON.
"""
import json
import os

SCHEMA = "t_p12566032_client_portal_ai_ass"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Api-Key",
}

AI_RESPONSES = {
    "ошибка": "Для диагностики ошибки укажите, пожалуйста: конфигурацию 1С, версию платформы и полный текст ошибки. Это позволит быстро определить причину и предложить решение.",
    "обновление": "Обновление конфигурации рекомендуется выполнять после создания резервной копии базы данных. Опишите вашу конфигурацию — подготовим инструкцию.",
    "зуп": "По вопросам ЗУП 3.1 могу помочь с настройкой начислений, кадровым учётом и регламентированной отчётностью. Уточните задачу.",
    "бухгалтерия": "По Бухгалтерии 3.0 консультирую по учёту, закрытию периода, сверке с налоговой. Опишите ситуацию подробнее.",
    "ут": "УТ 11 — управление продажами, закупками, складом. Уточните, в каком разделе возникла задача.",
}


def get_conn():
    import psycopg2
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ai_answer(text: str) -> str:
    low = text.lower()
    for kw, reply in AI_RESPONSES.items():
        if kw in low:
            return reply
    return (
        "Принял ваш вопрос. Анализирую запрос по базе знаний 1С. "
        "Если потребуется углублённая консультация — оформите обращение к специалисту, "
        "указав конфигурацию и детали задачи."
    )


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    message = (body.get("message") or "").strip()
    ticket_id = body.get("ticket_id")
    role_from = body.get("role", "user")

    if not message:
        return {"statusCode": 400, "headers": CORS,
                "body": {"error": "Field 'message' is required"}}

    answer = ai_answer(message)

    if ticket_id:
        conn = get_conn()
        cur = conn.cursor()
        try:
            cur.execute(
                f"""INSERT INTO {SCHEMA}.messages (ticket_id, role, content, author_name)
                    VALUES (%s, %s, %s, %s), (%s, %s, %s, %s)""",
                (ticket_id, role_from, message, body.get("author_name"),
                 ticket_id, "assistant", answer, "ИИ-ассистент"),
            )
            conn.commit()
        finally:
            cur.close()
            conn.close()

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": {"reply": answer, "role": "assistant", "ticket_id": ticket_id},
    }