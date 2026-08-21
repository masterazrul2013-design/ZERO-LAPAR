import React, { useState } from 'react';
import { Star, X, CheckCircle, MessageSquare, ThumbsUp, Heart, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MerchantRatingModal({ 
  isOpen, 
  onClose, 
  merchant, 
  currentUser,
  onSubmitRating 
}) {
  if (!isOpen || !merchant) return null;

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedTags, setSelectedTags] = useState(['😋 Makanan Sedap', '⚡ Servis Pantas']);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const presetTags = [
    '😋 Makanan Sedap',
    '⚡ Servis Pantas',
    '🧼 Bersih & Kemas',
    '🔥 Masih Panas/Segar',
    '💰 Sangat Berbaloi',
    '🤝 Peniaga Sangat Mesra',
    '🎓 Mesra Pelajar'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const reviewData = {
      id: 'rev_' + Date.now(),
      merchantId: merchant.id || 'm_1',
      merchantName: merchant.name || merchant.merchantName || 'Peniaga Makanan',
      rating: rating,
      comment: comment.trim() || 'Peniaga terbaik! Makanan berkualiti dan servis memuaskan.',
      tags: selectedTags,
      userName: currentUser?.name || 'Pelajar Kampus PMTG',
      userRole: currentUser?.roleLabel || currentUser?.role || 'Pelajar',
      createdAt: new Date().toLocaleDateString('ms-MY', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    if (onSubmitRating) {
      onSubmitRating(reviewData);
    }

    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-emerald-600 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center space-x-2 text-amber-200 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Penilaian & Maklum Balas Pengguna</span>
          </div>

          <h2 className="text-xl font-black">
            Beri Rating Kepada Peniaga
          </h2>
          <p className="text-xs text-amber-100 mt-1">
            {merchant.name || merchant.merchantName || 'Peniaga Rakan Niaga Zero Lapar'}
          </p>
        </div>

        {/* Modal Form Content */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6">
          
          {/* Star Selector */}
          <div className="text-center space-y-2 py-2">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Pilih Bintang Penilaian
            </div>
            <div className="flex items-center justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 transition-transform hover:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-9 h-9 ${
                      (hoverRating || rating) >= star
                        ? 'text-amber-400 fill-amber-400 drop-shadow-sm'
                        : 'text-slate-200'
                    }`}
                  />
                </button>
              ))}
            </div>
            <div className="text-sm font-black text-amber-700">
              {rating === 5 && '⭐⭐⭐⭐⭐ Cemerlang & Sangat Puas Hati!'}
              {rating === 4 && '⭐⭐⭐⭐ Sangat Baik & Berbaloi'}
              {rating === 3 && '⭐⭐⭐ Memuaskan'}
              {rating === 2 && '⭐⭐ Kurang Memuaskan'}
              {rating === 1 && '⭐ Perlu Penambahbaikan'}
            </div>
          </div>

          {/* Quick Tags Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Apa yang anda suka tentang hidangan/servis peniaga ini?
            </label>
            <div className="flex flex-wrap gap-2">
              {presetTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition flex items-center space-x-1 ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 shadow-sm border border-amber-600'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200'
                    }`}
                  >
                    <span>{tag}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment Textarea */}
          <div className="space-y-2">
            <label className="block text-xs font-black text-slate-700 uppercase tracking-wider">
              Ulasan / Komen Tambahan (Pilihan):
            </label>
            <textarea
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Cth: Makanan masih panas dan sedap sangat. Peniaga sangat mesra dan pek berbaloi untuk pelajar. Terima kasih Zero Lapar!"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* User Preview */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600">
            <span>Dihantar sebagai: <strong>{currentUser?.name || 'Pelajar PMTG'}</strong></span>
            <span className="text-[10px] text-slate-400 font-bold">Terbuka & Telus</span>
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-2xl text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-emerald-600 hover:from-amber-600 hover:to-emerald-700 text-white font-black rounded-2xl text-xs transition shadow-md shadow-amber-500/20 flex items-center justify-center space-x-1.5"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Hantar Penilaian ({rating} ⭐)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
