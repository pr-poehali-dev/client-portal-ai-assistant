import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const LOGO_URL = 'https://cdn.poehali.dev/projects/dc952390-4837-45eb-b79b-467f972bc182/files/favicon-1780639102129.jpg';

const SERVICES = [
  { icon: 'BarChart3', title: 'Внедрение 1С', desc: 'Установка, настройка и сопровождение конфигураций 1С: Бухгалтерия, УТ 11, ЗУП, ERP.' },
  { icon: 'Layers', title: 'Автоматизация бизнеса', desc: 'Комплексная автоматизация процессов: от учёта до аналитики и отчётности.' },
  { icon: 'Cpu', title: 'CRM и ERP системы', desc: 'Внедрение и интеграция систем управления предприятием под задачи вашего бизнеса.' },
  { icon: 'Monitor', title: 'Поставка оборудования и ПО', desc: 'Сертифицированные поставки серверного оборудования, рабочих станций и лицензий.' },
  { icon: 'Headset', title: 'Техническая поддержка', desc: 'Сопровождение IT-инфраструктуры, удалённая и выездная помощь специалистов.' },
  { icon: 'ShieldCheck', title: 'Информационная безопасность', desc: 'Защита данных, резервное копирование, настройка прав доступа и аудит систем.' },
];

const STATS = [
  { value: '8+', label: 'лет на рынке' },
  { value: '200+', label: 'проектов внедрено' },
  { value: '150+', label: 'клиентов доверяют' },
  { value: '24/7', label: 'поддержка' },
];

const WHY = [
  { icon: 'MapPin', title: 'Дальневосточная экспертиза', desc: 'Работаем на Дальнем Востоке с 2016 года, знаем специфику региона.' },
  { icon: 'Award', title: 'Сертифицированные специалисты', desc: 'Аттестованные партнёры 1С, Microsoft и ведущих вендоров оборудования.' },
  { icon: 'Zap', title: 'Быстрый старт', desc: 'От заявки до запуска проекта — за 3 рабочих дня. Без бюрократии.' },
  { icon: 'MessageSquare', title: 'Личный менеджер', desc: 'Один контакт для всех вопросов. Вы всегда знаете, кому звонить.' },
];

const PARTNERS = [
  {
    name: 'Созвездие',
    desc: 'Консалтинг и автоматизация на базе 1С. Владивосток',
    icon: 'Star',
    color: '#1a56db',
    bg: '#eff6ff',
  },
  {
    name: 'Клеверенс',
    desc: 'ПО для складской автоматизации и маркировки на ТСД',
    icon: 'PackageSearch',
    color: '#0e9f6e',
    bg: '#ecfdf5',
  },
  {
    name: 'Моби-С',
    desc: 'Мобильная торговля и автоматизация торговых представителей',
    icon: 'Smartphone',
    color: '#7c3aed',
    bg: '#f5f3ff',
  },
  {
    name: 'ScanSoft',
    desc: 'Мобильные решения для склада, магазина и маркировки',
    icon: 'ScanLine',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    name: 'Битрикс24',
    desc: 'CRM-система, корпоративный портал и управление задачами',
    icon: 'LayoutDashboard',
    color: '#e3174e',
    bg: '#fff1f2',
  },
  {
    name: '1С',
    desc: 'Платформа для автоматизации учёта, ERP и отраслевых решений',
    icon: 'BookOpen',
    color: '#b45309',
    bg: '#fef3c7',
  },
];

