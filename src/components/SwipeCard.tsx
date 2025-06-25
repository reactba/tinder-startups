'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';

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
  onSwipeRight: () => void;
  onSwipeLeft: () => void;
}

const SwipeCard: React.FC<Props> = ({ startup, onSwipeRight, onSwipeLeft }) => {
  const controls = useAnimation();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Reset states when startup changes
  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    controls.set({ x: 0, opacity: 1, scale: 1 });
  }, [startup.id, controls]);

  // Add CSS animation for spinner on client side only
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @media (max-width: 768px) {
        .swipe-card {
          max-width: 90vw !important;
          padding: 16px !important;
        }
        
        .video-container {
          height: 200px !important;
        }
        
        .startup-name {
          font-size: 24px !important;
        }
        
        .startup-sector {
          font-size: 16px !important;
        }
        
        .startup-description {
          font-size: 14px !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Cleanup function to remove the style when component unmounts
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDragEnd = (
    _?: MouseEvent | TouchEvent | PointerEvent,
    info?: { offset: { x: number }; velocity: { x: number } }
  ) => {
    setIsDragging(false);
    const threshold = 120;
    const velocityThreshold = 500;

    if (!info) return;

    if (info.offset.x > threshold || info.velocity.x > velocityThreshold) {
      // Swipe right - like
      controls.start({
        x: 600,
        opacity: 0,
        scale: 0.8,
        rotate: 15,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -threshold || info.velocity.x < -velocityThreshold) {
      // Swipe left - pass
      controls.start({
        x: -600,
        opacity: 0,
        scale: 0.8,
        rotate: -15,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
      setTimeout(onSwipeLeft, 300);
    } else {
      // Return to center
      controls.start({
        x: 0,
        opacity: 1,
        scale: 1,
        rotate: 0,
        transition: { duration: 0.2, ease: 'easeOut' },
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      handleDragEnd(undefined, { offset: { x: 200 }, velocity: { x: 600 } });
    } else if (e.key === 'ArrowLeft') {
      handleDragEnd(undefined, { offset: { x: -200 }, velocity: { x: -600 } });
    }
  };

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoError(true);
  };

  const getVideoUrl = (url: string) => {
    // Add autoplay and mute parameters for YouTube embeds
    if (url.includes('youtube.com/embed/')) {
      return `${url}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  return (
    <div style={styles.wrapper} role="region" aria-label={`Tarjeta de ${startup.name}`}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.1}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, opacity: 1, scale: 1 }}
        style={styles.card}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        role="button"
        tabIndex={0}
        aria-label={`Desliza ${startup.name} hacia la derecha para contactar o hacia la izquierda para pasar`}
        onKeyDown={handleKeyDown}
      >
        {/* Video Container with Loading States */}
        <div style={styles.videoContainer}>
          <AnimatePresence mode="wait">
            {isVideoLoading && !videoError && (
              <motion.div
                key="loading"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={styles.loadingContainer}
              >
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Cargando video...</p>
              </motion.div>
            )}

            {videoError && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={styles.errorContainer}
              >
                <div style={styles.errorIcon}>⚠️</div>
                <p style={styles.errorText}>Error al cargar el video</p>
                <button
                  style={styles.retryButton}
                  onClick={() => {
                    setVideoError(false);
                    setIsVideoLoading(true);
                  }}
                >
                  Reintentar
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {!videoError && (
            <iframe
              ref={videoRef}
              src={getVideoUrl(startup.videoUrl)}
              style={styles.video as React.CSSProperties}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={`Video de presentación de ${startup.name}`}
              onLoad={handleVideoLoad}
              onError={handleVideoError}
              loading="lazy"
            />
          )}
        </div>

        {/* Startup Information */}
        <div style={styles.infoContainer}>
          <h2 style={styles.name} id={`startup-name-${startup.id}`}>
            {startup.name}
          </h2>
          <h4 style={styles.sector} aria-describedby={`startup-name-${startup.id}`}>
            {startup.sector}
          </h4>
          <p style={styles.description} aria-describedby={`startup-name-${startup.id}`}>
            {startup.description}
          </p>
        </div>

        {/* Swipe Indicators */}
        <AnimatePresence>
          {isDragging && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={styles.swipeIndicator}
            >
              <div style={styles.swipeText}>← Pasar | Contactar →</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '60vh',
    padding: '20px',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 8px 32px #ff003355',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2.5px solid #ff0033',
    cursor: 'grab',
    position: 'relative',
    overflow: 'hidden',
  },
  videoContainer: {
    width: '100%',
    height: 240,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    border: '2px solid #ff0033',
    background: '#000',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: 20,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    color: '#fff',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid #ff0033',
    borderTop: '4px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#fff',
  },
  errorContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#1a1a1a',
    color: '#fff',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    background: '#ff0033',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '8px 16px',
    fontSize: 14,
    cursor: 'pointer',
    fontWeight: 600,
  },
  infoContainer: {
    width: '100%',
    textAlign: 'center',
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: '#ff0033',
    margin: '12px 0 0 0',
    lineHeight: 1.2,
  },
  sector: {
    fontSize: 18,
    color: '#1a1a1a',
    margin: '4px 0 8px 0',
    fontWeight: 600,
    lineHeight: 1.3,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 1.5,
    maxWidth: '100%',
  },
  swipeIndicator: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(0, 0, 0, 0.8)',
    color: '#fff',
    padding: '12px 20px',
    borderRadius: 20,
    fontSize: 14,
    fontWeight: 600,
    pointerEvents: 'none',
    zIndex: 10,
  },
  swipeText: {
    whiteSpace: 'nowrap',
  },
};

export default SwipeCard;
