import React from 'react';
import { 
  BookOpen,
  Utensils, 
  Store, 
  HeartHandshake, 
  BarChart3, 
  Presentation, 
  QrCode, 
  LogOut, 
  ShieldCheck,
  UserCheck,
  Users,
  Award,
  Printer,
  Menu
} from 'lucide-react';

export default function Navbar({ 
  currentUser, 
  activeTicketsCount, 
  onOpenTickets, 
  onLogout,
  onOpenProfile,
  adminViewRole,
  isCollapsed,
  setIsCollapsed,
  onOpenManual
}) {
  const roleBadges = {
    consumer: { label: 'Portal Pelajar / Pengguna', icon: Utensils, color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
    merchant: { label: 'Portal Peniaga Makanan', icon: Store, color: 'bg-amber-100 text-amber-900 border-amber-200' },
    ngo: { label: 'Portal NGO & Sukarelawan', icon: HeartHandshake, color: 'bg-teal-100 text-teal-900 border-teal-200' },
    admin: { label: 'Akses Pentadbir Utama', icon: ShieldCheck, color: 'bg-indigo-100 text-indigo-900 border-indigo-200' }
  };

  const pageTitles = {
    manage: { title: 'Pengurusan Makanan & Pengesahan QR', sub: 'Senaraikan lebihan sajian dan sahkan tiket penebusan' },
    analytics: { title: 'Prestasi & Impak Sumbangan Peniaga', sub: 'Statistik sisa diselamatkan dan sijil pengiktirafan hijau' },
    report: { title: 'Penyata Rekod Transaksi Premis', sub: 'Penyata rasmi jualan dan sumbangan makanan peniaga' },
    browse: { title: 'Portal Pelajar & Pengguna', sub: 'Cari makanan lebihan lazat pada harga diskaun atau donasi' },
    admin_dashboard: { title: 'Papan Impak ESG (3-Pillar)', sub: 'Laporan ESG, CSR & Metrik SDG 2 & 12' },
    admin_food: { title: 'Pengurusan Makanan & Tawaran', sub: 'Sunting harga, baki stok, dan status sajian' },
    admin_users: { title: 'Pengurusan Pengguna & Reset Password', sub: 'Senarai akaun berdaftar & kemaskini kata laluan' },
    admin_merchants: { title: 'Laporan Prestasi & Sumbangan Peniaga', sub: 'Kedudukan peniaga paling banyak menyumbang' },
    admin_reports: { title: 'Laporan Makanan Keluar & Masuk', sub: 'Penyata audit harian dan bulanan sedia dicetak (PDF)' },
    consumer: { title: 'Portal Pelajar & Pengguna', sub: 'Tempah makanan diskaun atau pohon donasi percuma' },
    merchant: { title: 'Portal Rakan Niaga Makanan', sub: 'Senaraikan makanan lebihan & sahkan tiket QR' },
    ngo: { title: 'Portal Sukarelawan & NGO', sub: 'Tuntut donasi pukal untuk agihan mahasiswa B40' },
    pitch: { title: 'Slaid Pembentangan PYIC 2026', sub: 'Pitch Deck & Business Model Canvas (BMC)' }
  };

  const isAdmin = currentUser?.role === 'admin';
  const currentBadge = currentUser ? roleBadges[currentUser.role] || roleBadges.consumer : roleBadges.consumer;
  const activePage = pageTitles[adminViewRole] || { title: 'Zero Lapar Platform', sub: 'Less Waste. More Meals. More Impact.' };

  const adminDisplayName = isAdmin ? 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL' : currentUser?.name;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm print:hidden">
      <div className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Sidebar Toggle + Current Page Title */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
              title="Togol Menu Sebelah Kiri"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-base font-black text-slate-900 leading-tight">
                {activePage.title}
              </h2>
              <p className="text-[11px] text-slate-500 hidden sm:block">
                {activePage.sub}
              </p>
            </div>
          </div>

          {/* Right Action: Role Badge, Tickets & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Role Badge */}
            <div className={`hidden md:flex items-center space-x-1.5 px-3 py-1 rounded-xl border text-xs font-black shadow-sm ${currentBadge.color}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{isAdmin ? 'Pentadbir Utama PMTG' : currentBadge.label}</span>
            </div>

            {/* Tickets QR */}
            {currentUser?.role === 'consumer' && (
              <button
                onClick={onOpenTickets}
                className="relative flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span className="hidden sm:inline">Tiket QR</span>
                {activeTicketsCount > 0 && (
                  <span className="bg-emerald-600 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse">
                    {activeTicketsCount}
                  </span>
                )}
              </button>
            )}

            {/* Manual Button */}
            <button
              onClick={onOpenManual}
              className="flex items-center space-x-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
              title="Buka Panduan Manual Pengguna"
            >
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span className="hidden sm:inline">Manual</span>
            </button>

            {/* Profile Avatar Button */}
            <button
              onClick={onOpenProfile}
              title="Kemaskini Profil Diri"
              className="flex items-center space-x-2 bg-slate-50 hover:bg-slate-100 p-1.5 pr-2.5 rounded-xl border border-slate-200 transition group"
            >
              <img 
                src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
                alt={adminDisplayName} 
                className="w-7 h-7 rounded-lg object-cover border border-slate-200 group-hover:ring-2 ring-emerald-500" 
              />
              <span className="hidden lg:inline text-xs font-extrabold text-slate-800 truncate max-w-[130px]">
                {adminDisplayName}
              </span>
            </button>

          </div>
        </div>
      </div>
    </header>
  );
}