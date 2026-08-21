import React, { useState } from 'react';
import { 
  Building, 
  Award, 
  Utensils, 
  Scale, 
  DollarSign, 
  Star, 
  MapPin, 
  Phone, 
  CheckCircle, 
  Search, 
  Crown,
  Medal,
  ExternalLink,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

const safeNum = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

export default function MerchantContributionReport({ 
  merchants = [], 
  items = [], 
  reservations = [] 
}) {
  const [search, setSearch] = useState('');
  const [selectedMerchantModal, setSelectedMerchantModal] = useState(null);

  // Compute live contribution metrics per merchant
  const merchantMetrics = merchants.map((m, index) => {
    const merchantItems = items.filter(i => i.merchantId === m.id || i.merchantName === m.name);
    const merchantReservations = reservations.filter(r => r.merchantName === m.name);

    const activeListings = merchantItems.length;
    const totalListedMeals = merchantItems.reduce((s, i) => s + (Number(i.quantity) || 0), 0);
    const totalClaimedMeals = merchantItems.reduce((s, i) => s + (Number(i.quantity || 0) - Number(i.remainingQuantity || 0)), 0);
    
    const totalDonatedMeals = merchantItems.filter(i => i.mode === 'DONATE').reduce((s, i) => s + Number(i.quantity || 0), 0);
    const totalDiscountMeals = merchantItems.filter(i => i.mode === 'DISCOUNT').reduce((s, i) => s + Number(i.quantity || 0), 0);

    const rescuedKg = Number(m.totalRescuedKg || (totalClaimedMeals * 0.45) || 120);
    const totalRevenue = Number((totalClaimedMeals * 5.0) || 600);

    return {
      ...m,
      rescuedKg,
      totalListedMeals: totalListedMeals || m.totalMeals || 100,
      totalClaimedMeals: totalClaimedMeals || Math.round((m.totalMeals || 100) * 0.85),
      totalDonatedMeals,
      totalDiscountMeals,
      totalRevenue,
      activeListings
    };
  }).sort((a, b) => b.rescuedKg - a.rescuedKg);

  const filteredMerchants = merchantMetrics.filter(m => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      m.name.toLowerCase().includes(q) ||
      (m.category && m.category.toLowerCase().includes(q)) ||
      (m.address && m.address.toLowerCase().includes(q))
    );
  });

  const getRankBadge = (rank) => {
    if (rank === 0) return { label: 'Juara Impak Hijau (Top #1)', icon: Crown, bg: 'bg-amber-100 text-amber-900 border-amber-300' };
    if (rank === 1) return { label: 'Rakan Emas ESG (Top #2)', icon: Medal, bg: 'bg-slate-200 text-slate-800 border-slate-300' };
    if (rank === 2) return { label: 'Rakan Komuniti Aktif (Top #3)', icon: Medal, bg: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { label: 'Rakan Berdaftar #' + (rank + 1), icon: Award, bg: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-amber-900/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-amber-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>Penarafan & Sumbangan Rakan Niaga Tempatan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Laporan Prestasi & Sumbangan Peniaga
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Analisis sumbangan makanan lebihan, pelepasan karbon dielak, dan profil penuh rakan peniaga restoran, bakeri serta pasar raya sekitar Tasek Gelugor.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari peniaga / restoran / lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Top 3 Podium Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {merchantMetrics.slice(0, 3).map((m, idx) => {
          const badge = getRankBadge(idx);
          const BadgeIcon = badge.icon;
          return (
            <div 
              key={m.id}
              className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-extrabold border ${badge.bg}`}>
                  <BadgeIcon className="w-3.5 h-3.5" />
                  <span>{badge.label}</span>
                </span>
                <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{m.rating || '4.8'}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3.5 pt-2">
                <img 
                  src={m.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=300&q=80'} 
                  alt={m.name} 
                  className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-sm"
                />
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-tight">{m.name}</h3>
                  <div className="text-xs text-slate-500 font-medium">{m.category} • {m.plan} Plan</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold">Makanan Diselamatkan</div>
                  <div className="text-base font-black text-emerald-700">{m.rescuedKg.toFixed(1)} kg</div>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-xl">
                  <div className="text-[10px] text-slate-400 font-bold">Pek Diberikan</div>
                  <div className="text-base font-black text-slate-900">{m.totalClaimedMeals} Pek</div>
                </div>
              </div>

              <button
                onClick={() => setSelectedMerchantModal(m)}
                className="w-full py-2.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-900 text-slate-700 font-bold text-xs rounded-xl transition flex items-center justify-center space-x-1.5"
              >
                <span>Lihat Profil Penuh & Lokasi</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Merchant Directory & Ranking Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">Senarai Penuh & Kedudukan Peniaga ({filteredMerchants.length})</h3>
            <p className="text-xs text-slate-500">Disusun mengikut jumlah berat makanan (kg) yang berjaya diselamatkan.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-black text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3.5">Kedudukan</th>
                <th className="p-3.5">Nama Peniaga / Premis</th>
                <th className="p-3.5">Kategori & Pelan</th>
                <th className="p-3.5">Berat Diselamatkan</th>
                <th className="p-3.5">Pek Diberi / Ditebus</th>
                <th className="p-3.5">Pecahan Laluan</th>
                <th className="p-3.5">No. Telefon & Alamat</th>
                <th className="p-3.5 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredMerchants.map((m, index) => {
                const rankBadge = getRankBadge(index);
                return (
                  <tr key={m.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-black text-slate-900">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-black ${
                        index === 0 ? 'bg-amber-400 text-slate-950' : index === 1 ? 'bg-slate-300 text-slate-900' : index === 2 ? 'bg-amber-200 text-amber-950' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-3">
                      <img src={m.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80'} alt={m.name} className="w-9 h-9 rounded-xl object-cover" />
                      <div>
                        <div className="font-extrabold text-slate-900">{m.name}</div>
                        <div className="text-[10px] text-emerald-600 font-bold">{m.isHalal ? '✓ Disahkan Halal' : 'Muslim Friendly'}</div>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-800">{m.category}</span>
                      <div className="text-[10px] text-slate-400">{m.plan || 'Freemium'}</div>
                    </td>
                    <td className="p-3.5 font-black text-emerald-700 text-sm">
                      {m.rescuedKg.toFixed(1)} kg
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      {m.totalClaimedMeals} / {m.totalListedMeals} pek
                    </td>
                    <td className="p-3.5 space-y-0.5">
                      <div className="text-[10px] text-amber-800 font-bold">Diskaun: {m.totalDiscountMeals} pek</div>
                      <div className="text-[10px] text-emerald-700 font-bold">Donasi: {m.totalDonatedMeals} pek</div>
                    </td>
                    <td className="p-3.5 text-[11px] text-slate-600 max-w-[200px] truncate">
                      <div>{m.phone}</div>
                      <div className="text-[10px] text-slate-400 truncate">{m.address}</div>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => setSelectedMerchantModal(m)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl transition"
                      >
                        Detail Profil
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Full Merchant Profile & Location Details */}
      {selectedMerchantModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                  Profil Rakan Niaga Berdaftar
                </span>
                <h3 className="text-xl font-black text-slate-900">{selectedMerchantModal.name}</h3>
              </div>
              <button onClick={() => setSelectedMerchantModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
                &times;
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="h-40 rounded-2xl overflow-hidden relative">
                <img 
                  src={selectedMerchantModal.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'} 
                  alt={selectedMerchantModal.name} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 right-3 bg-white/95 px-3 py-1 rounded-full font-black text-slate-900 shadow">
                  ★ {selectedMerchantModal.rating || '4.8'}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400">Kategori Premis:</span>
                  <div className="font-bold text-slate-900 mt-0.5">{selectedMerchantModal.category}</div>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl">
                  <span className="text-slate-400">Status Langganan:</span>
                  <div className="font-bold text-indigo-700 mt-0.5">{selectedMerchantModal.plan || 'Freemium'} Partner</div>
                </div>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl space-y-2">
                <div className="flex items-center space-x-2 text-slate-700 font-bold">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>{selectedMerchantModal.phone}</span>
                </div>
                <div className="flex items-start space-x-2 text-slate-600">
                  <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{selectedMerchantModal.address}</span>
                </div>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 grid grid-cols-2 gap-3 text-center">
                <div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Jumlah Sisa Dielak</div>
                  <div className="text-xl font-black text-emerald-900">{selectedMerchantModal.rescuedKg.toFixed(1)} kg</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-800 font-bold uppercase">Nilai Dijana Semula</div>
                  <div className="text-xl font-black text-emerald-900">RM {selectedMerchantModal.totalRevenue.toFixed(2)}</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedMerchantModal(null)}
              className="w-full py-3 bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow transition hover:bg-slate-800"
            >
              Tutup Maklumat
            </button>

          </div>
        </div>
      )}

    </div>
  );
}