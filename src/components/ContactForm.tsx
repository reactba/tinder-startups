'use client';

import React, { useState } from 'react';

interface Startup {
  id: string;
  name: string;
  sector: string;
  videoUrl: string;
  description: string;
  email: string;
}

interface Props {
  startup: Startup;
  onClose: () => void;
}

const ContactForm: React.FC<Props> = ({ startup, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    // Guardar en localStorage
    const prev = JSON.parse(localStorage.getItem('contacts') || '[]');
    prev.push({
      name,
      email,
      message,
      startupId: startup.id,
      date: new Date().toISOString(),
    });
    localStorage.setItem('contacts', JSON.stringify(prev));
    setSent(true);
    setTimeout(onClose, 1500);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.form}>
        {!sent ? (
          <form onSubmit={handleSend} style={{ width: '100%' }}>
            <h2 style={styles.title}>Contactar a {startup.name}</h2>
            <input
              style={styles.input}
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              style={styles.input}
              placeholder="Tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
            <textarea
              style={{ ...styles.input, height: 80 }}
              placeholder="Mensaje"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            <button type="submit" style={styles.button}>
              Enviar
            </button>
            <button type="button" style={styles.cancel} onClick={onClose}>
              Cancelar
            </button>
          </form>
        ) : (
          <div style={styles.sent}>¡Enviado! La startup recibirá tu contacto.</div>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: '#1a1a1acc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  form: {
    background: '#fff',
    borderRadius: 24,
    padding: 32,
    width: 340,
    boxShadow: '0 8px 32px #ff003355',
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 700,
    color: '#ff0033',
    marginBottom: 18,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    background: '#fff0f3',
    border: '1.5px solid #ff0033',
    borderRadius: 12,
    padding: 12,
    marginBottom: 14,
    fontSize: 16,
    color: '#1a1a1a',
    outline: 'none',
    resize: 'none',
  },
  button: {
    background: '#ff0033',
    borderRadius: 12,
    padding: '12px 0',
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
    color: '#fff',
    fontWeight: 700,
    fontSize: 18,
    border: 'none',
    cursor: 'pointer',
  },
  cancel: {
    background: 'none',
    color: '#ff0033',
    fontSize: 16,
    border: 'none',
    cursor: 'pointer',
    width: '100%',
    marginTop: 4,
  },
  sent: {
    color: '#ff0033',
    fontSize: 20,
    fontWeight: 700,
    textAlign: 'center',
    margin: '32px 0',
  },
};

export default ContactForm;
