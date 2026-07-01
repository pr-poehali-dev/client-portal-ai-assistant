import { useState } from 'react';
import LandingPage from '@/components/LandingPage';
import AuthPage from '@/components/AuthPage';
import PortalHeader, { NAV } from '@/components/PortalHeader';
import HomeContent from '@/components/HomeContent';
import ApiDocs from '@/components/ApiDocs';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

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

const CHAT_SEED = [
  { role: 'assistant', text: 'Здравствуйте! Я ИИ-ассистент по сопровождению 1С. Опишите вашу задачу — помогу с настройкой, ошибками или консультацией.' },
];

type Screen = 'landing' | 'auth' | 'portal';

const Index = () => {
  const [screen, setScreen] = useState<Screen>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<User | null>(null);
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

  const openAuth = (mode: 'login' | 'register' = 'login') => {
    setAuthMode(mode);
    setScreen('auth');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    setScreen('portal');
    setActive('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToLanding = () => {
    setScreen('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (screen === 'landing') {
    return <LandingPage onLogin={() => openAuth('login')} onRegister={() => openAuth('register')} />;
  }

  if (screen === 'auth') {
    return (
      <AuthPage
        initialMode={authMode}
        onSuccess={handleAuthSuccess}
        onBack={goToLanding}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <PortalHeader
        active={active}
        setActive={setActive}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        onExit={goToLanding}
        user={user}
        onLogout={handleLogout}
      />

      {/* Welcome banner */}
      {user && (
        <div className="border-b border-border bg-primary/5">
          <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/15 shrink-0">
              <Icon name="BadgeCheck" size={17} className="text-primary" />
            </div>
            <div className="text-sm">
              Добро пожаловать, <span className="font-semibold">{user.full_name || user.email}</span>
              {user.company && <span className="text-muted-foreground"> · {user.company}</span>}
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-md border border-primary/20 bg-background px-2.5 py-1 text-xs font-mono text-primary font-semibold">
              <Icon name="Fingerprint" size={13} />
              {user.client_id}
            </div>
          </div>
        </div>
      )}

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
            <Button variant="ghost" size="sm" className="text-xs text-muted-foreground" onClick={goToLanding}>
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
