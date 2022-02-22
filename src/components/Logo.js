import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const HomePage = () => {
    navigate('/');
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}
    >
      <img
        style={{ cursor: 'pointer', width: '300px' }}
        onClick={HomePage}
        src='/tabibkLogo.jpeg'
        alt='logo'
      />
    </div>
  );
};

export default Logo;
