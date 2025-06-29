'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Startup {
  id: string;
  name: string;
  sector: string;
  videoUrl: string;
  description: string;
  email: string;
}

interface FormData {
  name: string;
  email: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  message?: string;
}

interface Props {
  startup: Startup;
  onClose: () => void;
}

const ContactForm: React.FC<Props> = ({ startup, onClose }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const modalRef = useRef<HTMLDivElement>(null);
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  // Handle click outside modal to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Add CSS animation for spinner on client side only
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @media (max-width: 768px) {
        .contact-modal {
          max-width: 95vw !important;
          margin: 10px !important;
        }
        
        .contact-form {
          padding: 24px !important;
        }
        
        .contact-title {
          font-size: 20px !important;
        }
        
        .contact-input {
          font-size: 16px !important;
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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Ingresa un email válido';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    } else if (formData.message.trim().length > 500) {
      newErrors.message = 'El mensaje no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Save to localStorage (temporary solution)
      const prev = JSON.parse(localStorage.getItem('contacts') || '[]');
      prev.push({
        ...formData,
        startupId: startup.id,
        startupName: startup.name,
        date: new Date().toISOString(),
      });
      localStorage.setItem('contacts', JSON.stringify(prev));

      setIsSubmitted(true);

      // Close modal after showing success message
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch {
      setSubmitError('Error al enviar el mensaje. Por favor, intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={styles.overlay}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-form-title"
        aria-describedby="contact-form-description"
      >
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          style={styles.modal}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            style={styles.closeButton}
            aria-label="Cerrar formulario"
            disabled={isSubmitting}
          >
            ×
          </button>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} style={styles.form}>
              <div style={styles.header}>
                <h2 id="contact-form-title" style={styles.title}>
                  Contactar a {startup.name}
                </h2>
                <p id="contact-form-description" style={styles.subtitle}>
                  Envía un mensaje a esta startup para iniciar una conversación
                </p>
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="name" style={styles.label}>
                  Nombre completo *
                </label>
                <input
                  ref={firstInputRef}
                  id="name"
                  type="text"
                  style={{
                    ...styles.input,
                    ...(errors.name && styles.inputError),
                  }}
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                />
                {errors.name && (
                  <span id="name-error" style={styles.errorText}>
                    {errors.name}
                  </span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="email" style={styles.label}>
                  Email *
                </label>
                <input
                  id="email"
                  type="email"
                  style={{
                    ...styles.input,
                    ...(errors.email && styles.inputError),
                  }}
                  placeholder="tu@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  disabled={isSubmitting}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                />
                {errors.email && (
                  <span id="email-error" style={styles.errorText}>
                    {errors.email}
                  </span>
                )}
              </div>

              <div style={styles.inputGroup}>
                <label htmlFor="message" style={styles.label}>
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  style={{
                    ...styles.input,
                    ...styles.textarea,
                    ...(errors.message && styles.inputError),
                  }}
                  placeholder="Cuéntanos sobre tu interés en esta startup..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  disabled={isSubmitting}
                  rows={4}
                  maxLength={500}
                  aria-invalid={!!errors.message}
                  aria-describedby={errors.message ? 'message-error' : 'message-help'}
                />
                <div style={styles.messageFooter}>
                  {errors.message && (
                    <span id="message-error" style={styles.errorText}>
                      {errors.message}
                    </span>
                  )}
                  <span id="message-help" style={styles.characterCount}>
                    {formData.message.length}/500
                  </span>
                </div>
              </div>

              {submitError && (
                <div style={styles.submitError}>
                  <span style={styles.errorIcon}>⚠️</span>
                  {submitError}
                </div>
              )}

              <div style={styles.buttonGroup}>
                <button
                  type="submit"
                  style={{
                    ...styles.submitButton,
                    ...(isSubmitting && styles.submitButtonDisabled),
                  }}
                  disabled={isSubmitting}
                  aria-describedby={isSubmitting ? 'submitting-text' : undefined}
                >
                  {isSubmitting ? (
                    <>
                      <div style={styles.spinner}></div>
                      <span id="submitting-text">Enviando...</span>
                    </>
                  ) : (
                    'Enviar mensaje'
                  )}
                </button>

                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
              </div>
            </form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              style={styles.successContainer}
            >
              <div style={styles.successIcon}>✅</div>
              <h3 style={styles.successTitle}>¡Mensaje enviado!</h3>
              <p style={styles.successMessage}>
                Tu mensaje ha sido enviado a {startup.name}. Te contactaremos pronto.
              </p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    background: 'rgba(26, 26, 26, 0.8)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '20px',
  },
  modal: {
    background: '#fff',
    borderRadius: 24,
    padding: 0,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    overflow: 'hidden',
    boxShadow: '0 20px 60px rgba(255, 0, 51, 0.3)',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    fontSize: 28,
    color: '#666',
    cursor: 'pointer',
    width: 32,
    height: 32,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    transition: 'all 0.2s ease',
  },
  form: {
    padding: 32,
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    overflowY: 'auto',
  },
  header: {
    textAlign: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#ff0033',
    margin: '0 0 8px 0',
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    margin: 0,
    lineHeight: 1.4,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: 600,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    width: '100%',
    background: '#f8f9fa',
    border: '2px solid #e9ecef',
    borderRadius: 12,
    padding: '12px 16px',
    fontSize: 16,
    color: '#333',
    outline: 'none',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
  },
  textarea: {
    resize: 'vertical',
    minHeight: 100,
    fontFamily: 'inherit',
  },
  inputError: {
    borderColor: '#dc3545',
    background: '#fff5f5',
  },
  errorText: {
    fontSize: 12,
    color: '#dc3545',
    marginTop: 4,
  },
  messageFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  characterCount: {
    fontSize: 12,
    color: '#666',
  },
  submitError: {
    background: '#fff5f5',
    border: '1px solid #dc3545',
    borderRadius: 8,
    padding: '12px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    fontSize: 14,
    color: '#dc3545',
  },
  errorIcon: {
    fontSize: 16,
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    marginTop: 8,
  },
  submitButton: {
    background: '#ff0033',
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '16px 24px',
    fontSize: 16,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitButtonDisabled: {
    background: '#ccc',
    cursor: 'not-allowed',
  },
  cancelButton: {
    background: 'none',
    color: '#666',
    border: '1px solid #ddd',
    borderRadius: 12,
    padding: '12px 24px',
    fontSize: 14,
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  spinner: {
    width: 16,
    height: 16,
    border: '2px solid #fff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  successContainer: {
    padding: 48,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  successIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: 700,
    color: '#28a745',
    margin: 0,
  },
  successMessage: {
    fontSize: 16,
    color: '#666',
    margin: 0,
    lineHeight: 1.5,
  },
};

export default ContactForm;
