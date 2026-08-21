import { QRCodeSVG } from 'qrcode.react';
import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Package, 
  MapPin, 
  CheckCircle2, 
  Truck, 
  Users, 
  Sparkles,
  Building2,
  Clock,
  ShieldCheck,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function NgoPortal({ 
  items = [], 
  donations = [], 
  dropoffPoints = [], 
  ngos = [],
  onClaimDonation
}) {
  const currentNgo = ngos[1] || ngos[0] || {
    id: 'ngo_2',
    name: 'Skuad Sukarelawan Siswa PMTG',
    personInCharge: 'Faiz Ikhwan & Aishvini',
    activeVolunteers: 35,
    totalDistributedMeals: 2180
  };

  const [selectedHub, setSelectedHub] = useState('Zero Lapar Hub - Politeknik METrO Tasek Gelugor (PMTG)');
  const [claimSuccessMsg, setClaimSuccessMsg] = useState('');

  // Bulk Donated Items available
  const availableDonationItems = items.filter(i => i.mode === 'DONATE' && i.remainingQuantity > 0);

  const handleClaim = (item) => {
    onClaimDonation({
      itemId: item.id,
      ngoId: currentNgo.id,
      destinationHub: selectedHub
    });
    setClaimSuccessMsg(`Tuntutan berjaya! Batch '${item.title}' ditugaskan kepada ${currentNgo.name}.`);
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.7 } });
    setTimeout(() => setClaimSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-10 pb-16">
      
      {/* NGO Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-500/20 text-teal-300 flex items-center justify-center border border-teal-400/30">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-2xl font-black">{currentNgo.name}</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-500/30 text-teal-200 border border-teal-400/30">
                NGO Rakan Sah
              </span>
            </div>
            <p className="text-xs text-teal-200/80 mt-1">
              Ketua Operasi: {currentNgo.personInCharge} • {currentNgo.activeVolunteers} Sukarelawan Berdaftar
            </p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-right">
          <div className="text-xs text-teal-200 font-medium">Jumlah Agihan Makanan</div>
          <div className="text-2xl font-black text-white">{currentNgo.totalDistributedMeals?.toLocaleString()} Pek</div>
        </div>
      </div>

      {claimSuccessMsg && (
        <div className="bg-emerald-100 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{claimSuccessMsg}</span>
        </div>
      )}

      {/* Section 1: Bulk Surplus Food Available For NGOs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-extrabold text-emerald-600 tracking-wider">
              Laluan Donasi Pukal (Bulk Redistribution)
            </span>
            <h3 className="text-xl font-black text-slate-900">
              Makanan Donasi Sedia Diambil Oleh NGO
            </h3>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full">
            {availableDonationItems.length} Batch Sedia Ada
          </span>
        </div>

        {availableDonationItems.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-500 text-xs">
            Tiada batch donasi pukal baharu pada masa ini. Sila semak semula sebentar lagi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {availableDonationItems.map(item => (
              <div key={item.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 hover:shadow-md transition bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-extrabold bg-emerald-600 text-white px-2 py-0.5 rounded">
                      DONASI 100% PERCUMA
                    </span>
                    <h4 className="font-bold text-slate-900 text-base mt-1.5">{item.title}</h4>
                    <p className="text-xs text-slate-500 font-medium">Dari: {item.merchantName}</p>
                  </div>
                  <img src={item.image} alt={item.title} className="w-16 h-16 rounded-xl object-cover" />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-white p-3 rounded-xl border border-slate-100">
                  <div>
                    <span className="text-slate-400">Kuantiti Batch:</span>
                    <div className="font-extrabold text-slate-900">{item.remainingQuantity} pek</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Anggaran Berat:</span>
                    <div className="font-extrabold text-slate-900">{(item.unitWeightKg * item.remainingQuantity).toFixed(1)} kg</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Waktu Ambil:</span>
                    <div className="font-bold text-emerald-700">{item.pickupWindow}</div>
                  </div>
                  <div>
                    <span className="text-slate-400">Impak Penerima:</span>
                    <div className="font-bold text-slate-900">~{item.remainingQuantity} Mahasiswa / Asnaf</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-bold text-slate-600">Pilih Hub Destinasi Agihan:</label>
                  <select
                    value={selectedHub}
                    onChange={(e) => setSelectedHub(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                  >
                    {dropoffPoints.map(dp => (
                      <option key={dp.id} value={dp.name}>{dp.name}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => handleClaim(item)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition shadow flex items-center justify-center space-x-1.5"
                >
                  <Truck className="w-4 h-4" />
                  <span>Tuntut Batch Ini Untuk Agihan Komuniti</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Section 2: Zero Lapar Drop-Off Points Network */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div>
          <span className="text-xs uppercase font-extrabold text-amber-600 tracking-wider">
            Infrastruktur Komuniti
          </span>
          <h3 className="text-xl font-black text-slate-900">
            Rangkaian Zero Lapar Drop-Off Points & Chiller Lockers
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Lokasi pusat pengumpulan berpusat untuk memudahkan peniaga meletakkan makanan dan NGO/pelajar mengambilnya.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {dropoffPoints.map(dp => {
            const occupancyPercent = Math.round((dp.currentOccupancy / dp.capacity) * 100);
            return (
              <div key={dp.id} className="border border-slate-200 rounded-2xl p-5 space-y-4 bg-slate-50/60">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{dp.name}</h4>
                    <span className="text-[11px] text-amber-700 font-semibold">{dp.type}</span>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-1">
                  <div>📍 <strong>Alamat:</strong> {dp.address}</div>
                  <div>⏰ <strong>Waktu Operasi:</strong> {dp.operatingHours}</div>
                  <div>👤 <strong>Pegawai:</strong> {dp.contactPerson}</div>
                </div>

                {/* Capacity Bar */}
                <div className="space-y-1.5 pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-xs font-bold text-slate-700">
                    <span>Status Kapasiti:</span>
                    <span>{dp.currentOccupancy} / {dp.capacity} pek ({occupancyPercent}%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                      style={{ width: `${occupancyPercent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 3: Distribution History Logs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <h3 className="text-lg font-black text-slate-900">Log Misi Agihan NGO Terkini</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
              <tr>
                <th className="p-3">ID Misi</th>
                <th className="p-3">Makanan & Sumber</th>
                <th className="p-3">Kuantiti</th>
                <th className="p-3">Hub Agihan</th>
                <th className="p-3">Kesan Penerima</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {donations.map(d => (
                <tr key={d.id} className="hover:bg-slate-50">
                  <td className="p-3 font-mono font-bold text-emerald-800">{d.qrCode || d.id}</td>
                  <td className="p-3 font-semibold text-slate-900">
                    {d.itemTitle}
                    <div className="text-[11px] text-slate-400 font-normal">Dari: {d.merchantName}</div>
                  </td>
                  <td className="p-3 font-bold">{d.quantity} pek ({d.rescuedKg} kg)</td>
                  <td className="p-3 text-slate-600">{d.destinationHub}</td>
                  <td className="p-3 font-bold text-emerald-700">~{d.peopleImpacted} orang dibantu</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-teal-100 text-teal-800">
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}