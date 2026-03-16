import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, LayoutGrid, ChevronRight, MapPin, Quote, Info, Plus, Upload, X, Image as ImageIcon, Loader2, Sparkles, Calendar, User, Search, ChevronLeft, Pencil } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { DISHES, Dish, Dinner } from './constants';

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

const Logo = () => (
  <div className="flex flex-col items-center justify-center py-4">
    <div className="flex items-center gap-2 mb-1">
      <span className="font-serif text-3xl font-bold text-[#c4a484]">+1</span>
      <div className="h-8 w-[1px] bg-gray-200 mx-1" />
      <span className="font-serif text-lg tracking-tighter font-medium">Chopsticks</span>
    </div>
    <span className="font-serif text-[10px] uppercase tracking-[0.3em] text-[#8a8a8a]">Home Dining Shanghai</span>
  </div>
);

interface RecipeCardProps {
  dish: Dish;
  dinner: Dinner;
  isPrint?: boolean;
}

const RecipeCard: React.FC<RecipeCardProps & { onRemove?: (id: string) => void; onEdit?: (dish: Dish) => void }> = ({ dish, dinner, isPrint = false, onRemove, onEdit }) => {
  const typeColors = {
    veggie: { bg: 'bg-emerald-50/30', accent: 'text-emerald-600', dot: 'bg-emerald-400' },
    meat: { bg: 'bg-rose-50/30', accent: 'text-rose-600', dot: 'bg-rose-400' },
    seafood: { bg: 'bg-blue-50/30', accent: 'text-blue-600', dot: 'bg-blue-400' }
  };

  const colors = typeColors[dish.type];

  return (
    <div 
      className={`relative bg-white overflow-hidden flex flex-col group ${
        isPrint ? 'h-full border border-gray-200' : 'h-[700px] shadow-2xl rounded-3xl'
      } ${colors.bg}`}
      id={`dish-${dish.id}`}
    >
      {!isPrint && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(dish); }}
              className="p-2 bg-white/10 backdrop-blur-md text-white hover:bg-[#c4a484] transition-all rounded-full"
            >
              <Pencil size={16} />
            </button>
          )}
          {onRemove && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRemove(dish.id); }}
              className="p-2 bg-white/10 backdrop-blur-md text-white hover:bg-rose-500 transition-all rounded-full"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      <div className={`relative ${isPrint ? 'h-[60%]' : 'h-1/2'} overflow-hidden`}>
        <img 
          src={dish.heroImage} 
          alt={dish.englishName}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className={`flex-1 ${isPrint ? 'p-6' : 'p-8'} flex flex-col`}>
        <div className={isPrint ? 'mb-4' : 'mb-6'}>
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-serif ${isPrint ? 'text-2xl' : 'text-3xl md:text-4xl'} font-light tracking-tight`}>
              {dish.englishName}
            </h2>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
              <span className={`font-sans text-[8px] uppercase tracking-widest font-bold ${colors.accent}`}>
                {dish.type}
              </span>
            </div>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`font-chinese ${isPrint ? 'text-xl' : 'text-2xl'} text-[#c4a484]`}>{dish.chineseName}</span>
            <span className="font-serif italic text-sm text-gray-400">{dish.pinyin}</span>
          </div>
        </div>

        <div className={`grid ${isPrint ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-8'} flex-1`}>
          <div className={isPrint ? 'space-y-2' : 'space-y-4'}>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
              <Info size={12} className="text-gray-400" />
              <h3 className="font-sans text-[9px] uppercase tracking-widest font-bold text-gray-500">Key Ingredients</h3>
            </div>
            {isPrint ? (
              <p className="font-serif text-sm text-gray-600 leading-relaxed italic">
                {dish.ingredients.join(', ')}
              </p>
            ) : (
              <ul className="space-y-2">
                {dish.ingredients.map((ing, idx) => (
                  <li key={idx} className="font-serif text-sm text-gray-600 flex items-center gap-2">
                    <span className="w-1 h-1 bg-[#c4a484] rounded-full" />
                    {ing}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className={isPrint ? 'space-y-3' : 'space-y-4'}>
            <div className="flex items-center gap-2 border-b border-gray-100 pb-1">
              <Quote size={12} className="text-gray-400" />
              <h3 className="font-sans text-[9px] uppercase tracking-widest font-bold text-gray-500">The Story</h3>
            </div>
            <p className={`font-serif ${isPrint ? 'text-xs' : 'text-sm'} leading-relaxed text-gray-600 italic`}>
              "{dish.story}"
            </p>
            {!isPrint && (
              <div className="pt-2">
                <p className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#c4a484] mb-1">Cultural Note</p>
                <p className="font-serif text-xs text-gray-500 leading-snug">
                  {dish.culturalNote}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-auto pt-6 flex justify-between items-end border-t border-gray-100/50">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3 text-gray-400">
              <div className="flex items-center gap-1.5">
                <span className="font-serif text-[10px] text-gray-600 italic">{dinner.hostName}</span>
                <div className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="font-serif text-[10px]">{dinner.date}</span>
              </div>
              <div className="h-2 w-[0.5px] bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <MapPin size={8} />
                <span className="font-sans text-[8px] uppercase tracking-widest">{dinner.district}, {dinner.city}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end opacity-40 grayscale">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-serif font-bold text-[#c4a484]">+1</span>
              <div className="h-2.5 w-[0.5px] bg-gray-400" />
              <span className="text-[7px] font-serif uppercase tracking-widest">Chopsticks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'dinners' | 'dinner-detail' | 'print'>('dinners');
  const [dishes, setDishes] = useState<Dish[]>(DISHES);
  const [dinners, setDinners] = useState<Dinner[]>([
    {
      id: 'd1',
      hostName: 'Ayi Chen',
      district: 'Pudong',
      city: 'Shanghai',
      date: '2026-03-20',
      dishIds: ['1', '2', '6']
    }
  ]);
  const [selectedDinnerId, setSelectedDinnerId] = useState<string | null>(null);
  
  const [isDinnerModalOpen, setIsDinnerModalOpen] = useState(false);
  const [isEditDinnerModalOpen, setIsEditDinnerModalOpen] = useState(false);
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [isEditDishModalOpen, setIsEditDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [printError, setPrintError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);
  
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [newDinner, setNewDinner] = useState<Partial<Dinner>>({
    hostName: '', district: '', city: 'Shanghai', date: new Date().toISOString().split('T')[0], dishIds: []
  });
  
  const [newDish, setNewDish] = useState<Partial<Dish>>({
    englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', type: 'veggie', heroImage: ''
  });

  const selectedDinner = dinners.find(d => d.id === selectedDinnerId);
  const dinnerDishes = selectedDinner ? dishes.filter(d => selectedDinner.dishIds.includes(d.id)) : [];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewDish(prev => ({ ...prev, heroImage: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleMagicGenerate = async () => {
    if (!newDish.heroImage || (!newDish.englishName && !newDish.chineseName)) {
      alert("Please upload a photo and enter at least one name first.");
      return;
    }
    setIsGenerating(true);
    try {
      const base64Data = newDish.heroImage.split(',')[1];
      const prompt = `Analyze this food image and the provided name: "${newDish.englishName || newDish.chineseName}". Generate details for a high-end Shanghai home dining recipe card. Return JSON: englishName, chineseName, pinyin, ingredients (array), story, culturalNote, type (meat/veggie/seafood).`;
      const response = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ parts: [{ text: prompt }, { inlineData: { mimeType: "image/jpeg", data: base64Data } }] }],
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              englishName: { type: Type.STRING },
              chineseName: { type: Type.STRING },
              pinyin: { type: Type.STRING },
              ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
              story: { type: Type.STRING },
              culturalNote: { type: Type.STRING },
              type: { type: Type.STRING, enum: ['meat', 'veggie', 'seafood'] }
            },
            required: ['englishName', 'chineseName', 'pinyin', 'ingredients', 'story', 'culturalNote', 'type']
          }
        }
      });
      const result = JSON.parse(response.text);
      setNewDish(prev => ({ ...prev, ...result }));
    } catch (error) {
      console.error("AI Generation failed:", error);
      alert("Failed to generate details.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddDinner = (e: React.FormEvent) => {
    e.preventDefault();
    const dinner: Dinner = { ...newDinner as Dinner, id: Date.now().toString(), dishIds: [] };
    setDinners(prev => [dinner, ...prev]);
    setIsDinnerModalOpen(false);
    setSelectedDinnerId(dinner.id);
    setView('dinner-detail');
    setNewDinner({ hostName: '', district: '', city: 'Shanghai', date: new Date().toISOString().split('T')[0], dishIds: [] });
  };

  const handleUpdateDinner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDinnerId) return;
    setDinners(prev => prev.map(d => d.id === selectedDinnerId ? { ...d, ...newDinner } : d));
    setIsEditDinnerModalOpen(false);
  };

  const handleAddDishToDinner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDish.englishName || !newDish.heroImage || !selectedDinnerId) return;
    const dishToAdd: Dish = {
      ...newDish as Dish,
      id: Date.now().toString(),
      ingredients: typeof newDish.ingredients === 'string' ? (newDish.ingredients as string).split(',').map(i => i.trim()) : newDish.ingredients || []
    };
    setDishes(prev => [dishToAdd, ...prev]);
    setDinners(prev => prev.map(d => d.id === selectedDinnerId ? { ...d, dishIds: [...d.dishIds, dishToAdd.id] } : d));
    setIsDishModalOpen(false);
    setNewDish({ englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', type: 'veggie', heroImage: '' });
  };

  const handleUpdateDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDishId) return;
    
    const updatedDish: Dish = {
      ...newDish as Dish,
      id: editingDishId,
      ingredients: typeof newDish.ingredients === 'string' ? (newDish.ingredients as string).split(',').map(i => i.trim()) : newDish.ingredients || []
    };

    setDishes(prev => prev.map(d => d.id === editingDishId ? updatedDish : d));
    setIsEditDishModalOpen(false);
    setEditingDishId(null);
    setNewDish({ englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', type: 'veggie', heroImage: '' });
  };

  const handleAddFromLibrary = (dishId: string) => {
    if (!selectedDinnerId) return;
    setDinners(prev => prev.map(d => d.id === selectedDinnerId ? { ...d, dishIds: Array.from(new Set([...d.dishIds, dishId])) } : d));
    setIsLibraryModalOpen(false);
  };

  const handleRemoveDishFromDinner = (dishId: string) => {
    if (!selectedDinnerId) return;
    setDinners(prev => prev.map(d => d.id === selectedDinnerId ? { ...d, dishIds: d.dishIds.filter(id => id !== dishId) } : d));
  };

  const openNewDishModal = () => {
    setNewDish({
      englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', type: 'veggie', heroImage: ''
    });
    setIsDishModalOpen(true);
  };

  const dishPairs = [];
  for (let i = 0; i < dinnerDishes.length; i += 2) {
    dishPairs.push(dinnerDishes.slice(i, i + 2));
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="no-print fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('dinners')}>
          <span className="font-serif text-2xl font-bold text-[#c4a484]">+1</span>
          <h1 className="font-serif text-xl tracking-tight hidden sm:block">Chopsticks</h1>
        </div>
        
        <div className="flex items-center gap-4">
          {view === 'dinners' ? (
            <button 
              onClick={() => setIsDinnerModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium bg-[#c4a484] text-white hover:bg-[#b39373] transition-all shadow-lg shadow-[#c4a484]/20"
            >
              <Plus size={16} />
              <span>New Dinner</span>
            </button>
          ) : view === 'dinner-detail' ? (
            <>
              <button 
                onClick={() => setView('dinners')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-all"
              >
                <ChevronLeft size={16} />
                <span>Back</span>
              </button>
              <div className="h-6 w-[1px] bg-gray-200 mx-1" />
              <button 
                onClick={() => setIsLibraryModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all"
              >
                <Search size={16} />
                <span>Library</span>
              </button>
              <button 
                onClick={openNewDishModal}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-[#c4a484] text-white hover:bg-[#b39373] transition-all shadow-lg shadow-[#c4a484]/20"
              >
                <Plus size={16} />
                <span>Add Dish</span>
              </button>
              <button 
                onClick={() => setView('print')}
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all"
              >
                <Printer size={16} />
                <span>Print Menu</span>
              </button>
            </>
          ) : (
            <button 
              onClick={() => setView('dinner-detail')}
              className="flex items-center gap-2 px-6 py-2 rounded-full text-sm font-medium bg-black text-white hover:bg-gray-800 transition-all"
            >
              <ChevronLeft size={16} />
              <span>Back to Dinner</span>
            </button>
          )}
        </div>
      </nav>

      <main className="pt-24 pb-12 px-6">
        <AnimatePresence mode="wait">
          {view === 'dinners' ? (
            <motion.div 
              key="dinners"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {dinners.map(dinner => (
                <div 
                  key={dinner.id}
                  onClick={() => { setSelectedDinnerId(dinner.id); setView('dinner-detail'); }}
                  className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 bg-[#c4a484]/10 rounded-2xl text-[#c4a484]">
                      <Calendar size={24} />
                    </div>
                    <span className="font-sans text-[10px] uppercase tracking-widest font-bold text-gray-400">
                      {dinner.dishIds.length} Dishes
                    </span>
                  </div>
                  <h3 className="font-serif text-2xl mb-2 group-hover:text-[#c4a484] transition-colors">{dinner.hostName}'s Dinner</h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                    <MapPin size={14} />
                    <span>{dinner.district}, {dinner.city}</span>
                  </div>
                  <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                    <span className="font-serif italic text-gray-400">{dinner.date}</span>
                    <ChevronRight size={20} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
              {dinners.length === 0 && (
                <div className="col-span-full py-24 text-center">
                  <p className="font-serif text-2xl text-gray-300 italic">No dinners planned yet.</p>
                  <button onClick={() => setIsDinnerModalOpen(true)} className="mt-4 text-[#c4a484] font-medium hover:underline">Plan your first dinner</button>
                </div>
              )}
            </motion.div>
          ) : view === 'dinner-detail' ? (
            <motion.div 
              key="dinner-detail"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-7xl mx-auto"
            >
              <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h2 className="font-serif text-4xl">{selectedDinner?.hostName}'s Dinner</h2>
                    <button 
                      onClick={() => {
                        if (selectedDinner) {
                          setNewDinner({
                            hostName: selectedDinner.hostName,
                            district: selectedDinner.district,
                            city: selectedDinner.city,
                            date: selectedDinner.date
                          });
                          setIsEditDinnerModalOpen(true);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-[#c4a484] hover:bg-[#c4a484]/10 rounded-full transition-all"
                      title="Edit Host Details"
                    >
                      <Pencil size={18} />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-gray-500">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={16} />
                      <span>{selectedDinner?.date}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <div className="flex items-center gap-1.5">
                      <MapPin size={16} />
                      <span>{selectedDinner?.district}, {selectedDinner?.city}</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <button 
                      onClick={() => setView('print')}
                      className="flex items-center gap-1.5 text-black hover:text-[#c4a484] transition-colors font-medium"
                    >
                      <Printer size={16} />
                      <span>Print Menu</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-12">
                {dinnerDishes.map(dish => (
                  <RecipeCard 
                    key={dish.id} 
                    dish={dish} 
                    dinner={selectedDinner!} 
                    onRemove={handleRemoveDishFromDinner}
                    onEdit={(dish) => {
                      setNewDish({
                        ...dish,
                        ingredients: dish.ingredients.join(', ') as any
                      });
                      setEditingDishId(dish.id);
                      setIsEditDishModalOpen(true);
                    }}
                  />
                ))}
                <button 
                  onClick={openNewDishModal}
                  className="h-[700px] border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-[#c4a484] hover:bg-[#c4a484]/5 transition-all group"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#c4a484] group-hover:text-white transition-all">
                    <Plus size={32} />
                  </div>
                  <p className="font-serif text-xl text-gray-400 italic">Add a dish to this dinner</p>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="print"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col gap-12 items-center"
            >
              <div className="no-print text-center max-w-md mb-8">
                <h2 className="font-serif text-3xl mb-2">Print Menu Cards</h2>
                <p className="text-gray-500 text-sm mb-6">
                  Ready for {selectedDinner?.hostName}'s dinner. Cards are arranged two per A4 page.
                  <br />
                  <span className="text-xs italic opacity-70">Note: If the print dialog doesn't open, please open this app in a new tab using the button in the top right.</span>
                </p>
                <button 
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {
                      setPrintError(true);
                    }
                  }}
                  className="bg-[#c4a484] text-white px-8 py-3 rounded-full font-bold hover:bg-[#b39373] transition-colors shadow-xl shadow-[#c4a484]/20"
                >
                  Print Now
                </button>
                {printError && (
                  <p className="mt-4 text-rose-500 text-xs">
                    Print dialog blocked. Please open this app in a new tab to print.
                  </p>
                )}
              </div>
              
              {dishPairs.map((pair, idx) => (
                <div key={idx} className="print-page shadow-2xl border border-gray-200">
                  {pair.map(dish => (
                    <RecipeCard key={dish.id} dish={dish} dinner={selectedDinner!} isPrint={true} />
                  ))}
                  {pair.length === 1 && (
                    <div className="h-full border border-dashed border-gray-200 flex items-center justify-center">
                      <p className="font-serif text-gray-300 italic">Empty Card Space</p>
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {/* New Dinner Modal */}
        {isDinnerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDinnerModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl">Plan a Dinner</h2>
                <button onClick={() => setIsDinnerModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddDinner} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Host Name</label>
                  <input required type="text" value={newDinner.hostName} onChange={e => setNewDinner(prev => ({ ...prev, hostName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" placeholder="e.g. Ayi Chen" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">District</label>
                    <input type="text" value={newDinner.district} onChange={e => setNewDinner(prev => ({ ...prev, district: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" placeholder="Pudong" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Date</label>
                    <input type="date" value={newDinner.date} onChange={e => setNewDinner(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-[#c4a484] text-white rounded-xl font-bold shadow-lg shadow-[#c4a484]/20">Start Planning</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Dinner Modal */}
        {isEditDinnerModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditDinnerModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-serif text-3xl">Edit Dinner Details</h2>
                <button onClick={() => setIsEditDinnerModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateDinner} className="space-y-6">
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Host Name</label>
                  <input required type="text" value={newDinner.hostName} onChange={e => setNewDinner(prev => ({ ...prev, hostName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" placeholder="e.g. Ayi Chen" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">District</label>
                    <input type="text" value={newDinner.district} onChange={e => setNewDinner(prev => ({ ...prev, district: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" placeholder="Pudong" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Date</label>
                    <input type="date" value={newDinner.date} onChange={e => setNewDinner(prev => ({ ...prev, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-[#c4a484] text-white rounded-xl font-bold shadow-lg shadow-[#c4a484]/20">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Add Dish Modal */}
        {isDishModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDishModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-serif text-2xl">Create New Dish</h2>
                <button onClick={() => setIsDishModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddDishToDinner} className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Dish Photo</label>
                  <div onClick={() => document.getElementById('image-upload')?.click()} className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#c4a484] transition-all cursor-pointer overflow-hidden">
                    {newDish.heroImage ? <img src={newDish.heroImage} className="w-full h-full object-cover" alt="Preview" /> : <div className="h-full flex flex-col items-center justify-center text-gray-400"><Upload size={24} /><p className="text-sm mt-2">Upload photo</p></div>}
                    <input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">English Name</label>
                    <input required={!newDish.chineseName} type="text" value={newDish.englishName} onChange={e => setNewDish(prev => ({ ...prev, englishName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Chinese Name</label>
                    <input required={!newDish.englishName} type="text" value={newDish.chineseName} onChange={e => setNewDish(prev => ({ ...prev, chineseName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-chinese" />
                  </div>
                </div>
                <button type="button" onClick={handleMagicGenerate} disabled={isGenerating || !newDish.heroImage} className="w-full py-3 rounded-xl border-2 border-[#c4a484] text-[#c4a484] font-bold flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Magic Generate
                </button>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Pinyin</label>
                  <input type="text" value={newDish.pinyin} onChange={e => setNewDish(prev => ({ ...prev, pinyin: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif italic" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Dish Type</label>
                  <div className="flex gap-4">
                    {['veggie', 'meat', 'seafood'].map(type => (
                      <button key={type} type="button" onClick={() => setNewDish(prev => ({ ...prev, type: type as any }))} className={`flex-1 py-3 rounded-xl border transition-all ${newDish.type === type ? 'bg-black text-white' : 'bg-white'}`}>{type}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Ingredients</label>
                  <textarea value={newDish.ingredients as any} onChange={e => setNewDish(prev => ({ ...prev, ingredients: e.target.value as any }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">The Story</label>
                  <textarea value={newDish.story} onChange={e => setNewDish(prev => ({ ...prev, story: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif italic min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Cultural Note</label>
                  <textarea value={newDish.culturalNote} onChange={e => setNewDish(prev => ({ ...prev, culturalNote: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif min-h-[60px]" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#c4a484] text-white rounded-xl font-bold">Add to Dinner</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Edit Dish Modal */}
        {isEditDishModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => { setIsEditDishModalOpen(false); setEditingDishId(null); }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-serif text-2xl">Edit Dish Details</h2>
                <button onClick={() => { setIsEditDishModalOpen(false); setEditingDishId(null); }} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <form onSubmit={handleUpdateDish} className="p-8 overflow-y-auto space-y-6">
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Dish Photo</label>
                  <div onClick={() => document.getElementById('edit-image-upload')?.click()} className="relative aspect-video rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#c4a484] transition-all cursor-pointer overflow-hidden">
                    {newDish.heroImage ? <img src={newDish.heroImage} className="w-full h-full object-cover" alt="Preview" /> : <div className="h-full flex flex-col items-center justify-center text-gray-400"><Upload size={24} /><p className="text-sm mt-2">Upload photo</p></div>}
                    <input id="edit-image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">English Name</label>
                    <input required={!newDish.chineseName} type="text" value={newDish.englishName} onChange={e => setNewDish(prev => ({ ...prev, englishName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif" />
                  </div>
                  <div className="space-y-2">
                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Chinese Name</label>
                    <input required={!newDish.englishName} type="text" value={newDish.chineseName} onChange={e => setNewDish(prev => ({ ...prev, chineseName: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-chinese" />
                  </div>
                </div>
                <button type="button" onClick={handleMagicGenerate} disabled={isGenerating || !newDish.heroImage} className="w-full py-3 rounded-xl border-2 border-[#c4a484] text-[#c4a484] font-bold flex items-center justify-center gap-2">
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />} Magic Generate
                </button>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Pinyin</label>
                  <input type="text" value={newDish.pinyin} onChange={e => setNewDish(prev => ({ ...prev, pinyin: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif italic" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Dish Type</label>
                  <div className="flex gap-4">
                    {['veggie', 'meat', 'seafood'].map(type => (
                      <button key={type} type="button" onClick={() => setNewDish(prev => ({ ...prev, type: type as any }))} className={`flex-1 py-3 rounded-xl border transition-all ${newDish.type === type ? 'bg-black text-white' : 'bg-white'}`}>{type}</button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Ingredients</label>
                  <textarea value={newDish.ingredients as any} onChange={e => setNewDish(prev => ({ ...prev, ingredients: e.target.value as any }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">The Story</label>
                  <textarea value={newDish.story} onChange={e => setNewDish(prev => ({ ...prev, story: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif italic min-h-[80px]" />
                </div>
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-gray-500">Cultural Note</label>
                  <textarea value={newDish.culturalNote} onChange={e => setNewDish(prev => ({ ...prev, culturalNote: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-serif min-h-[60px]" />
                </div>
                <button type="submit" className="w-full py-4 bg-[#c4a484] text-white rounded-xl font-bold">Save Changes</button>
              </form>
            </motion.div>
          </div>
        )}

        {/* Library Modal */}
        {isLibraryModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsLibraryModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                <h2 className="font-serif text-2xl">Dish Library</h2>
                <button onClick={() => setIsLibraryModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={20} /></button>
              </div>
              <div className="p-8 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-6">
                {dishes.map(dish => (
                  <div 
                    key={dish.id} 
                    onClick={() => handleAddFromLibrary(dish.id)}
                    className="flex gap-4 p-4 rounded-2xl border border-gray-100 hover:border-[#c4a484] hover:bg-[#c4a484]/5 transition-all cursor-pointer group"
                  >
                    <img src={dish.heroImage} className="w-24 h-24 rounded-xl object-cover" alt={dish.englishName} />
                    <div className="flex-1">
                      <h4 className="font-serif text-lg group-hover:text-[#c4a484] transition-colors">{dish.englishName}</h4>
                      <p className="font-chinese text-[#c4a484]">{dish.chineseName}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 bg-gray-100 rounded-md text-[8px] uppercase tracking-widest font-bold text-gray-500">{dish.type}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="no-print py-12 border-t border-gray-100 text-center">
        <Logo />
        <p className="mt-4 font-serif text-sm text-gray-400 italic">Authentic Shanghai home dining experiences.</p>
        <p className="mt-2 font-sans text-[10px] text-gray-300 uppercase tracking-widest">plus1chopsticks.com</p>
      </footer>
    </div>
  );
}
