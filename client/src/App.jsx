import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import LiveImpactTicker from './components/LiveImpactTicker';
import LoginPage from './components/LoginPage';
import ConsumerPortal from './components/ConsumerPortal';
import MerchantPortal from './components/MerchantPortal';
import NgoPortal from './components/NgoPortal';
import AdminEsgDashboard from './components/AdminEsgDashboard';
import MerchantContributionReport from './components/MerchantContributionReport';
import PrintableFoodReport from './components/PrintableFoodReport';
import PitchView from './components/PitchView';
import ActiveTicketsModal from './components/ActiveTicketsModal';
import EditProfileModal from './components/EditProfileModal';
import UserManualModal from './components/UserManualModal';
import confetti from 'canvas-confetti';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminViewRole, setAdminViewRole] = useState('admin_dashboard');
  const [merchantActiveTab, setMerchantActiveTab] = useState('manage'); // 'manage', 'analytics', 'report', 'pitch'
  const [consumerActiveTab, setConsumerActiveTab] = useState('browse'); // 'browse', 'pitch'
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [globalBanner, setGlobalBanner] = useState(null);

  // Live Shared Data State
  const [items, setItems] = useState([]);
  const [merchants, setMerchants] = useState([]);
  const [dropoffPoints, setDropoffPoints] = useState([]);
  const [donations, setDonations] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [stats, setStats] = useState(null);
  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('zerolapar_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch(e) { return []; }
  });

  // Fetch all shared data from server
  const fetchData = async () => {
    try {
      const [itemsRes, merchantsRes, dropoffRes, donRes, resRes, esgRes] = await Promise.all([
        fetch('/api/items').then(r => r.json()),
        fetch('/api/merchants').then(r => r.json()),
        fetch('/api/dropoff').then(r => r.json()),
        fetch('/api/donations').then(r => r.json()),
        fetch('/api/reservations').then(r => r.json()),
        fetch('/api/esg/summary').then(r => r.json())
      ]);

      if (itemsRes && itemsRes.success) setItems(itemsRes.data);
      if (merchantsRes && merchantsRes.success) setMerchants(merchantsRes.data);
      if (dropoffRes && dropoffRes.success) setDropoffPoints(dropoffRes.data);
      if (donRes && donRes.success) setDonations(donRes.data);
      if (resRes && resRes.success) setReservations(resRes.data);
      if (esgRes && esgRes.success) setStats(esgRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  useEffect(() => {
    fetchData();

    // Check saved session in localStorage
    const savedUser = localStorage.getItem('zerolapar_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser);
        if (u.role === 'admin') {
          u.name = "MUHAMMAD FAIZ IKHWAN BIN ISMAIL";
          u.email = "faiz@pmtg.edu.my";
        }
        setCurrentUser(u);
      } catch (e) {}
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const handleLoginSuccess = (user) => {
    if (user.role === 'admin') {
      user.name = "MUHAMMAD FAIZ IKHWAN BIN ISMAIL";
      user.email = "faiz@pmtg.edu.my";
    }
    setCurrentUser(user);
    localStorage.setItem('zerolapar_current_user', JSON.stringify(user));
    if (user.role === 'admin') {
      setAdminViewRole('admin_dashboard');
    }
    setGlobalBanner({
      type: 'success',
      text: 'Selamat kembali, ' + user.name + ' (' + (user.roleLabel || user.role) + ')!'
    });
    setTimeout(() => setGlobalBanner(null), 5000);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
  };

  const handleAddReview = (newReview) => {
    setReviews(prev => {
      const updated = [newReview, ...prev];
      try { localStorage.setItem('zerolapar_reviews', JSON.stringify(updated)); } catch(e) {}
      return updated;
    });

    // Update merchant rating dynamically
    setMerchants(prev => prev.map(m => {
      if (m.id === newReview.merchantId || m.name === newReview.merchantName) {
        const currentCount = m.totalReviews || 1;
        const currentRating = Number(m.rating) || 4.8;
        const newRating = Number(((currentRating * currentCount + newReview.rating) / (currentCount + 1)).toFixed(1));
        return {
          ...m,
          rating: newRating,
          totalReviews: currentCount + 1
        };
      }
      return m;
    }));

    setGlobalBanner({
      type: 'success',
      text: 'Terima kasih! Penilaian ' + newReview.rating + ' bintang kepada ' + newReview.merchantName + ' berjaya dihantar.'
    });
    setTimeout(() => setGlobalBanner(null), 5000);
  };

  const handleProfileUpdated = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('zerolapar_current_user', JSON.stringify(updatedUser));
    setGlobalBanner({
      type: 'success',
      text: 'Profil ' + updatedUser.name + ' berjaya dikemaskini!'
    });
    setTimeout(() => setGlobalBanner(null), 4000);
  };

  const handleLogout = () => {
    if (window.confirm('Adakah anda pasti untuk log keluar?')) {
      setCurrentUser(null);
      localStorage.removeItem('zerolapar_current_user');
    }
  };

  const handleReserveItem = async (reserveData) => {
    try {
      const payload = {
        ...reserveData,
        customerName: currentUser?.name || reserveData.customerName || 'Pelajar PMTG',
        customerPhone: currentUser?.phone || reserveData.customerPhone || '+6012-3456789',
        customerEmail: currentUser?.email || 'pelajar@pmtg.edu.my'
      };

      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        await fetchData();
        // Immediately open tickets modal with the newly generated QR
        setTimeout(() => {
          setIsTicketsModalOpen(true);
        }, 100);
      } else {
        alert(data?.error || 'Ralat semasa membuat tempahan');
      }
    } catch (err) {
      console.error('Reserve error:', err);
    }
  };

  const handleAddNewItem = async (newItem) => {
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem)
      });
      await fetchData();
      setGlobalBanner({
        type: 'success',
        text: 'Makanan lebihan \'' + newItem.title + '\' berjaya disenaraikan!'
      });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch (err) {
      console.error('Add item error:', err);
    }
  };

  const handleEditItem = async (updatedItem) => {
    setItems(prevItems => prevItems.map(i => i.id === updatedItem.id ? { ...i, ...updatedItem } : i));

    try {
      const res = await fetch('/api/items/' + updatedItem.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
      const data = await res.json().catch(() => null);
      if (data && data.success && data.data) {
        setItems(prevItems => prevItems.map(i => i.id === data.data.id ? data.data : i));
      }
    } catch (err) {
      console.error('Error saving edit:', err);
    }
  };

  const handleDeleteItem = async (itemId, title) => {
    setItems(prevItems => prevItems.filter(i => i.id !== itemId));

    try {
      await fetch('/api/items/' + itemId, { method: 'DELETE' });
      await fetchData();
      setGlobalBanner({
        type: 'success',
        text: 'Makanan \'' + (title || 'terpilih') + '\' berjaya dipadam!'
      });
      setTimeout(() => setGlobalBanner(null), 4000);
    } catch (err) {
      await fetchData();
    }
  };

  const handleVerifyQrCode = async (codeOrQr) => {
    try {
      const res = await fetch('/api/reservations/verify-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codeOrQr })
      });
      const data = await res.json().catch(() => null);
      if (data && data.success) {
        await fetchData();
        setGlobalBanner({
          type: 'success',
          text: data.message || 'Penebusan berjaya! Nilai ESG dikemaskini.'
        });
        setTimeout(() => setGlobalBanner(null), 6000);
      }
      return data || { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const handleClaimDonation = async (claimData) => {
    try {
      const res = await fetch('/api/donations/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      await fetchData();
      setGlobalBanner({
        type: 'success',
        text: 'Donasi pukal berjaya dituntut oleh NGO!'
      });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch (err) {
      console.error('Claim error:', err);
    }
  };

  const handleUpgradePlan = async (merchantId, plan) => {
    try {
      await fetch('/api/merchants/upgrade-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, plan })
      });
      await fetchData();
    } catch (err) {
      console.error('Upgrade plan error:', err);
    }
  };

  if (!currentUser) {
    return (
      <LoginPage 
        onLoginSuccess={handleLoginSuccess}
        onOpenManual={() => setIsManualModalOpen(true)}
      />
    );
  }

  const userReservations = currentUser.role === 'consumer'
    ? (reservations.filter(r => 
        (r.customerName && currentUser.name && r.customerName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
        (r.customerPhone && currentUser.phone && r.customerPhone === currentUser.phone) ||
        (r.customerEmail && currentUser.email && r.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
      ).length > 0 
        ? reservations.filter(r => 
            (r.customerName && currentUser.name && r.customerName.toLowerCase().includes(currentUser.name.toLowerCase())) ||
            (r.customerPhone && currentUser.phone && r.customerPhone === currentUser.phone) ||
            (r.customerEmail && currentUser.email && r.customerEmail.toLowerCase() === currentUser.email.toLowerCase())
          )
        : reservations) // fallback to show recent reservations so user is never left with an empty modal
    : reservations;

  const activeTicketsCount = userReservations.filter(r => r.status === 'READY_FOR_PICKUP').length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      
      {/* Left Collapsible Sidebar */}
      <Sidebar 
        currentUser={currentUser}
        adminViewRole={adminViewRole}
        setAdminViewRole={setAdminViewRole}
        merchantActiveTab={merchantActiveTab}
        setMerchantActiveTab={setMerchantActiveTab}
        consumerActiveTab={consumerActiveTab}
        setConsumerActiveTab={setConsumerActiveTab}
        isCollapsed={isSidebarCollapsed}
        setIsCollapsed={setIsSidebarCollapsed}
        onOpenProfile={() => setIsProfileModalOpen(true)}
        onLogout={handleLogout}
        activeTicketsCount={activeTicketsCount}
        onOpenTickets={() => setIsTicketsModalOpen(true)}
        onOpenManual={() => setIsManualModalOpen(true)}
      />

      {/* Main Container Area */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 min-w-0 print:ml-0 print:p-0 ${
          isSidebarCollapsed ? 'ml-20' : 'ml-64 sm:ml-72'
        }`}
      >
        
        {/* Clean Top Navbar */}
        <Navbar 
          currentUser={currentUser}
          activeTicketsCount={activeTicketsCount}
          onOpenTickets={() => setIsTicketsModalOpen(true)}
          onLogout={handleLogout}
          onOpenProfile={() => setIsProfileModalOpen(true)}
          adminViewRole={currentUser.role === 'merchant' ? merchantActiveTab : (currentUser.role === 'consumer' ? consumerActiveTab : adminViewRole)}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          onOpenManual={() => setIsManualModalOpen(true)}
        />

        {/* Live ESG Impact Ticker */}
        <LiveImpactTicker stats={stats} />

        {/* Global Impact Toast */}
        {globalBanner && (
          <div className="bg-gradient-to-r from-emerald-700 to-teal-700 text-white text-center py-2.5 px-4 text-xs font-black tracking-wide shadow-md flex items-center justify-center space-x-2 animate-in fade-in slide-in-from-top duration-300 print:hidden">
            <span>✨</span>
            <span>{globalBanner.text}</span>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 w-full px-4 sm:px-8 lg:px-12 py-8 transition-all print:p-0 print:m-0">
          
          {/* 1. STUDENT / CONSUMER PORTAL */}
          {currentUser.role === 'consumer' && (
            <ConsumerPortal 
              items={items}
              merchants={merchants}
              dropoffPoints={dropoffPoints}
              currentUser={currentUser}
              onReserveItem={handleReserveItem}
                onAddReview={handleAddReview}
              onOpenTickets={() => setIsTicketsModalOpen(true)}
              onEditItem={handleEditItem}
              onDeleteItem={handleDeleteItem}
            />
          )}

          {/* 2. MERCHANT PORTAL */}
          {currentUser.role === 'merchant' && (
            <MerchantPortal 
              items={items}
              merchants={merchants}
              reservations={reservations}
              currentUser={currentUser}
              onAddNewItem={handleAddNewItem}
              onVerifyQrCode={handleVerifyQrCode}
              onUpgradePlan={handleUpgradePlan}
              activeMerchantTab={merchantActiveTab}
              setActiveMerchantTab={setMerchantActiveTab}
            />
          )}

          {/* 3. NGO / VOLUNTEER PORTAL */}
          {currentUser.role === 'ngo' && (
            <NgoPortal 
              items={items}
              donations={donations}
              dropoffPoints={dropoffPoints}
              currentUser={currentUser}
              onClaimDonation={handleClaimDonation}
            />
          )}

          {/* 4. ADMIN ESG DASHBOARD & MANAGEMENT TABS */}
          {currentUser.role === 'admin' && (
            <>
              {adminViewRole === 'admin_dashboard' && (
                <AdminEsgDashboard 
                  stats={stats}
                  merchants={merchants}
                  items={items}
                  initialTab="esg"
                  onRefreshData={fetchData}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}

              {adminViewRole === 'admin_food' && (
                <AdminEsgDashboard 
                  stats={stats}
                  merchants={merchants}
                  items={items}
                  initialTab="food_mgmt"
                  onRefreshData={fetchData}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}

              {adminViewRole === 'admin_users' && (
                <AdminEsgDashboard 
                  stats={stats}
                  merchants={merchants}
                  items={items}
                  initialTab="users_mgmt"
                  onRefreshData={fetchData}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}

              {adminViewRole === 'admin_merchants' && (
                <MerchantContributionReport 
                  merchants={merchants}
                  items={items}
                  reservations={reservations}
                />
              )}

              {adminViewRole === 'admin_reports' && (
                <PrintableFoodReport 
                  items={items}
                  reservations={reservations}
                  donations={donations}
                  merchants={merchants}
                />
              )}

              {adminViewRole === 'consumer' && (
                <ConsumerPortal 
                  items={items}
                  merchants={merchants}
                  dropoffPoints={dropoffPoints}
                  currentUser={currentUser}
                  onReserveItem={handleReserveItem}
                  onOpenTickets={() => setIsTicketsModalOpen(true)}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}

              {adminViewRole === 'merchant' && (
                <MerchantPortal 
                  items={items}
                  merchants={merchants}
                  reservations={reservations}
                  currentUser={currentUser}
                  onAddNewItem={handleAddNewItem}
                  onVerifyQrCode={handleVerifyQrCode}
                  onUpgradePlan={handleUpgradePlan}
                  activeMerchantTab={merchantActiveTab}
                  setActiveMerchantTab={setMerchantActiveTab}
                />
              )}

              {adminViewRole === 'ngo' && (
                <NgoPortal 
                  items={items}
                  donations={donations}
                  dropoffPoints={dropoffPoints}
                  currentUser={currentUser}
                  onClaimDonation={handleClaimDonation}
                />
              )}

              {adminViewRole === 'pitch' && (
                <PitchView />
              )}
            </>
          )}

        </main>

        {/* Active Tickets Modal */}
        <ActiveTicketsModal
          isOpen={isTicketsModalOpen}
          onClose={() => setIsTicketsModalOpen(false)}
          reservations={userReservations}
          onVerifyQrCode={handleVerifyQrCode}
        />

        {/* Edit Profile Modal for Current User */}
        <EditProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onProfileUpdated={handleProfileUpdated}
        />

        {/* Interactive User Manual Modal */}
        <UserManualModal
          isOpen={isManualModalOpen}
          onClose={() => setIsManualModalOpen(false)}
          initialRole={currentUser ? currentUser.role : 'consumer'}
        />

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 print:hidden mt-12">
          <div className="w-full px-4 sm:px-8 space-y-2">
            <div className="font-bold text-slate-800">
              🌱 ZERO LAPAR — The Digital Food Redistribution Platform
            </div>
            <div>
              Dibangunkan oleh Pasukan Pelajar <strong>Politeknik METrO Tasek Gelugor (PMTG)</strong> untuk <strong>Pertandingan PYIC 2026</strong>.
            </div>
            <div className="text-slate-400">
              Less Waste. More Meals. More Impact. • Pangkalan Data Bersepadu Masa-Nyata.
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}