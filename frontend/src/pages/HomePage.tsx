import React from 'react';
import ChatWidget from '../components/ChatWidget';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Главная страница (Пользователь)</h1>
      <ChatWidget />
    </div>
  );
};

export default HomePage;
