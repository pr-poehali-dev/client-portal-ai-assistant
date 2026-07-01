import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const LOGO_URL = 'https://cdn.poehali.dev/projects/dc952390-4837-45eb-b79b-467f972bc182/files/favicon-1780639102129.jpg';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'assistant', label: 'ИИ-Ассистент' },
  { id: 'tickets', label: 'Обращения' },
  { id: 'profile', label: 'Профиль' },
  { id: 'admin', label: 'Администрирование' },
  { id: 'docs', label: 'Документация' },
  { id: 'contacts', label: 'Контакты' },
];

interface User {
  id: number;
  email: string;
  full_name: string;
  company: string;
  client_id: string;
}

interface Props {
  active: string;
  setActive: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
  onExit?: () => void;
  user?: User | null;
  onLogout?: () => void;
}

const PortalHeader = ({ active, setActive, menuOpen, setMenuOpen, onExit, user, onLogout }: Props) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Инновации ДВ" className="h-9 w-9 rounded-lg object-cover" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight">Инновации ДВ</div>
              <div className="text-[10px] uppercase tracking-widest text-muted-foreground">Клиентский портал</div>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setActive(n.id)}
                className={`rounded px-3 py-1.5 text-sm transition-colors ${
                  active === n.id ? 'bg-secondary text-foreground font-medium' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {user && (
              <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-secondary/60 px-3 py-1.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15">
                  <Icon name="UserCircle" size={16} className="text-primary" />
                </div>
                <div className="leading-tight">
                  <div className="text-xs font-semibold">{user.full_name || user.email}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">{user.client_id}</div>
                </div>
              </div>
            )}
            {onLogout && (
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={onLogout}>
                <Icon name="LogOut" size={15} className="mr-1" />
                Выйти
              </Button>
            )}
            {onExit && !user && (
              <Button variant="ghost" size="sm" className="hidden sm:flex" onClick={onExit}>
                <Icon name="ArrowLeft" size={15} className="mr-1" />
                На сайт
              </Button>
            )}
            <button className="lg:hidden p-2" onClick={() => setMenuOpen((v) => !v)}>
              <Icon name={menuOpen ? 'X' : 'Menu'} size={22} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="lg:hidden pb-4 grid grid-cols-2 gap-1 animate-fade-in">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => { setActive(n.id); setMenuOpen(false); }}
                className={`rounded px-3 py-2 text-left text-sm ${
                  active === n.id ? 'bg-secondary font-medium' : 'text-muted-foreground'
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
};

export { NAV };
export default PortalHeader;