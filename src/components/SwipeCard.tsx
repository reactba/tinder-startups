'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

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

const SWIPE_THRESHOLD = 100;

const SwipeCard: React.FC<Props> = ({ startup, onSwipeRight, onSwipeLeft }) => {
  const controls = useAnimation();
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeDirection, setSwipeDirection] = useState<null | 'left' | 'right'>(null);
  const videoRef = useRef<HTMLIFrameElement>(null);

  // Add CSS animation for spinner
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
    return () => {
      if (document.head.contains(style)) {
        document.head.removeChild(style);
      }
    };
  }, []);

  // Reset states when startup changes
  useEffect(() => {
    setIsVideoLoading(true);
    setVideoError(false);
    setSwipeDirection(null);
    controls.set({ x: 0, opacity: 1, scale: 1, rotate: 0 });
  }, [startup.id, controls]);

  // react-swipeable handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setSwipeDirection('left');
      controls.start({
        x: -600,
        opacity: 0,
        scale: 0.8,
        rotate: -15,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
      setTimeout(() => {
        setSwipeDirection(null);
        onSwipeLeft();
      }, 300);
    },
    onSwipedRight: () => {
      setSwipeDirection('right');
      controls.start({
        x: 600,
        opacity: 0,
        scale: 0.8,
        rotate: 15,
        transition: { duration: 0.3, ease: 'easeOut' },
      });
      setTimeout(() => {
        setSwipeDirection(null);
        onSwipeRight();
      }, 300);
    },
    onSwiping: ({ deltaX }) => {
      setIsDragging(true);
      controls.set({ x: deltaX, scale: 0.97, rotate: deltaX / 20 });
    },
    onTap: () => {},
    onTouchEndOrOnMouseUp: () => {
      setIsDragging(false);
      controls.start({ x: 0, scale: 1, rotate: 0, transition: { duration: 0.2, ease: 'easeOut' } });
    },
    delta: SWIPE_THRESHOLD,
    trackMouse: true,
    preventScrollOnSwipe: true,
  });

  // Keyboard navigation for accessibility
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        onSwipeRight();
      } else if (e.key === 'ArrowLeft') {
        onSwipeLeft();
      }
    },
    [onSwipeLeft, onSwipeRight]
  );

  const handleVideoLoad = () => {
    setIsVideoLoading(false);
  };

  const handleVideoError = () => {
    setIsVideoLoading(false);
    setVideoError(true);
  };

  const getVideoUrl = (url: string) => {
    if (url.includes('youtube.com/embed/')) {
      return `${url}?autoplay=1&mute=1&controls=1&rel=0&modestbranding=1`;
    }
    return url;
  };

  return (
    <div
      style={styles.wrapper}
      role="region"
      aria-label={`Tarjeta de ${startup.name}`}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      {...swipeHandlers}
    >
      <motion.div
        animate={controls}
        initial={{ x: 0, opacity: 1, scale: 1, rotate: 0 }}
        style={styles.card}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        role="button"
        aria-label={`Desliza ${startup.name} hacia la derecha para contactar o hacia la izquierda para pasar`}
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
              style={{
                ...styles.swipeIndicator,
                background:
                  swipeDirection === 'left'
                    ? '#dc3545cc'
                    : swipeDirection === 'right'
                      ? '#28a745cc'
                      : 'rgba(0,0,0,0.8)',
              }}
            >
              <div style={styles.swipeText}>
                {swipeDirection === 'left' && '← Pasar'}
                {swipeDirection === 'right' && 'Contactar →'}
                {!swipeDirection && '← Pasar | Contactar →'}
              </div>
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
    outline: 'none',
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
