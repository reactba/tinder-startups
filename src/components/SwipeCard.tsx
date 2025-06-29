import React from 'react';
import { motion, useAnimation } from 'framer-motion';

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

  const handleDragEnd = (_: any, info: { offset: { x: number } }) => {
    if (info.offset.x > 120) {
      controls.start({ x: 600, opacity: 0 });
      setTimeout(onSwipeRight, 300);
    } else if (info.offset.x < -120) {
      controls.start({ x: -600, opacity: 0 });
      setTimeout(onSwipeLeft, 300);
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div style={styles.wrapper}>
      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        animate={controls}
        initial={{ x: 0, opacity: 1 }}
        style={styles.card}
        whileTap={{ scale: 0.97 }}
      >
        <div style={styles.videoContainer}>
          <iframe
            src={startup.videoUrl}
            style={styles.video as React.CSSProperties}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={startup.name}
          />
        </div>
        <h2 style={styles.name}>{startup.name}</h2>
        <h4 style={styles.sector}>{startup.sector}</h4>
        <p style={styles.description}>{startup.description}</p>
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
  },
  card: {
    width: 380,
    background: '#fff',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 8px 32px #ff003355',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '2.5px solid #ff0033',
  },
  videoContainer: {
    width: '100%',
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 18,
    border: '2px solid #ff0033',
    background: '#000',
  },
  video: {
    width: '100%',
    height: '100%',
    border: 'none',
    borderRadius: 20,
  },
  name: {
    fontSize: 28,
    fontWeight: 700,
    color: '#ff0033',
    margin: '12px 0 0 0',
  },
  sector: {
    fontSize: 18,
    color: '#1a1a1a',
    margin: '4px 0 8px 0',
    fontWeight: 600,
  },
  description: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginTop: 8,
  },
};

export default SwipeCard;
