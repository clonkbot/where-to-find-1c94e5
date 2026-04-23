import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocationNode } from '../App';

interface LocationTreeProps {
  nodes: LocationNode[];
  onSelect: (node: LocationNode) => void;
  selectedId?: string;
  onAddChild: (parentId: string, type: 'container' | 'item') => void;
  level?: number;
}

export function LocationTree({ nodes, onSelect, selectedId, onAddChild, level = 0 }: LocationTreeProps) {
  return (
    <ul className="location-tree" data-level={level}>
      {nodes.map((node, index) => (
        <LocationTreeItem
          key={node.id}
          node={node}
          onSelect={onSelect}
          selectedId={selectedId}
          onAddChild={onAddChild}
          level={level}
          index={index}
        />
      ))}

      <style>{`
        .location-tree {
          list-style: none;
        }

        .location-tree[data-level="0"] {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
      `}</style>
    </ul>
  );
}

interface LocationTreeItemProps {
  node: LocationNode;
  onSelect: (node: LocationNode) => void;
  selectedId?: string;
  onAddChild: (parentId: string, type: 'container' | 'item') => void;
  level: number;
  index: number;
}

function LocationTreeItem({ node, onSelect, selectedId, onAddChild, level, index }: LocationTreeItemProps) {
  const [isExpanded, setIsExpanded] = useState(level === 0);
  const hasChildren = node.children.length > 0;
  const isSelected = selectedId === node.id;
  const canHaveChildren = node.type === 'room' || node.type === 'container';

  return (
    <motion.li
      className={`tree-item tree-item-${node.type}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <div className={`tree-item-content ${isSelected ? 'selected' : ''}`}>
        {(hasChildren || canHaveChildren) && (
          <button
            className={`expand-btn ${isExpanded ? 'expanded' : ''}`}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        <button className="tree-item-main" onClick={() => onSelect(node)}>
          <span className="tree-item-icon">{node.icon}</span>
          <span className="tree-item-name">{node.name}</span>
          {hasChildren && (
            <span className="tree-item-count">{node.children.length}</span>
          )}
        </button>

        {canHaveChildren && (
          <div className="tree-item-actions">
            <button
              className="add-child-btn"
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id, node.type === 'room' ? 'container' : 'item');
              }}
              title={node.type === 'room' ? 'Add container' : 'Add item'}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            className="tree-children"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="tree-children-inner">
              <LocationTree
                nodes={node.children}
                onSelect={onSelect}
                selectedId={selectedId}
                onAddChild={onAddChild}
                level={level + 1}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .tree-item {
          position: relative;
        }

        .tree-item-content {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.375rem;
          border-radius: 10px;
          transition: background-color 0.15s ease;
        }

        .tree-item-room > .tree-item-content {
          background: white;
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .tree-item-content:hover {
          background: var(--color-cream-dark);
        }

        .tree-item-room > .tree-item-content:hover {
          background: white;
          border-color: var(--color-terracotta-light);
        }

        .tree-item-content.selected {
          background: var(--color-terracotta-light);
        }

        .tree-item-room > .tree-item-content.selected {
          background: var(--color-terracotta-light);
          border-color: var(--color-terracotta);
        }

        .expand-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--color-muted);
          transition: all 0.2s ease;
          border-radius: 6px;
          flex-shrink: 0;
        }

        .expand-btn:hover {
          color: var(--color-charcoal);
          background: rgba(0, 0, 0, 0.05);
        }

        .expand-btn svg {
          width: 16px;
          height: 16px;
          transition: transform 0.2s ease;
        }

        .expand-btn.expanded svg {
          transform: rotate(90deg);
        }

        .tree-item-main {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.625rem;
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          text-align: left;
          border-radius: 8px;
          min-height: 44px;
        }

        .tree-item-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .tree-item-name {
          flex: 1;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-charcoal);
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .tree-item-room > .tree-item-content .tree-item-name {
          font-family: var(--font-display);
          font-size: 1rem;
        }

        .tree-item-count {
          font-size: 0.75rem;
          padding: 0.125rem 0.5rem;
          background: var(--color-cream-dark);
          color: var(--color-muted);
          border-radius: 10px;
          flex-shrink: 0;
        }

        .tree-item-room > .tree-item-content .tree-item-count {
          background: var(--color-sage-light);
          color: #4A6B57;
        }

        .tree-item-actions {
          display: flex;
          gap: 0.25rem;
          opacity: 0;
          transition: opacity 0.15s ease;
        }

        .tree-item-content:hover .tree-item-actions {
          opacity: 1;
        }

        .add-child-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream);
          border: 1px solid var(--color-border);
          border-radius: 6px;
          cursor: pointer;
          color: var(--color-muted);
          transition: all 0.15s ease;
        }

        .add-child-btn:hover {
          background: var(--color-terracotta);
          border-color: var(--color-terracotta);
          color: white;
        }

        .add-child-btn svg {
          width: 16px;
          height: 16px;
        }

        .tree-children {
          overflow: hidden;
        }

        .tree-children-inner {
          padding-left: 1.75rem;
          padding-top: 0.375rem;
          border-left: 2px solid var(--color-border);
          margin-left: 0.875rem;
        }

        .tree-children .tree-item + .tree-item {
          margin-top: 0.25rem;
        }

        @media (max-width: 640px) {
          .tree-item-actions {
            opacity: 1;
          }
        }
      `}</style>
    </motion.li>
  );
}
