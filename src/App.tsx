import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TemplateCards } from './components/TemplateCards';
import { RecentProjects } from './components/RecentProjects';
import { TemplateModal } from './components/TemplateModal';
import { CustomSizeModal } from './components/CustomSizeModal';
import { AuthModal } from './components/AuthModal';
import { EditorWorkspace } from './components/EditorWorkspace';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SavedDocument, TemplateId, PageSize, AuthUser } from './types';
import { TEMPLATES, INITIAL_SAVED_DOCS } from './data/templates';

// Helper to get storage key for user-specific document isolation
const getUserDocsStorageKey = (user: AuthUser | null): string => {
  if (!user || !user.email) return 'officeweb_docs_guest';
  const cleanEmail = user.email.toLowerCase().trim().replace(/[^a-z0-9_.-]/g, '_');
  return `officeweb_docs_${cleanEmail}`;
};

// Helper to load documents strictly belonging to the active user
const loadDocsForUser = (user: AuthUser | null): SavedDocument[] => {
  const key = getUserDocsStorageKey(user);
  const local = localStorage.getItem(key);
  if (local !== null) {
    try {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse user docs', e);
    }
  }

  // Check legacy global storage as fallback for initial user
  if (user?.email === 'abdullahshahid.20100@gmail.com') {
    const legacyGlobal = localStorage.getItem('officeweb_documents');
    if (legacyGlobal !== null) {
      try {
        const parsedLegacy = JSON.parse(legacyGlobal);
        if (Array.isArray(parsedLegacy)) {
          localStorage.setItem(key, JSON.stringify(parsedLegacy));
          return parsedLegacy;
        }
      } catch (e) {}
    }
  }

  // First time initialization for new user or guest: give clean starter templates
  const initialDocs: SavedDocument[] = INITIAL_SAVED_DOCS.map((doc, idx) => ({
    ...doc,
    id: `doc-${user?.username || 'user'}-${Date.now()}-${idx}`,
    updatedAt: Date.now() - (idx * 3600000)
  }));
  localStorage.setItem(key, JSON.stringify(initialDocs));
  return initialDocs;
};

