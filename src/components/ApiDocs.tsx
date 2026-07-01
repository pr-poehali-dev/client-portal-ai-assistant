import Icon from '@/components/ui/icon';

const BASE = {
  tickets: 'https://functions.poehali.dev/89c46b96-8aee-4461-9cbd-d2b9bd41ecb8',
  chat:    'https://functions.poehali.dev/4d60b422-964b-40d0-ba1e-301f9d30234d',
  webhook: 'https://functions.poehali.dev/c01a12ad-ff79-4eb3-9271-41ecda425e09',
};

const API_DOCS = [
  {
    group: 'Обращения (Tickets)',
    icon: 'Inbox',
    baseUrl: BASE.tickets,
    endpoints: [
      {
        method: 'GET', path: '/', title: 'Список обращений',
        desc: 'Возвращает список обращений с фильтрацией по статусу и категории.',
        params: [
          { name: 'status', type: 'string', desc: 'Фильтр: Новое | В работе | Отвечено | Закрыто' },
          { name: 'category', type: 'string', desc: 'Фильтр: Ошибка | Консультация | Доработка' },
          { name: 'limit', type: 'number', desc: 'Кол-во записей (макс. 200, по умолч. 50)' },
          { name: 'offset', type: 'number', desc: 'Смещение для пагинации' },
        ],
        response: `{ "tickets": [ { "id": 1, "num": "ОБ-10001", "subject": "...", "category": "Ошибка", "priority": "Высокий", "status": "Новое", "created_at": "2026-07-01T10:00:00" } ], "total": 1 }`,
      },
      {
        method: 'POST', path: '/', title: 'Создать обращение',
        desc: 'Создаёт новое обращение. Автоматически помещает событие в очередь webhook для 1С.',
        body: `{ "subject": "Ошибка при проведении накладной", "description": "Подробное описание...", "category": "Ошибка", "priority": "Высокий", "user_id": 42 }`,
        response: `{ "id": 1, "num": "ОБ-10001", "status": "Новое", "created_at": "2026-07-01T10:00:00" }`,
      },
      {
        method: 'PUT', path: '/?id=1', title: 'Обновить статус',
        desc: 'Меняет статус обращения. Используется 1С или администратором портала.',
        body: `{ "status": "В работе", "onec_doc_id": "ДОК-0000123" }`,
        response: `{ "id": 1, "num": "ОБ-10001", "status": "В работе" }`,
      },
    ],
  },
  {
    group: 'ИИ-Ассистент (Chat)',
    icon: 'Bot',
    baseUrl: BASE.chat,
    endpoints: [
      {
        method: 'POST', path: '/', title: 'Отправить сообщение',
        desc: 'Принимает вопрос пользователя, возвращает ответ ИИ. Если передан ticket_id — сохраняет историю в базе. Совместим с Telegram-ботами и другими чат-платформами.',
        body: `{ "message": "Как закрыть месяц в БП 3.0?", "ticket_id": 1, "role": "user", "author_name": "Иван Петров" }`,
        response: `{ "reply": "Для закрытия месяца...", "role": "assistant", "ticket_id": 1 }`,
      },
    ],
  },
  {
    group: 'Интеграция с 1С (Webhook)',
    icon: 'Webhook',
    baseUrl: BASE.webhook,
    endpoints: [
      {
        method: 'GET', path: '/?action=pending', title: 'Очередь событий',
        desc: '1С забирает список необработанных событий (ticket.created и др.). После обработки — подтверждает через /ack.',
        response: `{ "events": [ { "id": 5, "event": "ticket.created", "payload": { "num": "ОБ-10001", "subject": "...", "status": "Новое" }, "created_at": "..." } ], "count": 1 }`,
      },
      {
        method: 'POST', path: '/?action=ack', title: 'Подтвердить обработку',
        desc: '1С сообщает об успешной обработке событий. Статус событий переходит в «sent».',
        body: `{ "ids": [5, 6, 7] }`,
        response: `{ "acked": 3 }`,
      },
      {
        method: 'POST', path: '/', title: 'Входящее событие от 1С',
        desc: '1С уведомляет портал об изменениях в документе «Обращение». Поддерживаемые события: ticket.status_changed, ticket.comment.',
        body: `{ "event": "ticket.status_changed", "payload": { "num": "ОБ-10001", "status": "В работе", "onec_doc_id": "ДОК-123" } }`,
        response: `{ "ok": true, "event": "ticket.status_changed" }`,
      },
    ],
  },
];

