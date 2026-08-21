import zeroLaparLogo from '../assets/logo.png';
import React, { useState } from 'react';
import { 
  Lock, 
  Utensils, 
  Store, 
  HeartHandshake, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  AlertCircle, 
  KeyRound, 
  Mail,
  LogIn,
  UserPlus
} from 'lucide-react';

const defaultSeedUsers = [
  {
    id: 'u_student_1',
    name: 'Mohd Danial (Pelajar DIT PMTG)',
    email: 'danial@pmtg.edu.my',
    role: 'consumer',
    roleLabel: 'Pelajar / Pengguna (DIT PMTG)',
    phone: '+6018-2948192',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    institution: 'Politeknik METrO Tasek Gelugor'
  },
  {
    id: 'u_merchant_1',
    name: 'Restoran Selera Kampus',
    merchantName: 'Restoran Selera Kampus',
    merchantId: 'm_1',
    email: 'selera@pmtg.edu.my',
    role: 'merchant',
    roleLabel: 'Peniaga Makanan (Selera Kampus)',
    phone: '+6012-3456789',
    avatar: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=150&q=80',
    institution: 'Politeknik METrO Tasek Gelugor'
  },
  {
    id: 'u_ngo_1',
    name: 'Persatuan Sukarelawan FoodBank Tasek Gelugor',
    email: 'ngo@pmtg.edu.my',
    role: 'ngo',
    roleLabel: 'NGO & Sukarelawan Makanan',
    phone: '+6019-3344556',
    avatar: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=150&q=80',
    institution: 'Politeknik METrO Tasek Gelugor'
  }
];

