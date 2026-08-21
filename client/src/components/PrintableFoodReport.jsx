import React, { useState } from 'react';
import { 
  Printer, 
  Calendar, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Filter, 
  CheckCircle2, 
  ArrowUpRight, 
  ArrowDownRight,
  Building,
  Utensils,
  Clock,
  DollarSign
} from 'lucide-react';

const safeNum = (val, fallback = 0) => {
  const n = Number(val);
  return Number.isFinite(n) ? n : fallback;
};

export default function PrintableFoodReport({ 
  items = [], 
  reservations = [], 
  donations = [], 
  merchants = [] 
}) {
  const [periodFilter, setPeriodFilter] = useState('ALL'); // 'TODAY', 'MONTH', 'ALL'

  const todayStr = new Date().toISOString().split('T')[0];
  const currentMonthStr = new Date().toISOString().slice(0, 7); // YYYY-MM

  // Build combined inflow & outflow transaction log safely
  const inflowLogs = (items || []).map(item => {
    const qty = safeNum(item.quantity, 0);
    const weight = (safeNum(item.unitWeightKg, 0.45) * qty).toFixed(2);
    const discPrice = safeNum(item.discountedPrice, 0);
    const priceVal = item.mode === 'DONATE' ? 0 : (discPrice * qty);

    return {
      id: 'in_' + item.id,
      type: 'INFLOW',
      typeLabel: 'MASUK (Penyenaraian)',
      date: item.createdAt ? item.createdAt.split('T')[0] : todayStr,
      timestamp: item.createdAt || new Date().toISOString(),
      title: item.title || 'Sajian Makanan',
      category: item.category || 'Makanan',
      merchantName: item.merchantName || 'Peniaga',
      quantity: qty,
      weightKg: weight,
      mode: item.mode || 'DISCOUNT',
      priceVal: priceVal,
      party: 'Peniaga (' + (item.merchantName || 'Premis') + ')',
      status: safeNum(item.remainingQuantity) === 0 ? 'Habis Ditebus' : ('Aktif (' + safeNum(item.remainingQuantity) + ' pek baki)')
    };
  });

  const outflowReservations = (reservations || []).map(res => {
    const qty = safeNum(res.quantity, 1);
    const weight = (safeNum(res.unitWeightKg, 0.45) * qty).toFixed(2);
    const totalPrice = safeNum(res.totalPrice, 0);

    return {
      id: 'out_res_' + res.id,
      type: 'OUTFLOW',
      typeLabel: 'KELUAR (Penebusan Pelajar)',
      date: res.createdAt ? res.createdAt.split('T')[0] : todayStr,
      timestamp: res.createdAt || new Date().toISOString(),
      title: res.itemTitle || 'Pek Makanan Jimat',
      category: 'Penebusan Diskaun/Donasi',
      merchantName: res.merchantName || 'Peniaga',
      quantity: qty,
      weightKg: weight,
      mode: totalPrice === 0 ? 'DONATE' : 'DISCOUNT',
      priceVal: totalPrice,
      party: (res.customerName || 'Mahasiswa') + ' (' + (res.customerPhone || '-') + ')',
      status: res.status === 'COMPLETED' ? 'Selesai Ditebus' : 'Sedia Diambil'
    };
  });

  const outflowDonations = (donations || [])
    .filter(d => d && (d.status === 'CLAIMED' || d.status === 'DISTRIBUTED'))
    .map(don => {
      const weight = safeNum(don.weightKg, (safeNum(don.quantityMeals, 0) * 0.45)).toFixed(2);

      return {
        id: 'out_don_' + don.id,
        type: 'OUTFLOW',
        typeLabel: 'KELUAR (Donasi Pukal NGO)',
        date: don.claimedAt ? don.claimedAt.split('T')[0] : todayStr,
        timestamp: don.claimedAt || new Date().toISOString(),
        title: don.title || 'Donasi Pukal',
        category: 'Donasi Pukal Komuniti',
        merchantName: don.merchantName || 'Peniaga',
        quantity: safeNum(don.quantityMeals, 0),
        weightKg: weight,
        mode: 'DONATE',
        priceVal: 0,
        party: don.claimedByNgoName || 'Skuad Sukarelawan Siswa PMTG',
        status: 'Diagih ke Mahasiswa B40'
      };
    });

  const allLogs = [...inflowLogs, ...outflowReservations, ...outflowDonations].sort((a, b) => 
    new Date(b.timestamp) - new Date(a.timestamp)
  );

  const filteredLogs = allLogs.filter(log => {
    if (periodFilter === 'TODAY') return log.date === todayStr;
    if (periodFilter === 'MONTH') return log.date.startsWith(currentMonthStr);
    return true;
  });

  const totalInflowMeals = filteredLogs.filter(l => l.type === 'INFLOW').reduce((sum, l) => sum + safeNum(l.quantity), 0);
  const totalInflowWeight = filteredLogs.filter(l => l.type === 'INFLOW').reduce((sum, l) => sum + safeNum(l.weightKg), 0);
  
  const totalOutflowMeals = filteredLogs.filter(l => l.type === 'OUTFLOW').reduce((sum, l) => sum + safeNum(l.quantity), 0);
  const totalOutflowWeight = filteredLogs.filter(l => l.type === 'OUTFLOW').reduce((sum, l) => sum + safeNum(l.weightKg), 0);

  const totalRevenueValue = filteredLogs.reduce((sum, l) => sum + safeNum(l.priceVal), 0);

  const handlePrint = () => {
    window.print();
  };

  const periodLabel = periodFilter === 'TODAY' 
    ? 'Harian (' + todayStr + ')' 
    : periodFilter === 'MONTH' 
    ? 'Bulanan (' + currentMonthStr + ')' 
    : 'Keseluruhan Projek (PYIC 2026)';

  return (
    <div className="space-y-8 pb-16">
      
      {/* Action Header Banner */}
      <div className="print:hidden bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-indigo-400/30">
            <FileText className="w-3.5 h-3.5" />
            <span>Pusat Audit & Pelaporan Makanan Rasmi</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Laporan Makanan Keluar & Masuk
          </h1>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Jana dan cetak penyata pergerakan makanan lebihan harian/bulanan bagi tujuan audit integriti CSR & ESG.
          </p>
        </div>

        {/* Filter Controls & Print Button */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="bg-slate-800 p-1.5 rounded-2xl border border-slate-700 flex space-x-1">
            <button
              onClick={() => setPeriodFilter('TODAY')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                periodFilter === 'TODAY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Harian (Hari Ini)
            </button>

            <button
              onClick={() => setPeriodFilter('MONTH')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                periodFilter === 'MONTH' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Bulanan ({currentMonthStr})
            </button>

            <button
              onClick={() => setPeriodFilter('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                periodFilter === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua Tempoh
            </button>
          </div>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-2xl shadow-lg transition flex items-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet (Standard A4 layout) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200 print:shadow-none print:border-none print:p-0 space-y-6">
        
        {/* Printable Official Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
          <div className="flex items-center space-x-3.5">
            <img src="/logo.png" alt="Zero Lapar" className="w-14 h-14 object-contain" />
            <div>
              <div className="text-xl font-black text-slate-900 tracking-tight">
                ZERO<span className="text-emerald-600">LAPAR</span> PLATFORM (PYIC 2026)
              </div>
              <div className="text-xs font-bold text-slate-600 mt-0.5">
                Politeknik METrO Tasek Gelugor (PMTG), Pulau Pinang
              </div>
              <div className="text-[11px] text-slate-500">
                Penyata Audit Aliran Lebihan Makanan & Penebusan Komuniti
              </div>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-extrabold text-slate-900">TEMPOH: {periodLabel.toUpperCase()}</div>
            <div className="text-slate-500 text-[11px]">Tarikh Cetakan: {new Date().toLocaleString('ms-MY')}</div>
            <div className="text-[11px] font-bold text-indigo-700">Pegawai Pentadbir: MUHAMMAD FAIZ IKHWAN BIN ISMAIL</div>
          </div>
        </div>

        {/* Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Card 1: Inflow */}
          <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 space-y-1">
            <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
              <span className="flex items-center space-x-1">
                <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                <span>Jumlah Makanan Masuk</span>
              </span>
              <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-black">INFLOW</span>
            </div>
            <div className="text-2xl font-black text-emerald-950">{totalInflowMeals} Pek</div>
            <div className="text-[11px] text-emerald-700 font-medium">Est. {totalInflowWeight.toFixed(1)} kg makanan didaftarkan</div>
          </div>

          {/* Card 2: Outflow */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-1">
            <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
              <span className="flex items-center space-x-1">
                <ArrowUpRight className="w-4 h-4 text-amber-600" />
                <span>Jumlah Makanan Keluar</span>
              </span>
              <span className="text-[10px] bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full font-black">OUTFLOW</span>
            </div>
            <div className="text-2xl font-black text-amber-950">{totalOutflowMeals} Pek</div>
            <div className="text-[11px] text-amber-700 font-medium">Est. {totalOutflowWeight.toFixed(1)} kg ditebus / diagih</div>
          </div>

          {/* Card 3: Economic / Recovery */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-1">
            <div className="flex items-center justify-between text-slate-700 text-xs font-bold">
              <span className="flex items-center space-x-1">
                <DollarSign className="w-4 h-4 text-slate-600" />
                <span>Nilai Transaksi & Donasi</span>
              </span>
              <span className="text-[10px] bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full font-black">VALUE</span>
            </div>
            <div className="text-2xl font-black text-slate-900">
              RM {totalRevenueValue.toFixed(2)}
            </div>
            <div className="text-[11px] text-slate-500 font-medium">Nilai pemulihan kos makanan & donasi</div>
          </div>

        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border border-slate-200 rounded-2xl">
            <thead className="bg-slate-100 text-slate-700 uppercase font-black text-[10px] border-b border-slate-200">
              <tr>
                <th className="p-3">Tarikh & Masa</th>
                <th className="p-3">Jenis Aliran</th>
                <th className="p-3">Nama Makanan</th>
                <th className="p-3">Peniaga / Premis</th>
                <th className="p-3">Kuantiti</th>
                <th className="p-3">Laluan</th>
                <th className="p-3">Pihak / Penerima</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-400 font-bold">
                    Tiada rekod aliran makanan bagi tempoh yang dipilih.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-500">{log.date}</td>
                    <td className="p-3 font-bold">
                      <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-md text-[10px] font-black ${
                        log.type === 'INFLOW' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {log.type === 'INFLOW' ? <ArrowDownRight className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                        <span>{log.typeLabel}</span>
                      </span>
                    </td>
                    <td className="p-3 font-bold text-slate-900">{log.title}</td>
                    <td className="p-3 text-slate-700">{log.merchantName}</td>
                    <td className="p-3 font-black text-slate-900">
                      {log.quantity} pek ({log.weightKg} kg)
                    </td>
                    <td className="p-3 font-bold">
                      {log.mode === 'DONATE' ? (
                        <span className="text-emerald-700">Donasi (RM0)</span>
                      ) : (
                        <span className="text-amber-700">Diskaun (RM {safeNum(log.priceVal).toFixed(2)})</span>
                      )}
                    </td>
                    <td className="p-3 text-slate-600">{log.party}</td>
                    <td className="p-3 font-medium text-slate-500">{log.status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Printable Signature & Validation Footer */}
        <div className="pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-xs">
          <div>
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Disediakan Oleh:</div>
            <div className="mt-8 border-b border-slate-400 w-48"></div>
            <div className="font-extrabold text-slate-900 mt-1">MUHAMMAD FAIZ IKHWAN BIN ISMAIL</div>
            <div className="text-[11px] text-slate-500">Penyelaras Inisiatif PYIC 2026 PMTG</div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-bold">Disahkan Oleh:</div>
            <div className="mt-8 border-b border-slate-400 w-48 ml-auto"></div>
            <div className="font-extrabold text-slate-900 mt-1">Jabatan Hal Ehwal Pelajar (HEP)</div>
            <div className="text-[11px] text-slate-500">Politeknik METrO Tasek Gelugor</div>
          </div>
        </div>

      </div>

    </div>
  );
}