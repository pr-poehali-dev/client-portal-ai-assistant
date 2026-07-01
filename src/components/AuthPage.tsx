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
    <div className="min-h-screen bg-[#0d1e3d] flex flex-col">
      {/* Grid overlay */}
      <div
        className="fixed inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-blue-600/15 blur-[140px] rounded-full pointer-events-none" />

      {/* Top bar */}
      <header className="relative z-10 border-b border-white/10 bg-[#0a1628]/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm text-blue-200/60 hover:text-white transition-colors"
          >
            <Icon name="ArrowLeft" size={16} />
            На сайт
          </button>
          <div className="flex items-center gap-3">
            <img src={LOGO_URL} alt="Инновации ДВ" className="h-8 w-8 rounded-lg object-cover" />
            <div className="leading-tight">
              <div className="font-bold tracking-tight text-white text-sm">Инновации ДВ</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-300/50">Клиентский портал</div>
            </div>
          </div>
        </div>
      </header>

      {/* Card */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-2xl shadow-black/40 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-blue-500/20 border border-blue-400/20 mx-auto mb-5">
                <Icon name={mode === 'login' ? 'LogIn' : 'UserPlus'} size={26} className="text-blue-400" />
              </div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                {mode === 'login' ? 'Вход в кабинет' : 'Регистрация'}
              </h1>
              <p className="text-sm text-blue-200/50 mt-2">
                {mode === 'login'
                  ? 'Введите данные для входа в клиентский портал'
                  : 'Создайте аккаунт — получите персональный ID клиента'}
              </p>
            </div>

            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1.5 block">Имя и фамилия *</label>
                    <Input
                      required
                      placeholder="Иван Петров"
                      value={form.full_name}
                      onChange={(e) => set('full_name', e.target.value)}
                      className="bg-[#0a1628] border-white/15 text-white placeholder:text-blue-300/30 focus-visible:ring-blue-400/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1.5 block">Название компании</label>
                    <Input
                      placeholder="ООО Компания"
                      value={form.company}
                      onChange={(e) => set('company', e.target.value)}
                      className="bg-[#0a1628] border-white/15 text-white placeholder:text-blue-300/30 focus-visible:ring-blue-400/40"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1.5 block">Телефон</label>
                    <Input
                      placeholder="+7 (924) 000-00-00"
                      value={form.phone}
                      onChange={(e) => set('phone', e.target.value)}
                      className="bg-[#0a1628] border-white/15 text-white placeholder:text-blue-300/30 focus-visible:ring-blue-400/40"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1.5 block">Email *</label>
                <Input
                  required
                  type="email"
                  placeholder="your@company.ru"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  className="bg-[#0a1628] border-white/15 text-white placeholder:text-blue-300/30 focus-visible:ring-blue-400/40"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-blue-300/60 uppercase tracking-wider mb-1.5 block">Пароль *</label>
                <Input
                  required
                  type="password"
                  placeholder={mode === 'register' ? 'Минимум 6 символов' : '••••••••'}
                  value={form.password}
                  onChange={(e) => set('password', e.target.value)}
                  className="bg-[#0a1628] border-white/15 text-white placeholder:text-blue-300/30 focus-visible:ring-blue-400/40"
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-400/20 px-3 py-2.5 text-sm text-red-300">
                  <Icon name="AlertCircle" size={15} />
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full bg-white text-[#0d1e3d] hover:bg-blue-50 font-bold text-base h-11"
                disabled={loading}
              >
                {loading
                  ? <><Icon name="Loader2" size={17} className="mr-2 animate-spin" />Подождите...</>
                  : mode === 'login'
                    ? <><Icon name="LogIn" size={17} className="mr-2" />Войти</>
                    : <><Icon name="UserPlus" size={17} className="mr-2" />Зарегистрироваться</>
                }
              </Button>
            </form>

            {/* Switch mode */}
            <div className="mt-6 text-center text-sm text-blue-200/50">
              {mode === 'login' ? (
                <>
                  Нет аккаунта?{' '}
                  <button
                    onClick={() => { setMode('register'); setError(''); }}
                    className="text-blue-300 font-semibold hover:text-white transition-colors"
                  >
                    Зарегистрироваться
                  </button>
                </>
              ) : (
                <>
                  Уже есть аккаунт?{' '}
                  <button
                    onClick={() => { setMode('login'); setError(''); }}
                    className="text-blue-300 font-semibold hover:text-white transition-colors"
                  >
                    Войти
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bottom note */}
          {mode === 'register' && (
            <div className="mt-5 text-center flex items-center justify-center gap-2 text-xs text-blue-300/40">
              <Icon name="Fingerprint" size={13} />
              После регистрации вам будет присвоен уникальный ID клиента
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;