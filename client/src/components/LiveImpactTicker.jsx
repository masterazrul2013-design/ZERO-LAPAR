import React from 'react';
import { Utensils, Scale, CloudRain, DollarSign } from 'lucide-react';

export default function LiveImpactTicker({ stats }) {
  const s = stats || {
    totalMealsRescued: 0,
    totalFoodWasteKg: 0,
    totalCO2eSavedKg: 0,
    totalRevenueRecoveredMYR: 0
  };

  const meals = Number(s.totalMealsRescued || s.mealsRescued || 0);
  const waste = Number(s.totalFoodWasteKg || s.foodWasteKg || 0);
  const co2 = Number(s.totalCO2eSavedKg || s.co2SavedKg || 0);
  const revenue = Number(s.totalRevenueRecoveredMYR || s.totalRevenueRecovered || 0);

  return (
    <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white py-4 px-4 sm:px-8 shadow-inner border-y border-emerald-700/50 print:hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-xs uppercase tracking-widest font-bold text-emerald-300">
              Impak Langsung Komuniti (Live ESG)
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 flex-1 max-w-4xl">
            {/* Stat 1 */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                <Utensils className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  {meals.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-200 font-medium">Hidangan Diselamatkan</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <div className="p-2 bg-amber-500/20 text-amber-300 rounded-lg">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  {waste.toFixed(1)} kg
                </div>
                <div className="text-[11px] text-amber-200 font-medium">Sisa Makanan Dielak</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <div className="p-2 bg-teal-500/20 text-teal-300 rounded-lg">
                <CloudRain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  {co2.toFixed(1)} kg
                </div>
                <div className="text-[11px] text-teal-200 font-medium">CO₂ Dielakkan</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
              <div className="p-2 bg-emerald-500/20 text-emerald-300 rounded-lg">
                <DollarSign className="w-5 h-5" />
              </div>
              <div>
                <div className="text-lg font-extrabold text-white">
                  RM {revenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-[11px] text-emerald-200 font-medium">Nilai Dijana Semula</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}