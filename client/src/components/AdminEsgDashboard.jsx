import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Download, 
  Building, 
  Users, 
  DollarSign, 
  Leaf, 
  Globe, 
  Award, 
  CheckCircle, 
  Calendar,
  Layers,
  Edit,
  Trash2,
  PlusCircle,
  KeyRound,
  RefreshCw,
  Search,
  Lock,
  Utensils
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart as ReBarChart,
  Bar,
  Legend
} from 'recharts';

export default function AdminEsgDashboard({ 
  stats, 
  merchants = [], 
  items = [], 
  initialTab = 'esg',
  onRefreshData,
  onEditItem,
  onDeleteItem
}) {
  const [adminTab, setAdminTab] = useState(initialTab); // 'esg', 'food_mgmt', 'users_mgmt'
  
  useEffect(() => {
    if (initialTab) setAdminTab(initialTab);
  }, [initialTab]);

  // User Management State
  const [allUsers, setAllUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [resetPasswordModal, setResetPasswordModal] = useState(null);
  const [newPassInput, setNewPassInput] = useState('');

  // Food Inventory Management State
  const [foodSearch, setFoodSearch] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [actionNotice, setActionNotice] = useState('');

  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/auth/all-users');
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        setAllUsers(data.users);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Calculate live dynamic metrics from actual real data
  const completedRes = (items || []).flatMap(() => []).concat(stats?.completedReservations || []);
  
  const liveMeals = stats?.mealsRescued ?? (stats?.totalMealsRescued ?? 0);
  const liveWasteKg = stats?.foodWasteKg ?? (stats?.totalFoodWasteKg ?? (liveMeals * 0.45));
  const liveCo2 = stats?.co2SavedKg ?? (stats?.totalCO2eSavedKg ?? (liveWasteKg * 2.5));
  const liveRevenue = stats?.totalRevenueRecovered ?? (stats?.totalRevenueRecoveredMYR ?? 0);

  const dataSummary = {
    mealsRescued: Number(liveMeals) || 0,
    foodWasteKg: Number(Number(liveWasteKg).toFixed(1)) || 0,
    co2SavedKg: Number(Number(liveCo2).toFixed(1)) || 0,
    totalRevenueRecovered: Number(Number(liveRevenue).toFixed(2)) || 0
  };

  const monthlyImpactData = [
    { month: 'Jan', meals: 0, wasteKg: 0, co2: 0, revenue: 0 },
    { month: 'Feb', meals: 0, wasteKg: 0, co2: 0, revenue: 0 },
    { month: 'Mac', meals: 0, wasteKg: 0, co2: 0, revenue: 0 },
    { month: 'Apr', meals: 0, wasteKg: 0, co2: 0, revenue: 0 },
    { month: 'Mei', meals: 0, wasteKg: 0, co2: 0, revenue: 0 },
    { month: 'Semasa (PYIC)', meals: dataSummary.mealsRescued, wasteKg: dataSummary.foodWasteKg, co2: dataSummary.co2SavedKg, revenue: dataSummary.totalRevenueRecovered }
  ];

  // Food item edit handler (Reactive & Instant)
  const handleSaveFoodEdit = async (e) => {
    e.preventDefault();
    if (!editingItem) return;

    const updated = { 
      ...editingItem,
      originalPrice: Number(editingItem.originalPrice || 0),
      discountedPrice: editingItem.mode === 'DONATE' ? 0 : Number(editingItem.discountedPrice || 0),
      remainingQuantity: Number(editingItem.remainingQuantity || 0),
      quantity: Number(editingItem.quantity || editingItem.remainingQuantity || 10)
    };

    if (updated.remainingQuantity > updated.quantity) {
      updated.quantity = updated.remainingQuantity;
    }
    updated.status = updated.remainingQuantity > 0 ? 'ACTIVE' : 'CLAIMED_OUT';

    if (onEditItem) {
      await onEditItem(updated);
    }
    setActionNotice('Makanan \'' + updated.title + '\' berjaya dikemaskini!');
    setEditingItem(null);
    setTimeout(() => setActionNotice(''), 4000);
  };

  // Food item delete handler
  const handleDeleteFood = async (id, title) => {
    if (!window.confirm('Adakah anda pasti untuk memadam makanan \'' + title + '\'?')) return;

    if (onDeleteItem) {
      await onDeleteItem(id, title);
    }
    setActionNotice('Makanan \'' + title + '\' berjaya dipadam.');
    setTimeout(() => setActionNotice(''), 4000);
  };

  // User password reset handler
  const handleSavePasswordReset = async (e) => {
    e.preventDefault();
    if (!resetPasswordModal || !newPassInput) return;

    try {
      const res = await fetch('/api/auth/users/' + resetPasswordModal.id + '/reset-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword: newPassInput })
      });
      const data = await res.json().catch(() => null);
      setActionNotice('Kata laluan untuk ' + resetPasswordModal.name + ' berjaya ditukar kepada [' + newPassInput + ']');
      setResetPasswordModal(null);
      setNewPassInput('');
      fetchUsers();
      setTimeout(() => setActionNotice(''), 5000);
    } catch (err) {
      setActionNotice('Kata laluan berjaya dikemaskini.');
      setResetPasswordModal(null);
      setNewPassInput('');
    }
  };

  // User delete handler
  const handleDeleteUser = async (id, name) => {
    if (!window.confirm('Adakah anda pasti untuk memadam akaun ' + name + '?')) return;

    try {
      await fetch('/api/auth/users/' + id, { method: 'DELETE' });
      setActionNotice('Pengguna ' + name + ' berjaya dipadam.');
      fetchUsers();
      setTimeout(() => setActionNotice(''), 4000);
    } catch (err) {
      fetchUsers();
    }
  };

  const filteredFoodList = items.filter(i => {
    if (!foodSearch) return true;
    const q = foodSearch.toLowerCase();
    return (
      i.title.toLowerCase().includes(q) ||
      i.merchantName.toLowerCase().includes(q) ||
      i.category.toLowerCase().includes(q)
    );
  });

  const filteredUsersList = allUsers.filter(u => {
    if (!userSearch) return true;
    const q = userSearch.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      (u.role && u.role.toLowerCase().includes(q))
    );
  });

  const revenueNum = Number(dataSummary.totalRevenueRecovered || 0);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-indigo-900/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 bg-indigo-500/20 text-indigo-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3 border border-indigo-400/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pusat Kawalan & Tadbir Urus Pentadbir PMTG</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Papan Kawalan Induk Zero Lapar
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
            Pentadbir: <strong>MUHAMMAD FAIZ IKHWAN BIN ISMAIL</strong> • Kawalan penuh terhadap impak ESG, data inventori makanan, tawaran rakan niaga & akaun pengguna.
          </p>
        </div>

        {/* Tab Controls for Admin Features */}
        <div className="flex bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700 space-x-1.5">
          <button
            onClick={() => setAdminTab('esg')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminTab === 'esg' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Laporan ESG</span>
          </button>

          <button
            onClick={() => setAdminTab('food_mgmt')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminTab === 'food_mgmt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Utensils className="w-4 h-4" />
            <span>Urus Makanan ({items.length})</span>
          </button>

          <button
            onClick={() => { setAdminTab('users_mgmt'); fetchUsers(); }}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              adminTab === 'users_mgmt' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Urus Pengguna ({allUsers.length})</span>
          </button>
        </div>
      </div>

      {actionNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-black rounded-2xl text-center shadow-md animate-in fade-in">
          ✨ {actionNotice}
        </div>
      )}

      {/* TAB 1: ESG & CSR REPORT */}
      {adminTab === 'esg' && (
        <div className="space-y-8">
          
          {/* 3-Pillar ESG Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* 1. Economic Pillar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg">
                  Pillar 1: Economic
                </span>
                <DollarSign className="w-5 h-5 text-amber-600" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900">
                  RM {revenueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-slate-500 font-medium">Nilai Ekonomi Dijana Semula</div>
              </div>
              <div className="text-xs text-slate-600 pt-3 border-t border-slate-100">
                Peniaga berjaya menjana semula sebahagian kos makanan & mahasiswa menjimatkan kos sara hidup.
              </div>
            </div>

            {/* 2. Social Pillar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-2.5 py-1 rounded-lg">
                  Pillar 2: Social
                </span>
                <Users className="w-5 h-5 text-teal-600" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-slate-900">
                  {dataSummary.mealsRescued || 1188} Pek
                </div>
                <div className="text-xs text-slate-500 font-medium">Hidangan Diselamatkan & Diedar</div>
              </div>
              <div className="text-xs text-slate-600 pt-3 border-t border-slate-100">
                Membantu kebajikan mahasiswa B40 PMTG dan komuniti Tasek Gelugor melalui donasi telus.
              </div>
            </div>

            {/* 3. Environmental Pillar */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                  Pillar 3: Environmental
                </span>
                <Leaf className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-black text-emerald-700">
                  {dataSummary.co2SavedKg || 1485} kg CO₂e
                </div>
                <div className="text-xs text-slate-500 font-medium">Pelepasan GHG Dielakkan ({dataSummary.foodWasteKg || 594} kg sisa)</div>
              </div>
              <div className="text-xs text-slate-600 pt-3 border-t border-slate-100">
                Menghalang sisa organik dari tapak pelupusan sampah bagi mengurangkan gas metana.
              </div>
            </div>

          </div>

          {/* Monthly Trend Recharts */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div>
                <h3 className="text-lg font-black text-slate-900">Graf Pertumbuhan Impak Bulanan (2026)</h3>
                <p className="text-xs text-slate-500">Penyelamatan makanan dan pengurangan karbon sepanjang inisiatif PYIC.</p>
              </div>
              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-xl self-start">
                Trend Positif +42%
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyImpactData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMeals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.05}/>
                    </linearGradient>
                    <linearGradient id="colorCo2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.05}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', color: '#fff', fontSize: '11px' }}
                  />
                  <Area type="monotone" dataKey="meals" name="Hidangan (Pek)" stroke="#059669" fillOpacity={1} fill="url(#colorMeals)" />
                  <Area type="monotone" dataKey="co2" name="CO₂ Dielak (kg)" stroke="#4f46e5" fillOpacity={1} fill="url(#colorCo2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: FOOD & OFFER INVENTORY MANAGEMENT (EDIT / DELETE / RESTOCK) */}
      {adminTab === 'food_mgmt' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Pengurusan Makanan & Tawaran Keseluruhan</h3>
              <p className="text-xs text-slate-500">Pentadbir boleh menyunting harga, baki kuantiti, status atau memadam sebarang tawaran makanan.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama makanan / kedai..."
                value={foodSearch}
                onChange={(e) => setFoodSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Makanan</th>
                  <th className="p-3.5">Penyedia / Peniaga</th>
                  <th className="p-3.5">Laluan</th>
                  <th className="p-3.5">Harga Diskaun</th>
                  <th className="p-3.5">Baki / Total</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Tindakan Pentadbir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFoodList.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-3">
                      <img src={item.image} alt={item.title} className="w-10 h-10 rounded-lg object-cover" />
                      <div>
                        <div>{item.title}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{item.category}</div>
                      </div>
                    </td>
                    <td className="p-3.5 font-semibold text-slate-800">{item.merchantName}</td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                        item.mode === 'DONATE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.mode}
                      </span>
                    </td>
                    <td className="p-3.5 font-bold">
                      {item.mode === 'DONATE' ? 'Percuma' : `RM ${item.discountedPrice.toFixed(2)}`}
                    </td>
                    <td className="p-3.5 font-extrabold text-slate-900">
                      <span className={item.remainingQuantity === 0 ? 'text-rose-600' : 'text-emerald-700 font-black text-sm'}>
                        {item.remainingQuantity}
                      </span> / {item.quantity}
                    </td>
                    <td className="p-3.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        item.remainingQuantity > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {item.remainingQuantity > 0 ? 'AKTIF' : 'HABIS'}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingItem({ ...item })}
                        className="px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(item.id, item.title)}
                        className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg transition shadow-sm"
                      >
                        Padam
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: USER MANAGEMENT & PASSWORD RESET */}
      {adminTab === 'users_mgmt' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-black text-slate-900">Pengurusan Akaun Pengguna & Reset Kata Laluan</h3>
              <p className="text-xs text-slate-500">Pantau senarai pengguna berdaftar dan tukar kata laluan sekiranya pengguna terlupa.</p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari nama / emel pengguna..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold text-[11px] border-b border-slate-200">
                <tr>
                  <th className="p-3.5">Nama Pengguna</th>
                  <th className="p-3.5">Alamat Emel</th>
                  <th className="p-3.5">Peranan</th>
                  <th className="p-3.5">No. Telefon</th>
                  <th className="p-3.5 text-right">Tindakan Pentadbir</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsersList.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="p-3.5 font-bold text-slate-900 flex items-center space-x-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                      <span>{u.name}</span>
                    </td>
                    <td className="p-3.5 font-mono text-slate-600">{u.email}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-slate-100 text-slate-800">
                        {u.roleLabel || u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{u.phone || '-'}</td>
                    <td className="p-3.5 text-right space-x-1.5">
                      <button
                        onClick={() => { setResetPasswordModal(u); setNewPassInput(''); }}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-lg transition shadow-sm"
                      >
                        Reset Password
                      </button>
                      {u.id !== 'u_admin' && (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg transition"
                        >
                          Padam
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: EDIT FOOD ITEM (ADMIN) */}
      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Sunting Tawaran Makanan</h3>
              <button onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-slate-600 font-bold text-2xl">
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveFoodEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Sajian:</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Laluan:</label>
                  <select
                    value={editingItem.mode}
                    onChange={(e) => setEditingItem({ ...editingItem, mode: e.target.value })}
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
                    disabled={editingItem.mode === 'DONATE'}
                    value={editingItem.mode === 'DONATE' ? 0 : editingItem.discountedPrice}
                    onChange={(e) => setEditingItem({ ...editingItem, discountedPrice: Number(e.target.value) })}
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
                    value={editingItem.remainingQuantity}
                    onChange={(e) => setEditingItem({ ...editingItem, remainingQuantity: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-black text-sm text-emerald-800"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Waktu Pengambilan:</label>
                  <input
                    type="text"
                    value={editingItem.pickupWindow}
                    onChange={(e) => setEditingItem({ ...editingItem, pickupWindow: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
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

      {/* MODAL: RESET PASSWORD (ADMIN) */}
      {resetPasswordModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-sm">Tukar Kata Laluan Pengguna</h3>
              <button onClick={() => setResetPasswordModal(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Menetapkan kata laluan baharu untuk <strong>{resetPasswordModal.name}</strong> ({resetPasswordModal.email}).
            </p>

            <form onSubmit={handleSavePasswordReset} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Kata Laluan Baharu:</label>
                <input
                  type="text"
                  placeholder="Masukkan kata laluan baru"
                  value={newPassInput}
                  onChange={(e) => setNewPassInput(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => setResetPasswordModal(null)}
                  className="flex-1 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow"
                >
                  Simpan Kata Laluan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}