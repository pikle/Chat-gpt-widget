import React, { useState, useEffect } from 'react';
import { socket } from '../socket';

interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  fileUrl?: string;
  timestamp?: string;
}

const ManagerPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [botEnabled, setBotEnabled] = useState(true);
  const [systemContext, setSystemContext] = useState('');

  useEffect(() => {
    socket.emit("getHistory");
    socket.on('initHistory', (all: ChatMessage[]) => {
      setMessages(all);
    });
    socket.on('message', (msg: ChatMessage) => {
      setMessages(prev => [...prev, msg]);
    });
    socket.on('botStatus', (status: { botEnabled: boolean }) => {
      setBotEnabled(status.botEnabled);
    });
    return () => {
      socket.off('initHistory');
      socket.off('message');
      socket.off('botStatus');
    };
  }, []);

  const toggleBot = () => {
    const newState = !botEnabled;
    socket.emit('toggleBot', { enable: newState });
  };

  const sendManagerMessage = () => {
    if (!input.trim()) return;
    socket.emit('message', {
      text: input.trim(),
      sender: 'manager',
    });
    setInput('');
  };

  const saveContext = () => {
    socket.emit('setContext', { context: systemContext });
    alert('Контекст сохранён!');
  };

  // Функция для очистки чата через REST API
  const clearChat = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/manager/clear-chat`, {
        method: 'DELETE',
      });
      if (response.ok) {
        alert('Чат очищен!');
        setMessages([]);
      } else {
        alert('Ошибка при очистке чата');
      }
    } catch (error) {
      console.error('Ошибка при очистке чата', error);
      alert('Ошибка при очистке чата');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Страница менеджера</h1>
      <p>Бот сейчас: {botEnabled ? 'ВКЛЮЧЕН' : 'ВЫКЛЮЧЕН'}</p>
      <button onClick={toggleBot} style={{ padding: '6px 12px' }}>
        {botEnabled ? 'Отключить бота' : 'Включить бота'}
      </button>
      <button onClick={clearChat} style={{ padding: '6px 12px', marginLeft: '10px' }}>
        Очистить чат
      </button>

      <h2 style={{ marginTop: '20px' }}>Контекст для GPT</h2>
      <textarea
        value={systemContext}
        onChange={e => setSystemContext(e.target.value)}
        placeholder="Введите контекст для GPT (не жёсткие правила, а общий контекст)..."
        style={{
          width: '100%',
          maxWidth: '600px',
          height: '100px',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px'
        }}
      />
      <br />
      <button onClick={saveContext} style={{ marginTop: '10px', padding: '6px 12px' }}>
        Сохранить контекст
      </button>

      <div style={{
        marginTop: '20px',
        border: '1px solid #ccc',
        padding: '10px',
        width: '600px',
        height: '300px',
        overflowY: 'auto'
      }}>
        {messages.map(m => (
          <div key={m.id} style={{
            background: m.sender === 'assistant' ? '#e6f7ff'
                     : m.sender === 'manager' ? '#ffd591'
                     : '#d9f7be',
            margin: '5px 0',
            padding: '8px',
            borderRadius: '4px'
          }}>
            <strong>{m.sender}</strong>: {m.text}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '10px' }}>
        <input
          style={{ width: '400px', marginRight: '5px', padding: '6px' }}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ответ менеджера..."
        />
        <button onClick={sendManagerMessage} style={{
          padding: '6px 12px',
          maxWidth: '100px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ManagerPage;
