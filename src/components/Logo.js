import { useNavigate } from 'react-router-dom';

const Logo = () => {
  const navigate = useNavigate();

  const HomePage = () => {
    navigate('/');
  };

  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', marginTop: '3rem' }}
    >
      <img
        style={{ cursor: 'pointer' }}
        onClick={HomePage}
        src='/tabibk.png'
        alt='lgo'
      />
    </div>
  );
};

export default Logo;
