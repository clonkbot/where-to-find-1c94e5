import { useState } from 'react';
import { motion } from 'framer-motion';

interface AddItemModalProps {
  type: 'room' | 'container' | 'item';
  onClose: () => void;
  onAdd: (name: string, icon: string) => void;
}

const iconSuggestions = {
  room: ['🛋️', '🛏️', '🍳', '🚗', '🛁', '📚', '💼', '🌿', '🏠', '🪴'],
  container: ['🗄️', '📦', '🧰', '🗃️', '🚪', '👔', '🎒', '💼', '📚', '🧺'],
  item: ['📱', '🔑', '💊', '🔌', '✂️', '🔋', '📷', '🎧', '💳', '🪥'],
};

export function AddItemModal({ type, onClose, onAdd }: AddItemModalProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState(iconSuggestions[type][0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), icon);
    }
  };

  const typeLabels = {
    room: 'New Room',
    container: 'New Container',
    item: 'New Item',
  };

  const typeDescriptions = {
    room: 'Add a space like a bedroom, kitchen, or office',
    container: 'Add a drawer, box, shelf, or cabinet',
    item: 'Add something you want to track',
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <h3 className="modal-title">{typeLabels[type]}</h3>
            <p className="modal-description">{typeDescriptions[type]}</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label className="form-label">Choose an icon</label>
            <div className="icon-grid">
              {iconSuggestions[type].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  className={`icon-option ${icon === emoji ? 'selected' : ''}`}
                  onClick={() => setIcon(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name" className="form-label">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'room' ? 'e.g., Living Room' : type === 'container' ? 'e.g., Junk Drawer' : 'e.g., Passport'}
              className="form-input"
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={!name.trim()}>
              <span className="btn-icon">{icon}</span>
              Add {type}
            </button>
          </div>
        </form>
      </motion.div>

      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(45, 41, 38, 0.4);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
          z-index: 1000;
        }

        .modal-content {
          width: 100%;
          max-width: 420px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 24px 48px rgba(45, 41, 38, 0.2);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem 1.5rem 0;
          gap: 1rem;
        }

        .modal-title-group {
          flex: 1;
        }

        .modal-title {
          font-family: var(--font-display);
          font-size: 1.375rem;
          font-weight: 600;
          color: var(--color-charcoal);
          margin-bottom: 0.25rem;
        }

        .modal-description {
          font-size: 0.875rem;
          color: var(--color-muted);
        }

        .modal-close {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          border: none;
          border-radius: 10px;
          cursor: pointer;
          color: var(--color-muted);
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .modal-close:hover {
          background: var(--color-cream-dark);
          color: var(--color-charcoal);
        }

        .modal-close svg {
          width: 20px;
          height: 20px;
        }

        .modal-form {
          padding: 1.5rem;
        }

        .form-group {
          margin-bottom: 1.25rem;
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-charcoal-light);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.625rem;
        }

        .icon-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 0.5rem;
        }

        .icon-option {
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          background: var(--color-cream);
          border: 2px solid transparent;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 48px;
        }

        .icon-option:hover {
          background: var(--color-cream-dark);
          transform: scale(1.05);
        }

        .icon-option.selected {
          background: var(--color-terracotta-light);
          border-color: var(--color-terracotta);
        }

        .form-input {
          width: 100%;
          padding: 0.875rem 1rem;
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-charcoal);
          background: var(--color-cream);
          border: 2px solid transparent;
          border-radius: 12px;
          transition: all 0.15s ease;
        }

        .form-input::placeholder {
          color: var(--color-muted);
        }

        .form-input:focus {
          outline: none;
          background: white;
          border-color: var(--color-terracotta-light);
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1.5rem;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 0.875rem 1rem;
          border-radius: 12px;
          font-family: var(--font-body);
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 52px;
        }

        .btn-cancel {
          background: var(--color-cream);
          border: 1px solid var(--color-border);
          color: var(--color-charcoal-light);
        }

        .btn-cancel:hover {
          background: var(--color-cream-dark);
        }

        .btn-submit {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: var(--color-terracotta);
          border: none;
          color: white;
          box-shadow: var(--shadow-terracotta);
        }

        .btn-submit:hover:not(:disabled) {
          background: #B85D3F;
        }

        .btn-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .btn-icon {
          font-size: 1.125rem;
        }
      `}</style>
    </motion.div>
  );
}
