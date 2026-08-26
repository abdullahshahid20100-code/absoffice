import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { TemplateCards } from './components/TemplateCards';
import { RecentProjects } from './components/RecentProjects';
import { TemplateModal } from './components/TemplateModal';
import { CustomSizeModal } from './components/CustomSizeModal';
import { EditorWorkspace } from './components/EditorWorkspace';
import { ToastContainer, ToastMessage } from './components/Toast';
import { SavedDocument, TemplateId, PageSize } from './types';
import { TEMPLATES } from './data/templates';
import {
  getOrCreateDeviceId,
  loadUserDocuments,
  saveUserDocuments,
  clearUserDocuments
} from './utils/storage';

export default function App() {
  // Navigation & Views
  const [currentView, setCurrentView] = useState<'home' | 'editor'>('home');
  const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
  const [isCustomSizeModalOpen, setIsCustomSizeModalOpen] = useState(false);

  // Device UUID for scoped browser storage
  const [deviceId] = useState<string>(() => getOrCreateDeviceId());

  // Saved documents scoped strictly to this browser/device
  const [savedDocuments, setSavedDocuments] = useState<SavedDocument[]>(() => {
    return loadUserDocuments();
  });

  // Sync saved documents with scoped localStorage
  useEffect(() => {
    saveUserDocuments(savedDocuments, deviceId);
  }, [savedDocuments, deviceId]);

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
      deviceId: deviceId,
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
      deviceId: deviceId,
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
    const scopedDoc: SavedDocument = {
      ...doc,
      deviceId: deviceId
    };
    setActiveDoc(scopedDoc);
    setSavedDocuments((prev) => {
      const exists = prev.some((d) => d.id === scopedDoc.id);
      if (exists) {
        return prev.map((d) => (d.id === scopedDoc.id ? scopedDoc : d));
      } else {
        return [scopedDoc, ...prev];
      }
    });
  };

  // Duplicate document
  const handleDuplicateDoc = (doc: SavedDocument) => {
    const duplicated: SavedDocument = {
      ...doc,
      id: 'doc-' + Date.now(),
      title: `${doc.title} (Copy)`,
      deviceId: deviceId,
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

  // Clear all documents for this device
  const handleClearAllDocs = () => {
    clearUserDocuments(deviceId);
    setSavedDocuments([]);
    addToast({
      type: 'info',
      title: 'History Cleared',
      description: 'Saved documents on this browser have been cleared.'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900 selection:bg-blue-500 selection:text-white">
      {/* Toast Notification Provider */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {/* Main View Router: Home Page or Editor Workspace */}
      {currentView === 'home' ? (
        <div className="flex-1 flex flex-col">
          {/* Top Navigation Header */}
          <Header
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
          />

          {/* Hero Section with Blue Gradient & Urdu Calligraphy */}
          <HeroSection
            onOpenTemplates={() => setIsTemplateModalOpen(true)}
            activeView="home"
          />

          {/* 5 Explore Templates Cards */}
          <TemplateCards
            onSelectTemplate={handleSelectTemplate}
            onOpenCustomSize={() => setIsCustomSizeModalOpen(true)}
          />

          {/* Recent Projects Section */}
          <RecentProjects
            documents={savedDocuments}
            onOpenDoc={handleOpenDoc}
            onDuplicateDoc={handleDuplicateDoc}
            onDeleteDoc={handleDeleteDoc}
            onClearAll={handleClearAllDocs}
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
        /* Full-featured Document Editor Workspace */
        <EditorWorkspace
          initialDocument={activeDoc}
          onBack={() => setCurrentView('home')}
          onSave={handleSaveDoc}
          onShowToast={addToast}
          onOpenCustomSize={() => setIsCustomSizeModalOpen(true)}
        />
      )}

      {/* Templates Modal Overlay */}
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
    </div>
  );
}
