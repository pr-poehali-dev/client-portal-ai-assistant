import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'assistant', label: 'ИИ-Ассистент' },
  { id: 'tickets', label: 'Обращения' },
  { id: 'profile', label: 'Профиль' },
  { id: 'admin', label: 'Администрирование' },
  { id: 'docs', label: 'Документация' },
  { id: 'contacts', label: 'Контакты' },
];

const TICKETS = [
  { num: 'ОБ-10428', date: '28.06.2026', status: 'В работе', category: 'Ошибка', priority: 'Высокий' },
  { num: 'ОБ-10415', date: '24.06.2026', status: 'Отвечено', category: 'Консультация', priority: 'Средний' },
  { num: 'ОБ-10390', date: '19.06.2026', status: 'Новое', category: 'Доработка', priority: 'Средний' },
  { num: 'ОБ-10377', date: '11.06.2026', status: 'Закрыто', category: 'Консультация', priority: 'Низкий' },
];

const STATUS_STYLE: Record<string, string> = {
  'Новое': 'bg-accent/10 text-accent border-accent/30',
  'В работе': 'bg-amber-50 text-amber-700 border-amber-200',
  'Отвечено': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Закрыто': 'bg-muted text-muted-foreground border-border',
};

const PRIORITY_STYLE: Record<string, string> = {
  'Высокий': 'text-destructive',
  'Средний': 'text-amber-600',
  'Низкий': 'text-muted-foreground',
};

const CONFIGS = [
  { name: 'Управление торговлей 11', code: 'УТ 11', icon: 'ShoppingCart' },
  { name: 'Бухгалтерия предприятия', code: 'БП 3.0', icon: 'Calculator' },
  { name: 'Зарплата и управление персоналом', code: 'ЗУП 3.1', icon: 'Users' },
];

const CHAT_SEED = [
  { role: 'assistant', text: 'Здравствуйте! Я ИИ-ассистент по сопровождению 1С. Опишите вашу задачу — помогу с настройкой, ошибками или консультацией.' },
];

const KPI = [
  { label: 'Всего обращений', value: '142', trend: '+12%', up: true, icon: 'Inbox' },
  { label: 'Решено ИИ', value: '68%', trend: '+5%', up: true, icon: 'Bot' },
  { label: 'Ср. время ответа', value: '1.4 ч', trend: '−18%', up: true, icon: 'Timer' },
  { label: 'Открыто сейчас', value: '9', trend: '+2', up: false, icon: 'AlertCircle' },
];

const CHART = [
  { m: 'Янв', v: 42 }, { m: 'Фев', v: 55 }, { m: 'Мар', v: 48 },
  { m: 'Апр', v: 71 }, { m: 'Май', v: 63 }, { m: 'Июн', v: 88 },
];

const CATEGORIES = [
  { name: 'Ошибка', pct: 46, color: 'bg-destructive' },
  { name: 'Консультация', pct: 34, color: 'bg-accent' },
  { name: 'Доработка', pct: 20, color: 'bg-amber-500' },
];

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