const METHOD_STYLE: Record<string, string> = {
  GET:  'bg-emerald-50 text-emerald-700 border-emerald-200',
  POST: 'bg-accent/10 text-accent border-accent/30',
  PUT:  'bg-amber-50 text-amber-700 border-amber-200',
};

const ApiDocs = () => {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 animate-fade-in">
      <div className="mb-10">
        <div className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Для разработчиков</div>
        <h2 className="text-2xl font-semibold tracking-tight">Документация API</h2>
        <p className="mt-2 text-muted-foreground max-w-2xl">
          REST API портала для подключения к базам 1С и чат-ботам. Все запросы по HTTPS, ответы в формате JSON.
        </p>
      </div>

      {/* Auth note */}
      <div className="mb-8 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Icon name="KeyRound" size={18} className="text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm">
          <span className="font-medium text-amber-800">Аутентификация:</span>
          <span className="text-amber-700"> передавайте ключ в заголовке </span>
          <code className="font-mono text-xs bg-amber-100 px-1.5 py-0.5 rounded">X-Api-Key: &lt;ваш_ключ&gt;</code>
          <span className="text-amber-700">. Ключи выдаются администратором портала.</span>
        </div>
      </div>

      <div className="space-y-10">
        {API_DOCS.map((group) => (
          <div key={group.group}>
            {/* Group header */}
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-border">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/5">
                <Icon name={group.icon} size={18} className="text-primary" />
              </div>
              <div>
                <div className="font-semibold">{group.group}</div>
                <div className="font-mono text-xs text-muted-foreground mt-0.5 break-all">{group.baseUrl}</div>
              </div>
              <button
                onClick={() => navigator.clipboard.writeText(group.baseUrl)}
                className="ml-auto shrink-0 flex items-center gap-1.5 rounded border border-border bg-card px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon name="Copy" size={13} /> Скопировать URL
              </button>
            </div>

            <div className="space-y-4">
              {group.endpoints.map((ep, i) => (
                <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
                  {/* Endpoint header */}
                  <div className="flex flex-wrap items-center gap-3 px-5 py-3.5 border-b border-border bg-secondary/30">
                    <span className={`font-mono text-xs font-semibold border rounded px-2 py-0.5 ${METHOD_STYLE[ep.method]}`}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-sm">{group.baseUrl}{ep.path}</code>
                    <span className="ml-auto text-sm font-medium">{ep.title}</span>
                  </div>

                  <div className="p-5 grid md:grid-cols-2 gap-5">
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">{ep.desc}</p>

                      {ep.params && (
                        <div>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Query параметры</div>
                          <div className="rounded-lg border border-border overflow-hidden">
                            {ep.params.map((p) => (
                              <div key={p.name} className="flex gap-3 px-3 py-2 border-b border-border last:border-0 text-sm">
                                <code className="font-mono text-accent shrink-0">{p.name}</code>
                                <span className="text-muted-foreground text-xs self-center">{p.type}</span>
                                <span className="text-muted-foreground text-xs">{p.desc}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {ep.body && (
                        <div className={ep.params ? 'mt-4' : ''}>
                          <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Request Body</div>
                          <pre className="rounded-lg bg-primary text-primary-foreground text-xs p-3 overflow-x-auto leading-relaxed">
                            {ep.body}
                          </pre>
                        </div>
                      )}
                    </div>

                    {ep.response && (
                      <div>
                        <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Пример ответа</div>
                        <pre className="rounded-lg bg-secondary text-foreground text-xs p-3 overflow-x-auto leading-relaxed h-full">
                          {ep.response}
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 1C integration note */}
      <div className="mt-10 rounded-xl border border-border bg-card p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-accent/10">
            <Icon name="GitMerge" size={20} className="text-accent" />
          </div>
          <div>
            <div className="font-semibold mb-1">Схема интеграции с 1С:Предприятие</div>
            <div className="text-sm text-muted-foreground mb-3">
              Рекомендуемый порядок подключения через HTTP-сервисы 1С:
            </div>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-none">
              {[
                'Клиент создаёт обращение на портале → API записывает в БД и помещает событие ticket.created в очередь',
                '1С периодически опрашивает GET /?action=pending → забирает новые события',
                '1С создаёт документ «Обращение» и подтверждает обработку через POST /?action=ack',
                'При изменении статуса 1С вызывает POST / с событием ticket.status_changed',
                'Портал обновляет статус и уведомляет клиента',
              ].map((s, i) => (
                <li key={i} className="flex gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary">{i + 1}</span>
                  {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApiDocs;
