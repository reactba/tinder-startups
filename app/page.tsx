import React, { useState } from 'react';
import startupsData from '../data/startups.json';
import SwipeCard from '../src/components/SwipeCard';
import ContactForm from '../src/components/ContactForm';

interface Startup {
  id: string;
  name: string;
  sector: string;
  videoUrl: string;
  description: string;
  email: string;
}

export default function HomePage() {
  const [current, setCurrent] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const startups = startupsData as Startup[];

  const handleSwipeRight = () => {
    setSelectedStartup(startups[current]);
    setShowForm(true);
  };

  const handleSwipeLeft = () => {
    setCurrent((prev) => prev + 1);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setCurrent((prev) => prev + 1);
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Tinder Startups</h1>
      <p style={styles.subtitle}>Descubre startups y conecta con un swipe</p>
      {!showForm && startups[current] && (
        <SwipeCard
          startup={startups[current]}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
        />
      )}
      {showForm && selectedStartup && (
        <ContactForm startup={selectedStartup} onClose={handleFormClose} />
      )}
      {!startups[current] && !showForm && (
        <div style={styles.endMsg}>¡No hay más startups por hoy!</div>
      )}
    </main>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  main: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #1a1a1a 60%, #ff0033 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 48,
  },
  title: {
    color: '#ff0033',
    fontSize: 40,
    fontWeight: 900,
    marginBottom: 8,
    letterSpacing: 1.5,
  },
  subtitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom: 32,
    fontWeight: 500,
  },
  endMsg: {
    color: '#fff',
    fontSize: 24,
    marginTop: 64,
    fontWeight: 700,
    textAlign: 'center',
  },
};