const Index = () => {
  const [active, setActive] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const [chat, setChat] = useState(CHAT_SEED);
  const [input, setInput] = useState('');

  const send = () => {
    if (!input.trim()) return;
    setChat((c) => [
      ...c,
      { role: 'user', text: input },
      { role: 'assistant', text: 'Принял вопрос в обработку. В рабочей версии здесь появится ответ ИИ. Если потребуется — оформим обращение к специалисту.' },
    ]);
    setInput('');
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded bg-primary">
                <Icon name="LifeBuoy" size={20} className="text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold tracking-tight">Портал 1С</div>
                <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Сопровождение</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActive(n.id)}
                  className={`rounded px-3 py-1.5 text-sm transition-colors ${
                    active === n.id ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="hidden sm:flex">Войти</Button>
              <Button size="sm" className="hidden sm:flex">Регистрация</Button>
              <button className="lg:hidden p-2" onClick={() => setMenuOpen((v) => !v)}>
                <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
              </button>
            </div>
          </div>

          {menuOpen && (
            <nav className="lg:hidden pb-4 grid grid-cols-2 gap-1 animate-fade-in">
              {NAV.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setActive(n.id); setMenuOpen(false); }}
                  className={`rounded px-3 py-2 text-left text-sm ${
                    active === n.id ? 'bg-secondary font-medium' : 'text-muted-foreground'
                  }`}
                >
                  {n.label}
                </button>
              ))}
            </nav>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/60 to-background" />
        <div className="relative mx-auto max-w-7xl px-5 py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Служба поддержки на связи
              </div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1]">
                Единый портал сопровождения ваших баз&nbsp;<span className="text-accent">1С</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-lg">
                Получите консультацию от ИИ-ассистента, создайте обращение к специалисту и отслеживайте статусы заявок в одном окне.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg" onClick={() => setActive('tickets')}>
                  <Icon name="Plus" size={18} className="mr-1" />
                  Создать заявку
                </Button>
                <Button size="lg" variant="outline" onClick={() => setActive('assistant')}>
                  <Icon name="Bot" size={18} className="mr-1" />
                  Спросить ассистента
                </Button>
              </div>
              <div className="mt-8 flex flex-wrap gap-6 text-sm text-muted-foreground">
                <span className="flex items-center gap-2"><Icon name="ShieldCheck" size={16} className="text-accent" /> Защита HTTPS</span>
                <span className="flex items-center gap-2"><Icon name="Clock" size={16} className="text-accent" /> Ответ 24/7</span>
                <span className="flex items-center gap-2"><Icon name="Link2" size={16} className="text-accent" /> Интеграция с 1С</span>
              </div>
            </div>

            {/* AI widget */}
            <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
              <div className="rounded-xl border border-border bg-card shadow-xl shadow-primary/5 overflow-hidden">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded bg-accent/10">
                      <Icon name="Bot" size={18} className="text-accent" />
                    </div>
                    <div className="text-sm font-medium">ИИ-ассистент</div>
                  </div>
                  <Badge variant="outline" className="text-[11px] font-normal">онлайн</Badge>
                </div>
                <div className="h-64 space-y-3 overflow-y-auto p-4 bg-secondary/30">
                  {chat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        m.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-card border border-border'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-border p-3">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      placeholder="Опишите вопрос по 1С…"
                      className="flex-1"
                    />
                    <Button size="icon" onClick={send}><Icon name="Send" size={16} /></Button>
                  </div>
                  <Button variant="link" size="sm" className="mt-1 h-auto p-0 text-accent" onClick={() => setActive('tickets')}>
                    <Icon name="Headset" size={14} className="mr-1" />
                    Создать заявку специалисту
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configs */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-10">
          <div className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Поддерживаемые конфигурации</div>
          <h2 className="text-2xl font-semibold tracking-tight">Сопровождаем ваши учётные системы</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CONFIGS.map((c) => (
            <div key={c.code} className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-primary/5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/5 group-hover:bg-accent/10 transition-colors">
                  <Icon name={c.icon} size={22} className="text-primary group-hover:text-accent transition-colors" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{c.code}</span>
              </div>
              <div className="mt-4 font-medium">{c.name}</div>
              <div className="mt-1 text-sm text-muted-foreground">Настройка, обновления, консультации и устранение ошибок.</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tickets */}
      <section className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <div className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Личный кабинет</div>
              <h2 className="text-2xl font-semibold tracking-tight">История обращений</h2>
            </div>
            <Button onClick={() => setActive('tickets')}>
              <Icon name="Plus" size={18} className="mr-1" />
              Новое обращение
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Номер</th>
                    <th className="px-4 py-3 font-medium">Дата</th>
                    <th className="px-4 py-3 font-medium">Статус</th>
                    <th className="px-4 py-3 font-medium">Категория</th>
                    <th className="px-4 py-3 font-medium">Приоритет</th>
                    <th className="px-4 py-3 font-medium text-right">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {TICKETS.map((t) => (
                    <tr key={t.num} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-medium">{t.num}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.category}</td>
                      <td className={`px-4 py-3 font-medium ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-8">
                          Посмотреть <Icon name="ChevronRight" size={16} className="ml-0.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="mb-8">
          <div className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Аналитика по задачам</div>
          <h2 className="text-2xl font-semibold tracking-tight">Показатели обращений</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPI.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded bg-primary/5">
                  <Icon name={k.icon} size={18} className="text-primary" />
                </div>
                <span className={`text-xs font-medium ${k.up ? 'text-emerald-600' : 'text-destructive'}`}>{k.trend}</span>
              </div>
              <div className="mt-4 text-3xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-medium">Динамика обращений</div>
              <Badge variant="outline" className="font-normal">6 месяцев</Badge>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {CHART.map((c) => (
                <div key={c.m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-full max-w-[44px] rounded-t bg-gradient-to-t from-primary to-accent transition-all hover:opacity-80"
                      style={{ height: `${(c.v / 88) * 100}%` }}
                      title={`${c.v} обращений`}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{c.m}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="font-medium mb-6">Распределение по категориям</div>
            <div className="space-y-5">
              {CATEGORIES.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span>{c.name}</span>
                    <span className="font-mono text-muted-foreground">{c.pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div className={`h-full rounded-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 border-t border-border pt-4 flex items-center gap-2 text-sm text-muted-foreground">
              <Icon name="TrendingUp" size={16} className="text-emerald-600" />
              Доля решённых ИИ выросла на 5%
            </div>
          </div>
        </div>
      </section>

      {/* Notifications feature */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-accent font-medium mb-2">Уведомления</div>
            <h2 className="text-2xl font-semibold tracking-tight">Всегда в курсе статуса заявок</h2>
            <p className="mt-4 text-muted-foreground max-w-lg">
              Получайте оповещения при смене статуса обращения и ответах специалистов — по email и прямо в портале.
            </p>
            <div className="mt-6 space-y-3">
              {[
                { icon: 'RefreshCw', t: 'Смена статуса', d: 'Новое → В работе → Отвечено → Закрыто' },
                { icon: 'MessageSquare', t: 'Ответ специалиста', d: 'Мгновенное уведомление о новом комментарии' },
                { icon: 'Bell', t: 'Гибкие каналы', d: 'Email и внутренние оповещения портала' },
              ].map((f) => (
                <div key={f.t} className="flex items-start gap-3 rounded-lg border border-border bg-card p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-accent/10">
                    <Icon name={f.icon} size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-medium">{f.t}</div>
                    <div className="text-sm text-muted-foreground">{f.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Лента уведомлений</div>
            <div className="space-y-3">
              {[
                { icon: 'CheckCircle2', c: 'text-emerald-600', t: 'ОБ-10415 — статус «Отвечено»', d: '5 минут назад' },
                { icon: 'MessageSquare', c: 'text-accent', t: 'Специалист ответил в ОБ-10428', d: '32 минуты назад' },
                { icon: 'Clock', c: 'text-amber-600', t: 'ОБ-10428 взято в работу', d: '2 часа назад' },
                { icon: 'FilePlus2', c: 'text-primary', t: 'Создано обращение ОБ-10390', d: 'вчера' },
              ].map((n, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                  <Icon name={n.icon} size={18} className={n.c} />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{n.t}</div>
                    <div className="text-xs text-muted-foreground">{n.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Готовы решить задачу в 1С?</h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/70">
            Задайте вопрос ассистенту или оформите обращение — специалисты подключатся, когда это потребуется.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" onClick={() => setActive('assistant')}>
              <Icon name="Bot" size={18} className="mr-1" /> Открыть ассистента
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" onClick={() => setActive('tickets')}>
              <Icon name="Plus" size={18} className="mr-1" /> Создать заявку
            </Button>
          </div>
        </div>
      </section>

      {/* API Docs */}
      {active === 'docs' && (
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
      )}

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
                <Icon name="LifeBuoy" size={18} className="text-primary-foreground" />
              </div>
              <span className="font-semibold">Портал 1С · Сопровождение</span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setActive(n.id)} className="hover:text-foreground transition-colors">{n.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-6 text-xs text-muted-foreground">
            © 2026 Клиентский портал 1С. Все данные передаются по защищённому протоколу HTTPS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;