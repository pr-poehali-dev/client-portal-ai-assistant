import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

const NAV = [
  { id: 'home', label: 'Главная' },
  { id: 'assistant', label: 'ИИ-Ассистент' },
  { id: 'tickets', label: 'Обращения' },
  { id: 'profile', label: 'Профиль' },
  { id: 'admin', label: 'Администрирование' },
  { id: 'docs', label: 'Документация' },
  { id: 'contacts', label: 'Контакты' },
];

interface Props {
  active: string;
  setActive: (id: string) => void;
  menuOpen: boolean;
  setMenuOpen: (v: boolean | ((prev: boolean) => boolean)) => void;
}

const PortalHeader = ({ active, setActive, menuOpen, setMenuOpen }: Props) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded bg-primary">
              <Icon name="LifeBuoy" size={20} className="text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">Портал 1С</div>
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Сопровождение</div>
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
            <Button variant="ghost" size="sm" className="hidden sm:flex">Войти</Button>
            <Button size="sm" className="hidden sm:flex">Регистрация</Button>
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
