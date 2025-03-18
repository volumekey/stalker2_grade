
import React, { useEffect, useRef } from 'react';

interface RatingField {
  id: string;
  label: string;
  value: number;
  max: number;
}

interface EditorCanvasProps {
  content: {
    [key: string]: string;
  };
  activeField: string;
  cursorPosition: number | null;
  ratings: RatingField[];
}

const EditorCanvas: React.FC<EditorCanvasProps> = ({ 
  content, 
  activeField,
  cursorPosition,
  ratings 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div 
      ref={containerRef} 
      className="editor-container animate-fade-in p-6 overflow-y-auto"
      style={{ height: 'calc(100vh - 60px)', marginRight: '320px' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Рейтинги на мобильном устройстве */}
        <div className="md:hidden mb-8 p-4 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-editor-separator">
          <h2 className="text-editor-text font-medium mb-4 text-xl">Оценки</h2>
          <div className="grid grid-cols-2 gap-4">
            {ratings.map((rating) => (
              <div key={rating.id} className="space-y-1">
                <div className="text-editor-text text-sm">{rating.label}</div>
                <div className="flex justify-between items-center">
                  <div className="h-2 bg-blue-900 rounded-full w-full mr-3">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(rating.value / rating.max) * 100}%` }}
                    />
                  </div>
                  <div className="text-editor-accent font-bold">{rating.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Рейтинги на десктопе (видны в боковой панели) */}
        <div className="hidden md:block mb-8 p-6 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-editor-separator">
          <div className="grid grid-cols-2 gap-6">
            {ratings.map((rating) => (
              <div key={rating.id} className="space-y-2">
                <div className="flex justify-between">
                  <div className="text-editor-text font-medium">{rating.label}</div>
                  <div className="text-editor-accent font-bold">{rating.value}</div>
                </div>
                <div className="h-3 bg-blue-900 rounded-full">
                  <div 
                    className="h-3 bg-blue-500 rounded-full relative"
                    style={{ width: `${(rating.value / rating.max) * 100}%` }}
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-blue-500 shadow-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {Object.keys(content).map((field) => (
          <div key={field} className="mb-8 animate-text-focus-in" style={{animationDelay: `${Object.keys(content).indexOf(field) * 0.1}s`}}>
            <div className="editor-label mb-2">{field}</div>
            <div className="editor-text text-xl">
              {content[field]}
              {activeField === field && cursorPosition !== null && (
                <span className="editor-cursor" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EditorCanvas;
