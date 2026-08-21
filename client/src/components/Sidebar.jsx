import zeroLaparLogo from '../assets/logo.png';
import React from 'react';
import { 
  Utensils, 
  Store, 
  HeartHandshake, 
  BarChart3, 
  Presentation, 
  QrCode, 
  LogOut, 
  ShieldCheck,
  Users,
  Award,
  Printer,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  LayoutDashboard,
  PlusCircle,
  Clock,
  Compass
} from 'lucide-react';

export default function Sidebar({ 
  currentUser, 
  adminViewRole, 
  setAdminViewRole,
  merchantActiveTab,
  setMerchantActiveTab,
  consumerActiveTab,
  setConsumerActiveTab,
  isCollapsed,
  setIsCollapsed,
  onOpenProfile,
  onLogout,
  activeTicketsCount,
  onOpenTickets,
  onOpenManual
}) {
  const isAdmin = currentUser?.role === 'admin';
  const isMerchant = currentUser?.role === 'merchant';
  const isConsumer = currentUser?.role === 'consumer';
  const isNgo = currentUser?.role === 'ngo';

  const adminNavSections = [
    {
      groupTitle: 'Pusat Kawalan Pentadbir',
      items: [
        { id: 'admin_dashboard', label: 'Papan ESG', icon: BarChart3, desc: 'Laporan Impak 3-Pillar' },
        { id: 'admin_food', label: 'Urus Makanan', icon: Utensils, badge: 'Edit/Padam', desc: 'Inventori & Stok' },
        { id: 'admin_users', label: 'Urus Pengguna', icon: Users, badge: 'Password', desc: 'Senarai Akaun & Reset' },
        { id: 'admin_merchants', label: 'Laporan Peniaga', icon: Award, badge: 'Ranking', desc: 'Sumbangan & Profil' },
        { id: 'admin_reports', label: 'Laporan Cetak', icon: Printer, badge: 'PDF', desc: 'Aliran Keluar/Masuk' }
      ]
    },
    {
      groupTitle: 'Master Omni-View Portal',
      items: [
        { id: 'consumer', label: 'View Pelajar', icon: Utensils, desc: 'Tempahan & Penebusan' },
        { id: 'merchant', label: 'View Peniaga', icon: Store, desc: 'Penyenaraian Makanan' },
        { id: 'ngo', label: 'View NGO', icon: HeartHandshake, desc: 'Tuntutan Donasi Pukal' },
        { id: 'pitch', label: 'Slaid PYIC 2026', icon: Presentation, badge: 'Khas Admin', desc: 'Pitch Deck & BMC' }
      ]
    }
  ];

  // Merchant Menu - Strictly Merchant Operations Only
  const merchantNavItems = [
    { id: 'manage', label: 'Urus Makanan & QR', icon: Store, desc: 'Senarai & Imbas QR' },
    { id: 'analytics', label: 'Prestasi & Impak', icon: Award, badge: 'ESG', desc: 'Statistik Sumbangan' },
    { id: 'report', label: 'Jana & Cetak Penyata', icon: Printer, badge: 'PDF', desc: 'Penyata Rekod Premis' }
  ];

  const adminDisplayName = isAdmin ? 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL' : (currentUser?.name || 'Pengguna');
  const adminDisplayEmail = isAdmin ? 'faiz@pmtg.edu.my' : (currentUser?.email || '-');

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen bg-slate-900 text-slate-100 border-r border-slate-800 transition-all duration-300 flex flex-col justify-between print:hidden ${
        isCollapsed ? 'w-20' : 'w-64 sm:w-72'
      }`}
    >
      
      {/* Top Header & Official Brand Logo */}
      <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
        {!isCollapsed ? (
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <img 
              src={zeroLaparLogo} 
              alt="Zero Lapar Logo" 
              className="w-11 h-11 object-contain flex-shrink-0 rounded-xl filter drop-shadow" 
            />
            <div className="truncate">
              <div className="flex items-center space-x-1.5">
                <span className="text-sm font-black tracking-tight text-white">
                  ZERO<span className="text-amber-400">LAPAR</span>
                </span>
                <span className="text-[9px] uppercase font-black px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  PYIC 2026
                </span>
              </div>
              <div className="text-[10px] font-semibold text-slate-400 truncate">
                Politeknik METrO TG
              </div>
            </div>
          </div>
        ) : (
          <div className="mx-auto">
            <img 
              src={zeroLaparLogo} 
              alt="Zero Lapar Logo" 
              className="w-10 h-10 object-contain rounded-xl filter drop-shadow" 
            />
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Buka Menu Penuh" : "Kecilkan Menu"}
          className={`p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition ${
            isCollapsed ? 'hidden' : 'block'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      </div>

      {/* Navigation Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-6">
        
        {isCollapsed && (
          <button
            onClick={() => setIsCollapsed(false)}
            title="Buka Menu Penuh"
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl flex items-center justify-center transition"
          >
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        )}

        {/* 1. ADMIN NAVIGATION (With PYIC Slide Tab) */}
        {isAdmin && (
          adminNavSections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              {!isCollapsed && (
                <div className="text-[10px] uppercase font-black tracking-wider text-slate-400 px-3 py-1">
                  {section.groupTitle}
                </div>
              )}

              {section.items.map(item => {
                const Icon = item.icon;
                const isActive = adminViewRole === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setAdminViewRole(item.id)}
                    title={isCollapsed ? `${item.label} (${item.desc})` : ''}
                    className={`w-full flex items-center transition rounded-2xl group ${
                      isCollapsed 
                        ? 'justify-center p-3' 
                        : 'px-3.5 py-2.5 space-x-3 text-left'
                    } ${
                      isActive 
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold shadow-lg shadow-emerald-950/40' 
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                    }`}
                  >
                    <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-300' : 'text-slate-400 group-hover:text-emerald-400'
                    }`} />
                    
                    {!isCollapsed && (
                      <div className="flex-1 min-w-0 flex items-center justify-between">
                        <div className="truncate">
                          <div className="text-xs leading-tight font-bold">{item.label}</div>
                          <div className="text-[10px] text-slate-400/90 font-normal truncate">{item.desc}</div>
                        </div>
                        {item.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ml-2 flex-shrink-0 ${
                            isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))
        )}

        {/* 2. MERCHANT NAVIGATION */}
        {isMerchant && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-black tracking-wider text-amber-400 px-3 py-1">
                Menu Rakan Niaga
              </div>
            )}

            {merchantNavItems.map(item => {
              const Icon = item.icon;
              const isActive = (merchantActiveTab || 'manage') === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setMerchantActiveTab(item.id)}
                  title={isCollapsed ? `${item.label} (${item.desc})` : ''}
                  className={`w-full flex items-center transition rounded-2xl group ${
                    isCollapsed 
                      ? 'justify-center p-3' 
                      : 'px-3.5 py-2.5 space-x-3 text-left'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-950/40' 
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-slate-950' : 'text-amber-400 group-hover:text-amber-300'
                  }`} />
                  
                  {!isCollapsed && (
                    <div className="flex-1 min-w-0 flex items-center justify-between">
                      <div className="truncate">
                        <div className="text-xs leading-tight font-bold">{item.label}</div>
                        <div className="text-[10px] opacity-80 font-normal truncate">{item.desc}</div>
                      </div>
                      {item.badge && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ml-2 flex-shrink-0 ${
                          isActive ? 'bg-slate-950 text-amber-300' : 'bg-slate-800 text-slate-300'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* 3. CONSUMER / STUDENT NAVIGATION */}
        {isConsumer && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-black tracking-wider text-emerald-400 px-3 py-1">
                Menu Pelajar / Pengguna
              </div>
            )}
            <button
              onClick={() => setConsumerActiveTab && setConsumerActiveTab('browse')}
              className="w-full flex items-center bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold rounded-2xl px-3.5 py-2.5 space-x-3 text-left shadow-lg shadow-emerald-950/40"
            >
              <Compass className="w-4 h-4 text-amber-300" />
              {!isCollapsed && <span className="text-xs font-bold">Cari & Tempah Makanan</span>}
            </button>
          </div>
        )}

        {/* 4. NGO NAVIGATION */}
        {isNgo && (
          <div className="space-y-1.5">
            {!isCollapsed && (
              <div className="text-[10px] uppercase font-black tracking-wider text-teal-400 px-3 py-1">
                Menu NGO & Komuniti
              </div>
            )}
            <button
              onClick={() => setConsumerActiveTab && setConsumerActiveTab('ngo')}
              className="w-full flex items-center bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-extrabold rounded-2xl px-3.5 py-2.5 space-x-3 text-left shadow-lg shadow-teal-950/40"
            >
              <HeartHandshake className="w-4 h-4 text-amber-300" />
              {!isCollapsed && <span className="text-xs font-bold">Tuntutan Donasi Pukal</span>}
            </button>
          </div>
        )}

      </div>

      {/* Bottom Profile Area */}
      <div className="p-3 border-t border-slate-800 space-y-2">
        
        {currentUser?.role === 'consumer' && (
          <button
            onClick={onOpenTickets}
            title={isCollapsed ? `Tiket QR Penebusan (${activeTicketsCount} Aktif)` : ''}
            className={`w-full flex items-center bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-2xl transition ${
              isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
            }`}
          >
            <QrCode className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between text-xs font-bold">
                <span>Tiket QR Saya</span>
                {activeTicketsCount > 0 && (
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    {activeTicketsCount}
                  </span>
                )}
              </div>
            )}
          </button>
        )}

        <button
          onClick={onOpenProfile}
          title="Klik untuk kemaskini profil & kata laluan anda"
          className={`w-full flex items-center bg-slate-800/60 hover:bg-slate-800 p-2 rounded-2xl border border-slate-700/60 transition group text-left ${
            isCollapsed ? 'justify-center' : 'space-x-2.5'
          }`}
        >
          <img 
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
            alt={adminDisplayName} 
            className="w-8 h-8 rounded-xl object-cover border border-slate-700 flex-shrink-0 group-hover:ring-2 ring-emerald-400" 
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <div className="text-xs font-extrabold text-white truncate group-hover:text-emerald-300">
                {adminDisplayName}
              </div>
              <div className="text-[10px] text-slate-400 truncate">
                {adminDisplayEmail}
              </div>
            </div>
          )}
        </button>

        <button
          onClick={onLogout}
          title="Log Keluar"
          className={`w-full flex items-center text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 p-2.5 rounded-2xl transition border border-transparent hover:border-rose-900/50 ${
            isCollapsed ? 'justify-center' : 'space-x-2.5 text-xs font-bold'
          }`}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span>Log Keluar</span>}
        </button>

      </div>

    </aside>
  );
}