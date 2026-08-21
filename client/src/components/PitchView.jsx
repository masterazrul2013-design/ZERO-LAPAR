import React, { useState } from 'react';
import { 
  Presentation, 
  Lightbulb, 
  Target, 
  Workflow, 
  TrendingUp, 
  Layers, 
  Award,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  DollarSign,
  HeartHandshake
} from 'lucide-react';

export default function PitchView() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "1. The Paradox of Scarcity and Abundance",
      subtitle: "Masalah Pembaziran Makanan vs Jurang Keterjaminan Makanan",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl space-y-2">
              <div className="text-3xl">🗑️</div>
              <h4 className="font-bold text-rose-900">Food Waste (Pembaziran)</h4>
              <p className="text-xs text-rose-700">
                Ribuan tan makanan lebihan berkualiti tinggi dari restoran, kafe & hotel dibuang ke tapak pelupusan setiap hari.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl space-y-2">
              <div className="text-3xl">🔌</div>
              <h4 className="font-bold text-amber-900">The Redistribution Gap</h4>
              <p className="text-xs text-amber-700">
                Makanan ada, orang memerlukan ada, tetapi tiada sambungan efisien. Koordinasi manual WhatsApp tidak berskala.
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-2">
              <div className="text-3xl">🎓</div>
              <h4 className="font-bold text-emerald-900">Food Insecurity</h4>
              <p className="text-xs text-emerald-700">
                Mahasiswa B40, keluarga miskin bandar & asnaf bergelut untuk mendapatkan hidangan harian yang mampu milik.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 text-white p-6 rounded-2xl text-center space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Misi Teras Zero Lapar</span>
            <p className="text-base sm:text-lg font-bold">
              "Bukan makanan tiada, tetapi hubungan antara makanan lebihan dan mereka yang memerlukan belum dihubungkan secara digital."
            </p>
          </div>
        </div>
      )
    },
    {
      title: "2. One Platform. Two Paths.",
      subtitle: "Formula Penyelesaian Dwi-Laluan Zero Lapar",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Path 1: Donate */}
            <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-600 text-white rounded-2xl font-black text-sm">
                  PATH 1
                </div>
                <h4 className="text-xl font-black text-emerald-900">DONATE (Donasi Percuma)</h4>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Peniaga mendermakan kumpulan makanan lebihan secara bermakna melalui agihan NGO, sukarelawan atau diletakkan di <strong>Zero Lapar Drop-Off Points</strong> (100% Percuma untuk penerima bantuan makanan).
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-xs text-emerald-900 font-semibold">
                ✓ Sifar kos untuk pelajar B40 & asnaf <br />
                ✓ Pengesahan pengambilan melalui Kod QR
              </div>
            </div>

            {/* Path 2: Discount */}
            <div className="bg-amber-50 border-2 border-amber-500 rounded-3xl p-6 space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-500 text-slate-950 rounded-2xl font-black text-sm">
                  PATH 2
                </div>
                <h4 className="text-xl font-black text-amber-950">DISCOUNT (Mampu Milik)</h4>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                Peniaga menjual hidangan lebihan berkualiti pada harga diskaun murah (cth: hidangan RM15 dijual pada hanya <strong>RM5</strong>).
              </p>
              <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs text-amber-950 font-semibold">
                ✓ Peniaga menjana semula kos operasi <br />
                ✓ Pengguna mendapat makanan segar berkualiti tinggi pada harga berpatutan
              </div>
            </div>

          </div>

          <div className="text-center text-xs font-bold text-slate-500">
            🌿 "One surplus meal gets two possibilities: Sell it affordably or Donate it meaningfully."
          </div>
        </div>
      )
    },
    {
      title: "3. From Surplus to Impact (Aliran 4 Langkah)",
      subtitle: "Proses Operasi Menyeluruh dari Penyenaraian ke Penjejakan ESG",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-center shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-full bg-emerald-100 text-emerald-800 font-black flex items-center justify-center text-sm">
                1
              </div>
              <h5 className="font-black text-slate-900 text-sm">LIST</h5>
              <p className="text-xs text-slate-500">
                Peniaga menyenaraikan stok makanan lebihan bersama kuantiti, masa ambil & maklumat diet.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-center shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-full bg-amber-100 text-amber-800 font-black flex items-center justify-center text-sm">
                2
              </div>
              <h5 className="font-black text-slate-900 text-sm">CHOOSE</h5>
              <p className="text-xs text-slate-500">
                Peniaga memilih sama ada mendermakan (Donate) atau menjual pada harga diskaun (Discount).
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-center shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-full bg-teal-100 text-teal-800 font-black flex items-center justify-center text-sm">
                3
              </div>
              <h5 className="font-black text-slate-900 text-sm">DISTRIBUTE</h5>
              <p className="text-xs text-slate-500">
                NGO mengambil donasi atau pelanggan menempah dan menebus di kedai menggunakan Tiket QR Kod.
              </p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-2 text-center shadow-sm">
              <div className="w-10 h-10 mx-auto rounded-full bg-indigo-100 text-indigo-800 font-black flex items-center justify-center text-sm">
                4
              </div>
              <h5 className="font-black text-slate-900 text-sm">TRACK</h5>
              <p className="text-xs text-slate-500">
                Sistem menjejak secara automatik impak ESG: Sisa dielak, hidangan diselamatkan, dan CO₂ dikurangkan.
              </p>
            </div>

          </div>
        </div>
      )
    },
    {
      title: "4. Model Perniagaan Mampan (Business Model)",
      subtitle: "Aliran Hasil & Strategi Kewangan untuk Impak Jangka Panjang",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                100% Percuma
              </span>
              <h5 className="font-black text-slate-900 text-sm">Freemium Tier</h5>
              <p className="text-xs text-slate-600">
                Penyenaraian makanan lebihan asas & sumbangan donasi dibuka percuma selamanya bagi memudahkan penyertaan semua peniaga.
              </p>
            </div>

            <div className="bg-emerald-50 border-2 border-emerald-500 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-white bg-emerald-600 px-2 py-0.5 rounded">
                RM49 - RM199 / bln
              </span>
              <h5 className="font-black text-slate-900 text-sm">Premium Tier</h5>
              <p className="text-xs text-slate-700">
                Langganan bagi perniagaan besar yang memerlukan laporan ESG/CSR bertauliah, sokongan multi-branch & analitik lanjutan.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded">
                Komisen Kecil
              </span>
              <h5 className="font-black text-slate-900 text-sm">Transaction Fee</h5>
              <p className="text-xs text-slate-700">
                Caj transaksi minimum pada setiap hidangan diskaun yang berjaya dijual kepada pelanggan awam.
              </p>
            </div>

            <div className="bg-teal-50 border border-teal-200 p-5 rounded-2xl space-y-2">
              <span className="text-[10px] font-black uppercase text-teal-900 bg-teal-200 px-2 py-0.5 rounded">
                Tajaan Strategik
              </span>
              <h5 className="font-black text-slate-900 text-sm">Partnerships</h5>
              <p className="text-xs text-slate-700">
                Tajaan CSR korporat, geran institusi pendidikan & tajaan pembinaan Zero Lapar Drop-Off Points.
              </p>
            </div>

          </div>

          <div className="bg-emerald-100/70 p-4 rounded-2xl border border-emerald-300 text-center text-xs text-emerald-950 font-bold">
            💡 Prinsip Penting: Kami menjana pendapatan daripada perniagaan & perkongsian strategik, BUKAN daripada golongan yang memerlukan bantuan makanan.
          </div>
        </div>
      )
    },
    {
      title: "5. Business Model Canvas (BMC) Zero Lapar",
      subtitle: "Struktur Kanvas Model Perniagaan Lengkap (Slide Pembentangan)",
      content: (
        <div className="bg-slate-900 text-slate-100 p-6 rounded-3xl space-y-6 text-xs overflow-x-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 min-w-[700px]">
            
            {/* Key Partners */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
              <h6 className="font-black text-emerald-400 text-xs uppercase">Key Partners</h6>
              <ul className="space-y-1 text-slate-300">
                <li>• Food Businesses (Restoran, Kafe, Bakeri, Hotel, Katering)</li>
                <li>• NGOs & Food Banks</li>
                <li>• Sponsors & CSR Corporates</li>
                <li>• Universiti & Institusi TVET</li>
              </ul>
            </div>

            {/* Key Activities & Resources */}
            <div className="space-y-3">
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1.5">
                <h6 className="font-black text-emerald-400 text-xs uppercase">Key Activities</h6>
                <p className="text-slate-300">• Platform Dev & Maintenance</p>
                <p className="text-slate-300">• Matching Supply & Demand</p>
                <p className="text-slate-300">• Impact Tracking (ESG Analytics)</p>
                <p className="text-slate-300">• NGO Coordination & Drop-off</p>
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1.5">
                <h6 className="font-black text-amber-400 text-xs uppercase">Key Resources</h6>
                <p className="text-slate-300">• Web & Mobile Platform</p>
                <p className="text-slate-300">• Data & Matching Algorithm</p>
                <p className="text-slate-300">• Network of Drop-Off Hubs</p>
              </div>
            </div>

            {/* Value Propositions */}
            <div className="bg-emerald-950/80 p-4 rounded-2xl border border-emerald-500/40 space-y-2">
              <h6 className="font-black text-emerald-300 text-xs uppercase">Value Propositions</h6>
              <div className="space-y-1.5 text-emerald-100">
                <div><strong>Untuk Peniaga:</strong> Pulihkan kos sisa, Laporan ESG/CSR automatik.</div>
                <div><strong>Untuk Pelajar:</strong> Makanan murah & donasi percuma.</div>
                <div><strong>Untuk Alam Sekitar:</strong> Kurangkan sisa buangan & CO₂.</div>
                <div className="text-[11px] font-bold text-amber-300 mt-2">"One Surplus Meal, Two Possibilities"</div>
              </div>
            </div>

            {/* Customer Relationships & Channels */}
            <div className="space-y-3">
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1.5">
                <h6 className="font-black text-teal-400 text-xs uppercase">Customer Rel.</h6>
                <p className="text-slate-300">• Self-service app</p>
                <p className="text-slate-300">• Community-based trust</p>
                <p className="text-slate-300">• Automated QR validation</p>
              </div>
              <div className="bg-slate-800/90 p-3.5 rounded-2xl border border-slate-700 space-y-1.5">
                <h6 className="font-black text-teal-400 text-xs uppercase">Channels</h6>
                <p className="text-slate-300">• Web/Mobile App</p>
                <p className="text-slate-300">• Zero Lapar Drop-Off Hubs</p>
                <p className="text-slate-300">• Social Media & University</p>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="bg-slate-800/90 p-4 rounded-2xl border border-slate-700 space-y-2">
              <h6 className="font-black text-emerald-400 text-xs uppercase">Customer Segments</h6>
              <ul className="space-y-1.5 text-slate-300">
                <li><strong>Individuals:</strong> Mahasiswa, B40, price-conscious buyers.</li>
                <li><strong>Businesses:</strong> F&B seeking CSR & revenue recovery.</li>
                <li><strong>Charity:</strong> NGOs & beneficiaries needing meals.</li>
              </ul>
            </div>

          </div>

          <div className="grid grid-cols-2 gap-3 min-w-[700px] pt-3 border-t border-slate-700">
            <div className="bg-slate-800 p-3.5 rounded-xl">
              <span className="font-bold text-rose-400">Cost Structure:</span>
              <p className="text-slate-400 text-[11px] mt-1">Platform development, cloud hosting, marketing & onboarding, maintenance of drop-off points.</p>
            </div>
            <div className="bg-slate-800 p-3.5 rounded-xl">
              <span className="font-bold text-emerald-400">Revenue Streams:</span>
              <p className="text-slate-400 text-[11px] mt-1">Freemium Premium tiers (RM49-199/mth), transaction fee on discounted meals, CSR corporate sponsorship.</p>
            </div>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => setCurrentSlide((prev) => Math.min(slides.length - 1, prev + 1));
  const prevSlide = () => setCurrentSlide((prev) => Math.max(0, prev - 1));

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Presentation Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full w-fit mb-2">
            <Presentation className="w-4 h-4" />
            <span>Koleksi Slaid & Ringkasan Pembentangan PYIC 2026</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            {slides[currentSlide].title}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            {slides[currentSlide].subtitle}
          </p>
        </div>

        {/* Slide Counter */}
        <div className="flex items-center space-x-2">
          <button
            disabled={currentSlide === 0}
            onClick={prevSlide}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-xs font-black text-slate-700 px-2">
            {currentSlide + 1} / {slides.length}
          </span>
          <button
            disabled={currentSlide === slides.length - 1}
            onClick={nextSlide}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Slide Body */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-200">
        {slides[currentSlide].content}
      </div>

      {/* Slide Navigator Dots */}
      <div className="flex justify-center items-center space-x-2">
        {slides.map((s, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-3 rounded-full transition-all ${
              currentSlide === idx ? 'w-8 bg-emerald-600' : 'w-3 bg-slate-300 hover:bg-slate-400'
            }`}
          ></button>
        ))}
      </div>

    </div>
  );
}