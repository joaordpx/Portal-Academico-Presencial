import React, { useState } from 'react';
import styles from './VirtualAssistant.module.css';

interface Message {
  id: number;
  text: string;
  sender: 'assistant' | 'user';
}

const VirtualAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'assistant',
      text: 'Olá! Eu sou a Assistente Virtual do Calouro da Unimontes. Como posso ajudar você?',
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      sender: 'user',
      text: trimmedMessage,
    };

    setMessages((previous) => [...previous, userMessage]);
    setMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          question: trimmedMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || 'Não foi possível obter uma resposta.'
        );
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: data.answer,
      };

      setMessages((previous) => [
        ...previous,
        assistantMessage,
      ]);
    } catch (error) {
      console.error('Erro ao consultar a assistente:', error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        sender: 'assistant',
        text: 'Desculpe, não consegui consultar as informações no momento. Tente novamente.',
      };

      setMessages((previous) => [
        ...previous,
        errorMessage,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          className={styles.floatingButton}
          onClick={() => setIsOpen(true)}
          aria-label="Abrir Assistente Virtual do Calouro"
        >
          <span className={styles.chatIcon}>💬</span>

          <span className={styles.floatingText}>
            Assistente do Calouro
          </span>
        </button>
      )}

      {isOpen && (
        <section
          className={styles.chatWindow}
          aria-label="Assistente Virtual do Calouro"
        >
          <header className={styles.chatHeader}>
            <div className={styles.assistantInfo}>
              <div className={styles.avatar}>
                🎓
              </div>

              <div>
                <h2>Assistente do Calouro</h2>
                <span>Unimontes</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Fechar assistente"
            >
              ×
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((item) => (
              <div
                key={item.id}
                className={
                  item.sender === 'user'
                    ? styles.userMessageContainer
                    : styles.assistantMessageContainer
                }
              >
                <div
                  className={
                    item.sender === 'user'
                      ? styles.userMessage
                      : styles.assistantMessage
                  }
                >
                  {item.text}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={styles.assistantMessageContainer}>
                <div className={styles.assistantMessage}>
                  Consultando as informações da Unimontes...
                </div>
              </div>
            )}
          </div>

          <div className={styles.inputArea}>
            <input
              type="text"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua pergunta..."
              aria-label="Digite sua pergunta"
              disabled={isLoading}
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!message.trim() || isLoading}
              aria-label="Enviar pergunta"
            >
              {isLoading ? '...' : '➤'}
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default VirtualAssistant;

