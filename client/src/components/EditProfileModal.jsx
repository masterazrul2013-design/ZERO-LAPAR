import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  Camera, 
  Lock, 
  ShieldCheck, 
  Save, 
  X,
  Building,
  KeyRound,
  CheckCircle2
} from 'lucide-react';

export default function EditProfileModal({ 
  isOpen, 
  onClose, 
  currentUser, 
  onProfileUpdated 
}) {
  if (!isOpen || !currentUser) return null;

  const [name, setName] = useState(currentUser.name || '');
  const [phone, setPhone] = useState(currentUser.phone || '');
  const [avatar, setAvatar] = useState(currentUser.avatar || '');
  const [institution, setInstitution] = useState(currentUser.institution || 'Politeknik METrO Tasek Gelugor');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setStatusMsg('');

    if (newPassword && newPassword !== confirmPassword) {
      alert('Kata laluan baharu dan pengesahan tidak sepadan!');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentUser.id,
          role: currentUser.role,
          name,
          phone,
          avatar,
          institution,
          newPassword: newPassword ? newPassword.trim() : undefined
        })
      });

      const data = await res.json();
      if (data.success) {
        setStatusMsg('Maklumat berjaya dikemaskini!');
        if (onProfileUpdated) {
          onProfileUpdated(data.user);
        }
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        alert(data.error || 'Ralat semasa menyimpan');
      }
    } catch (err) {
      alert('Ralat pelayan: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
        
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Kemaskini Profil Diri</h3>
              <p className="text-xs text-slate-500">{currentUser.roleLabel || currentUser.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-2xl"
          >
            &times;
          </button>
        </div>

        {statusMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{statusMsg}</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Avatar Preview & URL */}
          <div className="flex items-center space-x-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <img 
              src={avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'} 
              alt={name} 
              className="w-14 h-14 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
            />
            <div className="flex-1 space-y-1">
              <label className="block font-bold text-slate-700">URL Gambar Profil:</label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono text-[11px] focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Penuh:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Alamat Emel (Kekal):</label>
              <input
                type="email"
                value={currentUser.email}
                disabled
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-mono text-slate-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">No. Telefon:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Institusi / Organisasi:</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold"
            />
          </div>

          {/* Change Password Section */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
            <div className="font-extrabold text-amber-900 flex items-center space-x-1.5">
              <KeyRound className="w-4 h-4 text-amber-600" />
              <span>Tukar Kata Laluan (Pilihan):</span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-semibold text-slate-700 text-[11px] mb-1">Kata Laluan Baru:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 text-[11px] mb-1">Sahkan Kata Laluan:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono"
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{loading ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}