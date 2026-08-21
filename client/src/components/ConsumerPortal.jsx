import MerchantRatingModal from './MerchantRatingModal';
import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Tag, 
  CheckCircle2, 
  Gift, 
  Percent, 
  Filter, 
  Map as MapIcon, 
  Grid, 
  Sparkles,
  ShoppingBag,
  Info,
  ShieldCheck,
  Building,
  AlertCircle,
  Edit3,
  Trash2,
  X
} from 'lucide-react';
import LeafletMap from './LeafletMap';

export default function ConsumerPortal({
  onAddReview, 
  items = [], 
  merchants = [], 
  dropoffPoints = [],
  currentUser,
  onReserveItem,
  onOpenTickets,
  onEditItem,
  onDeleteItem
}) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMode, setSelectedMode] = useState('ALL'); // 'ALL', 'DISCOUNT', 'DONATE'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'map'
  
  // Reserve Modal State
  const [selectedItemForModal, setSelectedItemForModal] = useState(null);
  const [reserveQty, setReserveQty] = useState(1);
  const [reserveError, setReserveError] = useState('');
  const [userName, setUserName] = useState(currentUser?.name || 'Mohd Danial (Pelajar DIT PMTG)');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '+6018-2948192');

  // Inline Admin Edit Modal State
  const [adminEditingItem, setAdminEditingItem] = useState(null);
  const [ratingModalMerchant, setRatingModalMerchant] = useState(null);

  const isAdmin = currentUser?.role === 'admin';
  const categories = ['ALL', 'Rice Meal', 'Bakery', 'Groceries', 'Buffet Surplus'];

  // FILTER: REMOVE ZERO-QUANTITY ITEMS
  const filteredItems = items.filter(item => {
    if (!isAdmin && (item.remainingQuantity <= 0 || item.status === 'CLAIMED_OUT' || item.status === 'OUT_OF_STOCK')) {
      return false;
    }
    if (selectedMode !== 'ALL' && item.mode !== selectedMode) return false;
    if (selectedCategory !== 'ALL' && item.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.merchantName.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleOpenReserve = (item) => {
    setSelectedItemForModal(item);
    setReserveQty(1);
    setReserveError('');
  };

  const handleQtyChange = (val) => {
    const num = parseInt(val, 10) || 0;
    setReserveQty(num);
    if (selectedItemForModal) {
      if (num > selectedItemForModal.remainingQuantity) {
        setReserveError(`Ralat: Kuantiti tempahan (${num} pek) melebihi baki stok yang tinggal (${selectedItemForModal.remainingQuantity} pek)!`);
      } else if (num < 1) {
        setReserveError('Kuantiti minima tempahan adalah 1 pek.');
      } else {
        setReserveError('');
      }
    }
  };

  const handleConfirmReservation = () => {
    if (!selectedItemForModal) return;

    if (reserveQty > selectedItemForModal.remainingQuantity) {
      setReserveError(`Ralat: Kuantiti tempahan (${reserveQty} pek) melebihi baki stok yang tinggal (${selectedItemForModal.remainingQuantity} pek)!`);
      return;
    }

    if (reserveQty < 1) {
      setReserveError('Sila masukkan kuantiti sekurang-kurangnya 1 pek.');
      return;
    }

    onReserveItem({
      itemId: selectedItemForModal.id,
      customerName: currentUser?.name || userName,
      customerPhone: currentUser?.phone || userPhone,
      quantity: reserveQty
    });
    setSelectedItemForModal(null);
  };

  const handleSaveAdminInlineEdit = (e) => {
    e.preventDefault();
    if (!adminEditingItem) return;
    if (onEditItem) {
      onEditItem(adminEditingItem);
    }
    setAdminEditingItem(null);
  };

  const availableItemsCount = items.filter(i => i.remainingQuantity > 0 && i.status !== 'CLAIMED_OUT').length;

  return (
    <div className="space-y-8 pb-16">
      
      {/* Banner: One Platform Two Paths */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute right-20 -top-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold mb-4 border border-emerald-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Inisiatif Politeknik METrO Tasek Gelugor (PYIC 2026)</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight">
            Makanan Berkualiti, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-amber-300">
              Harga Jimat & Donasi Percuma
            </span>
          </h1>

          <p className="mt-4 text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            Selamatkan makanan lebihan daripada restoran, kafe & hotel sekitar Tasek Gelugor. Nikmati diskaun sehingga <strong>70%</strong> atau mohon pek hidangan donasi percuma untuk mahasiswa & komuniti.
          </p>

          {/* Filter Pills inside banner */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedMode('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedMode === 'ALL'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>Semua Pilihan Tersedia</span>
              <span className="bg-slate-200/40 text-xs px-1.5 py-0.5 rounded-full">{availableItemsCount}</span>
            </button>

            <button
              onClick={() => setSelectedMode('DISCOUNT')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedMode === 'DISCOUNT'
                  ? 'bg-amber-400 text-amber-950 font-black shadow-md'
                  : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30'
              }`}
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Laluan Diskaun (Mampu Milik)</span>
            </button>

            <button
              onClick={() => setSelectedMode('DONATE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 ${
                selectedMode === 'DONATE'
                  ? 'bg-emerald-400 text-emerald-950 font-black shadow-md'
                  : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-400/30'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Laluan Donasi (100% Percuma)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari makanan, kedai, atau lokasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white transition"
            />
          </div>

          {/* Grid vs Map Toggle */}
          <div className="flex items-center space-x-2 self-end md:self-auto">
            <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
                <span>Senarai</span>
              </button>

              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  viewMode === 'map' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <MapIcon className="w-3.5 h-3.5" />
                <span>Peta Interaktif</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pt-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Kategori:</span>
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Display: Grid View OR Map View */}
      {viewMode === 'grid' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 font-bold px-1">
            <span>Menunjukkan {filteredItems.length} hidangan sedia ditempah (Baki Stok Aktif)</span>
            <span>📍 Kawasan Tasek Gelugor</span>
          </div>

          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 border border-slate-200">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800">Tiada makanan aktif buat masa ini</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Semua makanan yang habis telah dikeluarkan daripada senarai. Peniaga akan menyenaraikan stok makanan lebihan baharu sebentar lagi.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => {
                const discountPercent = item.originalPrice > 0
                  ? Math.round(((item.originalPrice - item.discountedPrice) / item.originalPrice) * 100)
                  : 0;

                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all flex flex-col overflow-hidden group relative"
                  >
                    {/* Item Image & Badges */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                      {/* Mode Badge */}
                      <div className="absolute top-3 left-3">
                        {item.mode === 'DONATE' ? (
                          <span className="inline-flex items-center space-x-1 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                            <Gift className="w-3.5 h-3.5" />
                            <span>100% DONASI PERCUMA</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 bg-amber-500 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full shadow-md">
                            <Percent className="w-3.5 h-3.5" />
                            <span>JIMAT {discountPercent}%</span>
                          </span>
                        )}
                      </div>

                      {/* Dietary / Halal Tag */}
                      <div className="absolute top-3 right-3">
                        <span className="inline-flex items-center space-x-1 bg-white/95 text-slate-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-sm">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>{item.dietaryTags?.[0] || 'Halal'}</span>
                        </span>
                      </div>

                      {/* Merchant name bottom overlay */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                        <span className="font-bold flex items-center space-x-1 drop-shadow">
                          <Building className="w-3.5 h-3.5" />
                          <span>{item.merchantName}</span>
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setRatingModalMerchant({ id: item.merchantId || 'm_1', name: item.merchantName });
                          }}
                          className="inline-flex items-center space-x-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full shadow transition"
                        >
                          <span>⭐ Nilai Peniaga</span>
                        </button>
                      </div>
                    </div>

                    {/* Admin Direct Action Bar (Only visible to Admin) */}
                    {isAdmin && (
                      <div className="bg-indigo-950 text-white px-4 py-2 flex items-center justify-between text-xs border-y border-indigo-900">
                        <span className="font-bold text-amber-300 flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Control:</span>
                        </span>
                        <div className="flex items-center space-x-1.5">
                          <button
                            onClick={() => setAdminEditingItem({ ...item })}
                            className="px-2.5 py-0.5 bg-indigo-700 hover:bg-indigo-600 text-white font-bold rounded text-[11px] transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (onDeleteItem) onDeleteItem(item.id, item.title);
                            }}
                            className="px-2.5 py-0.5 bg-rose-700 hover:bg-rose-600 text-white font-bold rounded text-[11px] transition"
                          >
                            Padam
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Card Content */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.category}
                          </span>
                          <span className="text-[11px]">Est. {item.unitWeightKg} kg / hidangan</span>
                        </div>

                        <h3 className="font-extrabold text-base text-slate-900 group-hover:text-emerald-700 transition">
                          {item.title}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                          {item.description || 'Pek makanan berkualiti sedia diambil di premis.'}
                        </p>

                        {/* Pickup time & Stock Info */}
                        <div className="mt-3 p-2.5 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600 border border-slate-100">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center space-x-1 text-amber-700 font-semibold">
                              <Clock className="w-3.5 h-3.5 text-amber-600" />
                              <span>Waktu Ambil:</span>
                            </span>
                            <span className="font-bold text-slate-800">{item.pickupWindow}</span>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                            <span className="text-slate-500">Baki Tersedia:</span>
                            <span className="font-black text-emerald-700">
                              {item.remainingQuantity} pek tinggal
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing & CTA Button */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          {item.mode === 'DONATE' ? (
                            <div>
                              <span className="text-[11px] text-slate-400 line-through">
                                RM {item.originalPrice.toFixed(2)}
                              </span>
                              <div className="text-lg font-black text-emerald-600 leading-none">
                                RM 0.00 (Percuma)
                              </div>
                            </div>
                          ) : (
                            <div>
                              <span className="text-[11px] text-slate-400 line-through">
                                RM {item.originalPrice.toFixed(2)}
                              </span>
                              <div className="text-xl font-black text-slate-900 leading-none">
                                RM {item.discountedPrice.toFixed(2)}
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => handleOpenReserve(item)}
                          className={`px-4 py-2.5 rounded-xl font-extrabold text-xs shadow-md transition flex items-center space-x-1.5 ${
                            item.mode === 'DONATE'
                              ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                              : 'bg-amber-500 hover:bg-amber-600 text-slate-950 shadow-amber-200'
                          }`}
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{item.mode === 'DONATE' ? 'Mohon Donasi' : 'Tempah Hidangan'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-base text-slate-900">Peta Lokasi Rakan Niaga & Drop-Off Hub</h3>
              <p className="text-xs text-slate-500">Pilih premis sekitar Tasek Gelugor untuk membuat tempahan atau serahan.</p>
            </div>
          </div>
          <LeafletMap 
            merchants={merchants}
            dropoffPoints={dropoffPoints}
            items={filteredItems}
            onSelectItem={(item) => handleOpenReserve(item)}
          />
        </div>
      )}

      {/* Admin Inline Edit Food Modal */}
      {adminEditingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Sunting Tawaran Makanan (Pentadbir)</h3>
              <button onClick={() => setAdminEditingItem(null)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAdminInlineEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Sajian:</label>
                <input
                  type="text"
                  value={adminEditingItem.title}
                  onChange={(e) => setAdminEditingItem({ ...adminEditingItem, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Laluan:</label>
                  <select
                    value={adminEditingItem.mode}
                    onChange={(e) => setAdminEditingItem({ ...adminEditingItem, mode: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  >
                    <option value="DISCOUNT">Laluan Diskaun</option>
                    <option value="DONATE">Laluan Donasi (Percuma)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Harga Diskaun (RM):</label>
                  <input
                    type="number"
                    step="0.5"
                    disabled={adminEditingItem.mode === 'DONATE'}
                    value={adminEditingItem.mode === 'DONATE' ? 0 : adminEditingItem.discountedPrice}
                    onChange={(e) => setAdminEditingItem({ ...adminEditingItem, discountedPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Baki Kuantiti (Pek):</label>
                  <input
                    type="number"
                    min="0"
                    value={adminEditingItem.remainingQuantity}
                    onChange={(e) => setAdminEditingItem({ ...adminEditingItem, remainingQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pengambilan:</label>
                  <input
                    type="text"
                    value={adminEditingItem.pickupWindow}
                    onChange={(e) => setAdminEditingItem({ ...adminEditingItem, pickupWindow: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setAdminEditingItem(null)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-xl shadow"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reservation & Confirmation Modal */}
      {selectedItemForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                  Pengesahan Tempahan Makanan
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedItemForModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedItemForModal(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Error Notification if quantity exceeded */}
            {reserveError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{reserveError}</span>
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Penyedia / Restoran:</span>
                  <span className="font-bold text-slate-900">{selectedItemForModal.merchantName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu Pengambilan:</span>
                  <span className="font-bold text-slate-900">{selectedItemForModal.pickupWindow}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Baki Stok Tersedia:</span>
                  <span className="font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    {selectedItemForModal.remainingQuantity} pek tinggal
                  </span>
                </div>
              </div>

              {/* Quantity Selector with Max boundary */}
              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <label className="font-bold text-slate-700">Kuantiti Pek Ditempah:</label>
                  <span className="text-[11px] text-slate-400">Maksimum: {selectedItemForModal.remainingQuantity} pek</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max={selectedItemForModal.remainingQuantity}
                  value={reserveQty}
                  onChange={(e) => handleQtyChange(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base font-black text-slate-900 focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* User Info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Nama Penerima:</label>
                  <input
                    type="text"
                    value={currentUser?.name || userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium mt-1"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">No. Telefon:</label>
                  <input
                    type="text"
                    value={currentUser?.phone || userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium mt-1"
                  />
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 flex justify-between items-center">
                <div>
                  <div className="text-[11px] text-emerald-800">Jumlah Bayaran (Di Kaunter):</div>
                  <div className="text-xl font-black text-emerald-900">
                    {selectedItemForModal.mode === 'DONATE'
                      ? 'RM 0.00 (Percuma)'
                      : `RM ${(selectedItemForModal.discountedPrice * reserveQty).toFixed(2)}`}
                  </div>
                </div>
                <div className="text-right text-[11px] text-emerald-700 font-semibold">
                  <div>🌿 Diselamatkan: {(selectedItemForModal.unitWeightKg * reserveQty).toFixed(2)} kg</div>
                  <div>💨 CO₂ Dijimat: {(selectedItemForModal.unitWeightKg * reserveQty * 2.5).toFixed(2)} kg</div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedItemForModal(null)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={Boolean(reserveError) || reserveQty > selectedItemForModal.remainingQuantity || reserveQty < 1}
                onClick={handleConfirmReservation}
                className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-extrabold rounded-xl text-xs shadow-lg transition flex items-center justify-center space-x-1.5"
              >
                <span>Dapatkan Tiket QR</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}