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
        <div className="border-b border-white/10 bg-[#0d1e3d]">
          <div className="mx-auto max-w-7xl px-5 py-3 flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/20 shrink-0">
              <Icon name="BadgeCheck" size={15} className="text-blue-400" />
            </div>
            <div className="text-sm text-blue-100/80">
              Добро пожаловать,{' '}
              <span className="font-bold text-white">{user.full_name || user.email}</span>
              {user.company && <span className="text-blue-300/50"> · {user.company}</span>}
            </div>
            <div className="ml-auto flex items-center gap-1.5 rounded-md border border-white/15 bg-white/8 px-2.5 py-1 text-xs font-mono text-blue-300 font-semibold">
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
      <footer className="border-t border-white/10 bg-[#0a1628] text-white">
        <div className="mx-auto max-w-7xl px-5 py-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20">
                <Icon name="LifeBuoy" size={18} className="text-blue-400" />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Портал 1С · Инновации ДВ</div>
                <div className="text-xs text-blue-300/50">office@intdv.ru · +7 (924) 263-09-21</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-blue-300/50">
              {NAV.map((n) => (
                <button key={n.id} onClick={() => setActive(n.id)} className="hover:text-white transition-colors">{n.label}</button>
              ))}
            </div>
          </div>
          <div className="mt-6 border-t border-white/10 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="text-xs text-blue-300/40">
              © 2016–2026 ООО «Инновации ДВ» · ИНН 2543091244 · Все данные передаются по HTTPS.
            </div>
            <button
              className="flex items-center gap-1.5 text-xs text-blue-300/40 hover:text-blue-300 transition-colors"
              onClick={goToLanding}
            >
              <Icon name="ArrowLeft" size={13} />
              На сайт компании
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;