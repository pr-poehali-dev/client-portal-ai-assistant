import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';
import { LOGO_URL } from './landing/constants';

const AUTH_URL = 'https://functions.poehali.dev/86df45eb-2a73-44d8-b79b-44303c14eee1';

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

interface Props {
  onSuccess: (user: User) => void;
  onBack: () => void;
  initialMode?: 'login' | 'register';
}

const AuthPage = ({ onSuccess, onBack, initialMode = 'login' }: Props) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    email: '',
    password: '',
    full_name: '',
    company: '',
    phone: '',
  });

  const set = (field: string, value: string) => {
    setForm((f) => ({ ...f, [field]: value }));
    setError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch(AUTH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: mode, ...form }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Произошла ошибка');
        return;
      }
      onSuccess(data.user);
    } catch {
      setError('Ошибка сети. Попробуйте ещё раз.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <div className="border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 h-14 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <Icon name="ArrowLeft" size={16} />
            На сайт
          </button>
          <div className="flex items-center gap-2.5">
            <img src={LOGO_URL} alt="Инновации ДВ" className="h-7 w-7 rounded object-cover" />
            <span className="font-semibold text-sm">Инновации ДВ</span>
          </div>
        </div>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-border bg-card shadow-lg p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mx-auto mb-4">
                <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={26} className="text-primary" />
              </div>
              <h1 className="text-2xl font-black tracking-tight">
                {mode === 'login' ? 'Вход в кабинет' : 'Регистрация'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {mode === 'login'
                  ? 'Введите данные для входа в клиентский портал'
                  : 'Создайте аккаунт — получите персональный ID клиента'}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Имя и фамилия *</label>
                    <Input
                      required
                      placeholder="Иван Петров"
                      value={form.full_name}
                      onChange={(e) => set('full_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Название компании</label>
                    <Input
                      placeholder="ООО Компания"
                      value={form.company}
                      onChange={(e) => set('company', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Телефон</label>
                    <Input
                      placeholder="+7 (924) 000-00-00"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="your@company.ru"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Пароль *</label>
                <Input
                  required
                  type="password"
                  placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2.5 text-sm text-destructive">
                  <Icon name="AlertCircle" size={15} />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading
                  ? <><Icon name="Loader2" size={17} className="mr-2 animate-spin" />Подождите...</>
                  : mode === 'login'
                    ? <><Icon name="LogIn" size={17} className="mr-2" />Войти</>
                    : <><Icon name="UserPlus" size={17} className="mr-2" />Зарегистрироваться</>
                }
              </Button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              {mode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button onClick={() => { setMode('register'); setError(''); }} className="text-primary font-semibold hover:underline">
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button onClick={() => { setMode('login'); setError(''); }} className="text-primary font-semibold hover:underline">
                    Войти
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
