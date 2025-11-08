import React from 'react';

const Home = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Bienvenue sur notre site !</h1>
      <p>Nous sommes ravis de vous voir ici. Explorez et profitez de votre visite.</p>
      <button
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
        onClick={() => {
          window.location.href = '/'; // Redirige vers une autre page
        }}
      >
        En savoir plus
      </button>
    </div>
  );
};

export default Home;