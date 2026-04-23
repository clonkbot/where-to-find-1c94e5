import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocationTree } from './components/LocationTree';
import { SearchBar } from './components/SearchBar';
import { AddItemModal } from './components/AddItemModal';
import { ItemDetail } from './components/ItemDetail';
import './styles.css';

export interface LocationNode {
  id: string;
  name: string;
  type: 'room' | 'container' | 'item';
  icon?: string;
  children: LocationNode[];
  parentId?: string;
}

const initialData: LocationNode[] = [
  {
    id: '1',
    name: 'Living Room',
    type: 'room',
    icon: '🛋️',
    children: [
      {
        id: '1-1',
        name: 'TV Console',
        type: 'container',
        icon: '🗄️',
        parentId: '1',
        children: [
          { id: '1-1-1', name: 'Remote Controls', type: 'item', icon: '📺', parentId: '1-1', children: [] },
          { id: '1-1-2', name: 'HDMI Cables', type: 'item', icon: '🔌', parentId: '1-1', children: [] },
          { id: '1-1-3', name: 'Gaming Controllers', type: 'item', icon: '🎮', parentId: '1-1', children: [] },
        ],
      },
      {
        id: '1-2',
        name: 'Bookshelf',
        type: 'container',
        icon: '📚',
        parentId: '1',
        children: [
          { id: '1-2-1', name: 'Photo Albums', type: 'item', icon: '📷', parentId: '1-2', children: [] },
          { id: '1-2-2', name: 'Board Games', type: 'item', icon: '🎲', parentId: '1-2', children: [] },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Kitchen',
    type: 'room',
    icon: '🍳',
    children: [
      {
        id: '2-1',
        name: 'Pantry',
        type: 'container',
        icon: '🚪',
        parentId: '2',
        children: [
          { id: '2-1-1', name: 'Spices', type: 'item', icon: '🌶️', parentId: '2-1', children: [] },
          { id: '2-1-2', name: 'Canned Goods', type: 'item', icon: '🥫', parentId: '2-1', children: [] },
        ],
      },
      {
        id: '2-2',
        name: 'Junk Drawer',
        type: 'container',
        icon: '🗃️',
        parentId: '2',
        children: [
          { id: '2-2-1', name: 'Batteries', type: 'item', icon: '🔋', parentId: '2-2', children: [] },
          { id: '2-2-2', name: 'Tape & Scissors', type: 'item', icon: '✂️', parentId: '2-2', children: [] },
          { id: '2-2-3', name: 'Takeout Menus', type: 'item', icon: '📄', parentId: '2-2', children: [] },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'Bedroom',
    type: 'room',
    icon: '🛏️',
    children: [
      {
        id: '3-1',
        name: 'Closet',
        type: 'container',
        icon: '👔',
        parentId: '3',
        children: [
          { id: '3-1-1', name: 'Winter Jackets', type: 'item', icon: '🧥', parentId: '3-1', children: [] },
          { id: '3-1-2', name: 'Shoe Boxes', type: 'item', icon: '👟', parentId: '3-1', children: [] },
        ],
      },
      {
        id: '3-2',
        name: 'Nightstand',
        type: 'container',
        icon: '🪑',
        parentId: '3',
        children: [
          { id: '3-2-1', name: 'Phone Charger', type: 'item', icon: '🔌', parentId: '3-2', children: [] },
          { id: '3-2-2', name: 'Reading Glasses', type: 'item', icon: '👓', parentId: '3-2', children: [] },
        ],
      },
    ],
  },
  {
    id: '4',
    name: 'Garage',
    type: 'room',
    icon: '🚗',
    children: [
      {
        id: '4-1',
        name: 'Tool Cabinet',
        type: 'container',
        icon: '🧰',
        parentId: '4',
        children: [
          { id: '4-1-1', name: 'Screwdrivers', type: 'item', icon: '🪛', parentId: '4-1', children: [] },
          { id: '4-1-2', name: 'Drill & Bits', type: 'item', icon: '🔩', parentId: '4-1', children: [] },
        ],
      },
    ],
  },
];

function App() {
  const [locations, setLocations] = useState<LocationNode[]>(initialData);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LocationNode | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addTarget, setAddTarget] = useState<{ parentId?: string; type: 'room' | 'container' | 'item' } | null>(null);

  const findPath = useCallback((nodes: LocationNode[], targetId: string, path: LocationNode[] = []): LocationNode[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === targetId) return newPath;
      if (node.children.length > 0) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const searchItems = useCallback((nodes: LocationNode[], query: string): LocationNode[] => {
    const results: LocationNode[] = [];
    const lowerQuery = query.toLowerCase();

    const search = (items: LocationNode[]) => {
      for (const item of items) {
        if (item.name.toLowerCase().includes(lowerQuery)) {
          results.push(item);
        }
        if (item.children.length > 0) {
          search(item.children);
        }
      }
    };

    search(nodes);
    return results;
  }, []);

  const searchResults = searchQuery ? searchItems(locations, searchQuery) : [];

  const handleAddItem = (name: string, icon: string) => {
    if (!addTarget) return;

    const newItem: LocationNode = {
      id: `${Date.now()}`,
      name,
      type: addTarget.type,
      icon,
      parentId: addTarget.parentId,
      children: [],
    };

    if (!addTarget.parentId) {
      setLocations([...locations, newItem]);
    } else {
      const addToParent = (nodes: LocationNode[]): LocationNode[] => {
        return nodes.map(node => {
          if (node.id === addTarget.parentId) {
            return { ...node, children: [...node.children, newItem] };
          }
          if (node.children.length > 0) {
            return { ...node, children: addToParent(node.children) };
          }
          return node;
        });
      };
      setLocations(addToParent(locations));
    }

    setIsAddModalOpen(false);
    setAddTarget(null);
  };

  const handleDeleteItem = (itemId: string) => {
    const deleteFromNodes = (nodes: LocationNode[]): LocationNode[] => {
      return nodes
        .filter(node => node.id !== itemId)
        .map(node => ({
          ...node,
          children: deleteFromNodes(node.children),
        }));
    };
    setLocations(deleteFromNodes(locations));
    setSelectedItem(null);
  };

  const openAddModal = (parentId?: string, type: 'room' | 'container' | 'item' = 'room') => {
    setAddTarget({ parentId, type });
    setIsAddModalOpen(true);
  };

  return (
    <div className="app-container">
      <div className="grain-overlay" />

      <motion.header
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="logo-section">
          <motion.div
            className="logo-mark"
            whileHover={{ rotate: 45, scale: 1.1 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
              <rect x="22" y="4" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
              <rect x="4" y="22" width="14" height="14" rx="2" stroke="currentColor" strokeWidth="2.5"/>
              <circle cx="29" cy="29" r="6" stroke="currentColor" strokeWidth="2.5"/>
              <circle cx="29" cy="29" r="2" fill="currentColor"/>
            </svg>
          </motion.div>
          <div className="logo-text">
            <h1>where to find</h1>
            <p>instant recall for physical things</p>
          </div>
        </div>

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          results={searchResults}
          onSelectResult={(item) => {
            setSelectedItem(item);
            setSearchQuery('');
          }}
          findPath={(id) => findPath(locations, id)}
        />
      </motion.header>

      <main className="main-content">
        <motion.div
          className="tree-section"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="section-header">
            <h2>Your Spaces</h2>
            <motion.button
              className="add-room-btn"
              onClick={() => openAddModal(undefined, 'room')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span>+</span> Add Room
            </motion.button>
          </div>

          <LocationTree
            nodes={locations}
            onSelect={setSelectedItem}
            selectedId={selectedItem?.id}
            onAddChild={openAddModal}
          />
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedItem && (
            <ItemDetail
              item={selectedItem}
              path={findPath(locations, selectedItem.id) || []}
              onClose={() => setSelectedItem(null)}
              onDelete={() => handleDeleteItem(selectedItem.id)}
              onAddChild={(type) => openAddModal(selectedItem.id, type)}
            />
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {isAddModalOpen && addTarget && (
          <AddItemModal
            type={addTarget.type}
            onClose={() => { setIsAddModalOpen(false); setAddTarget(null); }}
            onAdd={handleAddItem}
          />
        )}
      </AnimatePresence>

      <footer className="app-footer">
        <p>Requested by @web-user · Built by @clonkbot</p>
      </footer>
    </div>
  );
}

export default App;
