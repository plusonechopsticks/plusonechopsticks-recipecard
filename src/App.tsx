import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { motion, AnimatePresence } from 'motion/react';
import { Printer, LayoutGrid, ChevronRight, MapPin, Quote, Info, Plus, Upload, X, Image as ImageIcon, Calendar, User, Search, ChevronLeft, Pencil, FileDown, Sparkles, Loader2 } from 'lucide-react';
import { DISHES, Dish, Dinner } from './constants';

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
    veggie: { bg: 'bg-emerald-50/20', badge: 'bg-emerald-50 text-emerald-700' },
    meat: { bg: 'bg-rose-50/20', badge: 'bg-rose-50 text-rose-700' },
    seafood: { bg: 'bg-blue-50/20', badge: 'bg-blue-50 text-blue-700' }
  };

  const colors = typeColors[dish.type];

  return (
    <div
      data-recipe-card="true"
      className={`relative bg-[#fdfaf5] overflow-hidden flex flex-col group ${
        isPrint ? 'h-full border border-[#e8dcc8]' : 'h-[700px] shadow-2xl rounded-2xl border border-[#e8dcc8]'
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

      <div className={`relative ${isPrint ? 'h-[45%]' : 'h-[55%]'} overflow-hidden bg-gray-100`}>
        {dish.heroImage && (
          <img
            src={dish.heroImage}
            alt={dish.englishName}
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      <div className={`flex-1 ${isPrint ? 'p-4' : 'p-8'} flex flex-col`}>
        <div className={isPrint ? 'mb-4' : 'mb-6'}>
          <div className="flex items-center justify-between mb-1">
            <h2 className={`font-handwriting ${isPrint ? 'text-3xl' : 'text-3xl md:text-4xl'} font-semibold tracking-tight`}>
              {dish.englishName}
            </h2>
            <span className={`font-sans text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full ${colors.badge}`}>
              {dish.type}
            </span>
          </div>
          <div className="flex items-baseline gap-3">
            <span className={`font-chinese ${isPrint ? 'text-2xl' : 'text-2xl'} text-[#c4a484]`}>{dish.chineseName}</span>
            <span className="font-serif italic text-base text-gray-700">{dish.pinyin}</span>
          </div>
        </div>

        <div className={`grid ${isPrint ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-8'} flex-1`}>
          <div className={isPrint ? 'space-y-2' : 'space-y-4'}>
            <div className="flex items-center gap-2 border-b border-dashed border-[#d4c5a9] pb-1">
              <Info size={12} className="text-gray-600" />
              <h3 className="font-sans text-[11px] uppercase tracking-widest font-bold text-gray-700">Key Ingredients</h3>
            </div>
            {(() => {
              const ingredientList = Array.isArray(dish.ingredients)
                ? dish.ingredients
                : (dish.ingredients as unknown as string).split(',').map(s => s.trim()).filter(Boolean);
              return (
                <ul className={isPrint ? 'space-y-1' : 'space-y-2'}>
                  {ingredientList.map((ing, idx) => (
                    <li key={idx} className={`font-serif ${isPrint ? 'text-sm' : 'text-sm'} text-gray-700 flex items-start gap-2`}>
                      <span className="text-[#c4a484] mt-0.5">•</span>
                      {ing}
                    </li>
                  ))}
                </ul>
              );
            })()}
          </div>

          <div className={isPrint ? 'space-y-3' : 'space-y-4'}>
            <div className="flex items-center gap-2 border-b border-dashed border-[#d4c5a9] pb-1">
              <Quote size={12} className="text-gray-600" />
              <h3 className="font-sans text-[11px] uppercase tracking-widest font-bold text-gray-700">The Story</h3>
            </div>
            <p className={`font-serif ${isPrint ? 'text-base' : 'text-sm'} leading-relaxed text-gray-800 italic`}>
              "{dish.story}"
            </p>
            {!isPrint && (
              <div className="pt-2 space-y-3">
                <div>
                  <p className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#c4a484] mb-1">Cultural Note</p>
                  <p className="font-serif text-sm text-gray-500 leading-snug">
                    {dish.culturalNote}
                  </p>
                </div>
                {dish.familySecret && (
                  <div>
                    <p className="font-sans text-[9px] uppercase tracking-widest font-bold text-[#c4a484] mb-1">家庭秘方</p>
                    <p className="font-handwriting text-base text-[#8a6a3a] leading-snug flex items-start gap-1">
                      <Pencil size={12} className="mt-1 shrink-0 text-[#c4a484]" />
                      {dish.familySecret}
                    </p>
                  </div>
                )}
              </div>
            )}
            {isPrint && dish.familySecret && (
              <div className="pt-1">
                <p className="font-sans text-[8px] uppercase tracking-widest font-bold text-[#c4a484] mb-0.5">家庭秘方</p>
                <p className="font-handwriting text-sm text-[#8a6a3a] leading-snug flex items-start gap-1">
                  <Pencil size={10} className="mt-0.5 shrink-0 text-[#c4a484]" />
                  {dish.familySecret}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className={`mt-auto ${isPrint ? 'pt-3' : 'pt-6'} flex justify-between items-end border-t border-gray-100/50`}>
          <div className="flex items-center gap-3 text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="font-handwriting text-[14px] text-gray-800">{dinner.hostName}</span>
              <div className="w-1 h-1 rounded-full bg-gray-300" />
              <span className="font-serif text-[12px] text-gray-700">{dinner.date}</span>
            </div>
            <div className="h-2 w-[0.5px] bg-gray-200" />
            <div className="flex items-center gap-1.5">
              <MapPin size={8} />
              <span className="font-sans text-[10px] uppercase tracking-widest">{dinner.district}, {dinner.city}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState<'dinners' | 'dinner-detail'>('dinners');
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
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const cardGridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    QRCode.toDataURL('https://plus1chopsticks.com', { width: 80, margin: 1 })
      .then(setQrCodeUrl)
      .catch(() => {});
  }, []);

  const handleMagicGenerate = async () => {
    const chineseName = newDish.chineseName?.trim();
    if (!chineseName) return;
    setIsGenerating(true);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{
            role: 'user',
            content: `You are a Chinese food expert specializing in Shanghainese cuisine.
Given this Chinese dish name: ${chineseName}

Return ONLY a JSON object with these exact fields, no other text:
{
  "englishName": "English dish name",
  "pinyin": "Accurate Mandarin romanization with correct tone marks (ā á ǎ à, ē é ě è etc). Double-check tones carefully.",
  "type": "veggie" or "meat" or "seafood",
  "ingredients": ["ingredient 1", "ingredient 2", "ingredient 3", "ingredient 4"],
  "story": "Exactly 2 sentences maximum, under 40 words total",
  "culturalNote": "Exactly 1 sentence, under 20 words",
  "familySecret": "One specific cooking tip or secret technique that makes this dish special at home, under 15 words. Something a home cook would know."
}`
          }]
        })
      });
      const data = await response.json();
      const text = data.content[0].text;
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setNewDish(prev => ({
        ...prev,
        englishName: parsed.englishName ?? prev.englishName,
        pinyin: parsed.pinyin ?? prev.pinyin,
        type: parsed.type ?? prev.type,
        ingredients: parsed.ingredients ?? prev.ingredients,
        story: parsed.story ?? prev.story,
        culturalNote: parsed.culturalNote ?? prev.culturalNote,
        familySecret: parsed.familySecret ?? prev.familySecret,
      }));
    } catch (e) {
      console.error('Claude API error', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = async () => {
    if (!cardGridRef.current) return;
    if (!qrCodeUrl) return;
    setIsDownloadingPdf(true);
    try {
      const [{ default: jsPDF }, { toCanvas }] = await Promise.all([
        import('jspdf'),
        import('html-to-image'),
      ]);

      const cards = Array.from(
        cardGridRef.current.querySelectorAll<HTMLElement>('[data-recipe-card]')
      );
      if (cards.length === 0) return;

      // Measure row dimensions before async capture (DOM still laid out)
      const cardHeight = cards[0].offsetHeight;
      const gapPx = parseFloat(getComputedStyle(cardGridRef.current).rowGap) || 48;
      const rowCount = Math.ceil(cards.length / 2);
      const PIXEL_RATIO = 2;

      const fullCanvas = await toCanvas(cardGridRef.current, {
        pixelRatio: PIXEL_RATIO,
        backgroundColor: '#ffffff',
      });

      // Canvas-space measurements
      const canvasW = fullCanvas.width;
      const rowStride = (cardHeight + gapPx) * PIXEL_RATIO; // top-of-row to top-of-next-row
      const cardSliceH = cardHeight * PIXEL_RATIO;           // card pixels only, no trailing gap

      // Build chopsticks logo as a PNG data URL from the SVG
      const svgStr = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 2L5 22" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
        <path d="M12 2L10 22" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
        <path d="M19 7V13" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
        <path d="M16 10H22" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round"/>
      </svg>`;
      const svgDataUrl = 'data:image/svg+xml;base64,' + btoa(svgStr);
      const logoDataUrl = await new Promise<string>((resolve) => {
        const img = new Image();
        img.onload = () => {
          const c = document.createElement('canvas');
          c.width = 48; c.height = 48;
          c.getContext('2d')!.drawImage(img, 0, 0, 48, 48);
          resolve(c.toDataURL('image/png'));
        };
        img.onerror = () => resolve('');
        img.src = svgDataUrl;
      });

      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
      const PAGE_W_MM = 297, PAGE_H_MM = 210;

      for (let i = 0; i < rowCount; i++) {
        const sliceY = i * rowStride;
        const sliceH = Math.min(cardSliceH, fullCanvas.height - sliceY);
        if (sliceH <= 0) break;

        const slice = document.createElement('canvas');
        slice.width = canvasW;
        slice.height = sliceH;
        slice.getContext('2d')!.drawImage(fullCanvas, 0, sliceY, canvasW, sliceH, 0, 0, canvasW, sliceH);

        // Preserve aspect ratio, centre vertically on A4
        const renderedH = sliceH * (PAGE_W_MM / canvasW);

        if (i > 0) pdf.addPage();

        const HEADER_H = 15, FOOTER_H = 12;
        const cardZoneH = PAGE_H_MM - HEADER_H - FOOTER_H; // 183mm
        const cardH = renderedH <= cardZoneH ? renderedH : cardZoneH;
        const cardW = cardH === cardZoneH ? cardZoneH * (PAGE_W_MM / renderedH) : PAGE_W_MM;
        const cardX = (PAGE_W_MM - cardW) / 2;
        const cardY = HEADER_H + (cardZoneH - cardH) / 2;

        // Header
        pdf.setDrawColor(220, 220, 220);
        pdf.line(0, HEADER_H, PAGE_W_MM, HEADER_H);
        if (logoDataUrl) pdf.addImage(logoDataUrl, 'PNG', 6, 4, 7, 7);
        pdf.setTextColor(26, 26, 26);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(12);
        pdf.text('+1 Chopsticks', 15, 10);
        pdf.setTextColor(120, 120, 120);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7);
        pdf.text('AUTHENTIC SHANGHAI HOME DINING', PAGE_W_MM - 8, 10, { align: 'right' });

        // Cards
        pdf.addImage(slice.toDataURL('image/jpeg', 0.92), 'JPEG', cardX, cardY, cardW, cardH);

        // Footer
        pdf.line(0, PAGE_H_MM - FOOTER_H, PAGE_W_MM, PAGE_H_MM - FOOTER_H);
        pdf.setTextColor(120, 120, 120);
        pdf.setFont('times', 'italic');
        pdf.setFontSize(9);
        pdf.text('plus1chopsticks.com', 8, PAGE_H_MM - FOOTER_H + 7.5);
        pdf.addImage(qrCodeUrl, 'PNG', PAGE_W_MM - 11 - 3, PAGE_H_MM - FOOTER_H + 1, 10, 10);
      }

      const dinnerName = selectedDinner?.hostName ?? 'menu';
      pdf.save(`${dinnerName.replace(/\s+/g, '-').toLowerCase()}-recipe-cards.pdf`);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [view]);
  
  const [isUploading, setIsUploading] = useState(false);

  const [newDinner, setNewDinner] = useState<Partial<Dinner>>({
    hostName: '', district: '', city: 'Shanghai', date: new Date().toISOString().split('T')[0], dishIds: []
  });
  
  const [newDish, setNewDish] = useState<Partial<Dish>>({
    englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', familySecret: '', type: 'veggie', heroImage: ''
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
    if (!newDish.englishName || !selectedDinnerId) return;
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
      englishName: '', chineseName: '', pinyin: '', ingredients: [], story: '', culturalNote: '', familySecret: '', type: 'veggie', heroImage: ''
    });
    setIsDishModalOpen(true);
  };


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
            </>
          ) : null}
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
                      onClick={() => window.print()}
                      className="flex items-center gap-1.5 text-black hover:text-[#c4a484] transition-colors font-medium"
                    >
                      <Printer size={16} />
                      <span>Print</span>
                    </button>
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    <button
                      onClick={handleDownloadPdf}
                      disabled={isDownloadingPdf}
                      className="flex items-center gap-1.5 text-black hover:text-[#c4a484] transition-colors font-medium disabled:opacity-40"
                    >
                      <FileDown size={16} />
                      <span>{isDownloadingPdf ? 'Generating…' : 'Download PDF'}</span>
                    </button>
                  </div>
                </div>
              </div>

              <div ref={cardGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-12">
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
              </div>
              <button
                onClick={openNewDishModal}
                className="mt-12 w-full h-32 border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-[#c4a484] hover:bg-[#c4a484]/5 transition-all group"
              >
                <div className="flex items-center gap-3 text-gray-400 group-hover:text-[#c4a484] transition-colors">
                  <Plus size={20} />
                  <p className="font-serif text-lg italic">Add a dish to this dinner</p>
                </div>
              </button>
            </motion.div>
          ) : null}
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
                <div className="flex justify-end">
                  <button type="button" onClick={handleMagicGenerate} disabled={!newDish.chineseName?.trim() || isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-sans font-medium text-gray-600 hover:border-[#c4a484] hover:text-[#c4a484] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Auto-fill
                  </button>
                </div>
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
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-[#c4a484]">家庭秘方 Family Secret <span className="text-gray-400 normal-case tracking-normal font-normal">(optional)</span></label>
                  <textarea value={newDish.familySecret ?? ''} onChange={e => setNewDish(prev => ({ ...prev, familySecret: e.target.value }))} placeholder="e.g. 葱油需提前熬2小时 (scallion oil slow-cooked 2 hours)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-handwriting text-base min-h-[60px] placeholder:font-sans placeholder:text-sm" />
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
                <div className="flex justify-end">
                  <button type="button" onClick={handleMagicGenerate} disabled={!newDish.chineseName?.trim() || isGenerating} className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-gray-300 rounded-lg font-sans font-medium text-gray-600 hover:border-[#c4a484] hover:text-[#c4a484] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                    Auto-fill
                  </button>
                </div>
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
                <div className="space-y-2">
                  <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-[#c4a484]">家庭秘方 Family Secret <span className="text-gray-400 normal-case tracking-normal font-normal">(optional)</span></label>
                  <textarea value={newDish.familySecret ?? ''} onChange={e => setNewDish(prev => ({ ...prev, familySecret: e.target.value }))} placeholder="e.g. 葱油需提前熬2小时 (scallion oil slow-cooked 2 hours)" className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none font-handwriting text-base min-h-[60px] placeholder:font-sans placeholder:text-sm" />
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
