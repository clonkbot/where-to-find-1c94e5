import { motion } from 'framer-motion';
import type { LocationNode } from '../App';

interface ItemDetailProps {
  item: LocationNode;
  path: LocationNode[];
  onClose: () => void;
  onDelete: () => void;
  onAddChild: (type: 'container' | 'item') => void;
}

export function ItemDetail({ item, path, onClose, onDelete, onAddChild }: ItemDetailProps) {
  const canHaveChildren = item.type === 'room' || item.type === 'container';
  const childType = item.type === 'room' ? 'container' : 'item';

  return (
    <motion.div
      className="item-detail"
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="detail-header">
        <button className="close-btn" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="detail-content">
        <motion.div
          className="detail-icon"
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
        >
          {item.icon}
        </motion.div>

        <motion.h2
          className="detail-name"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          {item.name}
        </motion.h2>

        <motion.span
          className={`detail-type detail-type-${item.type}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {item.type}
        </motion.span>

        {path.length > 1 && (
          <motion.div
            className="detail-path"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <div className="path-label">Location path</div>
            <div className="path-breadcrumbs">
              {path.map((node, index) => (
                <span key={node.id} className="path-segment">
                  <span className="path-icon">{node.icon}</span>
                  <span className="path-name">{node.name}</span>
                  {index < path.length - 1 && (
                    <svg className="path-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {item.children.length > 0 && (
          <motion.div
            className="detail-contents"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="contents-label">Contains {item.children.length} {item.children.length === 1 ? 'item' : 'items'}</div>
            <ul className="contents-list">
              {item.children.map((child) => (
                <li key={child.id} className="contents-item">
                  <span className="contents-icon">{child.icon}</span>
                  <span className="contents-name">{child.name}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>

      <div className="detail-actions">
        {canHaveChildren && (
          <motion.button
            className="action-btn action-add"
            onClick={() => onAddChild(childType)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add {childType}
          </motion.button>
        )}

        <motion.button
          className="action-btn action-delete"
          onClick={onDelete}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
          </svg>
          Delete
        </motion.button>
      </div>

      <style>{`
        .item-detail {
          flex: 1;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 16px;
          box-shadow: var(--shadow-md);
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (min-width: 1024px) {
          .item-detail {
            max-width: 400px;
          }
        }

        .detail-header {
          display: flex;
          justify-content: flex-end;
          padding: 1rem;
          border-bottom: 1px solid var(--color-border);
        }

        .close-btn {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          border: 1px solid var(--color-border);
          border-radius: 10px;
          cursor: pointer;
          color: var(--color-muted);
          transition: all 0.15s ease;
        }

        .close-btn:hover {
          background: var(--color-cream-dark);
          color: var(--color-charcoal);
        }

        .close-btn svg {
          width: 20px;
          height: 20px;
        }

        .detail-content {
          flex: 1;
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          overflow-y: auto;
        }

        .detail-icon {
          font-size: 4rem;
          margin-bottom: 1rem;
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }

        .detail-name {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--color-charcoal);
          margin-bottom: 0.5rem;
        }

        .detail-type {
          font-size: 0.75rem;
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
          margin-bottom: 1.5rem;
        }

        .detail-type-room {
          background: var(--color-sage-light);
          color: #4A6B57;
        }

        .detail-type-container {
          background: var(--color-terracotta-light);
          color: #8B4D36;
        }

        .detail-type-item {
          background: var(--color-cream-dark);
          color: var(--color-muted);
        }

        .detail-path {
          width: 100%;
          padding: 1rem;
          background: var(--color-cream);
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .path-label {
          font-size: 0.6875rem;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
        }

        .path-breadcrumbs {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .path-segment {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .path-icon {
          font-size: 1rem;
        }

        .path-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: var(--color-charcoal-light);
        }

        .path-arrow {
          width: 14px;
          height: 14px;
          color: var(--color-muted);
          margin-left: 0.125rem;
        }

        .detail-contents {
          width: 100%;
          text-align: left;
        }

        .contents-label {
          font-size: 0.6875rem;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.75rem;
        }

        .contents-list {
          list-style: none;
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .contents-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          padding: 0.5rem 0.75rem;
          background: var(--color-cream);
          border-radius: 8px;
        }

        .contents-icon {
          font-size: 1rem;
        }

        .contents-name {
          font-size: 0.875rem;
          color: var(--color-charcoal);
        }

        .detail-actions {
          padding: 1.25rem;
          border-top: 1px solid var(--color-border);
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        @media (min-width: 480px) {
          .detail-actions {
            flex-direction: row;
          }
        }

        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1rem;
          border-radius: 10px;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
          min-height: 48px;
        }

        .action-btn svg {
          width: 18px;
          height: 18px;
        }

        .action-add {
          background: var(--color-terracotta);
          color: white;
          border: none;
          box-shadow: var(--shadow-terracotta);
        }

        .action-add:hover {
          background: #B85D3F;
        }

        .action-delete {
          background: white;
          color: var(--color-muted);
          border: 1px solid var(--color-border);
        }

        .action-delete:hover {
          background: #FEF2F2;
          color: #DC2626;
          border-color: #FECACA;
        }
      `}</style>
    </motion.div>
  );
}