interface Props {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: Props) => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex h-16 items-center justify-between">
            {/* Логотип с сайта Инновации ДВ */}
            <div className="flex items-center gap-3">
              <img
                src={LOGO_URL}
                alt="Инновации ДВ"
                className="h-9 w-9 rounded-lg object-cover"
              />
              <div className="leading-tight">
                <div className="font-bold tracking-tight text-foreground">Инновации ДВ</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">IT-решения для бизнеса</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
              <a href="#partners" className="hover:text-foreground transition-colors">Партнёры</a>
              <a href="#why" className="hover:text-foreground transition-colors">О компании</a>
              <a href="#feedback" className="hover:text-foreground transition-colors">Связаться</a>
            </nav>

            <div className="flex items-center gap-3">
              <a href="tel:+79242630921" className="hidden sm:flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
                <Icon name="Phone" size={14} className="text-primary" />
                +7 (924) 263-09-21
              </a>
              <Button size="sm" onClick={onLogin}>
                <Icon name="LogIn" size={15} className="mr-1.5" />
                Войти в кабинет
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-background to-orange-50">
        <div className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/8 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-4 py-1.5 text-xs text-primary font-semibold mb-8 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Владивосток · Работаем с 2016 года
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-foreground animate-fade-in" style={{ animationDelay: '60ms' }}>
              IT-решения для<br />
              <span className="text-primary">дальневосточного</span><br />
              бизнеса
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl animate-fade-in" style={{ animationDelay: '120ms' }}>
              Внедряем 1С, автоматизируем процессы, поставляем оборудование и сопровождаем IT-инфраструктуру предприятий Дальнего Востока.
            </p>
            <div className="mt-10 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '180ms' }}>
              <Button size="lg" className="text-base px-7" onClick={onLogin}>
                Войти в портал поддержки
                <Icon name="ArrowRight" size={18} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="text-base px-7" asChild>
                <a href="#feedback">Оставить заявку</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/60">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-4xl font-black text-primary">{s.value}</div>
                <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="mx-auto max-w-7xl px-5 py-20">
        <div className="mb-12">
          <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Что мы делаем</div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight">Наши услуги</h2>
          <p className="mt-3 text-muted-foreground max-w-xl">
            Полный цикл IT-сопровождения — от поставки оборудования до автоматизации учёта и поддержки пользователей.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.map((s) => (
            <div key={s.title} className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors mb-4">
                <Icon name={s.icon} size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Partners */}
      <section id="partners" className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-10 text-center">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Наши партнёры</div>
            <h2 className="text-3xl font-black tracking-tight">Технологические партнёры</h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Работаем только с проверенными решениями — используем продукты и платформы, которым доверяют предприятия по всей России.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/30 hover:shadow-md transition-all group"
              >
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: p.bg }}
                >
                  <Icon name={p.icon} size={24} color={p.color} />
                </div>
                <div>
                  <div className="font-black text-base" style={{ color: p.color }}>{p.name}</div>
                  <div className="text-sm text-muted-foreground mt-0.5 leading-snug">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Почему выбирают нас</div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight mb-6">Партнёр, которому<br />доверяют предприятия ДВ</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              ООО «Инновации ДВ» — сертифицированный партнёр 1С и ведущих IT-вендоров. Мы работаем в Приморском крае с 2016 года и знаем специфику бизнеса на Дальнем Востоке.
            </p>
            <Button onClick={onLogin}>
              <Icon name="LifeBuoy" size={16} className="mr-2" />
              Открыть портал поддержки
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {WHY.map((w) => (
              <div key={w.title} className="rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                  <Icon name={w.icon} size={20} className="text-primary" />
                </div>
                <div className="font-bold text-sm mb-1">{w.title}</div>
                <div className="text-xs text-muted-foreground leading-relaxed">{w.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="border-y border-border bg-primary/5">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="rounded-2xl border border-primary/20 bg-white p-10 md:p-14 relative overflow-hidden shadow-sm">
            <div className="absolute right-0 top-0 w-72 h-72 bg-primary/6 blur-[80px] rounded-full -translate-y-1/4 translate-x-1/4" />
            <div className="relative max-w-xl">
              <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Клиентский портал</div>
              <h2 className="text-3xl font-black tracking-tight mb-4">Уже являетесь нашим клиентом?</h2>
              <p className="text-muted-foreground mb-8">
                Войдите в личный кабинет — задайте вопрос ИИ-ассистенту по 1С, создайте обращение к специалисту и отслеживайте статус заявок в реальном времени.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button size="lg" onClick={onLogin}>
                  <Icon name="LogIn" size={18} className="mr-2" />
                  Войти в кабинет
                </Button>
                <Button size="lg" variant="outline">
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feedback form */}
      <section id="feedback" className="mx-auto max-w-7xl px-5 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Обратная связь</div>
            <h2 className="text-3xl font-black tracking-tight mb-4">Оставьте заявку</h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Опишите вашу задачу — менеджер свяжется в течение рабочего дня и подберёт оптимальное решение.
            </p>
            <div className="space-y-4">
              {[
                { icon: 'Phone', text: '+7 (924) 263-09-21', sub: '+7 (924) 327-07-08' },
                { icon: 'Mail', text: 'office@intdv.ru' },
                { icon: 'MapPin', text: 'г. Владивосток, пр-кт Красного Знамени, д. 59, офис 505' },
                { icon: 'Clock', text: 'Пн–Пт, 09:00–18:00 (Владивосток)' },
              ].map((c) => (
                <div key={c.text} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <Icon name={c.icon} size={17} className="text-primary" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">{c.text}</div>
                    {c.sub && <div className="text-sm text-muted-foreground">{c.sub}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-7 shadow-sm">
            {sent ? (
              <div className="py-10 text-center animate-fade-in">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mx-auto mb-4">
                  <Icon name="CheckCircle2" size={32} className="text-primary" />
                </div>
                <h3 className="text-xl font-black mb-2">Заявка отправлена!</h3>
                <p className="text-muted-foreground text-sm">
                  Мы свяжемся с вами в течение рабочего дня.<br />
                  Спасибо, что выбрали Инновации ДВ!
                </p>
                <Button className="mt-6" variant="outline" onClick={() => setSent(false)}>
                  Отправить ещё одну
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-black text-lg mb-5">Напишите нам</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Ваше имя *</label>
                    <Input
                      required
                      placeholder="Иван Петров"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Телефон *</label>
                    <Input
                      required
                      placeholder="+7 (924) 000-00-00"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email</label>
                  <Input
                    type="email"
                    placeholder="your@company.ru"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Опишите задачу *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Расскажите о вашей ситуации — что нужно автоматизировать, какие проблемы решить..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  <Icon name="Send" size={17} className="mr-2" />
                  Отправить заявку
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">
                  Нажимая «Отправить», вы соглашаетесь на обработку персональных данных
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Contacts footer */}
      <section id="contacts" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-7xl px-5 py-16">
          <div className="mb-10">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Как нас найти</div>
            <h2 className="text-3xl font-black tracking-tight">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: 'Phone', label: 'Телефон', lines: ['+7 (924) 263-09-21', '+7 (924) 327-07-08'] },
              { icon: 'Mail', label: 'Email', lines: ['office@intdv.ru'] },
              { icon: 'MapPin', label: 'Адрес', lines: ['г. Владивосток,', 'пр-кт Красного Знамени,', 'д. 59, офис 505'] },
              { icon: 'Clock', label: 'Режим работы', lines: ['Пн–Пт, 09:00–18:00', '(Владивосток, UTC+10)'] },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon name={c.icon} size={20} className="text-primary" />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-semibold">{c.label}</div>
                {c.lines.map((l, i) => <div key={i} className="text-sm font-medium leading-relaxed">{l}</div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-foreground text-background">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Инновации ДВ" className="h-8 w-8 rounded-lg object-cover opacity-90" />
              <div>
                <div className="font-bold text-sm">ООО «Инновации ДВ»</div>
                <div className="text-xs opacity-50">ИНН 2543091244 · ОГРН 1162536055880</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs opacity-50">
              <span>690002, Владивосток, пр-кт Красного Знамени, 59, оф. 505</span>
              <span>office@intdv.ru</span>
            </div>
          </div>
          <div className="mt-6 border-t border-background/10 pt-4 text-xs opacity-40">
            © 2016–2026 ООО «Инновации ДВ». Все права защищены. Данные передаются по HTTPS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;