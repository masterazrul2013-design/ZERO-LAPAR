import React, { useState, useRef } from 'react';
import { 
  Utensils,
  Store, 
  PlusCircle, 
  QrCode, 
  Sparkles, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Percent, 
  Gift, 
  Trash2, 
  Award, 
  FileText,
  DollarSign,
  ShieldCheck,
  Building,
  CheckCheck,
  Upload,
  Image as ImageIcon,
  Camera,
  X,
  Printer,
  Calendar,
  Leaf,
  Scale,
  CloudRain,
  ExternalLink,
  Medal,
  Crown,
  Star
} from 'lucide-react';
import confetti from 'canvas-confetti';

const safeNum = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

export default function MerchantPortal({
  reviews = [], 
  items = [], 
  merchants = [], 
  reservations = [],
  currentUser,
  onAddNewItem, 
  onVerifyQrCode,
  onUpgradePlan,
  activeMerchantTab = 'manage',
  setActiveMerchantTab
}) {
  const [reportPeriod, setReportPeriod] = useState('ALL'); // 'TODAY', 'MONTH', 'ALL'

  const defaultMerchant = {
    id: 'm_1',
    name: 'Restoran Selera Kampus',
    category: 'Restaurant',
    address: 'No. 12, Jalan Tasek Gelugor Utama, 13300 Tasek Gelugor, Pulau Pinang',
    phone: '+6012-3456789',
    rating: 4.8,
    plan: 'Premium',
    isHalal: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
    totalRescuedKg: 340.5,
    totalMeals: 220
  };

  const foundMerchant = (currentUser?.role === 'merchant' && currentUser.merchantId)
    ? (merchants || []).find(m => m && m.id === currentUser.merchantId)
    : (merchants && merchants[0]);

  const currentMerchant = {
    ...defaultMerchant,
    ...(foundMerchant || {}),
    name: (foundMerchant && foundMerchant.name) || currentUser?.merchantName || currentUser?.name || defaultMerchant.name,
    phone: (foundMerchant && foundMerchant.phone) || currentUser?.phone || defaultMerchant.phone,
    address: (foundMerchant && foundMerchant.address) || defaultMerchant.address,
    plan: (foundMerchant && foundMerchant.plan) || currentUser?.plan || 'Premium',
    image: (foundMerchant && foundMerchant.image) || currentUser?.avatar || defaultMerchant.image
  };

  // Form State
  const [formMode, setFormMode] = useState('DISCOUNT');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Rice Meal');
  const [originalPrice, setOriginalPrice] = useState(15);
  const [discountedPrice, setDiscountedPrice] = useState(5);
  const [quantity, setQuantity] = useState(10);
  const [unitWeightKg, setUnitWeightKg] = useState(0.45);
  const [pickupWindow, setPickupWindow] = useState('12:00 PM - 4:00 PM');
  const [description, setDescription] = useState('');
  const [dietaryTag, setDietaryTag] = useState('Halal');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80');
  const [imageTab, setImageTab] = useState('upload');

  const fileInputRef = useRef(null);

  const presetFoodImages = [
    { name: 'Set Nasi Berlauk / Ayam Goreng', url: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80' },
    { name: 'Nasi Lemak Sambal & Telur', url: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80' },
    { name: 'Roti, Croissant & Pastri', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80' },
    { name: 'Hidangan Buffet / Katering', url: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80' },
    { name: 'Buah-buahan & Barangan Segar', url: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=600&q=80' },
    { name: 'Mee Goreng / Masakan Panas', url: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80' }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('Saiz gambar terlalu besar. Sila pilih gambar di bawah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setImageUrl(uploadEvent.target.result);
    };
    reader.readAsDataURL(file);
  };

  // QR Scanner State
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Safe item filters
  const merchantItems = (items || []).filter(i => 
    i && (i.merchantId === currentMerchant.id || (i.merchantName && i.merchantName.toLowerCase() === currentMerchant.name.toLowerCase()))
  );

  // Safe reservation filters
  const merchantReservations = (reservations || []).filter(r => 
    r && ((r.merchantId && r.merchantId === currentMerchant.id) || (r.merchantName && r.merchantName.toLowerCase() === currentMerchant.name.toLowerCase()))
  );

  // Safe metrics calculations
  const totalListedMeals = merchantItems.reduce((s, i) => s + safeNum(i.quantity), 0);
  const totalClaimedMeals = merchantItems.reduce((s, i) => s + Math.max(0, safeNum(i.quantity) - safeNum(i.remainingQuantity)), 0);
  const totalDiscountMeals = merchantItems.filter(i => i.mode === 'DISCOUNT').reduce((s, i) => s + safeNum(i.quantity), 0);
  const totalDonatedMeals = merchantItems.filter(i => i.mode === 'DONATE').reduce((s, i) => s + safeNum(i.quantity), 0);
  
  const totalRescuedKg = safeNum(currentMerchant.totalRescuedKg, safeNum(totalClaimedMeals * 0.45, 120));
  const totalCo2SavedKg = safeNum(totalRescuedKg * 2.5, 300);
  const totalRevenueRecovered = safeNum(totalClaimedMeals * 5.0, 600);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Sila masukkan nama hidangan!');
      return;
    }

    const newItem = {
      title,
      category,
      mode: formMode,
      originalPrice: safeNum(originalPrice, 15),
      discountedPrice: formMode === 'DONATE' ? 0 : safeNum(discountedPrice, 5),
      quantity: safeNum(quantity, 10),
      remainingQuantity: safeNum(quantity, 10),
      unitWeightKg: safeNum(unitWeightKg, 0.45),
      pickupWindow: pickupWindow || '12:00 PM - 4:00 PM',
      dietaryTags: [dietaryTag || 'Halal'],
      description: description || (formMode === 'DONATE' ? 'Pek makanan donasi percuma untuk mahasiswa & komuniti.' : 'Sajian lebihan lazat pada harga jimat.'),
      image: imageUrl,
      merchantId: currentMerchant.id,
      merchantName: currentMerchant.name
    };

    onAddNewItem(newItem);
    setTitle('');
    setDescription('');
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;

    setIsScanning(true);
    const res = await onVerifyQrCode(qrCodeInput.trim());
    setIsScanning(false);

    if (res && res.success) {
      setScanResult({
        type: 'success',
        title: 'Penebusan Berjaya Disahkan!',
        message: res.message || `Kod ${qrCodeInput} disahkan. Makanan telah diserahkan kepada pelanggan.`,
        reservation: res.reservation
      });
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
      setQrCodeInput('');
    } else {
      setScanResult({
        type: 'error',
        title: 'Ralat Pengesahan QR',
        message: res?.error || 'Kod QR atau No. Tiket tidak sah atau telah ditebus sebelum ini.'
      });
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = new Date().toISOString().slice(0, 7);

  const filteredMerchantItems = merchantItems.filter(item => {
    const itemDate = item.createdAt ? item.createdAt.split('T')[0] : todayStr;
    if (reportPeriod === 'TODAY') return itemDate === todayStr;
    if (reportPeriod === 'MONTH') return itemDate.startsWith(currentMonthStr);
    return true;
  });

  const periodLabel = reportPeriod === 'TODAY' 
    ? 'Harian (' + todayStr + ')' 
    : reportPeriod === 'MONTH' 
    ? 'Bulanan (' + currentMonthStr + ')' 
    : 'Keseluruhan Rekod Peniaga';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner with Profile & Navigation Tabs */}
      <div className="bg-gradient-to-br from-amber-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 print:hidden">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 p-1 flex items-center justify-center border border-amber-400/30 overflow-hidden flex-shrink-0">
            <img 
              src={currentMerchant.image} 
              alt={currentMerchant.name}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Portal Rakan Niaga PMTG
              </span>
              <span className="text-xs font-bold text-slate-400">
                • {currentMerchant.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight mt-1">
              {currentMerchant.name}
            </h1>
            <p className="text-xs text-slate-300">
              Pelan: <strong className="text-amber-300">{currentMerchant.plan}</strong> • {currentMerchant.address}
            </p>
          </div>
        </div>

        {/* Tab Switcher for Merchant */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-slate-800/90 p-1.5 rounded-2xl border border-slate-700 flex space-x-1">
            <button
              onClick={() => setActiveMerchantTab('manage')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMerchantTab === 'manage' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Urus Makanan & QR</span>
            </button>

            <button
              onClick={() => setActiveMerchantTab('analytics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMerchantTab === 'analytics' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Prestasi & Impak</span>
            </button>

            <button
              onClick={() => setActiveMerchantTab('report')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
                activeMerchantTab === 'report' ? 'bg-amber-500 text-slate-950 shadow font-black' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Jana & Cetak Penyata</span>
            </button>
          </div>

          <button
            onClick={() => setShowPlanModal(true)}
            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-400/30 transition flex items-center space-x-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Pelan</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MANAGE FOOD LISTINGS & QR SCANNER */}
      {activeMerchantTab === 'manage' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Form: List Surplus Food */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
                    Langkah 1 & 2: List & Choose
                  </span>
                  <h3 className="text-xl font-black text-slate-900">
                    Senaraikan Makanan Lebihan
                  </h3>
                </div>
                <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                  <PlusCircle className="w-6 h-6" />
                </div>
              </div>

              {/* Mode Selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Pilih Laluan Pengagihan ("One Platform. Two Paths."):
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormMode('DISCOUNT')}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      formMode === 'DISCOUNT'
                        ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-400/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 flex items-center space-x-1.5">
                        <Percent className="w-4 h-4 text-amber-600" />
                        <span>Laluan Diskaun</span>
                      </span>
                      {formMode === 'DISCOUNT' && <CheckCircle className="w-4 h-4 text-amber-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Jual murah (cth RM5) untuk menjana semula sebahagian kos makanan.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormMode('DONATE')}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between ${
                      formMode === 'DONATE'
                        ? 'border-emerald-500 bg-emerald-50/70 ring-2 ring-emerald-400/50'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-sm text-slate-900 flex items-center space-x-1.5">
                        <Gift className="w-4 h-4 text-emerald-600" />
                        <span>Laluan Donasi</span>
                      </span>
                      {formMode === 'DONATE' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">
                      Salur percuma kepada NGO, sukarelawan atau Zero Lapar Hub.
                    </p>
                  </button>
                </div>
              </div>

              {/* Food Details Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Sajian / Menu:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Nasi Kerabu Ayam Bakar, Roti Canai & Kari..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kategori:</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="Rice Meal">Rice Meal / Nasi Berlauk</option>
                      <option value="Bakery">Bakery & Pastry</option>
                      <option value="Groceries">Groceries / Pasar Segar</option>
                      <option value="Buffet Surplus">Buffet / Katering</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pensijilan:</label>
                    <select
                      value={dietaryTag}
                      onChange={(e) => setDietaryTag(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    >
                      <option value="Halal">Halal (Disahkan)</option>
                      <option value="Muslim Friendly">Muslim Friendly</option>
                      <option value="Vegetarian">Vegetarian</option>
                    </select>
                  </div>
                </div>

                {/* Pricing & Quantity */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Harga Asal (RM):</label>
                    <input
                      type="number"
                      min="1"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      {formMode === 'DONATE' ? 'Harga Tawaran:' : 'Harga Diskaun (RM):'}
                    </label>
                    <input
                      type="number"
                      disabled={formMode === 'DONATE'}
                      value={formMode === 'DONATE' ? 0 : discountedPrice}
                      onChange={(e) => setDiscountedPrice(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold disabled:bg-slate-100 disabled:text-emerald-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kuantiti (Pek):</label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Waktu Ambil:</label>
                    <input
                      type="text"
                      value={pickupWindow}
                      onChange={(e) => setPickupWindow(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Anggaran Berat (kg):</label>
                    <input
                      type="number"
                      step="0.05"
                      value={unitWeightKg}
                      onChange={(e) => setUnitWeightKg(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Food Image Upload & Picker */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex justify-between items-center">
                    <label className="block text-xs font-bold text-slate-700">Gambar Makanan:</label>
                    <div className="flex space-x-1 bg-slate-100 p-0.5 rounded-lg text-[10px]">
                      <button
                        type="button"
                        onClick={() => setImageTab('upload')}
                        className={`px-2 py-1 rounded ${imageTab === 'upload' ? 'bg-white font-bold text-slate-900 shadow' : 'text-slate-500'}`}
                      >
                        Upload Gambar / Kamera
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageTab('presets')}
                        className={`px-2 py-1 rounded ${imageTab === 'presets' ? 'bg-white font-bold text-slate-900 shadow' : 'text-slate-500'}`}
                      >
                        Pilihan Pantas
                      </button>
                    </div>
                  </div>

                  {imageTab === 'upload' && (
                    <div className="flex items-center space-x-3">
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileUpload} 
                        accept="image/*" 
                        className="hidden" 
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 py-3 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl border border-dashed border-emerald-300 text-xs transition flex items-center justify-center space-x-2"
                      >
                        <Camera className="w-4 h-4 text-emerald-600" />
                        <span>Pilih Gambar dari Komputer / Kamera HP</span>
                      </button>
                    </div>
                  )}

                  {imageTab === 'presets' && (
                    <div className="grid grid-cols-3 gap-2">
                      {presetFoodImages.map(p => (
                        <button
                          key={p.name}
                          type="button"
                          onClick={() => setImageUrl(p.url)}
                          className={`p-1.5 rounded-xl border text-left flex items-center space-x-2 ${
                            imageUrl === p.url ? 'border-emerald-500 bg-emerald-50 ring-2 ring-emerald-400/50' : 'border-slate-200 hover:bg-slate-50'
                          }`}
                        >
                          <img src={p.url} alt={p.name} className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-[10px] font-bold text-slate-800 line-clamp-1">{p.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center space-x-2 mt-4"
                >
                  <PlusCircle className="w-4 h-4 text-amber-400" />
                  <span>Siarkan Makanan Lebihan ke Aplikasi</span>
                </button>
              </form>
            </div>

            {/* Right Column: Interactive QR Scanner & Pending Orders Queue */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* QR Code Redemption Scanner & Camera */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                      <QrCode className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-slate-900">Pengimbas Kod QR Penebusan</h3>
                      <p className="text-xs text-slate-500">Imbas kod QR pada telefon mahasiswa.</p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                    LIVE
                  </span>
                </div>

                {/* Form to Type or Scan QR */}
                <form onSubmit={handleVerify} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Taip atau Imbas Kod Tiket Pelajar:
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Contoh: ZL-4311"
                        value={qrCodeInput}
                        onChange={(e) => setQrCodeInput(e.target.value.toUpperCase())}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono font-bold tracking-wider uppercase focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      {qrCodeInput && (
                        <button
                          type="button"
                          onClick={() => setQrCodeInput('')}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 font-bold text-xs"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    {/* Quick Code Chips for Fast 1-Click Fill */}
                    {(reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className="text-[10px] text-slate-400 font-bold">Pilih Kod Tiket:</span>
                        {(reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').slice(0, 4).map(r => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setQrCodeInput(r.pickupCode || r.id)}
                            className="text-[10px] font-mono font-black bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg transition"
                          >
                            {r.pickupCode}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="submit"
                      disabled={isScanning || !qrCodeInput.trim()}
                      className="py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center justify-center space-x-1.5"
                    >
                      <CheckCheck className="w-4 h-4" />
                      <span>{isScanning ? 'Mengesahkan...' : 'Sahkan Tiket'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const pending = (reservations || []).find(r => r.status === 'READY_FOR_PICKUP');
                        if (pending) {
                          setQrCodeInput(pending.pickupCode || pending.id);
                        } else {
                          alert('Tiada tempahan aktif yang menunggu pada masa ini.');
                        }
                      }}
                      className="py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1"
                    >
                      <Camera className="w-4 h-4 text-indigo-600" />
                      <span>Isi Tiket Pantas</span>
                    </button>
                  </div>
                </form>

                {scanResult && (
                  <div className={`p-4 rounded-2xl border text-xs animate-in fade-in ${
                    scanResult.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}>
                    <div className="font-black text-sm flex items-center space-x-1.5">
                      {scanResult.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-rose-600" />}
                      <span>{scanResult.title}</span>
                    </div>
                    <p className="mt-1">{scanResult.message}</p>
                  </div>
                )}
              </div>

              {/* Pending Customer Orders Queue with One-Click QR Verify */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                  <div>
                    <h4 className="font-extrabold text-sm text-slate-900">
                      Tempahan Menunggu Serahan ({(reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').length})
                    </h4>
                    <p className="text-[11px] text-slate-400">Penebusan makanan mahasiswa di kampus PMTG</p>
                  </div>
                  <span className="p-1.5 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold">
                    Menunggu ({(reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').length})
                  </span>
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar">
                  {(reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-bold bg-slate-50 rounded-2xl">
                      Semua tempahan telah diserahkan dan ditebus!
                    </div>
                  ) : (
                    (reservations || []).filter(r => r.status === 'READY_FOR_PICKUP').map(res => (
                      <div key={res.id} className="p-3 bg-amber-50/60 rounded-2xl border border-amber-200 flex items-center justify-between text-xs">
                        <div className="space-y-0.5">
                          <div className="font-extrabold text-slate-900">{res.customerName || 'Mahasiswa'}</div>
                          <div className="text-[11px] text-slate-600">{res.itemTitle} • {res.quantity} pek ({res.merchantName})</div>
                          <div className="font-mono text-[10px] font-bold text-indigo-700">Kod: {res.pickupCode || res.id}</div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setQrCodeInput(res.pickupCode || res.id);
                            onVerifyQrCode(res.pickupCode || res.id).then(r => {
                              if (r && r.success) {
                                setScanResult({
                                  type: 'success',
                                  title: 'Penebusan Berjaya Disahkan!',
                                  message: `Makanan '${res.itemTitle}' telah diserahkan kepada ${res.customerName}.`
                                });
                                confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
                              }
                            });
                          }}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition"
                        >
                          Sahkan Serahan
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Merchant Active Listings Overview */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-extrabold text-sm text-slate-900">Senarai Makanan Aktif Anda ({merchantItems.length})</h4>
                  <span className="text-xs text-slate-400">Penyegerakan masa-nyata</span>
                </div>

                <div className="space-y-2.5 max-h-72 overflow-y-auto custom-scrollbar">
                  {merchantItems.length === 0 ? (
                    <div className="p-4 text-center text-xs text-slate-400 font-bold">
                      Belum ada makanan tersenarai. Gunakan borang di sebelah untuk mula.
                    </div>
                  ) : (
                    merchantItems.map(it => (
                      <div key={it.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-3">
                          <img src={it.image} alt={it.title} className="w-10 h-10 rounded-xl object-cover" />
                          <div>
                            <div className="font-bold text-slate-900">{it.title}</div>
                            <div className="text-[10px] text-slate-400">{it.mode} • RM {safeNum(it.discountedPrice).toFixed(2)}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
                            safeNum(it.remainingQuantity) > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {safeNum(it.remainingQuantity)} / {safeNum(it.quantity)} pek
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 2: MERCHANT ESG PERFORMANCE & CONTRIBUTION ANALYTICS */}
      {activeMerchantTab === 'analytics' && (
        <div className="space-y-8">
          
          {/* Key Impact Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Meals */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-emerald-600">
                <span className="text-xs uppercase font-extrabold tracking-wider">Hidangan Diselamatkan</span>
                <Utensils className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-slate-900">{totalClaimedMeals} Pek</div>
              <p className="text-xs text-slate-500">Daripada {totalListedMeals} pek yang disenaraikan di platform.</p>
            </div>

            {/* Card 2: Food Waste Diverted */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-amber-600">
                <span className="text-xs uppercase font-extrabold tracking-wider">Sisa Organik Dielak</span>
                <Scale className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-amber-700">{totalRescuedKg.toFixed(1)} kg</div>
              <p className="text-xs text-slate-500">Mencegah pembaziran ke tapak pelupusan sisa.</p>
            </div>

            {/* Card 3: GHG CO2 Emissions */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-teal-600">
                <span className="text-xs uppercase font-extrabold tracking-wider">Pelepasan CO₂ Dielak</span>
                <CloudRain className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-teal-700">{totalCo2SavedKg.toFixed(1)} kg</div>
              <p className="text-xs text-slate-500">Faktor penjimatan GHG 2.5 kg CO₂e bagi setiap kg makanan.</p>
            </div>

            {/* Card 4: Revenue & Value */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-indigo-600">
                <span className="text-xs uppercase font-extrabold tracking-wider">Nilai Dijana Semula</span>
                <DollarSign className="w-5 h-5" />
              </div>
              <div className="text-3xl font-black text-indigo-950">
                RM {totalRevenueRecovered.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">Pemulihan kos bahan mentah & jualan makanan lebihan.</p>
            </div>

          </div>

          {/* CSR Recognition Certificate Preview */}
          <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-teal-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center space-x-2 bg-amber-400 text-slate-950 px-3.5 py-1 rounded-full text-xs font-black">
                <Award className="w-4 h-4" />
                <span>Pengiktirafan Sijil Hijau PMTG (PYIC 2026)</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
                Tahniah {currentMerchant.name}! <br />
                <span className="text-emerald-300">Rakan Niaga Lestari & Penyumbang Makanan Komuniti</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Premis anda telah menyumbang secara langsung dalam pencapaian <strong>SDG 2 (Zero Hunger)</strong> dan <strong>SDG 12 (Responsible Consumption)</strong> di kawasan Tasek Gelugor.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center space-y-3 w-full md:w-64">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg">
                ★ {safeNum(currentMerchant.rating, 4.8)}
              </div>
              <div className="font-extrabold text-sm text-white">Penarafan Komuniti</div>
              <div className="text-xs text-emerald-200">{currentMerchant.plan} Verified Partner</div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: PRINTABLE MERCHANT STATEMENT */}
      {activeMerchantTab === 'report' && (
        <div className="space-y-6">
          
          <div className="print:hidden bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
            <div>
              <h3 className="font-black text-base text-slate-900">Penyata Laporan Transaksi & Sumbangan Peniaga</h3>
              <p className="text-xs text-slate-500">Pilih tempoh masa untuk menjana penyata rasmi bagi simpanan akaun atau audit premis.</p>
            </div>

            <div className="flex items-center space-x-3 w-full sm:w-auto">
              <div className="bg-slate-100 p-1 rounded-xl flex space-x-1 border border-slate-200">
                <button
                  onClick={() => setReportPeriod('TODAY')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${reportPeriod === 'TODAY' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
                >
                  Harian
                </button>
                <button
                  onClick={() => setReportPeriod('MONTH')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${reportPeriod === 'MONTH' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
                >
                  Bulanan
                </button>
                <button
                  onClick={() => setReportPeriod('ALL')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${reportPeriod === 'ALL' ? 'bg-white text-slate-900 shadow' : 'text-slate-500'}`}
                >
                  Semua
                </button>
              </div>

              <button
                onClick={() => window.print()}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow transition flex items-center space-x-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-6">
            
            {/* Header */}
            <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
              <div>
                <div className="text-xl font-black text-slate-900 tracking-tight">
                  ZERO<span className="text-emerald-600">LAPAR</span> — PENYATA PRESTASI PENIAGA
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  Premis: <span className="text-base font-black text-slate-900">{currentMerchant.name}</span> ({currentMerchant.category})
                </div>
                <div className="text-[11px] text-slate-500">
                  Alamat: {currentMerchant.address} • Tel: {currentMerchant.phone}
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-extrabold text-slate-900">TEMPOH: {periodLabel.toUpperCase()}</div>
                <div className="text-slate-500 text-[11px]">Tarikh Cetakan: {new Date().toLocaleString('ms-MY')}</div>
                <div className="text-[11px] font-bold text-emerald-700">Pelan: {currentMerchant.plan} Partner</div>
              </div>
            </div>

            {/* Metric Summary Box */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="text-[10px] text-slate-400 font-bold uppercase">Makanan Disenarai</div>
                <div className="text-xl font-black text-slate-900">{filteredMerchantItems.reduce((s, i) => s + safeNum(i.quantity), 0)} Pek</div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-200">
                <div className="text-[10px] text-emerald-800 font-bold uppercase">Makanan Ditebus</div>
                <div className="text-xl font-black text-emerald-900">
                  {filteredMerchantItems.reduce((s, i) => s + Math.max(0, safeNum(i.quantity) - safeNum(i.remainingQuantity)), 0)} Pek
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <div className="text-[10px] text-amber-800 font-bold uppercase">Sisa Dielak (kg)</div>
                <div className="text-xl font-black text-amber-900">
                  {(filteredMerchantItems.reduce((s, i) => s + Math.max(0, safeNum(i.quantity) - safeNum(i.remainingQuantity)), 0) * 0.45).toFixed(1)} kg
                </div>
              </div>
              <div className="bg-indigo-50 p-3 rounded-2xl border border-indigo-200">
                <div className="text-[10px] text-indigo-800 font-bold uppercase">Nilai Dijana Semula</div>
                <div className="text-xl font-black text-indigo-950">
                  RM {(filteredMerchantItems.reduce((s, i) => s + Math.max(0, safeNum(i.quantity) - safeNum(i.remainingQuantity)), 0) * 5).toFixed(2)}
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border border-slate-200 rounded-2xl">
                <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nama Sajian / Menu</th>
                    <th className="p-3">Laluan</th>
                    <th className="p-3">Harga Tawaran</th>
                    <th className="p-3">Kuantiti Asal</th>
                    <th className="p-3">Baki Stok</th>
                    <th className="p-3">Jumlah Ditebus</th>
                    <th className="p-3">Sisa Dielak</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[11px]">
                  {filteredMerchantItems.length === 0 ? (
                    <tr>
                      <td colSpan="8" className="p-8 text-center text-slate-400 font-bold">
                        Tiada rekod sajian makanan bagi tempoh yang dipilih.
                      </td>
                    </tr>
                  ) : (
                    filteredMerchantItems.map(item => {
                      const claimed = Math.max(0, safeNum(item.quantity) - safeNum(item.remainingQuantity));
                      return (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="p-3 font-bold text-slate-900">{item.title}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              item.mode === 'DONATE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {item.mode === 'DONATE' ? 'Donasi (Percuma)' : 'Diskaun (Mampu Milik)'}
                            </span>
                          </td>
                          <td className="p-3 font-bold">
                            {item.mode === 'DONATE' ? 'RM 0.00' : `RM ${safeNum(item.discountedPrice).toFixed(2)}`}
                          </td>
                          <td className="p-3 font-medium">{safeNum(item.quantity)} pek</td>
                          <td className="p-3 font-bold text-slate-700">{safeNum(item.remainingQuantity)} pek</td>
                          <td className="p-3 font-black text-emerald-700">{claimed} pek</td>
                          <td className="p-3 font-medium">{(claimed * safeNum(item.unitWeightKg, 0.45)).toFixed(2)} kg</td>
                          <td className="p-3 font-bold">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                              safeNum(item.remainingQuantity) === 0 ? 'bg-slate-100 text-slate-600' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {safeNum(item.remainingQuantity) === 0 ? 'HABIS DITEBUS' : 'SEDIA DITEMPAH'}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Signature Box */}
            <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
              <div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Pengesahan Peniaga / Pengurus:</div>
                <div className="mt-8 border-b border-slate-400 w-48"></div>
                <div className="font-extrabold text-slate-900 mt-1">{currentMerchant.name}</div>
                <div className="text-[11px] text-slate-500">Rakan Niaga Zero Lapar PMTG</div>
              </div>

              <div className="text-right">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Pengesahan Sistem Penyelaras:</div>
                <div className="mt-8 border-b border-slate-400 w-48 ml-auto"></div>
                <div className="font-extrabold text-slate-900 mt-1">MUHAMMAD FAIZ IKHWAN BIN ISMAIL</div>
                <div className="text-[11px] text-slate-500">Penyelaras Inisiatif PYIC 2026 PMTG</div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* Modal: Upgrade Subscription Plan */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Model Monetisasi B2B SaaS & Langganan (PYIC 2026)
                </span>
                <h3 className="text-xl font-black text-slate-900">Pilih Pelan Rakan Niaga</h3>
              </div>
              <button onClick={() => setShowPlanModal(false)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
                &times;
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border-2 border-slate-200 hover:border-slate-400 transition space-y-3">
                <div className="font-extrabold text-base text-slate-900">Freemium Basic</div>
                <div className="text-2xl font-black text-slate-900">RM 0 <span className="text-xs font-normal text-slate-500">/bulan</span></div>
                <ul className="text-xs text-slate-600 space-y-1.5">
                  <li>✓ Penyenaraian asas makanan lebihan</li>
                  <li>✓ Pengesahan QR Penebusan</li>
                  <li>✓ Komisen platform 5% bagi transaksi diskaun</li>
                </ul>
                <button
                  type="button"
                  onClick={() => { onUpgradePlan(currentMerchant.id, 'Freemium'); setShowPlanModal(false); }}
                  className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl"
                >
                  Pilih Pelan Ini
                </button>
              </div>

              <div className="p-5 rounded-2xl border-2 border-amber-500 bg-amber-50/50 space-y-3">
                <div className="flex justify-between items-center">
                  <div className="font-black text-base text-slate-900">Premium ESG Partner</div>
                  <span className="text-[10px] font-black bg-amber-400 text-slate-950 px-2 py-0.5 rounded-full">POPULAR</span>
                </div>
                <div className="text-2xl font-black text-slate-900">RM 49 <span className="text-xs font-normal text-slate-500">/bulan</span></div>
                <ul className="text-xs text-slate-700 space-y-1.5">
                  <li>✓ Sifar komisen jualan (0% fee)</li>
                  <li>✓ Penyata & Laporan Audit ESG Bulanan</li>
                  <li>✓ Sijil Pengiktirafan Hijau PMTG</li>
                  <li>✓ Keutamaan dalam carian lokasi peta</li>
                </ul>
                <button
                  type="button"
                  onClick={() => { onUpgradePlan(currentMerchant.id, 'Premium'); setShowPlanModal(false); }}
                  className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow"
                >
                  Langgan Pelan Premium
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}