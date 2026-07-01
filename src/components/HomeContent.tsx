import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const TICKETS = [
  { num: 'ОБ-10428', date: '28.06.2026', status: 'В работе', category: 'Ошибка', priority: 'Высокий' },
  { num: 'ОБ-10415', date: '24.06.2026', status: 'Отвечено', category: 'Консультация', priority: 'Средний' },
  { num: 'ОБ-10390', date: '19.06.2026', status: 'Новое', category: 'Доработка', priority: 'Средний' },
  { num: 'ОБ-10377', date: '11.06.2026', status: 'Закрыто', category: 'Консультация', priority: 'Низкий' },
];

const STATUS_STYLE: Record<string, string> = {
  'Новое': 'bg-blue-50 text-blue-700 border-blue-200',
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
  { name: 'Консультация', pct: 34, color: 'bg-blue-500' },
  { name: 'Доработка', pct: 20, color: 'bg-amber-500' },
];

interface ChatMessage {
  role: string;
  text: string;
}

interface Props {
  setActive: (id: string) => void;
  chat: ChatMessage[];
  input: string;
  setInput: (v: string) => void;
  send: () => void;
}

const HomeContent = ({ setActive, chat, input, setInput, send }: Props) => {
  return (
    <>
      {/* Hero — dark, same style as landing */}
      <section className="relative overflow-hidden border-b border-border bg-[#0d1e3d]">
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-blue-300 font-semibold mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Служба поддержки на связи
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05] text-white">
                Единый портал<br />
                сопровождения<br />
                <span className="text-blue-400">ваших баз 1С</span>
              </h1>
              <p className="mt-6 text-lg text-blue-100/70 max-w-lg">
                Получите консультацию от ИИ-ассистента, создайте обращение к специалисту и отслеживайте статусы заявок в одном окне.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="text-base px-7 bg-white text-[#0d1e3d] hover:bg-blue-50 font-bold"
                  onClick={() => setActive('tickets')}
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать заявку
                </Button>
                <Button
                  size="lg"
                  className="text-base px-7 border-white/25 text-[#0d1e3d] bg-white hover:bg-blue-50 font-bold"
                  variant="outline"
                  onClick={() => setActive('assistant')}
                >
                  <Icon name="Bot" size={18} className="mr-2" />
                  Спросить ассистента
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-blue-200/60">
                <span className="flex items-center gap-2"><Icon name="ShieldCheck" size={15} className="text-blue-400" /> Защита HTTPS</span>
                <span className="flex items-center gap-2"><Icon name="Clock" size={15} className="text-blue-400" /> Ответ 24/7</span>
                <span className="flex items-center gap-2"><Icon name="Link2" size={15} className="text-blue-400" /> Интеграция с 1С</span>
              </div>
            </div>

            {/* AI widget */}
            <div className="animate-fade-in" style={{ animationDelay: '120ms' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#0a1628] px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/20">
                      <Icon name="Bot" size={18} className="text-blue-400" />
                    </div>
                    <div className="text-sm font-bold text-white">ИИ-ассистент 1С</div>
                  </div>
                  <Badge className="text-[11px] font-normal bg-emerald-500/20 text-emerald-400 border-emerald-500/30">онлайн</Badge>
                </div>
                <div className="h-64 space-y-3 overflow-y-auto p-4 bg-[#0d1e3d]/60">
                  {chat.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-xl px-3 py-2 text-sm ${
                        m.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white/10 border border-white/10 text-blue-100'
                      }`}>
                        {m.text}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-white/10 bg-[#0a1628] p-3">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && send()}
                      placeholder="Опишите вопрос по 1С…"
                      className="flex-1 bg-white/8 border-white/15 text-white placeholder:text-blue-300/40"
                    />
                    <Button size="icon" onClick={send} className="bg-blue-500 hover:bg-blue-400">
                      <Icon name="Send" size={16} />
                    </Button>
                  </div>
                  <button
                    className="mt-2 flex items-center gap-1.5 text-xs text-blue-300/60 hover:text-blue-300 transition-colors"
                    onClick={() => setActive('tickets')}
                  >
                    <Icon name="Headset" size={13} />
                    Создать заявку специалисту
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Configs */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Поддерживаемые конфигурации</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Сопровождаем ваши учётные системы</h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Настройка, обновления, консультации и устранение ошибок — по всем основным конфигурациям 1С.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-5">
          {CONFIGS.map((c) => (
            <div key={c.code} className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors">
                  <Icon name={c.icon} size={22} className="text-primary" />
                </div>
                <span className="font-mono text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">{c.code}</span>
              </div>
              <div className="mt-4 font-bold text-base">{c.name}</div>
              <div className="mt-1 text-sm text-muted-foreground leading-relaxed">Настройка, обновления, консультации и устранение ошибок.</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tickets */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Личный кабинет</div>
              <h2 className="text-3xl font-black tracking-tight">История обращений</h2>
            </div>
            <Button onClick={() => setActive('tickets')}>
              <Icon name="Plus" size={18} className="mr-1.5" />
              Новое обращение
            </Button>
          </div>

          <div className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Номер</th>
                    <th className="px-4 py-3 font-semibold">Дата</th>
                    <th className="px-4 py-3 font-semibold">Статус</th>
                    <th className="px-4 py-3 font-semibold">Категория</th>
                    <th className="px-4 py-3 font-semibold">Приоритет</th>
                    <th className="px-4 py-3 font-semibold text-right">Действие</th>
                  </tr>
                </thead>
                <tbody>
                  {TICKETS.map((t) => (
                    <tr key={t.num} className="border-b border-border last:border-0 hover:bg-secondary/40 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-foreground">{t.num}</td>
                      <td className="px-4 py-3 text-muted-foreground">{t.date}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">{t.category}</td>
                      <td className={`px-4 py-3 font-semibold ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</td>
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
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Аналитика по задачам</div>
          <h2 className="text-3xl font-black tracking-tight">Показатели обращений</h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {KPI.map((k) => (
            <div key={k.label} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon name={k.icon} size={20} className="text-primary" />
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${k.up ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-destructive'}`}>
                  {k.trend}
                </span>
              </div>
              <div className="mt-4 text-3xl font-black tracking-tight">{k.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{k.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-4">
          {/* Bar chart */}
          <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-base">Динамика обращений</div>
              <Badge variant="outline" className="font-normal text-xs">6 месяцев</Badge>
            </div>
            <div className="flex items-end justify-between gap-3 h-48">
              {CHART.map((c) => (
                <div key={c.m} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex items-end justify-center" style={{ height: '160px' }}>
                    <div
                      className="w-full max-w-[44px] rounded-t bg-gradient-to-t from-primary to-blue-400 transition-all hover:opacity-80"
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
            <div className="font-black text-base mb-6">Распределение по категориям</div>
            <div className="space-y-5">
              {CATEGORIES.map((c) => (
                <div key={c.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium">{c.name}</span>
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

      {/* Notifications */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Уведомления</div>
              <h2 className="text-3xl font-black tracking-tight mb-6">Всегда в курсе<br />статуса заявок</h2>
              <p className="text-muted-foreground max-w-lg leading-relaxed mb-8">
                Получайте оповещения при смене статуса обращения и ответах специалистов — по email и прямо в портале.
              </p>
              <div className="space-y-3">
                {[
                  { icon: 'RefreshCw', t: 'Смена статуса', d: 'Новое → В работе → Отвечено → Закрыто' },
                  { icon: 'MessageSquare', t: 'Ответ специалиста', d: 'Мгновенное уведомление о новом комментарии' },
                  { icon: 'Bell', t: 'Гибкие каналы', d: 'Email и внутренние оповещения портала' },
                ].map((f) => (
                  <div key={f.t} className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 hover:border-primary/30 transition-colors">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon name={f.icon} size={18} className="text-primary" />
                    </div>
                    <div>
                      <div className="font-bold text-sm mb-0.5">{f.t}</div>
                      <div className="text-sm text-muted-foreground">{f.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-card p-5 shadow-lg shadow-primary/5">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-4">Лента уведомлений</div>
              <div className="space-y-3">
                {[
                  { icon: 'CheckCircle2', c: 'text-emerald-600', t: 'ОБ-10415 — статус «Отвечено»', d: '5 минут назад' },
                  { icon: 'MessageSquare', c: 'text-primary', t: 'Специалист ответил в ОБ-10428', d: '32 минуты назад' },
                  { icon: 'Clock', c: 'text-amber-600', t: 'ОБ-10428 взято в работу', d: '2 часа назад' },
                  { icon: 'FilePlus2', c: 'text-primary', t: 'Создано обращение ОБ-10390', d: 'вчера' },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg bg-secondary/40 px-3 py-2.5">
                    <Icon name={n.icon} size={18} className={n.c} />
                    <div className="flex-1">
                      <div className="text-sm font-semibold">{n.t}</div>
                      <div className="text-xs text-muted-foreground">{n.d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA — dark, same style as landing */}
      <section className="bg-[#0d1e3d] border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-10 md:p-14 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-72 h-72 bg-blue-600/15 blur-[80px] rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="relative max-w-xl">
              <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-3">Нужна помощь?</div>
              <h2 className="text-3xl font-black tracking-tight text-white mb-4">Готовы решить задачу в 1С?</h2>
              <p className="text-blue-100/70 mb-8 leading-relaxed">
                Задайте вопрос ассистенту или оформите обращение — специалисты подключатся, когда это потребуется.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="lg"
                  className="bg-white text-[#0d1e3d] hover:bg-blue-50 font-bold text-base px-7"
                  onClick={() => setActive('assistant')}
                >
                  <Icon name="Bot" size={18} className="mr-2" />
                  Открыть ассистента
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/25 text-[#0d1e3d] bg-white hover:bg-blue-50 font-bold text-base px-7"
                  onClick={() => setActive('tickets')}
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Создать заявку
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomeContent;
