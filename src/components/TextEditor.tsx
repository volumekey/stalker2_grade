import React, { useState } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Info, Edit2, Trash2, Plus, Settings } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface EditorField {
  id: string;
  label: string;
  placeholder?: string;
  isRating?: boolean;
}

interface RatingField {
  id: string;
  label: string;
  value: number;
  max: number;
  info: string;
}

const DEFAULT_FIELDS: EditorField[] = [
  { id: 'Графика', label: 'Графика', isRating: true },
  { id: 'Сюжет', label: 'Сюжет', isRating: true },
  { id: 'Длина сюжета', label: 'Длина сюжета', isRating: true },
  { id: 'Геймплей', label: 'Геймплей', isRating: true },
  { id: 'Эмбиент', label: 'Эмбиент', isRating: true },
  { id: 'Атмосфера', label: 'Атмосфера', isRating: true },
  { id: 'Доп. квесты', label: 'Доп. квесты', isRating: true },
  { 
    id: 'МИНУСЫ', 
    label: 'Минусы/чего не хватает', 
    placeholder: 'минусы/чего не хватает...', 
    isRating: false 
  },
  { id: 'ПЛЮСЫ', label: 'Плюсы', placeholder: 'плюсы...', isRating: false },
];

const DEFAULT_RATINGS: RatingField[] = [
  { id: 'Графика', label: 'Графика', value: 0, max: 10, info: '' },
  { id: 'Сюжет', label: 'Сюжет', value: 0, max: 10, info: '' },
  { id: 'Длина сюжета', label: 'Длина сюжета', value: 0, max: 10, info: '' },
  { id: 'Геймплей', label: 'Геймплей', value: 0, max: 10, info: '' },
  { id: 'Эмбиент', label: 'Эмбиент', value: 0, max: 10, info: '' },
  { id: 'Атмосфера', label: 'Атмосфера', value: 0, max: 10, info: '' },
  { id: 'Доп. квесты', label: 'Доп. квесты', value: 0, max: 10, info: '' },
];

const DEFAULT_CONTENT: Record<string, string> = DEFAULT_FIELDS.reduce(
  (acc, field) => ({ ...acc, [field.id]: '' }),
  {}
);

