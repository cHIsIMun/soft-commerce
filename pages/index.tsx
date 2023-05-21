import React from 'react';
import { signOut } from 'next-auth/react';

const Home: React.FC = () => {
  return (
    <div>
      <h1>Bem-vindo à minha aplicação!</h1>
      <p>Esta é a tela inicial.</p>
      <button onClick={() => signOut()}>Sair</button>
    </div>
  );
};

export default Home;
