import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Clock, MapPin, CheckCircle, X, Sparkles, CheckCheck, AlertCircle, ScanLine } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ActiveTicketsModal({ 
  isOpen, 
  onClose, 
  reservations = [],
  onVerifyQrCode
}) {
  const [redeemingId, setRedeemingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [manualCode, setManualCode] = useState('');

  if (!isOpen) return null;

  const handleRedeemTicket = async (res) => {
    setRedeemingId(res.id);
    setSuccessMessage('');
    setErrorMessage('');

    const result = await onVerifyQrCode(res.pickupCode || res.id);
    setRedeemingId(null);

    if (result && result.success) {
      setSuccessMessage(result.message || 'Penebusan berjaya! Makanan disahkan.');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } else {
      setErrorMessage(result?.error || 'Gagal menebus tiket.');
    }
  };

  const handleManualScanOrSubmit = async () => {
    if (!manualCode) return;
    setSuccessMessage('');
    setErrorMessage('');

    const result = await onVerifyQrCode(manualCode);
    if (result && result.success) {
      setSuccessMessage(result.message || 'Penebusan kod ' + manualCode + ' berjaya!');
      setManualCode('');
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } else {
      setErrorMessage(result?.error || 'Kod tidak sah.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">Tiket Penebusan Makanan</h3>
              <p className="text-xs text-slate-500">Tunjukkan kod QR atau tekan butang 'Sahkan Ambil' semasa serahan.</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1 text-2xl font-bold">
            &times;
          </button>
        </div>

        {/* Global Success / Error Banners */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-emerald-100 border border-emerald-300 rounded-2xl text-emerald-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle className="w-5 h-5 text-emerald-700 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-100 border border-rose-300 rounded-2xl text-rose-900 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-700 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Manual Code Input Bar */}
        <div className="px-6 pt-4">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center space-x-2">
            <ScanLine className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Imbas kod QR atau taip cth: ZL-4311"
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              className="flex-1 bg-transparent text-xs font-bold text-slate-900 focus:outline-none placeholder:text-slate-400"
            />
            <button
              onClick={handleManualScanOrSubmit}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition"
            >
              Sahkan Kod
            </button>
          </div>
        </div>

        {/* Tickets List */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {reservations.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              Tiada tiket aktif buat masa ini. Sila buat tempahan makanan di portal pengguna.
            </div>
          ) : (
            reservations.map(res => {
              const isCompleted = res.status === 'COMPLETED';
              return (
                <div 
                  key={res.id} 
                  className={`border rounded-2xl p-5 space-y-4 relative transition-all ${
                    isCompleted
                      ? 'border-slate-200 bg-slate-50 opacity-80'
                      : 'border-emerald-500 bg-emerald-50/40 shadow-md ring-2 ring-emerald-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full inline-flex items-center space-x-1 ${
                        isCompleted
                          ? 'bg-slate-200 text-slate-700'
                          : 'bg-emerald-600 text-white shadow-sm'
                      }`}>
                        {isCompleted ? (
                          <>
                            <CheckCheck className="w-3 h-3" />
                            <span>TELAH SELESAI DITEBUS</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
                            <span>SEDIA DIAMBIL (AKTIF)</span>
                          </>
                        )}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-base mt-2">{res.itemTitle}</h4>
                      <p className="text-xs text-slate-500 font-medium">{res.merchantName}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-lg font-black text-slate-900">
                        {res.totalAmount === 0 ? 'RM 0.00 (Donasi)' : `RM ${res.totalAmount.toFixed(2)}`}
                      </div>
                      <div className="text-xs text-slate-500 font-bold">{res.quantity} pek</div>
                    </div>
                  </div>

                  {/* QR Code & Code Number */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
                    <div className="p-2 bg-white rounded-lg shadow-inner border border-slate-100 flex-shrink-0">
                      <QRCodeSVG value={res.qrData || res.pickupCode} size={110} />
                    </div>

                    <div className="space-y-1.5 text-center sm:text-left flex-1 w-full">
                      <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Kod Pengesahan Pengambilan</span>
                      <div className="text-2xl font-mono font-black text-emerald-800 tracking-wider">
                        {res.pickupCode}
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Nama: <strong>{res.customerName}</strong> ({res.customerPhone})
                      </p>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        🌿 Anda menyelamatkan {res.rescuedKg} kg sisa makanan!
                      </div>
                    </div>
                  </div>

                  {/* ACTION BUTTON: DIRECT ONE-CLICK REDEMPTION / CONFIRM HANDOVER */}
                  {!isCompleted ? (
                    <button
                      disabled={redeemingId === res.id}
                      onClick={() => handleRedeemTicket(res)}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold rounded-xl text-xs shadow-lg shadow-emerald-200 transition flex items-center justify-center space-x-2 active:scale-95"
                    >
                      <Sparkles className="w-4 h-4 text-amber-300" />
                      <span>
                        {redeemingId === res.id ? 'Mengesahkan Serahan...' : '⚡ Sahkan Pengambilan Makanan Sekarang (Tebus Kod)'}
                      </span>
                    </button>
                  ) : (
                    <div className="bg-slate-100 p-2.5 rounded-xl text-center text-xs font-bold text-slate-600 flex items-center justify-center space-x-1.5">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Makanan telah diserahkan & impak ESG telah dikemaskini!</span>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 text-center">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
}