import { useState, useEffect } from 'react';
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

const CONFIGS = [
  { name: 'Управление торговлей 11', code: 'УТ 11', icon: 'ShoppingCart' },
  { name: 'Бухгалтерия предприятия', code: 'БП 3.0', icon: 'Calculator' },
  { name: 'Зарплата и управление персоналом', code: 'ЗУП 3.1', icon: 'Users' },
];

interface User {
  id: number;
  email: string;
  full_name: string;
  company: string;
  phone: string;
  client_id: string;
  is_admin?: boolean;
  created_at: string;
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
}

interface Props {
  user: User;
  onSetActive: (id: string) => void;
}

const UserProfile = ({ user, onSetActive }: Props) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [tab, setTab] = useState<'profile' | 'tickets' | 'databases'>('profile');
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user.full_name || '',
    company: user.company || '',
    phone: user.phone || '',
  });

  useEffect(() => {
    const load = async () => {
      setLoadingTickets(true);
      try {
        const res = await fetch(`${ADMIN_URL}?action=client_tickets&user_id=${user.id}`);
        const data = await res.json();
        setTickets(data.tickets || []);
      } catch {
        setTickets([]);
      } finally {
        setLoadingTickets(false);
      }
    };
    load();
  }, [user.id]);

  const ticketsByStatus = {
    open: tickets.filter(t => t.status === 'Новое' || t.status === 'В работе').length,
    answered: tickets.filter(t => t.status === 'Отвечено').length,
    closed: tickets.filter(t => t.status === 'Закрыто').length,
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Hero профиля */}
      <div className="relative rounded-2xl overflow-hidden mb-8 bg-[#0d1e3d] p-8">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[80px] rounded-full" />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-400/20">
            <Icon name="UserCircle" size={32} className="text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-widest text-blue-400 font-semibold mb-1">Клиентский профиль</div>
            <h1 className="text-2xl font-black text-white tracking-tight">{user.full_name || user.email}</h1>
            {user.company && <div className="text-blue-200/60 text-sm mt-0.5">{user.company}</div>}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3 py-2">
              <Icon name="Fingerprint" size={15} className="text-blue-400" />
              <span className="font-mono text-sm font-bold text-white">{user.client_id}</span>
            </div>
            <div className="text-xs text-blue-300/40">
              С нами с {new Date(user.created_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long' })}
            </div>
          </div>
        </div>

        {/* Мини-статистика */}
        <div className="relative mt-6 grid grid-cols-3 gap-3">
          {[
            { label: 'Всего обращений', value: tickets.length, icon: 'Inbox' },
            { label: 'Открытых', value: ticketsByStatus.open, icon: 'Timer' },
            { label: 'Закрытых', value: ticketsByStatus.closed, icon: 'CheckCircle2' },
          ].map(s => (
            <div key={s.label} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center">
              <div className="text-2xl font-black text-white">{s.value}</div>
              <div className="text-xs text-blue-300/50 mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Вкладки */}
      <div className="flex gap-1 mb-8 rounded-xl border border-border bg-secondary/40 p-1 w-fit">
        {([
          { id: 'profile', label: 'Мои данные', icon: 'User' },
          { id: 'tickets', label: 'Мои обращения', icon: 'Inbox' },
          { id: 'databases', label: 'Мои базы 1С', icon: 'Database' },
        ] as { id: 'profile' | 'tickets' | 'databases'; label: string; icon: string }[]).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
              tab === t.id ? 'bg-card shadow text-foreground' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name={t.icon} size={15} />
            {t.label}
          </button>
        ))}
      </div>

      {/* ── МОИ ДАННЫЕ ───────────────────────────────────────────────────── */}
      {tab === 'profile' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="font-black text-base">Личные данные</div>
              <Button variant="outline" size="sm" onClick={() => setEditMode(!editMode)}>
                <Icon name={editMode ? 'X' : 'Pencil'} size={14} className="mr-1.5" />
                {editMode ? 'Отмена' : 'Редактировать'}
              </Button>
            </div>

            {editMode ? (
              <div className="space-y-4">
                {[
                  { field: 'full_name', label: 'Имя и фамилия', placeholder: 'Иван Петров' },
                  { field: 'company', label: 'Компания', placeholder: 'ООО Компания' },
                  { field: 'phone', label: 'Телефон', placeholder: '+7 (924) 000-00-00' },
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
                <Button className="w-full mt-2">
                  <Icon name="Save" size={15} className="mr-2" />
                  Сохранить изменения
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Изменения данных обрабатываются менеджером портала
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  { icon: 'User', label: 'Имя', value: user.full_name || '—' },
                  { icon: 'Mail', label: 'Email', value: user.email },
                  { icon: 'Building2', label: 'Компания', value: user.company || '—' },
                  { icon: 'Phone', label: 'Телефон', value: user.phone || '—' },
                ].map(f => (
                  <div key={f.label} className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon name={f.icon} size={16} className="text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{f.label}</div>
                      <div className="text-sm font-semibold">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {/* ID карточка */}
            <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Ваш клиентский ID</div>
              <div className="flex items-center gap-3 mb-3">
                <Icon name="Fingerprint" size={28} className="text-primary" />
                <div className="text-3xl font-black tracking-tight font-mono text-primary">{user.client_id}</div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Используйте этот ID при обращении в поддержку — менеджер сразу найдёт всю историю работы с вашей компанией.
              </p>
            </div>

            {/* Быстрые действия */}
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="font-black text-base mb-4">Быстрые действия</div>
              <div className="space-y-2">
                <Button className="w-full justify-start" onClick={() => onSetActive('tickets')}>
                  <Icon name="Plus" size={16} className="mr-2" />
                  Создать обращение
                </Button>
                <Button variant="outline" className="w-full justify-start" onClick={() => onSetActive('assistant')}>
                  <Icon name="Bot" size={16} className="mr-2" />
                  Спросить ИИ-ассистента
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── МОИ ОБРАЩЕНИЯ ────────────────────────────────────────────────── */}
      {tab === 'tickets' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-black tracking-tight">Мои обращения</h2>
              <p className="text-sm text-muted-foreground">История всех заявок вашей компании на портале</p>
            </div>
            <Button onClick={() => onSetActive('tickets')}>
              <Icon name="Plus" size={16} className="mr-2" />
              Новое обращение
            </Button>
          </div>

          {loadingTickets ? (
            <div className="flex items-center gap-2 text-muted-foreground py-8">
              <Icon name="Loader2" size={16} className="animate-spin" /> Загрузка...
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                <Icon name="Inbox" size={24} className="text-primary" />
              </div>
              <div className="font-bold text-base mb-2">Обращений пока нет</div>
              <p className="text-sm text-muted-foreground mb-6">Создайте первое обращение — специалист ответит в течение рабочего дня</p>
              <Button onClick={() => onSetActive('tickets')}>
                <Icon name="Plus" size={16} className="mr-2" />
                Создать обращение
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-secondary/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-3 font-semibold">Номер</th>
                      <th className="px-4 py-3 font-semibold">Тема</th>
                      <th className="px-4 py-3 font-semibold">Категория</th>
                      <th className="px-4 py-3 font-semibold">Приоритет</th>
                      <th className="px-4 py-3 font-semibold">Статус</th>
                      <th className="px-4 py-3 font-semibold">Дата</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map(t => (
                      <tr key={t.id} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-primary">{t.num}</td>
                        <td className="px-4 py-3 max-w-[240px]">
                          <div className="truncate font-medium" title={t.subject}>{t.subject}</div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">{t.category}</td>
                        <td className={`px-4 py-3 ${PRIORITY_STYLE[t.priority]}`}>{t.priority}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block rounded border px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[t.status] || ''}`}>
                            {t.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-muted-foreground">
                          {new Date(t.created_at).toLocaleDateString('ru-RU')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── МОИ БАЗЫ 1С ──────────────────────────────────────────────────── */}
      {tab === 'databases' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-black tracking-tight">Мои базы 1С</h2>
            <p className="text-sm text-muted-foreground">Конфигурации, сопровождаемые специалистами Инновации ДВ</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {CONFIGS.map(c => (
              <div key={c.code} className="rounded-xl border border-border bg-card p-6 hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
                    <Icon name={c.icon} size={22} className="text-primary" />
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">{c.code}</Badge>
                </div>
                <div className="font-bold text-base mb-1">{c.name}</div>
                <div className="text-sm text-muted-foreground leading-relaxed mb-4">
                  Настройка, обновления, консультации и устранение ошибок.
                </div>
                <Button variant="outline" size="sm" className="w-full" onClick={() => onSetActive('tickets')}>
                  <Icon name="Headset" size={14} className="mr-1.5" />
                  Задать вопрос
                </Button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-dashed border-border bg-card/50 p-6 flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon name="PlusCircle" size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Нужна ещё одна конфигурация?</div>
              <div className="text-xs text-muted-foreground mt-0.5">Оставьте заявку — менеджер подберёт подходящее решение</div>
            </div>
            <Button size="sm" onClick={() => onSetActive('tickets')}>Заявка</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
