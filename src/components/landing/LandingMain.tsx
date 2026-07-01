import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { SERVICES, STATS, WHY, PARTNERS } from './constants';

interface PartnerLogoProps {
  logo: string;
  name: string;
  fallbackIcon: string;
  color: string;
  bg: string;
}

const PartnerLogo = ({ logo, name, fallbackIcon, color }: PartnerLogoProps) => {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <Icon name={fallbackIcon} size={26} color={color} />;
  }
  return (
    <img
      src={logo}
      alt={name}
      className="h-9 w-9 object-contain"
      onError={() => setFailed(true)}
    />
  );
};

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingMain = ({ onLogin, onRegister }: Props) => {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border bg-[#0d1e3d]">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full" />

        <div className="relative mx-auto max-w-7xl px-5 py-20 md:py-28">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            {/* Left — text */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 text-xs text-blue-300 font-semibold mb-8 animate-fade-in">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-pulse" />
                Владивосток · Работаем с 2016 года
              </div>
              <h1 className="text-5xl md:text-6xl font-black tracking-tight leading-[1.05] text-white animate-fade-in" style={{ animationDelay: '60ms' }}>
                IT-решения для<br />
                <span className="text-blue-400">дальневосточного</span><br />
                бизнеса
              </h1>
              <p className="mt-6 text-lg text-blue-100/70 max-w-lg animate-fade-in" style={{ animationDelay: '120ms' }}>
                Внедряем 1С, автоматизируем процессы, поставляем оборудование и сопровождаем IT-инфраструктуру предприятий Дальнего Востока.
              </p>
              <div className="mt-10 flex flex-wrap gap-3 animate-fade-in" style={{ animationDelay: '180ms' }}>
                <Button size="lg" className="text-base px-7 bg-white text-[#0d1e3d] hover:bg-blue-50 font-bold" onClick={onLogin}>
                  Войти в портал поддержки
                  <Icon name="ArrowRight" size={18} className="ml-2" />
                </Button>
                <Button size="lg" variant="outline" className="text-base px-7 border-white/25 text-[#0d1e3d] bg-white hover:bg-blue-50 font-bold" asChild>
                  <a href="#feedback">Оставить заявку</a>
                </Button>
              </div>
              <div className="mt-10 flex flex-wrap gap-6 text-sm text-blue-200/60 animate-fade-in" style={{ animationDelay: '240ms' }}>
                <span className="flex items-center gap-2"><Icon name="ShieldCheck" size={15} className="text-blue-400" /> Защита HTTPS</span>
                <span className="flex items-center gap-2"><Icon name="Award" size={15} className="text-blue-400" /> Партнёр 1С</span>
                <span className="flex items-center gap-2"><Icon name="Clock" size={15} className="text-blue-400" /> Поддержка 24/7</span>
              </div>
            </div>

            {/* Right — image */}
            <div className="relative hidden lg:block animate-fade-in" style={{ animationDelay: '200ms' }}>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/50 border border-white/10">
                <img
                  src="https://cdn.poehali.dev/projects/cb67a010-9e51-4b4b-aea6-982c034eee99/files/04157181-4d22-4b14-9ca8-036a855bba59.jpg"
                  alt="IT-инфраструктура"
                  className="w-full h-[400px] object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-[#0d1e3d]/80 backdrop-blur-sm border border-white/10 p-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
                    <Icon name="LifeBuoy" size={20} className="text-blue-400" />
                  </div>
                  <div>
                    <div className="text-white text-sm font-bold">Клиентский портал 1С</div>
                    <div className="text-blue-300/70 text-xs">ИИ-ассистент · Обращения · Статусы заявок</div>
                  </div>
                  <Button size="sm" className="ml-auto bg-blue-500 hover:bg-blue-400 text-white shrink-0" onClick={onLogin}>
                    Войти
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-border bg-[#0d1e3d]">
        <div className="mx-auto max-w-7xl px-5 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="text-center px-4">
                <div className="text-4xl font-black text-white">{s.value}</div>
                <div className="mt-1 text-sm text-blue-300/70">{s.label}</div>
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
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 rounded-xl border border-border bg-card p-5 hover:border-primary/40 hover:shadow-lg hover:-translate-y-0.5 transition-all group"
              >
                <div
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl overflow-hidden"
                  style={{ backgroundColor: p.bg }}
                >
                  <PartnerLogo logo={p.logo} name={p.name} fallbackIcon={p.fallbackIcon} color={p.color} bg={p.bg} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-base">{p.name}</span>
                    <Icon name="ExternalLink" size={13} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5 leading-snug">{p.desc}</div>
                </div>
              </a>
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
                <Button size="lg" variant="outline" onClick={onRegister}>
                  <Icon name="UserPlus" size={18} className="mr-2" />
                  Зарегистрироваться
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LandingMain;