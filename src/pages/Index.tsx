import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import PortalHeader, { NAV } from '@/components/PortalHeader';
import HomeContent from '@/components/HomeContent';
import ApiDocs from '@/components/ApiDocs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const CHAT_SEED = [
  { role: 'assistant', text: 'Здравствуйте! Я ИИ-ассистент по сопровождению 1С. Опишите вашу задачу — помогу с настройкой, ошибками или консультацией.' },
];

const Index = () => {
  const [isPortal, setIsPortal] = useState(false);
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

  const enterPortal = () => {
    setIsPortal(true);
    setActive('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const exitPortal = () => {
    setIsPortal(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!isPortal) {
    return <LandingPage onLogin={enterPortal} />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <PortalHeader
        active={active}
        setActive={setActive}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onExit={exitPortal}
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
              <div>
                <div className="font-semibold">Портал 1С · Инновации ДВ</div>
                <div className="text-xs text-muted-foreground">office@intdv.ru · +7 (924) 263-09-21</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setActive(n.id)} className="hover:text-foreground transition-colors">{n.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 border-t border-border pt-5 flex items-center justify-between gap-4">
            <div className="text-xs text-muted-foreground">
              © 2016–2026 ООО «Инновации ДВ» · ИНН 2543091244 · Все данные передаются по HTTPS.
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={exitPortal}>
              <Icon name="ArrowLeft" size={14} className="mr-1" />
              На сайт компании
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
