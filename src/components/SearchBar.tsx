import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LocationNode } from '../App';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  results: LocationNode[];
  onSelectResult: (item: LocationNode) => void;
  findPath: (id: string) => LocationNode[] | null;
}

export function SearchBar({ value, onChange, results, onSelectResult, findPath }: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showResults = isFocused && value.length > 0 && results.length > 0;

  return (
    <div ref={containerRef} className="search-container">
      <motion.div
        className="search-input-wrapper"
        animate={{
          boxShadow: isFocused
            ? '0 4px 20px rgba(201, 107, 75, 0.15)'
            : '0 2px 8px rgba(45, 41, 38, 0.06)',
        }}
      >
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Where did I put..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="search-input"
        />
        {value && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => onChange('')}
            className="search-clear"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </motion.button>
        )}
      </motion.div>

      <AnimatePresence>
        {showResults && (
          <motion.div
            className="search-results"
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <div className="search-results-header">
              Found {results.length} item{results.length !== 1 ? 's' : ''}
            </div>
            <ul className="search-results-list">
              {results.slice(0, 8).map((item, index) => {
                const path = findPath(item.id);
                return (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <button
                      onClick={() => {
                        onSelectResult(item);
                        setIsFocused(false);
                      }}
                      className="search-result-item"
                    >
                      <span className="result-icon">{item.icon}</span>
                      <div className="result-info">
                        <span className="result-name">{item.name}</span>
                        {path && path.length > 1 && (
                          <span className="result-path">
                            {path.slice(0, -1).map(p => p.name).join(' → ')}
                          </span>
                        )}
                      </div>
                      <span className={`result-type result-type-${item.type}`}>
                        {item.type}
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .search-container {
          position: relative;
          width: 100%;
          max-width: 400px;
        }

        .search-input-wrapper {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          transition: border-color 0.2s ease;
        }

        .search-input-wrapper:focus-within {
          border-color: var(--color-terracotta-light);
        }

        .search-icon {
          width: 20px;
          height: 20px;
          color: var(--color-muted);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          background: none;
          font-family: var(--font-body);
          font-size: 1rem;
          color: var(--color-charcoal);
          min-width: 0;
        }

        .search-input::placeholder {
          color: var(--color-muted);
        }

        .search-input:focus {
          outline: none;
        }

        .search-clear {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-cream-dark);
          border: none;
          border-radius: 6px;
          cursor: pointer;
          color: var(--color-muted);
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .search-clear:hover {
          background: var(--color-border);
          color: var(--color-charcoal);
        }

        .search-clear svg {
          width: 16px;
          height: 16px;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid var(--color-border);
          border-radius: 12px;
          box-shadow: var(--shadow-lg);
          overflow: hidden;
          z-index: 100;
        }

        .search-results-header {
          padding: 0.75rem 1rem;
          font-size: 0.75rem;
          color: var(--color-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid var(--color-border);
        }

        .search-results-list {
          list-style: none;
          max-height: 320px;
          overflow-y: auto;
        }

        .search-result-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.875rem 1rem;
          background: none;
          border: none;
          text-align: left;
          cursor: pointer;
          transition: background-color 0.15s ease;
          min-height: 48px;
        }

        .search-result-item:hover {
          background: var(--color-cream);
        }

        .result-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .result-info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }

        .result-name {
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--color-charcoal);
        }

        .result-path {
          font-size: 0.75rem;
          color: var(--color-muted);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .result-type {
          font-size: 0.6875rem;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.03em;
          font-weight: 500;
          flex-shrink: 0;
        }

        .result-type-room {
          background: var(--color-sage-light);
          color: #4A6B57;
        }

        .result-type-container {
          background: var(--color-terracotta-light);
          color: #8B4D36;
        }

        .result-type-item {
          background: var(--color-cream-dark);
          color: var(--color-muted);
        }
      `}</style>
    </div>
  );
}
