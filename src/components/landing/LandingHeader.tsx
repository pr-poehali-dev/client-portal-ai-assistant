import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { LOGO_URL } from './constants';

interface Props {
  onLogin: () => void;
}

const LandingHeader = ({ onLogin }: Props) => {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur-md shadow-sm">
      <div className="mx-auto max-w-7xl px-5">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Инновации ДВ" className="h-9 w-9 rounded-lg object-cover" />
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
  );
};

export default LandingHeader;