export default function LoginPage({ onLoginSuccess, onOpenManual }) {
  const [selectedTab, setSelectedTab] = useState('login'); // 'login', 'admin', 'register'
  
  // Email Login State (Blank)
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  // Admin Login State (COMPLETELY BLANK - NO PREFILL / NO MEMORY)
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regRole, setRegRole] = useState('consumer');
  const [regPhone, setRegPhone] = useState('');
  const [regError, setRegError] = useState('');

  // Helper to get all registered users
  const getRegisteredUsers = () => {
    try {
      const saved = localStorage.getItem('zerolapar_registered_users');
      const custom = saved ? JSON.parse(saved) : [];
      return [...custom, ...defaultSeedUsers];
    } catch (e) {
      return defaultSeedUsers;
    }
  };

  // Helper to save registered user
  const saveRegisteredUser = (user) => {
    try {
      const saved = localStorage.getItem('zerolapar_registered_users');
      const list = saved ? JSON.parse(saved) : [];
      const updated = [user, ...list.filter(u => u.email !== user.email)];
      localStorage.setItem('zerolapar_registered_users', JSON.stringify(updated));
    } catch (e) {}
  };

  // Handle Direct Email Login
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    setLoginError('');
    setLoading(true);

    const emailClean = loginEmail.trim().toLowerCase();

    // 1. Check Local Persistent Registry
    const allUsers = getRegisteredUsers();
    const found = allUsers.find(u => u.email && u.email.toLowerCase() === emailClean);

    if (found) {
      setLoading(false);
      onLoginSuccess(found);
      return;
    }

    // 2. Try Server API if online
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && data.user) {
          saveRegisteredUser(data.user);
          onLoginSuccess(data.user);
          return;
        }
      }
    } catch (err) {}

    setLoginError('Emel [' + loginEmail + '] belum didaftarkan. Sila klik tab \'Daftar Baru\' untuk mendaftar.');
    setLoading(false);
  };

  // Admin Login (Requires manual entry of admin / admin123)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    setLoading(true);

    const u = adminUsername.trim();
    const p = adminPassword.trim();

    if (!u || !p) {
      setAdminError('Sila masukkan ID Pengguna dan Kata Laluan Pentadbir.');
      setLoading(false);
      return;
    }

    if (u === 'admin' && p === 'admin123') {
      const adminUser = {
        id: 'u_admin',
        username: 'admin',
        name: 'MUHAMMAD FAIZ IKHWAN BIN ISMAIL',
        role: 'admin',
        roleLabel: 'Penyelaras Zero Lapar PMTG (Pentadbir Utama)',
        email: 'faiz@pmtg.edu.my',
        phone: '+6019-8877665',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        institution: 'Politeknik METrO Tasek Gelugor'
      };
      onLoginSuccess(adminUser);
    } else {
      setAdminError('ID Pengguna atau Kata Laluan Pentadbir tidak sah!');
    }
    setLoading(false);
  };

  // Register New User
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setRegError('Sila isikan nama penuh dan alamat emel.');
      return;
    }

    setRegError('');
    setLoading(true);

    const emailClean = regEmail.trim().toLowerCase();
    const newId = 'u_' + Date.now();

    const newUser = {
      id: newId,
      name: regName.trim(),
      email: emailClean,
      role: regRole,
      merchantId: regRole === 'merchant' ? ('m_' + Date.now()) : undefined,
      merchantName: regRole === 'merchant' ? regName.trim() : undefined,
      roleLabel: regRole === 'consumer' ? 'Pelajar / Pengguna' : regRole === 'merchant' ? 'Peniaga Makanan' : 'NGO / Sukarelawan',
      phone: regPhone.trim() || '+6012-3456789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      institution: 'Politeknik METrO Tasek Gelugor'
    };

    // Save into persistent local registry
    saveRegisteredUser(newUser);

    // If registered as merchant, create merchant profile in shared merchants list
    if (regRole === 'merchant') {
      try {
        const savedMerchants = localStorage.getItem('zerolapar_shared_merchants');
        const mList = savedMerchants ? JSON.parse(savedMerchants) : [];
        const newMerchant = {
          id: newUser.merchantId,
          name: newUser.name,
          category: 'Restaurant / Kafe',
          address: 'Kampus PMTG / Sekitar Tasek Gelugor',
          phone: newUser.phone,
          rating: 5.0,
          totalReviews: 1,
          plan: 'Premium',
          isHalal: true,
          image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
        };
        localStorage.setItem('zerolapar_shared_merchants', JSON.stringify([newMerchant, ...mList]));
      } catch (e) {}
    }

    // Also send to backend API if online
    try {
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
    } catch (err) {}

    setLoading(false);
    onLoginSuccess(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 flex flex-col justify-center items-center p-4 sm:p-6 text-slate-900">
      
      {/* Brand Header */}
      <div className="text-center text-white space-y-2 mb-8 max-w-lg">
        <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold border border-emerald-400/30">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Politeknik METrO Tasek Gelugor (PYIC 2026)</span>
        </div>

        <div className="flex items-center justify-center pt-2">
          <img 
            src={zeroLaparLogo} 
            alt="Zero Lapar - Less Waste. More Meals. More Impact." 
            className="w-48 sm:w-56 h-auto object-contain filter drop-shadow-xl hover:scale-105 transition-transform" 
          />
        </div>

        <p className="text-xs sm:text-sm text-emerald-100/80 font-medium">
          Log Masuk Sistem Pengagihan Makanan Lebihan PMTG
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 border border-slate-200 animate-in fade-in zoom-in duration-200">
        
        {/* Navigation Tabs */}
        <div className="flex space-x-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => { setSelectedTab('login'); setLoginError(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              selectedTab === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <LogIn className="w-4 h-4 text-emerald-600" />
            <span>Log Masuk</span>
          </button>

          <button
            onClick={() => { setSelectedTab('admin'); setAdminError(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              selectedTab === 'admin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Lock className="w-4 h-4 text-amber-500" />
            <span>Pentadbir</span>
          </button>

          <button
            onClick={() => { setSelectedTab('register'); setRegError(''); }}
            className={`flex-1 py-2.5 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              selectedTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4 text-teal-600" />
            <span>Daftar Baru</span>
          </button>
        </div>

        {/* TAB 1: DIRECT EMAIL LOGIN (BLANK INPUT) */}
        {selectedTab === 'login' && (
          <form onSubmit={handleEmailLoginSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-lg text-slate-800">
                Log Masuk Akaun Anda
              </h3>
              <p className="text-xs text-slate-500">
                Masukkan emel berdaftar untuk membuka portal peranan anda.
              </p>
            </div>

            {loginError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{loginError}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Alamat Emel:
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="cth: azrul@pmtg.edu.my"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold rounded-2xl text-xs transition shadow-lg shadow-emerald-700/20 flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memproses...' : 'Log Masuk'}</span>
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setSelectedTab('register')}
                className="text-xs text-slate-500 hover:text-emerald-700 font-medium transition"
              >
                Belum mempunyai akaun? <span className="font-bold text-emerald-700 underline">Daftar Baru di sini</span>
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: SECURE ADMIN LOGIN */}
        {selectedTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="inline-flex items-center space-x-1 bg-amber-50 text-amber-700 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-amber-200 mb-1">
                <KeyRound className="w-3.5 h-3.5" />
                <span>Mod Pentadbir Keselamatan Tinggi</span>
              </div>
              <h3 className="font-extrabold text-lg text-slate-800">
                Pusat Tadbir Urus Pentadbir PMTG
              </h3>
              <p className="text-xs text-slate-500">
                Sila masukkan ID Pengguna dan Kata Laluan Pentadbir.
              </p>
            </div>

            {adminError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{adminError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  ID Pengguna Pentadbir:
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Masukkan ID Pentadbir (cth: admin)"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Kata Laluan Pentadbir:
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-extrabold rounded-2xl text-xs transition shadow-lg shadow-amber-700/20 flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{loading ? 'Mengesahkan...' : 'Buka Papan Kawalan Admin'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER NEW USER */}
        {selectedTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="text-center space-y-1">
              <h3 className="font-extrabold text-lg text-slate-800">
                Daftar Akaun Baharu
              </h3>
              <p className="text-xs text-slate-500">
                Pilih peranan anda dan mulakan ekosistem Zero Lapar.
              </p>
            </div>

            {regError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{regError}</span>
              </div>
            )}

            {/* Role Radio Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRegRole('consumer')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  regRole === 'consumer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Utensils className="w-4 h-4 text-emerald-600" />
                <span className="text-[11px] font-black leading-tight">Pelajar / B40</span>
              </button>

              <button
                type="button"
                onClick={() => setRegRole('merchant')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  regRole === 'merchant'
                    ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Store className="w-4 h-4 text-amber-600" />
                <span className="text-[11px] font-black leading-tight">Peniaga Makanan</span>
              </button>

              <button
                type="button"
                onClick={() => setRegRole('ngo')}
                className={`p-3 rounded-2xl border text-center transition flex flex-col items-center justify-center space-y-1 ${
                  regRole === 'ngo'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-sm'
                    : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HeartHandshake className="w-4 h-4 text-teal-600" />
                <span className="text-[11px] font-black leading-tight">NGO / Sukarelawan</span>
              </button>
            </div>

            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  {regRole === 'merchant' ? 'Nama Kedai / Restoran:' : 'Nama Penuh:'}
                </label>
                <input
                  type="text"
                  required
                  placeholder={regRole === 'merchant' ? 'cth: Restoran Selera Utara' : 'cth: Ahmad Bin Razak'}
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Alamat Emel:
                </label>
                <input
                  type="email"
                  required
                  placeholder="cth: ahmad@pmtg.edu.my"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  No. Telefon:
                </label>
                <input
                  type="tel"
                  placeholder="cth: +6012-3456789"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-700 hover:from-teal-700 hover:to-emerald-800 text-white font-extrabold rounded-2xl text-xs transition shadow-lg shadow-teal-700/20 flex items-center justify-center space-x-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{loading ? 'Mendaftar...' : 'Daftar Akaun Sekarang'}</span>
            </button>
          </form>
        )}

      </div>

      {/* Footer System Info with User Manual Link */}
      <div className="mt-8 text-center space-y-2">
        {onOpenManual && (
          <div>
            <button
              onClick={onOpenManual}
              className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 bg-emerald-950/60 border border-emerald-800/80 px-3.5 py-1.5 rounded-full transition shadow-sm"
            >
              <span>📖 Buka Manual Panduan Penggunaan Sistem</span>
            </button>
          </div>
        )}
        <p className="text-xs text-slate-400">
          © 2026 Zero Lapar. Hak Cipta Terpelihara • Politeknik METrO Tasek Gelugor.
        </p>
      </div>

    </div>
  );
}
