import { useState, useEffect, useCallback } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const ADMIN_URL = 'https://functions.poehali.dev/7bc78f6b-f801-4333-89ee-95d2540eab3a';

const STATUS_STYLE: Record<string, string> = {
  'Новое': 'bg-blue-50 text-blue-700 border-blue-200',
  'В работе': 'bg-amber-50 text-amber-700 border-amber-200',
  'Отвечено': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Закрыто': 'bg-muted text-muted-foreground border-border',
};

const PRIORITY_STYLE: Record<string, string> = {
  'Высокий': 'text-destructive font-bold',
  'Средний': 'text-amber-600',
  'Низкий': 'text-muted-foreground',
};

const STATUSES = ['Новое', 'В работе', 'Отвечено', 'Закрыто'];
const PRIORITIES = ['Низкий', 'Средний', 'Высокий'];

interface Client {
  id: number;
  email: string;
  full_name: string;
  company: string;
  phone: string;
  client_id: string;
  is_admin: boolean;
  is_blocked: boolean;
  created_at: string;
  tickets_count: number;
}

interface Ticket {
  id: number;
  num: string;
  subject: string;
  category: string;
  priority: string;
  status: string;
  created_at: string;
  updated_at: string;
  full_name: string;
  email: string;
  client_id: string;
  company: string;
}

interface Stats {
  total: number;
  by_status: Record<string, number>;
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  clients_count: number;
  by_month: { m: string; v: number }[];
}

type Tab = 'analytics' | 'clients' | 'tickets';

