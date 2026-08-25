import React from 'react';
import { History, ArrowRight, FileText, Trash2, Copy, Edit3, Calendar } from 'lucide-react';
import { SavedDocument } from '../types';

interface RecentProjectsProps {
  documents: SavedDocument[];
  onOpenDoc: (doc: SavedDocument) => void;
  onDuplicateDoc: (doc: SavedDocument) => void;
  onDeleteDoc: (id: string) => void;
  onOpenTemplates: () => void;
}

export const RecentProjects: React.FC<RecentProjectsProps> = ({
  documents,
  onOpenDoc,
  onDuplicateDoc,
  onDeleteDoc,
  onOpenTemplates
}) => {
  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-8 mt-8 sm:mt-12 mb-16 sm:mb-20">
      <div className="bg-white rounded-2xl p-4 sm:p-8 border border-gray-200/80 shadow-xs">
        {/* Section Header */}
        <div className="flex items-center justify-between pb-4 sm:pb-6 border-b border-gray-100">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <History className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h2 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
              Recent Projects <span className="text-xs sm:text-sm font-normal text-gray-500 hidden sm:inline">(حالیہ دستاویزات)</span>
            </h2>
          </div>

          <button
            id="btn-view-all-templates"
            onClick={onOpenTemplates}
            className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline transition"
          >
            <span>Templates</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Projects List / Grid: 2 cards per row on mobile, 2 on tablet, 3 on desktop */}
        {documents.length === 0 ? (
          <div className="text-center py-10 sm:py-12">
            <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-2 sm:mb-3" />
            <p className="text-gray-600 font-medium text-sm sm:text-base">No saved documents yet (کوئی فائل نہیں ہے)</p>
            <p className="text-gray-400 text-xs mt-1">Pick a template above or click "Create Design" to start writing.</p>
          </div>
        ) : (
          <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-5">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="group border border-gray-200 hover:border-blue-400 rounded-xl p-3 sm:p-5 bg-white hover:bg-blue-50/20 transition-all duration-200 shadow-2xs hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-1.5 sm:gap-3">
                    <div className="flex items-center gap-1.5 sm:gap-2 overflow-hidden min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                      </div>
                      <h3 className="font-bold text-gray-900 truncate text-xs sm:text-base group-hover:text-blue-600 transition" title={doc.title}>
                        {doc.title}
                      </h3>
                    </div>
                    <span className="text-[9px] sm:text-[11px] font-medium bg-gray-100 text-gray-600 px-1.5 sm:px-2 py-0.5 rounded-full shrink-0">
                      {doc.pageSize || 'A4'}
                    </span>
                  </div>

                  {/* Snippet preview */}
                  <div
                    onClick={() => onOpenDoc(doc)}
                    className="cursor-pointer mt-2 sm:mt-3 p-2 sm:p-3 bg-gray-50/80 rounded-lg text-[11px] sm:text-xs text-gray-600 line-clamp-2 sm:line-clamp-3 font-nastaliq leading-relaxed border border-gray-100/80"
                    dangerouslySetInnerHTML={{
                      __html: doc.content.replace(/<[^>]*>?/gm, ' ').substring(0, 140) + '...'
                    }}
                  />
                </div>

                <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 sm:gap-2 truncate">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {formatTime(doc.updatedAt)}
                    </span>
                    <span className="hidden sm:inline">•</span>
                    <span className="hidden sm:inline">{doc.wordCount || 0} words</span>
                  </div>

                  <div className="flex items-center gap-0.5 sm:gap-1 opacity-90 group-hover:opacity-100 transition justify-end">
                    <button
                      id={`edit-doc-${doc.id}`}
                      onClick={() => onOpenDoc(doc)}
                      title="Open in Editor"
                      className="p-1 sm:p-1.5 hover:bg-blue-100 hover:text-blue-700 rounded-md transition text-gray-600"
                    >
                      <Edit3 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      id={`duplicate-doc-${doc.id}`}
                      onClick={() => onDuplicateDoc(doc)}
                      title="Duplicate"
                      className="p-1 sm:p-1.5 hover:bg-gray-100 hover:text-gray-800 rounded-md transition text-gray-600"
                    >
                      <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      id={`delete-doc-${doc.id}`}
                      onClick={() => onDeleteDoc(doc.id)}
                      title="Delete"
                      className="p-1 sm:p-1.5 hover:bg-red-100 hover:text-red-600 rounded-md transition text-gray-600"
                    >
                      <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