const TextEditor: React.FC = () => {
  const [content, setContent] = useLocalStorage('editor-content', DEFAULT_CONTENT);
  const [ratings, setRatings] = useLocalStorage('editor-ratings', DEFAULT_RATINGS);
  const [manualFinalRating, setManualFinalRating] = useLocalStorage('editor-finalRating', 0);
  
  const [newRatingName, setNewRatingName] = useState('');
  const [editingRating, setEditingRating] = useState<{ id: string; label: string } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  
  // Состояния для настроек
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStalkerCursor, setIsStalkerCursor] = useState(false);

  const handleTextChange = (id: string, text: string) => {
    setContent(prev => ({ ...prev, [id]: text }));
  };

  const handleRatingChange = (id: string, value: number[]) => {
    const newRatings = ratings.map(rating =>
      rating.id === id ? { ...rating, value: value[0] } : rating
    );
    setRatings(newRatings);
  };

  const handleRatingInfoChange = (id: string, info: string) => {
    const newRatings = ratings.map(rating =>
      rating.id === id ? { ...rating, info } : rating
    );
    setRatings(newRatings);
  };

  const handleRatingLabelChange = (id: string, newLabel: string) => {
    const newRatings = ratings.map(rating =>
      rating.id === id ? { ...rating, label: newLabel } : rating
    );
    setRatings(newRatings);
  };

  const handleSaveRating = (id: string) => {
    if (editingRating && editingRating.id === id) {
      handleRatingLabelChange(id, editingRating.label);
      setEditingRating(null);
    }
  };

  const handleDeleteRating = (id: string) => {
    setRatings(ratings.filter(rating => rating.id !== id));
  };

  const handleAddRating = () => {
    if (newRatingName.trim() !== '') {
      const newRating: RatingField = {
        id: newRatingName,
        label: newRatingName,
        value: 0,
        max: 10,
        info: '',
      };
      setRatings([...ratings, newRating]);
      setNewRatingName('');
      setIsAddDialogOpen(false);
    }
  };

  const handleDownload = () => {
    const now = new Date();
    const moscowNow = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Moscow" }));
    
    const dateOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const timeOptions: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit', hour12: false };
    const moscowDateStr = moscowNow.toLocaleDateString("ru-RU", dateOptions).replace(/\./g, '-');
    const moscowTimeStr = moscowNow.toLocaleTimeString("ru-RU", timeOptions).replace(/:/g, '-');
    
    const fileName = `Оценка_${moscowDateStr}_${moscowTimeStr}.txt`;

    let fileContent = '=== Критерии оценки ===\n\n';
    ratings.forEach(rating => {
      fileContent += `Название: ${rating.label}\n`;
      fileContent += `Оценка: ${rating.value} из ${rating.max}\n`;
      if (rating.info && rating.info.trim() !== '') {
        fileContent += `Комментарий: ${rating.info}\n`;
      }
      fileContent += '\n';
    });

    fileContent += `=== Итоговая оценка ===\n\n`;
    fileContent += `Оценка: ${manualFinalRating.toFixed(1)} из 10\n\n`;

    fileContent += '=== КОММЕНТАРИИ ===\n\n';
    DEFAULT_FIELDS.filter(field => !field.isRating).forEach(field => {
      fileContent += `${field.label}:\n`;
      fileContent += `${content[field.id]}\n\n`;
    });

    const blob = new Blob([fileContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div 
      className="w-full h-screen bg-editor-bg overflow-hidden relative"
      style={isStalkerCursor ? { cursor: "url('/public/stalker.cur'), auto" } : {}}
    >
      {/* Верхняя панель */}
      <div className="h-[60px] border-b border-editor-separator flex items-center justify-between px-4 bg-black bg-opacity-90 backdrop-blur-md z-10">
        <div className="flex items-center gap-4">
          <h1 className="text-editor-accent text-2xl font-mono font-bold">Оценка STALKER 2</h1>
          {/* Значок настроек */}
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <button className="p-2 rounded-full hover:bg-green-800 transition-colors">
                <Settings size={20} className="text-green-500" />
              </button>
            </DialogTrigger>
            <DialogContent className="bg-black text-green-500 border border-green-700 p-4 rounded-lg transition-all duration-300">
              <h2 className="text-lg mb-4">Настройки</h2>
              <div className="flex items-center justify-between">
                <span>Курсор STALKER</span>
                {/* Переключатель без зеленого фокуса */}
                <label htmlFor="cursor-toggle" className="inline-flex relative items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    id="cursor-toggle"
                    checked={isStalkerCursor} 
                    onChange={(e) => setIsStalkerCursor(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 rounded-full peer-checked:bg-green-500 transition-colors duration-200"></div>
                  <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform peer-checked:translate-x-5"></div>
                </label>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <button onClick={handleDownload} className="text-white hover:text-green-500">
          Скачать оценку
        </button>
      </div>

      {/* Основной контент */}
      <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 60px)' }}>
        <div className="max-w-4xl mx-auto">
          {/* Блок с критериями оценки */}
          <div className="relative mb-8 p-6 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-editor-separator">
            <h2 className="text-white text-xl font-medium mb-6">Критерии оценки</h2>
            <div className="absolute top-4 right-4">
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="p-2 rounded-full bg-transparent hover:bg-green-800 transition-colors">
                    <Plus size={20} className="text-green-500" />
                  </button>
                </DialogTrigger>
                <DialogContent className="bg-black text-green-500 border border-green-700 p-4 rounded-lg transition-all duration-300">
                  <div className="flex flex-col gap-4 mt-4">
                    <input
                      type="text"
                      placeholder="Название критерия"
                      value={newRatingName}
                      onChange={(e) => setNewRatingName(e.target.value)}
                      className="p-2 border border-green-700 rounded-md bg-black text-green-500 focus:outline-none"
                    />
                    <button
                      onClick={handleAddRating}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors"
                    >
                      Создать
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {ratings.map((rating) => (
                <div key={rating.id} className="space-y-2 group">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      {editingRating && editingRating.id === rating.id ? (
                        <input
                          type="text"
                          value={editingRating.label}
                          onChange={(e) =>
                            setEditingRating({ id: rating.id, label: e.target.value })
                          }
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveRating(rating.id);
                          }}
                          onBlur={() => handleSaveRating(rating.id)}
                          className="bg-transparent border-b border-gray-500 text-white focus:outline-none"
                        />
                      ) : (
                        <span className="text-white">{rating.label}</span>
                      )}
                      <button
                        onClick={() =>
                          editingRating && editingRating.id === rating.id
                            ? handleSaveRating(rating.id)
                            : setEditingRating({ id: rating.id, label: rating.label })
                        }
                        className="text-green-500 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        {editingRating && editingRating.id === rating.id ? 'Сохранить' : <Edit2 size={16} />}
                      </button>
                      <button
                        onClick={() => handleDeleteRating(rating.id)}
                        className="text-red-500 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={16} />
                      </button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="text-green-500 hover:text-green-400 transition-colors opacity-0 group-hover:opacity-100">
                            <Info size={16} />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="bg-editor-bg border-editor-separator">
                          <div className="p-2">
                            <Textarea
                              className="bg-editor-bg text-editor-text border-editor-separator focus:outline-none"
                              placeholder={`Почему ты поставил ${rating.value} за ${rating.label}?`}
                              value={rating.info}
                              onChange={(e) => handleRatingInfoChange(rating.id, e.target.value)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <div className="text-editor-accent font-bold text-2xl">
                      {rating.value.toFixed(1)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[rating.value]}
                      max={rating.max}
                      step={0.1}
                      onValueChange={(value) => handleRatingChange(rating.id, value)}
                      className="bg-opacity-20 cursor-grab active:cursor-grabbing"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Итоговая оценка */}
          <div className="relative mb-8 p-6 rounded-lg bg-gradient-to-br from-gray-900 to-black border border-editor-separator">
            <h2 className="text-white text-xl font-medium mb-6">Итоговая оценка</h2>
            <div className="flex justify-between items-center">
              <div className="text-editor-accent font-bold text-2xl">
                {manualFinalRating.toFixed(1)}
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <Slider
                value={[manualFinalRating]}
                max={10}
                step={0.1}
                onValueChange={(value) => setManualFinalRating(value[0])}
                className="bg-opacity-20 cursor-grab active:cursor-grabbing"
              />
            </div>
          </div>

          {/* Текстовые поля для "Минусы/чего не хватает" и "Плюсы" */}
          {DEFAULT_FIELDS.filter(field => !field.isRating).map((field) => (
            <div key={field.id} className="mb-8">
              <div className="editor-label mb-2">{field.label}</div>
              <Textarea
                className="min-h-36 text-xl p-4 bg-black bg-opacity-30 border border-editor-separator rounded-md text-editor-text font-mono appearance-none focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-colors"
                placeholder={field.placeholder}
                value={content[field.id] || ''}
                onChange={(e) => handleTextChange(field.id, e.target.value)}
              />
            </div>
          ))}

          {/* Кнопка для гида */}
          <div className="flex justify-center mt-4">
            <Dialog open={isGuideOpen} onOpenChange={setIsGuideOpen}>
              <DialogTrigger asChild>
                <button className="text-green-500 text-lg">гайд</button>
              </DialogTrigger>
              <DialogContent className="bg-black text-green-500 border border-green-700 p-4 rounded-lg transition-all duration-300">
                <div className="mt-4 text-sm text-center">
                  Привет, здесь ты можешь оценить STALKER 2.
                  <br /><br />
                  При наведении на критерий оценки появятся кнопки управления этим критерием.
                  Ты можешь редактировать название критерия, удалить его и добавить уточнение, нажав на значок информации.
                  <br /><br />
                  Внизу есть две области: "Плюсы" и "Минусы/чего не хватает" для записи твоих общих впечатлений об игре.
                  <br /><br />
                  Также ты можешь скачать свою оценку в виде структурированного текстового документа.
                  <br /><br />
                  <span className="text-xs">Все данные сохраняются в куках твоего браузера.</span>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextEditor;
