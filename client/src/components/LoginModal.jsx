import React, { useState } from 'react';
import { 
  Users, 
  Utensils, 
  Store, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle, 
  Sparkles,
  ArrowRight,
  UserCheck,
  X
} from 'lucide-react';

export default function LoginModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onSelectUser, 
  availableUsers = [] 
}) {
  const [activeTab, setActiveTab] = useState('demo'); // 'demo' or 'custom'
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [customRole, setCustomRole] = useState('consumer');

  if (!isOpen) return null;

  const roleIcons = {
    consumer: Utensils,
    merchant: Store,
    ngo: HeartHandshake,
    admin: ShieldCheck
  };

  const roleColors = {
    consumer: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    merchant: 'bg-amber-50 text-amber-900 border-amber-200',
    ngo: 'bg-teal-50 text-teal-800 border-teal-200',
    admin: 'bg-indigo-50 text-indigo-900 border-indigo-200'
  };

  const handleChooseUser = (u) => {
    onSelectUser(u);
    onClose();
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!customName || !customEmail) return;

    const newUser = {
      id: 'u_' + Date.now(),
      name: customName,
      email: customEmail,
      role: customRole,
      roleLabel: customRole === 'consumer' ? 'Pelajar / Pengguna' : customRole === 'merchant' ? 'Peniaga Makanan' : customRole === 'ngo' ? 'NGO / Sukarelawan' : 'Pentadbir ESG',
      phone: '+6012-3456789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      institution: 'Politeknik METrO Tasek Gelugor'
    };

    onSelectUser(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] flex flex-col animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Sistem Log Masuk Pelbagai Peranan</h3>
              <p className="text-xs text-slate-500">Pangkalan data dikongsi secara masa-nyata untuk semua ID.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
            &times;
          </button>
        </div>

        {/* Current Active Account Indicator */}
        {currentUser && (
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full object-cover border border-slate-300" />
              <div>
                <div className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                  <span>{currentUser.name}</span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                    Akaun Aktif
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">{currentUser.roleLabel} • {currentUser.email}</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex space-x-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            onClick={() => setActiveTab('demo')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'demo' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Pilih Profil Demo Sedia Ada (Satu Klik)</span>
          </button>

          <button
            onClick={() => setActiveTab('custom')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'custom' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Daftar / Log Masuk ID Baru</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
          {activeTab === 'demo' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableUsers.map((u) => {
                const Icon = roleIcons[u.role] || Users;
                const isSelected = currentUser?.id === u.id;
                const badgeColor = roleColors[u.role] || 'bg-slate-100 text-slate-800 border-slate-200';

                return (
                  <button
                    key={u.id}
                    onClick={() => handleChooseUser(u)}
                    className={`p-4 rounded-2xl border text-left transition flex flex-col justify-between group hover:shadow-md ${
                      isSelected 
                        ? 'border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/30' 
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="flex items-center space-x-3">
                        <img src={u.avatar} alt={u.name} className="w-11 h-11 rounded-xl object-cover" />
                        <div>
                          <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-700 transition">
                            {u.name}
                          </h4>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border inline-block mt-0.5 ${badgeColor}`}>
                            {u.roleLabel}
                          </span>
                        </div>
                      </div>
                      <Icon className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition flex-shrink-0" />
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 w-full">
                      <span>{u.email}</span>
                      <span className="font-bold text-emerald-600 flex items-center space-x-0.5">
                        <span>Log Masuk</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <form onSubmit={handleCustomLogin} className="space-y-4 p-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh:</label>
                <input
                  type="text"
                  placeholder="cth: Ahmad Zulkifli / Restoran Nelayan"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Email:</label>
                <input
                  type="email"
                  placeholder="cth: ahmad@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Peranan (Role):</label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                >
                  <option value="consumer">Pelajar / Pengguna (Beli Makanan Murah / Mohon Donasi)</option>
                  <option value="merchant">Peniaga Makanan (Senaraikan Lebihan & Sahkan Serahan)</option>
                  <option value="ngo">NGO & Sukarelawan (Ambil Donasi Pukal & Agih ke Komuniti)</option>
                  <option value="admin">Pentadbir Tadbir Urus ESG & Hab Institusi</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-lg transition"
              >
                Log Masuk Sebagai ID Baharu
              </button>
            </form>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-center text-xs text-slate-500 font-medium">
          💡 <strong>Pangkalan Data Bersepadu:</strong> Sebarang kemaskini oleh Peniaga akan terus kelihatan kepada Pelajar & NGO, dan tempahan Pelajar akan terus mengemaskini stok dan nilai ESG masa-nyata!
        </div>

      </div>
    </div>
  );
}