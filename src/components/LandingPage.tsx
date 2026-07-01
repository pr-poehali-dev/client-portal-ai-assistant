import LandingHeader from './landing/LandingHeader';
import LandingMain from './landing/LandingMain';
import LandingContacts from './landing/LandingContacts';

interface Props {
  onLogin: () => void;
  onRegister: () => void;
}

const LandingPage = ({ onLogin, onRegister }: Props) => {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <LandingHeader onLogin={onLogin} />
      <LandingMain onLogin={onLogin} onRegister={onRegister} />
      <LandingContacts />
    </div>
  );
};

export default LandingPage;
