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

  // Handle Direct Email Login
  const handleEmailLoginSubmit = async (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    setLoginError('');
    setLoading(true);

    const emailClean = loginEmail.trim().toLowerCase();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailClean })
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success) {
          onLoginSuccess(data.user);
          return;
        } else {
          setLoginError(data.error || 'Emel tidak dijumpai.');
          return;
        }
      }

      setLoginError('Emel [' + loginEmail + '] belum didaftarkan. Sila klik tab \'Daftar Baru\' untuk mendaftar.');
    } catch (err) {
      setLoginError('Ralat pelayan semasa log masuk.');
    } finally {
      setLoading(false);
    }
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
        name: 'En. Ashraff (Pentadbir PMTG)',
        role: 'admin',
        roleLabel: 'Pentadbir Utama & ESG Hub',
        email: 'admin@pmtg.edu.my',
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
    setRegError('');
    setLoading(true);

    const newUser = {
      id: 'u_' + Date.now(),
      name: regName.trim(),
      email: regEmail.trim().toLowerCase(),
      role: regRole,
      roleLabel: regRole === 'consumer' ? 'Pelajar / Pengguna' : regRole === 'merchant' ? 'Peniaga Makanan' : 'NGO / Sukarelawan',
      phone: regPhone || '+6012-3456789',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      institution: 'Politeknik METrO Tasek Gelugor'
    };

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser)
      });
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        onLoginSuccess(data.user);
      } else {
        onLoginSuccess(newUser);
      }
    } catch (err) {
      onLoginSuccess(newUser);
    } finally {
      setLoading(false);
    }
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
            src="/logo.png" 
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

        {/* TAB 1: STANDARD EMAIL LOGIN */}
        {selectedTab === 'login' && (
          <form onSubmit={handleEmailLoginSubmit} className="space-y-4" autoComplete="off">
            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Log Masuk Akaun Anda</h3>
              <p className="text-xs text-slate-500">Masukkan emel berdaftar untuk membuka portal peranan anda.</p>
            </div>

            {loginError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Emel:</label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="cth: azrul@pmtg.edu.my"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    autoComplete="off"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                  />
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-200 transition flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Mengesahkan...' : 'Log Masuk'}</span>
            </button>

            <div className="pt-2 text-center text-xs text-slate-500">
              Belum mempunyai akaun?{' '}
              <button
                type="button"
                onClick={() => setSelectedTab('register')}
                className="font-bold text-emerald-600 hover:underline"
              >
                Daftar Baru di sini
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: ADMIN PASSWORD LOGIN (Completely Blank - No Auto Fill) */}
        {selectedTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-4" autoComplete="off">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-black text-slate-900 text-base">Akses Pentadbir Tadbir Urus ESG</h3>
              <p className="text-xs text-slate-500">Sila masukkan ID Pengguna dan Kata Laluan Pentadbir.</p>
            </div>

            {adminError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{adminError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">ID Pengguna (Username):</label>
                <input
                  type="text"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="Masukkan Username"
                  required
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Laluan (Password):</label>
                <div className="relative">
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan Password"
                    required
                    autoComplete="new-password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:bg-white"
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-xs shadow-lg shadow-amber-200 transition flex items-center justify-center space-x-2"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Mengesahkan...' : 'Log Masuk Pentadbir'}</span>
            </button>
          </form>
        )}

        {/* TAB 3: REGISTER NEW USER */}
        {selectedTab === 'register' && (
          <form onSubmit={handleRegister} className="space-y-4" autoComplete="off">
            <div className="text-center space-y-1">
              <h3 className="font-black text-slate-900 text-base">Pendaftaran Akaun Baharu</h3>
              <p className="text-xs text-slate-500">Sertai rangkaian ekosistem penyelamatan makanan Zero Lapar.</p>
            </div>

            {regError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-rose-800 text-xs font-bold flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{regError}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Penuh / Nama Kedai:</label>
                <input
                  type="text"
                  placeholder="cth: MOHD AZRULNIZAM / Restoran Nelayan"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Alamat Emel:</label>
                <input
                  type="email"
                  placeholder="cth: azrul@pmtg.edu.my"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                  autoComplete="off"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Peranan Anda:</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold"
                >
                  <option value="consumer">🎓 Pelajar / Pengguna (Beli Makanan Diskaun & Donasi)</option>
                  <option value="merchant">🏪 Peniaga Makanan (Senarai Lebihan & Sahkan Serahan)</option>
                  <option value="ngo">🤝 NGO & Sukarelawan (Ambil Donasi Pukal & Agih)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-lg transition"
            >
              {loading ? 'Mendaftar...' : 'Daftar & Terus Masuk'}
            </button>
          </form>
        )}

      </div>

      {/* Footer info */}
      <div className="mt-8 text-center text-xs text-slate-400">
        © 2026 Zero Lapar. Hak Cipta Terpelihara • Politeknik METrO Tasek Gelugor.
      </div>
    </div>
  );
}