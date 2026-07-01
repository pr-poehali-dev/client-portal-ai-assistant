import { useState } from 'react';
import PortalHeader, { NAV } from '@/components/PortalHeader';
import HomeContent from '@/components/HomeContent';
import ApiDocs from '@/components/ApiDocs';
import Icon from '@/components/ui/icon';

const CHAT_SEED = [
  { role: 'assistant', text: 'Здравствуйте! Я ИИ-ассистент по сопровождению 1С. Опишите вашу задачу — помогу с настройкой, ошибками или консультацией.' },
];

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
      <PortalHeader
        active={active}
        setActive={setActive}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      <HomeContent
        setActive={setActive}
        chat={chat}
        input={input}
        setInput={setInput}
        send={send}
      />

      {active === 'docs' && <ApiDocs />}

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
