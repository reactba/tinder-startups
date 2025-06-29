'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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

interface PageState {
  current: number;
  showForm: boolean;
  selectedStartup: Startup | null;
  isLoading: boolean;
  error: string | null;
  hasMoreCards: boolean;
}

export default function HomePage() {
  const [state, setState] = useState<PageState>({
    current: 0,
    showForm: false,
    selectedStartup: null,
    isLoading: false,
    error: null,
    hasMoreCards: true,
  });

  const startups = startupsData as Startup[];

  // Check if there are more cards
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      hasMoreCards: prev.current < startups.length - 1,
    }));
  }, [state.current, startups.length]);

  // Handle swipe right (like/contact)
  const handleSwipeRight = useCallback(() => {
    if (startups[state.current]) {
      setState((prev) => ({
        ...prev,
        selectedStartup: startups[prev.current],
        showForm: true,
      }));
    }
  }, [state.current, startups]);

  // Handle swipe left (pass)
  const handleSwipeLeft = useCallback(() => {
    setState((prev) => ({
      ...prev,
      current: Math.min(prev.current + 1, startups.length - 1),
    }));
  }, [startups.length]);

  // Handle form close
  const handleFormClose = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showForm: false,
      selectedStartup: null,
      current: Math.min(prev.current + 1, startups.length - 1),
    }));
  }, [startups.length]);

  // Handle manual navigation buttons
  const handlePass = useCallback(() => {
    handleSwipeLeft();
  }, [handleSwipeLeft]);

  const handleContact = useCallback(() => {
    handleSwipeRight();
  }, [handleSwipeRight]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (state.showForm) return; // Don't handle keys when form is open

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          handlePass();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleContact();
          break;
        case 'Escape':
          if (state.showForm) {
            handleFormClose();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [state.showForm, handlePass, handleContact, handleFormClose]);

  // Reset to first card when reaching the end
  const handleReset = useCallback(() => {
    setState((prev) => ({
      ...prev,
      current: 0,
      hasMoreCards: true,
    }));
  }, []);

  const currentStartup = startups[state.current];

  return (
    <>
      {/* SEO Meta Tags */}
      <head>
        <title>Tinder Startups - Descubre y conecta con startups innovadoras</title>
        <meta
          name="description"
          content="Descubre startups innovadoras y conecta con emprendedores usando nuestra plataforma de swipe. Encuentra tu próxima oportunidad de inversión."
        />
        <meta
          name="keywords"
          content="startups, emprendimiento, inversión, innovación, tecnología"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Tinder Startups" />
        <meta
          property="og:description"
          content="Descubre startups innovadoras y conecta con emprendedores"
        />
        <meta property="og:type" content="website" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <main style={styles.main} role="main">
        {/* Header */}
        <header style={styles.header}>
          <motion.h1
            style={styles.title}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Tinder Startups
          </motion.h1>
          <motion.p
            style={styles.subtitle}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Descubre startups y conecta con un swipe
          </motion.p>

          {/* Progress indicator */}
          <motion.div
            style={styles.progressContainer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div style={styles.progressBar}>
              <div
                style={{
                  ...styles.progressFill,
                  width: `${((state.current + 1) / startups.length) * 100}%`,
                }}
              />
            </div>
            <span style={styles.progressText}>
              {state.current + 1} de {startups.length}
            </span>
          </motion.div>
        </header>

        {/* Main Content */}
        <section style={styles.content}>
          <AnimatePresence mode="wait">
            {state.error && (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                style={styles.errorContainer}
              >
                <div style={styles.errorIcon}>⚠️</div>
                <h3 style={styles.errorTitle}>Error</h3>
                <p style={styles.errorMessage}>{state.error}</p>
                <button
                  onClick={() => setState((prev) => ({ ...prev, error: null }))}
                  style={styles.retryButton}
                >
                  Reintentar
                </button>
              </motion.div>
            )}

            {!state.showForm && currentStartup && (
              <motion.div
                key={`card-${currentStartup.id}`}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -50 }}
                transition={{ duration: 0.4 }}
                style={styles.cardContainer}
              >
                <SwipeCard
                  startup={currentStartup}
                  onSwipeRight={handleSwipeRight}
                  onSwipeLeft={handleSwipeLeft}
                />
              </motion.div>
            )}

            {!currentStartup && !state.showForm && (
              <motion.div
                key="end-message"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                style={styles.endContainer}
              >
                <div style={styles.endIcon}>🎉</div>
                <h2 style={styles.endTitle}>¡No hay más startups por hoy!</h2>
                <p style={styles.endMessage}>
                  Has revisado todas las startups disponibles. Vuelve mañana para descubrir nuevas
                  oportunidades.
                </p>
                <button onClick={handleReset} style={styles.resetButton}>
                  Ver desde el principio
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Navigation Buttons (Desktop) */}
        {currentStartup && !state.showForm && (
          <motion.nav
            style={styles.navigation}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <button
              onClick={handlePass}
              style={styles.navButton}
              className="pass-button"
              aria-label="Pasar startup"
              title="Pasar (Flecha izquierda)"
            >
              <span style={styles.navButtonIcon}>✕</span>
              <span style={styles.navButtonText}>Pasar</span>
            </button>

            <button
              onClick={handleContact}
              style={styles.navButton}
              className="contact-button"
              aria-label="Contactar startup"
              title="Contactar (Flecha derecha)"
            >
              <span style={styles.navButtonIcon}>♥</span>
              <span style={styles.navButtonText}>Contactar</span>
            </button>
          </motion.nav>
        )}

        {/* Instructions */}
        <motion.footer
          style={styles.footer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <p style={styles.instructions}>
            <strong>Navegación:</strong> Usa las flechas del teclado o desliza las tarjetas
          </p>
          <p style={styles.instructions}>
            <strong>Flecha izquierda:</strong> Pasar | <strong>Flecha derecha:</strong> Contactar
          </p>
        </motion.footer>

        {/* Contact Form Modal */}
        <AnimatePresence>
          {state.showForm && state.selectedStartup && (
            <ContactForm startup={state.selectedStartup} onClose={handleFormClose} />
          )}
        </AnimatePresence>
      </main>
    </>
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
    padding: '20px',
    position: 'relative',
    overflow: 'hidden',
  },
  header: {
    textAlign: 'center',
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
  },
  title: {
    color: '#ff0033',
    fontSize: 'clamp(32px, 6vw, 48px)',
    fontWeight: 900,
    marginBottom: 12,
    letterSpacing: 1.5,
    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
  },
  subtitle: {
    color: '#fff',
    fontSize: 'clamp(16px, 3vw, 20px)',
    marginBottom: 24,
    fontWeight: 500,
    opacity: 0.9,
  },
  progressContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  progressBar: {
    width: 200,
    height: 6,
    background: 'rgba(255,255,255,0.2)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#ff0033',
    borderRadius: 3,
    transition: 'width 0.3s ease',
  },
  progressText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
    opacity: 0.8,
  },
  content: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 600,
    position: 'relative',
  },
  cardContainer: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  endContainer: {
    textAlign: 'center',
    padding: 48,
    background: 'rgba(255,255,255,0.1)',
    borderRadius: 24,
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    maxWidth: 400,
  },
  endIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  endTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
  },
  endMessage: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 1.5,
    marginBottom: 24,
    opacity: 0.9,
  },
  resetButton: {
    background: '#ff0033',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '12px 24px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  errorContainer: {
    textAlign: 'center',
    padding: 32,
    background: 'rgba(220, 53, 69, 0.1)',
    borderRadius: 16,
    border: '1px solid rgba(220, 53, 69, 0.3)',
    maxWidth: 400,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    color: '#dc3545',
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 12,
  },
  errorMessage: {
    color: '#dc3545',
    fontSize: 16,
    marginBottom: 20,
  },
  retryButton: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
  },
  navigation: {
    display: 'flex',
    gap: 20,
    marginTop: 32,
    marginBottom: 20,
  },
  navButton: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.1)',
    border: '2px solid rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: '16px 24px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backdropFilter: 'blur(10px)',
    minWidth: 120,
  },
  navButtonIcon: {
    fontSize: 24,
    fontWeight: 700,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 600,
  },
  footer: {
    textAlign: 'center',
    marginTop: 'auto',
    paddingTop: 20,
  },
  instructions: {
    color: '#fff',
    fontSize: 14,
    margin: '4px 0',
    opacity: 0.7,
  },
};

// Add responsive styles
const style = document.createElement('style');
style.textContent = `
  @media (max-width: 768px) {
    .pass-button:hover,
    .contact-button:hover {
      transform: none !important;
    }
    
    .nav-button {
      min-width: 100px !important;
      padding: 12px 16px !important;
    }
  }
  
  @media (max-width: 480px) {
    .main {
      padding: 16px !important;
    }
    
    .header {
      margin-bottom: 24px !important;
    }
    
    .navigation {
      gap: 16px !important;
    }
    
    .nav-button {
      min-width: 80px !important;
      padding: 10px 12px !important;
    }
  }
`;
document.head.appendChild(style);