export default function App() {
  // Navigation & Views
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // User state initialized from persistent localStorage (null for new visitors)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const savedUser = localStorage.getItem('officeweb_active_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse active user', e);
      }
    }
    return null;
  });

  // Saved documents strictly filtered & isolated per logged-in user or guest
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => {
    const savedUser = localStorage.getItem('officeweb_active_user');
    let initialUser: AuthUser | null = null;
    if (savedUser) {
      try {
        initialUser = JSON.parse(savedUser);
      } catch (e) {}
    }
    return loadDocsForUser(initialUser);
  });

  // Keep documents in sync when user logs in, switches account, or logs out
  useEffect(() => {
    if (user) {
      localStorage.setItem('officeweb_active_user', JSON.stringify(user));
      // Add to registered users list
      const savedUsersRaw = localStorage.getItem('officeweb_registered_users');
      let registeredUsers: AuthUser[] = [];
      if (savedUsersRaw) {
        try { registeredUsers = JSON.parse(savedUsersRaw); } catch (e) {}
      }
      const existingIdx = registeredUsers.findIndex(u => u.email.toLowerCase() === user.email.toLowerCase());
      if (existingIdx >= 0) {
        registeredUsers[existingIdx] = user;
      } else {
        registeredUsers.push(user);
      }
      localStorage.setItem('officeweb_registered_users', JSON.stringify(registeredUsers));
    } else {
      localStorage.removeItem('officeweb_active_user');
    }

    // Load documents belonging exclusively to this user
    const userDocs = loadDocsForUser(user);
    setSavedDocuments(userDocs);
  }, [user]);

  // Sync current user's saved documents with localStorage
  useEffect(() => {
    const key = getUserDocsStorageKey(user);
    localStorage.setItem(key, JSON.stringify(savedDocuments));
  }, [savedDocuments, user]);

  // Current active document in editor
  const [activeDoc, setActiveDoc] = useState<SavedDocument>(() => {
    return savedDocuments[0] || {
      id: 'doc-default',
      title: 'Blank Document',
      content: TEMPLATES[2].defaultContent,
      templateId: 'blank',
      fontFamily: 'font-nastaliq',
      fontSize: 16,
      lineHeight: '2.0',
      textAlign: 'right',
      direction: 'rtl',
      pageSize: 'A4',
      updatedAt: Date.now(),
      wordCount: 12,
      charCount: 65
    };
  });

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (toast: { type: 'success' | 'error' | 'info'; title: string; description?: string }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast: ToastMessage = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Create new document from template
  const handleSelectTemplate = (templateId: TemplateId) => {
    const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[2];
    const newDoc: SavedDocument = {
      id: 'doc-' + Date.now(),
      title: tpl.defaultTitle,
      content: tpl.defaultContent,
      templateId: tpl.id,
      fontFamily: tpl.defaultFont,
      fontSize: 16,
      lineHeight: tpl.defaultLineHeight,
      textAlign: tpl.defaultAlign,
      direction: tpl.defaultDirection,
      pageSize: 'A4',
      updatedAt: Date.now(),
      wordCount: 0,
      charCount: 0
    };

    setActiveDoc(newDoc);
    setCurrentView('editor');
    setIsTemplateModalOpen(false);
  };

  // Handle custom size creation
  const handleApplyCustomSize = (config: {
    name: string;
    width: string;
    minHeight: string;
    pageSize: PageSize;
  }) => {
    const customTpl = TEMPLATES.find((t) => t.id === 'custom-size') || TEMPLATES[4];
    const newDoc: SavedDocument = {
      id: 'doc-' + Date.now(),
      title: `${customTpl.defaultTitle} - ${config.name}`,
      content: customTpl.defaultContent,
      templateId: 'custom-size',
      fontFamily: 'font-nastaliq',
      fontSize: 16,
      lineHeight: '2.0',
      textAlign: 'right',
      direction: 'rtl',
      pageSize: config.pageSize,
      updatedAt: Date.now(),
      wordCount: 0,
      charCount: 0
    };

    setActiveDoc(newDoc);
    setCurrentView('editor');
    setIsCustomSizeModalOpen(false);
  };

  // Open existing document
  const handleOpenDoc = (doc: SavedDocument) => {
    setActiveDoc(doc);
    setCurrentView('editor');
  };

  // Save document from editor
  const handleSaveDoc = (doc: SavedDocument) => {
    setActiveDoc(doc);
    setSavedDocuments((prev) => {
      const exists = prev.some((d) => d.id === doc.id);
      if (exists) {
        return prev.map((d) => (d.id === doc.id ? doc : d));
      } else {
        return [doc, ...prev];
      }
    });
  };

  // Duplicate document
  const handleDuplicateDoc = (doc: SavedDocument) => {
    const duplicated: SavedDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      title: `${doc.title} (Copy)`,
      updatedAt: Date.now()
    };
    setSavedDocuments((prev) => [duplicated, ...prev]);
    addToast({
      type: 'success',
      title: 'Document Duplicated',
      description: `Created copy of "${doc.title}".`
    });
  };

  // Delete document
  const handleDeleteDoc = (id: string) => {
    setSavedDocuments((prev) => prev.filter((d) => d.id !== id));
    addToast({
      type: 'info',
      title: 'Document Deleted',
      description: 'Document removed from recent projects.'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-blue-500 selection:text-white">
      {/* Toast Notification Provider */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main View Router: Home Page or Editor Workspace */}
      {currentView === 'home' ? (
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Header (image_1.png) */}
          <Header
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            user={user}
            onLogout={() => setUser(null)}
          />

          {/* Hero Section with Blue Gradient & Urdu Calligraphy (image_1.png) */}
          <HeroSection
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
            activeView="home"
          />

          {/* 5 Explore Templates Cards (image_1.png) */}
          <TemplateCards
            onSelectTemplate={handleSelectTemplate}
            onOpenCustomSize={() => setIsCustomSizeModalOpen(true)}
          />

          {/* Recent Projects Section (image_1.png) */}
          <RecentProjects
            documents={savedDocuments}
            onOpenDoc={handleOpenDoc}
            onDuplicateDoc={handleDuplicateDoc}
            onDeleteDoc={handleDeleteDoc}
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
          />

          {/* Footer */}
          <footer className="mt-auto border-t border-gray-200 bg-white py-5 sm:py-6 px-4 text-center">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                  ABS
                </div>
                <span className="font-bold text-gray-900">ABS Office</span>
                <span className="text-xs bg-blue-50 text-blue-700 font-semibold px-2 py-0.5 rounded border border-blue-200">
                  Notepad
                </span>
              </div>

              <p className="text-sm font-medium text-gray-700">
                Develop by <span className="font-bold text-blue-700">Abdullah Shahid</span>
              </p>
            </div>
          </footer>
        </div>
      ) : (
        /* Full-featured Document Editor Workspace (image_3.png) */
        <EditorWorkspace
          initialDocument={activeDoc}
          onBack={() => setCurrentView('home')}
          onSave={handleSaveDoc}
          onShowToast={addToast}
          onOpenCustomSize={() => setIsCustomSizeModalOpen(true)}
        />
      )}

      {/* Templates Modal Overlay (image_2.png) */}
      <TemplateModal
        isOpen={isTemplateModalOpen}
        onClose={() => setIsTemplateModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
        onOpenCustomSize={() => {
          setIsTemplateModalOpen(false);
          setIsCustomSizeModalOpen(true);
        }}
      />

      {/* Custom Size Selection Modal */}
      <CustomSizeModal
        isOpen={isCustomSizeModalOpen}
        onClose={() => setIsCustomSizeModalOpen(false)}
        onApplyCustomSize={handleApplyCustomSize}
      />

      {/* Login & Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onShowToast={addToast}
        onLoginSuccess={(u) => {
          setUser(u);
        }}
      />
    </div>
  );
}