const api = async (params: object | null, body?: object) => {
  if (params && !body) {
    const q = new URLSearchParams(params as Record<string, string>).toString();
    const res = await fetch(`${ADMIN_URL}?${q}`);
    return res.json();
  }
  const res = await fetch(ADMIN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
};

const AdminPanel = () => {
  const [tab, setTab] = useState<Tab>('analytics');
  const [stats, setStats] = useState<Stats | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [editClient, setEditClient] = useState<Client | null>(null);
  const [editForm, setEditForm] = useState({ full_name: '', company: '', phone: '', email: '' });
  const [ticketSearch, setTicketSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadStats = useCallback(async () => {
    setLoading(true);
    const data = await api({ action: 'stats' });
    setStats(data);
    setLoading(false);
  }, []);

  const loadClients = useCallback(async () => {
    setLoading(true);
    const data = await api({ action: 'clients' });
    setClients(data.clients || []);
    setLoading(false);
  }, []);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const data = await api({ action: 'tickets' });
    setTickets(data.tickets || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === 'analytics') loadStats();
    if (tab === 'clients') loadClients();
    if (tab === 'tickets') loadTickets();
  }, [tab, loadStats, loadClients, loadTickets]);

  const handleToggleBlock = async (c: Client) => {
    await api(null, { action: 'toggle_block', id: c.id, blocked: !c.is_blocked });
    loadClients();
  };

  const handleDelete = async (c: Client) => {
    if (!confirm(`Удалить клиента ${c.full_name || c.email}? Все его обращения тоже будут удалены.`)) return;
    await api(null, { action: 'delete_client', id: c.id });
    loadClients();
  };

  const openEdit = (c: Client) => {
    setEditClient(c);
    setEditForm({ full_name: c.full_name || '', company: c.company || '', phone: c.phone || '', email: c.email });
  };

  const saveEdit = async () => {
    if (!editClient) return;
    await api(null, { action: 'update_client', id: editClient.id, ...editForm });
    setEditClient(null);
    loadClients();
  };

  const handleTicketStatus = async (t: Ticket, status: string) => {
    await api(null, { action: 'update_ticket', id: t.id, status });
    loadTickets();
  };

  const handleTicketPriority = async (t: Ticket, priority: string) => {
    await api(null, { action: 'update_ticket', id: t.id, priority });
    loadTickets();
  };

  const filteredClients = clients.filter(c =>
    [c.full_name, c.email, c.company, c.client_id].some(v => (v || '').toLowerCase().includes(search.toLowerCase()))
  );

  const filteredTickets = tickets.filter(t => {
    const matchSearch = [t.num, t.subject, t.full_name, t.email, t.company, t.client_id]
      .some(v => (v || '').toLowerCase().includes(ticketSearch.toLowerCase()));
    const matchStatus = statusFilter ? t.status === statusFilter : true;
    return matchSearch && matchStatus;
  });

  const maxMonth = stats ? Math.max(...(stats.by_month.map(m => m.v)), 1) : 1;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-2">Только для администратора</div>
        <h1 className="text-3xl font-black tracking-tight">Администрирование портала</h1>
        <p className="text-muted-foreground mt-1">Управление клиентами, тикетами и аналитика по всему порталу.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-8 rounded-xl border border-border bg-secondary/40 p-1 w-fit">
        {([
          { id: 'analytics', label: 'Аналитика', icon: 'BarChart3' },
          { id: 'clients', label: 'Клиенты', icon: 'Users' },
          { id: 'tickets', label: 'Тикеты', icon: 'Inbox' },
        ] as { id: Tab; label: string; icon: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={t.icon} size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-muted-foreground py-8">
          <Icon name="Loader2" size={18} className="animate-spin" /> Загрузка...
        </div>
      )}

      {/* ── АНАЛИТИКА ─────────────────────────────────────────────────────── */}
      {tab === 'analytics' && stats && !loading && (
        <div className="space-y-6">
          {/* KPI */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Всего тикетов', value: stats.total, icon: 'Inbox', color: 'text-primary' },
              { label: 'Клиентов', value: stats.clients_count, icon: 'Users', color: 'text-blue-600' },
              { label: 'В работе', value: stats.by_status['В работе'] || 0, icon: 'Timer', color: 'text-amber-600' },
              { label: 'Закрыто', value: stats.by_status['Закрыто'] || 0, icon: 'CheckCircle2', color: 'text-emerald-600' },
            ].map(k => (
              <div key={k.label} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3`}>
                  <Icon name={k.icon} size={20} className={k.color} />
                </div>
                <div className="text-3xl font-black tracking-tight">{k.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{k.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-5">
            {/* График по месяцам */}
            <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
              <div className="font-black text-base mb-6">Тикеты по месяцам</div>
              {stats.by_month.length > 0 ? (
                <div className="flex items-end gap-3 h-40">
                  {stats.by_month.map(m => (
                    <div key={m.m} className="flex-1 flex flex-col items-center gap-2">
                      <div className="text-xs text-muted-foreground font-mono">{m.v}</div>
                      <div className="w-full flex items-end justify-center" style={{ height: '100px' }}>
                        <div
                          className="w-full max-w-[44px] rounded-t bg-gradient-to-t from-primary to-blue-400"
                          style={{ height: `${(m.v / maxMonth) * 100}%`, minHeight: '4px' }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground">{m.m}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-muted-foreground text-sm py-8 text-center">Нет данных за последние 6 месяцев</div>
              )}
            </div>

            {/* Распределение */}
            <div className="space-y-4">
              {/* По статусам */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="font-black text-sm mb-4">По статусам</div>
                <div className="space-y-2">
                  {Object.entries(stats.by_status).map(([s, v]) => (
                    <div key={s} className="flex items-center justify-between">
                      <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[s] || 'bg-muted text-muted-foreground border-border'}`}>{s}</span>
                      <span className="font-mono font-bold text-sm">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* По категориям */}
              <div className="rounded-xl border border-border bg-card p-5">
                <div className="font-black text-sm mb-4">По категориям</div>
                <div className="space-y-2">
                  {Object.entries(stats.by_category).map(([cat, v]) => (
                    <div key={cat} className="flex items-center justify-between text-sm">
                      <span>{cat}</span>
                      <span className="font-mono font-bold">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── КЛИЕНТЫ ───────────────────────────────────────────────────────── */}
      {tab === 'clients' && !loading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по имени, email, компании, ID..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Badge variant="outline" className="text-sm">{filteredClients.length} клиентов</Badge>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">ID клиента</th>
                    <th className="px-4 py-3 font-semibold">Имя / Email</th>
                    <th className="px-4 py-3 font-semibold">Компания</th>
                    <th className="px-4 py-3 font-semibold">Телефон</th>
                    <th className="px-4 py-3 font-semibold">Тикеты</th>
                    <th className="px-4 py-3 font-semibold">Статус</th>
                    <th className="px-4 py-3 font-semibold">Дата</th>
                    <th className="px-4 py-3 font-semibold text-right">Действия</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map(c => (
                    <tr key={c.id} className={`border-b border-border last:border-0 transition-colors ${c.is_blocked ? 'bg-red-50/40' : 'hover:bg-secondary/30'}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary">{c.client_id}</span>
                          {c.is_admin && <Badge className="text-[10px] px-1.5 py-0 bg-primary/10 text-primary border-primary/20">Админ</Badge>}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold">{c.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{c.company || '—'}</td>
                      <td className="px-4 py-3 text-muted-foreground">{c.phone || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono font-bold">{c.tickets_count}</span>
                      </td>
                      <td className="px-4 py-3">
                        {c.is_blocked
                          ? <span className="inline-block rounded border px-2 py-0.5 text-xs font-medium bg-red-50 text-red-600 border-red-200">Заблокирован</span>
                          : <span className="inline-block rounded border px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">Активен</span>
                        }
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(c.created_at).toLocaleDateString('ru-RU')}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" className="h-8 px-2" onClick={() => openEdit(c)}>
                            <Icon name="Pencil" size={14} />
                          </Button>
                          {!c.is_admin && (
                            <>
                              <Button
                                variant="ghost" size="sm"
                                className={`h-8 px-2 ${c.is_blocked ? 'text-emerald-600 hover:text-emerald-700' : 'text-amber-600 hover:text-amber-700'}`}
                                onClick={() => handleToggleBlock(c)}
                                title={c.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                              >
                                <Icon name={c.is_blocked ? 'Unlock' : 'Lock'} size={14} />
                              </Button>
                              <Button
                                variant="ghost" size="sm"
                                className="h-8 px-2 text-destructive hover:text-destructive"
                                onClick={() => handleDelete(c)}
                                title="Удалить"
                              >
                                <Icon name="Trash2" size={14} />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredClients.length === 0 && (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-muted-foreground">Клиенты не найдены</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Форма редактирования */}
          {editClient && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setEditClient(null)}>
              <div className="w-full max-w-md rounded-2xl border border-border bg-card p-7 shadow-2xl" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-lg">Редактировать клиента</h3>
                  <button onClick={() => setEditClient(null)} className="text-muted-foreground hover:text-foreground">
                    <Icon name="X" size={20} />
                  </button>
                </div>
                <div className="space-y-3">
                  {[
                    { field: 'full_name', label: 'Имя и фамилия', placeholder: 'Иван Петров' },
                    { field: 'email', label: 'Email', placeholder: 'email@company.ru' },
                    { field: 'company', label: 'Компания', placeholder: 'ООО Компания' },
                    { field: 'phone', label: 'Телефон', placeholder: '+7 (000) 000-00-00' },
                  ].map(f => (
                    <div key={f.field}>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">{f.label}</label>
                      <Input
                        placeholder={f.placeholder}
                        value={editForm[f.field as keyof typeof editForm]}
                        onChange={e => setEditForm(ef => ({ ...ef, [f.field]: e.target.value }))}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <Button className="flex-1" onClick={saveEdit}>
                    <Icon name="Save" size={16} className="mr-2" />
                    Сохранить
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => setEditClient(null)}>
                    Отмена
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ТИКЕТЫ ────────────────────────────────────────────────────────── */}
      {tab === 'tickets' && !loading && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Icon name="Search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Поиск по номеру, теме, клиенту..."
                value={ticketSearch}
                onChange={e => setTicketSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="">Все статусы</option>
              {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <Badge variant="outline" className="text-sm">{filteredTickets.length} тикетов</Badge>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="px-4 py-3 font-semibold">Номер</th>
                    <th className="px-4 py-3 font-semibold">Тема</th>
                    <th className="px-4 py-3 font-semibold">Клиент</th>
                    <th className="px-4 py-3 font-semibold">Категория</th>
                    <th className="px-4 py-3 font-semibold">Приоритет</th>
                    <th className="px-4 py-3 font-semibold">Статус</th>
                    <th className="px-4 py-3 font-semibold">Дата</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTickets.map(t => (
                    <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-primary">{t.num}</td>
                      <td className="px-4 py-3 max-w-[220px]">
                        <div className="truncate font-medium" title={t.subject}>{t.subject}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-xs">{t.full_name || '—'}</div>
                        <div className="text-xs text-muted-foreground font-mono">{t.client_id || '—'}</div>
                        <div className="text-xs text-muted-foreground">{t.company || ''}</div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                      <td className="px-4 py-3">
                        <select
                          value={t.priority}
                          onChange={e => handleTicketPriority(t, e.target.value)}
                          className={`rounded border-0 bg-transparent text-sm font-semibold cursor-pointer focus:outline-none ${PRIORITY_STYLE[t.priority]}`}
                        >
                          {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={t.status}
                          onChange={e => handleTicketStatus(t, e.target.value)}
                          className={`rounded border px-2 py-0.5 text-xs font-medium cursor-pointer focus:outline-none ${STATUS_STYLE[t.status] || ''}`}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(t.created_at).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-muted-foreground">Тикеты не найдены</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
