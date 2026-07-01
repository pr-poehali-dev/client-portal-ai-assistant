import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LOGO_URL } from './constants';

const LandingContacts = () => {
  const [form, setForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
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

      {/* Contacts */}
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
      <footer className="border-t border-white/10 bg-[#0a1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img src={LOGO_URL} alt="Инновации ДВ" className="h-8 w-8 rounded-lg object-cover" />
              <div>
                <div className="font-bold text-sm text-white">ООО «Инновации ДВ»</div>
                <div className="text-xs text-blue-300/50">ИНН 2543091244 · ОГРН 1162536055880</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-blue-300/50">
              <span>690002, Владивосток, пр-кт Красного Знамени, 59, оф. 505</span>
              <span>office@intdv.ru</span>
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4 text-xs text-blue-300/40">
            © 2016–2026 ООО «Инновации ДВ». Все права защищены. Данные передаются по HTTPS.
          </div>
        </div>
      </footer>
    </>
  );
};

export default LandingContacts;
