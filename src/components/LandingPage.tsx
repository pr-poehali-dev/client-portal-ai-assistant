import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const SERVICES = [
  {
    icon: 'BarChart3',
    title: 'Внедрение 1С',
    desc: 'Установка, настройка и сопровождение конфигураций 1С: Бухгалтерия, УТ 11, ЗУП, ERP.',
  },
  {
    icon: 'Layers',
    title: 'Автоматизация бизнеса',
    desc: 'Комплексная автоматизация процессов: от учёта до аналитики и отчётности.',
  },
  {
    icon: 'Cpu',
    title: 'CRM и ERP системы',
    desc: 'Внедрение и интеграция систем управления предприятием под задачи вашего бизнеса.',
  },
  {
    icon: 'Monitor',
    title: 'Поставка оборудования и ПО',
    desc: 'Сертифицированные поставки серверного оборудования, рабочих станций и лицензий.',
  },
  {
    icon: 'Headset',
    title: 'Техническая поддержка',
    desc: 'Сопровождение IT-инфраструктуры, удалённая и выездная помощь специалистов.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Информационная безопасность',
    desc: 'Защита данных, резервное копирование, настройка прав доступа и аудит систем.',
  },
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

interface Props {
  onLogin: () => void;
}

const LandingPage = ({ onLogin }: Props) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Icon name="Zap" size={18} className="text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <div className="font-bold tracking-tight text-foreground">Инновации ДВ</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground">IT-решения для бизнеса</div>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#services" className="hover:text-foreground transition-colors">Услуги</a>
              <a href="#why" className="hover:text-foreground transition-colors">О компании</a>
              <a href="#contacts" className="hover:text-foreground transition-colors">Контакты</a>
            </nav>

            <div className="flex items-center gap-2">
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
      <section className="relative overflow-hidden border-b border-border">
        {/* Сетка фона */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        {/* Оранжевое свечение */}
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/10 blur-[120px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-5 py-24 md:py-36">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs text-primary font-medium mb-8 animate-fade-in">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Владивосток · Работаем с 2016 года
            </div>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] animate-fade-in" style={{ animationDelay: '60ms' }}>
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
                <a href="#contacts">Связаться с нами</a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-secondary/40">
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
            <div key={s.title} className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors mb-4">
                <Icon name={s.icon} size={22} className="text-primary" />
              </div>
              <h3 className="font-bold text-base mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why us */}
      <section id="why" className="border-y border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
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
                <div key={w.title} className="rounded-xl border border-border bg-card p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-3">
                    <Icon name={w.icon} size={20} className="text-primary" />
                  </div>
                  <div className="font-bold text-sm mb-1">{w.title}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{w.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portal CTA */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-10 md:p-14 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-64 h-64 bg-primary/10 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/4" />
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
      </section>

      {/* Contacts */}
      <section id="contacts" className="border-t border-border bg-secondary/30">
        <div className="mx-auto max-w-7xl px-5 py-20">
          <div className="mb-12">
            <div className="text-xs uppercase tracking-widest text-primary font-semibold mb-3">Связаться с нами</div>
            <h2 className="text-3xl font-black tracking-tight">Контакты</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: 'Phone', label: 'Телефон', lines: ['+7 (924) 263-09-21', '+7 (924) 327-07-08'] },
              { icon: 'Mail', label: 'Email', lines: ['office@intdv.ru'] },
              { icon: 'MapPin', label: 'Адрес', lines: ['г. Владивосток,', 'пр-кт Красного Знамени,', 'д. 59, офис 505'] },
              { icon: 'Clock', label: 'Режим работы', lines: ['Пн–Пт, 09:00–18:00', '(Владивосток)'] },
            ].map((c) => (
              <div key={c.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-4">
                  <Icon name={c.icon} size={20} className="text-primary" />
                </div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">{c.label}</div>
                {c.lines.map((l, i) => (
                  <div key={i} className="text-sm font-medium leading-relaxed">{l}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Icon name="Zap" size={16} className="text-primary-foreground" />
              </div>
              <div>
                <div className="font-bold text-sm">ООО «Инновации ДВ»</div>
                <div className="text-xs text-muted-foreground">ИНН 2543091244 · ОГРН 1162536055880</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground">
              <span>690002, Владивосток, пр-кт Красного Знамени, 59, оф. 505</span>
              <span>office@intdv.ru</span>
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-4 text-xs text-muted-foreground">
            © 2016–2026 ООО «Инновации ДВ». Все права защищены. Данные передаются по HTTPS.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
