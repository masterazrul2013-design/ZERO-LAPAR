import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  X, 
  Utensils, 
  Store, 
  HeartHandshake, 
  ShieldCheck, 
  CheckCircle2, 
  QrCode, 
  Camera, 
  Printer, 
  Award, 
  KeyRound, 
  Sparkles,
  HelpCircle,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';

export default function UserManualModal({ isOpen, onClose, initialRole = 'consumer' }) {
  const [activeTab, setActiveTab] = useState('consumer'); // 'consumer', 'merchant', 'ngo', 'admin', 'faq'

  useEffect(() => {
    if (initialRole) {
      setActiveTab(initialRole);
    }
  }, [initialRole, isOpen]);

  if (!isOpen) return null;

  const roleGuides = {
    consumer: {
      title: 'Panduan Pengguna / Mahasiswa',
      badge: 'Portal Pelajar',
      color: 'from-emerald-600 to-teal-700',
      steps: [
        {
          stepNum: '01',
          title: 'Cari & Pilih Sajian Makanan',
          desc: 'Semak senarai makanan lebihan lazat dari rakan niaga sekitar PMTG. Anda boleh tapis mengikut kategori (Nasi Berlauk, Bakeri, Groseri) atau penapis diet Halal.',
          tip: 'Makanan berlabel "Donasi Percuma" disasarkan kepada mahasiswa yang memerlukan (RM0), manakala "Diskaun" dijual pada potongan harga 50-70%.'
        },
        {
          stepNum: '02',
          title: 'Pilih Kuantiti & Buat Tempahan',
          desc: 'Klik "Tempah Sekarang", pilih bilangan pek yang diingini dan sahkan nama serta nombor telefon anda.',
          tip: 'Sistem akan memeriksa had baki stok secara automatik bagi mengelakkan tempahan berlebihan.'
        },
        {
          stepNum: '03',
          title: 'Dapatkan Tiket QR Penebusan',
          desc: 'Selepas tempahan berjaya, buka tab "Tiket QR Saya" di bar navigasi untuk melihat kod tiket digital anda (cth: ZL-4311) beserta peta waktu pengambilan.',
          tip: 'Hadir ke premis kedai dalam tempoh waktu pengambilan yang dinyatakan.'
        },
        {
          stepNum: '04',
          title: 'Tunjukkan Tiket & Ambil Makanan',
          desc: 'Tunjukkan kod QR atau sebut nombor tiket kepada peniaga. Peniaga akan mengimbas/mengesahkan tiket anda dan menyerahkan hidangan makanan.',
          tip: 'Status tiket akan bertukar kepada "Selesai Ditebus" dan impak sisa dielakkan akan dikemaskini dalam ESG Ticker.'
        }
      ]
    },
    merchant: {
      title: 'Panduan Rakan Niaga (Peniaga Makanan)',
      badge: 'Portal Peniaga',
      color: 'from-amber-600 to-amber-800',
      steps: [
        {
          stepNum: '01',
          title: 'Penyenaraian Makanan ("One Platform. Two Paths.")',
          desc: 'Di tab "Urus Makanan & QR", pilih salah satu laluan agihan: Laluan Diskaun (jual murah RM5 untuk pulih kos) ATAU Laluan Donasi (RM0 untuk kebajikan).',
          tip: 'Masukkan nama sajian, kuantiti pek, harga asal, dan anggaran berat hidangan (kg).'
        },
        {
          stepNum: '02',
          title: 'Muat Naik Gambar Sajian',
          desc: 'Gunakan butang "Pilih Gambar dari Komputer / Kamera HP" untuk memuat naik gambar sajian sebenar, atau klik "Pilihan Pantas" untuk memilih set gambar hidangan siap.',
          tip: 'Gambar yang menarik meningkatkan kadar penebusan pantas oleh mahasiswa.'
        },
        {
          stepNum: '03',
          title: 'Pengesahan Penebusan Kod QR Mahasiswa',
          desc: 'Apabila mahasiswa tiba di premis, masukkan kod tiket (cth: ZL-4311) ke dalam borang "Pengesahan QR Penebusan" dan klik Sahkan.',
          tip: 'Sistem akan menolak stok baki secara masa-nyata dan mengemaskini rekod akaun anda.'
        },
        {
          stepNum: '04',
          title: 'Semak Prestasi & Sijil Hijau ESG',
          desc: 'Klik tab "Prestasi & Impak" untuk melihat jumlah pek hidangan diselamatkan, berat sisa dielak (kg), pelepasan CO2 dielak, dan pratinjau Sijil Pengiktirafan Hijau PMTG.',
          tip: 'Prestasi cemerlang melayakkan premis anda berada di kedudukan teratas penarafan komuniti.'
        },
        {
          stepNum: '05',
          title: 'Jana & Cetak Penyata Rekod Premis',
          desc: 'Klik tab "Jana & Cetak Penyata", pilih tempoh masa (Harian / Bulanan / Semua), dan klik "Cetak / PDF" untuk menyimpan penyata audit rasmi lengkap dengan tandatangan.',
          tip: 'Penyata ini boleh digunakan untuk rekod cukai CSR, audit premis, dan rekod jualan dalaman.'
        }
      ]
    },
    ngo: {
      title: 'Panduan Pertubuhan NGO & Sukarelawan',
      badge: 'Portal NGO',
      color: 'from-teal-600 to-emerald-800',
      steps: [
        {
          stepNum: '01',
          title: 'Pantau Donasi Makanan Pukal',
          desc: 'Semak tawaran makanan lebihan berskala besar yang disumbangkan oleh dewan katering, hotel, atau buffet sekitar Tasek Gelugor.',
          tip: 'Setiap entri memaparkan anggaran bilangan hidangan dan berat pukal (kg).'
        },
        {
          stepNum: '02',
          title: 'Tuntut Donasi untuk Agihan Komuniti',
          desc: 'Klik butang "Tuntut Donasi Ini", pilih skuad sukarelawan anda, dan sahkan masa pengambilan pukal.',
          tip: 'Peniaga akan menerima notifikasi penyediaan bungkusan donasi secara automatik.'
        },
        {
          stepNum: '03',
          title: 'Gunakan Zero Lapar Drop-Off Hub',
          desc: 'Gunakan kemudahan loker makanan komuniti (Drop-off Hub) di PMTG bagi agihan fleksibel kepada mahasiswa B40 di luar waktu operasi pejabat.',
          tip: 'Hub dilengkapi pemantauan suhu dan kod akses selamat.'
        }
      ]
    },
    admin: {
      title: 'Panduan Pentadbir Utama (Master Admin)',
      badge: 'Akses Pentadbir PMTG',
      color: 'from-indigo-600 to-slate-900',
      steps: [
        {
          stepNum: '01',
          title: 'Pusat Kawalan ESG (3-Pillar Analytics)',
          desc: 'Pantau pencapaian SDG 2 (Zero Hunger) dan SDG 12 (Responsible Consumption) melalui metrik graf interaktif Environmental, Social, dan Governance.',
          tip: 'Gunakan data ini untuk penyediaan laporan impak kemampanan institusi.'
        },
        {
          stepNum: '02',
          title: 'Pengurusan Inventori Makanan',
          desc: 'Buka tab "Urus Makanan" untuk menyunting harga, baki stok pek, atau memadam sajian makanan sekiranya terdapat pembatalan oleh peniaga.',
          tip: 'Butang Edit dan Padam juga tersedia terus pada kad makanan di paparan View Pelajar.'
        },
        {
          stepNum: '03',
          title: 'Pengurusan Pengguna & Reset Kata Laluan',
          desc: 'Buka tab "Urus Pengguna" untuk melihat keseluruhan senarai akaun berdaftar. Sekiranya pengguna terlupa kata laluan, klik "Reset Password" untuk menetapkan kata laluan baharu serta-merta.',
          tip: 'Semua akaun termasuk Pentadbir juga mempunyai tab "Edit Profil" untuk kemaskini peribadi.'
        },
        {
          stepNum: '04',
          title: 'Laporan Penarafan Prestasi Peniaga',
          desc: 'Buka tab "Laporan Peniaga" untuk melihat kedudukan ranking peniaga yang paling banyak menyumbang (Juara Impak Hijau) serta melihat profil lengkap dan nombor telefon premis.',
          tip: 'Gunakan laporan ini bagi penganugerahan Rakan Niaga Lestari PMTG.'
        },
        {
          stepNum: '05',
          title: 'Penjanaan Penyata Audit Makanan Masuk/Keluar',
          desc: 'Buka tab "Laporan Cetak", tapis mengikut Harian atau Bulanan, dan klik "Cetak / Simpan PDF" untuk menjana dokumen audit rasmi lengkap kepala surat PMTG & ruangan tandatangan HEP.',
          tip: 'Format cetakan telah diselaraskan ke A4 bersih tanpa memotong birai dokumen.'
        },
        {
          stepNum: '06',
          title: 'Master Omni-View & Slaid PYIC 2026',
          desc: 'Pentadbir boleh mengakses mana-mana sudut pandangan portal (Pelajar, Peniaga, NGO) serta membuka tab eksklusif "Slaid PYIC 2026" untuk sesi pembentangan juri pertandingan.',
          tip: 'Slaid merangkumi Problem Statement, Solution, Business Model Canvas (BMC), dan ESG Value Proposition.'
        }
      ]
    },
    faq: {
      title: 'Soalan Lazim (FAQ) & Bantuan Sistem',
      badge: 'Bantuan Pantas',
      color: 'from-slate-700 to-slate-900',
      questions: [
        {
          q: 'Bagaimanakah keselamatan dan kualiti makanan lebihan dijamin?',
          a: 'Semua hidangan yang disenaraikan adalah makanan segar hari yang sama dan tertakluk kepada tetingkap waktu pengambilan ketat (Pickup Window) serta piawaian Halal / Muslim Friendly.'
        },
        {
          q: 'Apakah perbezaan Laluan Diskaun dan Laluan Donasi?',
          a: 'Laluan Diskaun membolehkan peniaga menjual lebihan pada harga mampu milik (cth RM5) bagi memulihkan sebahagian kos bahan, manakala Laluan Donasi disalurkan percuma (RM0) kepada mahasiswa B40 & NGO.'
        },
        {
          q: 'Bagaimanakah sekiranya saya terlupa kata laluan?',
          a: 'Pengguna boleh menghubungi Pentadbir Utama PMTG (MUHAMMAD FAIZ IKHWAN BIN ISMAIL di faiz@pmtg.edu.my) untuk penetapan semula kata laluan melalui modul Urus Pengguna.'
        },
        {
          q: 'Adakah peniaga dikenakan bayaran langganan?',
          a: 'Zero Lapar menyediakan pelan Freemium Basic (RM0/bulan) dan pelan Premium ESG Partner (RM49/bulan) yang menyediakan laporan audit bulanan serta pengecualian komisen jualan.'
        }
      ]
    }
  };

  const currentGuide = roleGuides[activeTab] || roleGuides.consumer;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 print:hidden animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Header */}
        <div className={`bg-gradient-to-r ${currentGuide.color} text-white p-5 sm:p-6 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 p-2 flex items-center justify-center backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-white/20 text-white">
                  {currentGuide.badge}
                </span>
                <span className="text-xs text-white/80 font-semibold">• Zero Lapar PMTG</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-0.5">
                {currentGuide.title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition font-bold"
            title="Tutup Manual"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Navigation Tabs */}
        <div className="bg-slate-100 p-2 border-b border-slate-200 flex flex-wrap gap-1">
          <button
            onClick={() => setActiveTab('consumer')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'consumer' ? 'bg-emerald-600 text-white shadow font-extrabold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Mahasiswa / Pelajar</span>
          </button>

          <button
            onClick={() => setActiveTab('merchant')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'merchant' ? 'bg-amber-600 text-white shadow font-extrabold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Rakan Niaga (Peniaga)</span>
          </button>

          <button
            onClick={() => setActiveTab('ngo')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'ngo' ? 'bg-teal-600 text-white shadow font-extrabold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>NGO & Sukarelawan</span>
          </button>

          <button
            onClick={() => setActiveTab('admin')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'admin' ? 'bg-indigo-600 text-white shadow font-extrabold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Pentadbir Utama</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ml-auto ${
              activeTab === 'faq' ? 'bg-slate-800 text-white shadow font-extrabold' : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Soalan Lazim (FAQ)</span>
          </button>
        </div>

        {/* Modal Body Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8 space-y-6">
          
          {/* Step-by-Step Guides */}
          {activeTab !== 'faq' && currentGuide.steps && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Langkah Demi Langkah Penggunaan Portal:
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {currentGuide.steps.length} Langkah Utama
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {currentGuide.steps.map((st, sIdx) => (
                  <div 
                    key={sIdx}
                    className="p-4 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200 hover:border-slate-300 transition space-y-2.5"
                  >
                    <div className="flex items-start space-x-3">
                      <span className="w-7 h-7 rounded-xl bg-slate-900 text-white text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                        {st.stepNum}
                      </span>
                      <div className="flex-1">
                        <h4 className="text-sm sm:text-base font-extrabold text-slate-900">
                          {st.title}
                        </h4>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                          {st.desc}
                        </p>
                      </div>
                    </div>

                    {st.tip && (
                      <div className="bg-amber-50/80 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start space-x-2">
                        <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span><strong>Tip:</strong> {st.tip}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* FAQ View */}
          {activeTab === 'faq' && currentGuide.questions && (
            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                  Jawapan Kepada Persoalan Kerap Ditanya Mengenai Inisiatif Zero Lapar:
                </span>
              </div>

              <div className="space-y-3">
                {currentGuide.questions.map((faq, fIdx) => (
                  <div key={fIdx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900 flex items-start space-x-2">
                      <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <span>{faq.q}</span>
                    </div>
                    <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Politeknik / PYIC 2026 Note */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span>Sistem Inovasi <strong>Zero Lapar PMTG</strong> untuk Pertandingan <strong>PYIC 2026</strong>.</span>
            </div>
            <span className="font-mono text-[10px] bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full font-bold">
              v2.0 LIVE
            </span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs">
          <div className="text-slate-500 text-[11px]">
            Ada masalah lanjut? Hubungi Penyelaras: <strong>MUHAMMAD FAIZ IKHWAN BIN ISMAIL</strong> (faiz@pmtg.edu.my)
          </div>

          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow transition"
          >
            Faham & Tutup
          </button>
        </div>

      </div>
    </div>
  );
}