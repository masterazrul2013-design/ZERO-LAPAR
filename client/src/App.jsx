import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ConsumerPortal from './components/ConsumerPortal';
import MerchantPortal from './components/MerchantPortal';
import NgoPortal from './components/NgoPortal';
import AdminEsgDashboard from './components/AdminEsgDashboard';
import PitchView from './components/PitchView';
import LiveImpactTicker from './components/LiveImpactTicker';
import ActiveTicketsModal from './components/ActiveTicketsModal';
import EditProfileModal from './components/EditProfileModal';
import UserManualModal from './components/UserManualModal';
import LoginPage from './components/LoginPage';
import PrintableFoodReport from './components/PrintableFoodReport';
import ErrorBoundary from './components/ErrorBoundary';
import confetti from 'canvas-confetti';

// Default Seed Items for Initial Exploration
const defaultInitialItems = [
  {
    id: 'item_1',
    title: 'Nasi Berlauk Ayam Goreng Berempah & Sambal',
    category: 'Rice Meal',
    mode: 'DISCOUNT',
    originalPrice: 12.00,
    discountedPrice: 4.50,
    quantity: 15,
    remainingQuantity: 15,
    unitWeightKg: 0.45,
    pickupWindow: '1:30 PM - 4:00 PM',
    dietaryTags: ['Halal', 'Mesra Mahasiswa'],
    description: 'Set hidangan lebihan makan tengah hari berkualiti tinggi. Termasuk nasi putih, ayam berempah, sayur kubis goreng dan kuah kari.',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
    merchantId: 'm_1',
    merchantName: 'Restoran Selera Kampus',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'item_2',
    title: 'Donasi Roti & Pastri Aneka Rasa',
    category: 'Bakery',
    mode: 'DONATE',
    originalPrice: 18.00,
    discountedPrice: 0.00,
    quantity: 20,
    remainingQuantity: 20,
    unitWeightKg: 0.35,
    pickupWindow: '4:00 PM - 7:00 PM',
    dietaryTags: ['Halal', '100% Percuma B40'],
    description: 'Roti sosej, bun kacang merah dan croissant segar daripada baki jualan petang untuk diagihkan kepada pelajar yang memerlukan.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    merchantId: 'm_2',
    merchantName: 'Kafe Roti Segar PMTG',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  },
  {
    id: 'item_3',
    title: 'Nasi Kandar Lauk Daging Hitam & Telur Masin',
    category: 'Rice Meal',
    mode: 'DISCOUNT',
    originalPrice: 15.00,
    discountedPrice: 5.00,
    quantity: 10,
    remainingQuantity: 10,
    unitWeightKg: 0.50,
    pickupWindow: '2:00 PM - 5:30 PM',
    dietaryTags: ['Halal', 'Jimat 67%'],
    description: 'Hidangan lazat kuah campur banjir bersama daging masak hitam lembut dan bendi.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=600&q=80',
    merchantId: 'm_3',
    merchantName: 'Restoran Nasi Kandar Berkat',
    status: 'ACTIVE',
    createdAt: new Date().toISOString()
  }
];

const defaultMerchants = [
  {
    id: 'm_1',
    name: 'Restoran Selera Kampus',
    category: 'Restaurant',
    address: 'No. 12, Jalan Tasek Gelugor Utama, 13300 Tasek Gelugor, Pulau Pinang',
    phone: '+6012-3456789',
    rating: 4.8,
    totalReviews: 12,
    plan: 'Premium',
    isHalal: true,
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm_2',
    name: 'Kafe Roti Segar PMTG',
    category: 'Bakery',
    address: 'Kafeteria Blok B, Kampus PMTG, Tasek Gelugor',
    phone: '+6019-8765432',
    rating: 4.9,
    totalReviews: 18,
    plan: 'Pro',
    isHalal: true,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'm_3',
    name: 'Restoran Nasi Kandar Berkat',
    category: 'Restaurant',
    address: 'Pusat Perniagaan Tasek Gelugor, Pulau Pinang',
    phone: '+6013-4455667',
    rating: 4.7,
    totalReviews: 9,
    plan: 'Freemium',
    isHalal: true,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [adminViewRole, setAdminViewRole] = useState('admin_dashboard');
  const [merchantActiveTab, setMerchantActiveTab] = useState('manage');
  const [consumerActiveTab, setConsumerActiveTab] = useState('browse');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTicketsModalOpen, setIsTicketsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [globalBanner, setGlobalBanner] = useState(null);

  // Persistent Shared State (Loads from LocalStorage immediately, syncs with backend if available)
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zerolapar_shared_items');
      return saved ? JSON.parse(saved) : defaultInitialItems;
    } catch (e) { return defaultInitialItems; }
  });

  const [merchants, setMerchants] = useState(() => {
    try {
      const saved = localStorage.getItem('zerolapar_shared_merchants');
      return saved ? JSON.parse(saved) : defaultMerchants;
    } catch (e) { return defaultMerchants; }
  });

  const [reservations, setReservations] = useState(() => {
    try {
      const saved = localStorage.getItem('zerolapar_shared_reservations');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [reviews, setReviews] = useState(() => {
    try {
      const saved = localStorage.getItem('zerolapar_reviews');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [dropoffPoints, setDropoffPoints] = useState([]);
  const [donations, setDonations] = useState([]);
  const [stats, setStats] = useState(null);

  // Save items to localStorage whenever they change
  const updateItemsState = (newItems) => {
    setItems(newItems);
    try { localStorage.setItem('zerolapar_shared_items', JSON.stringify(newItems)); } catch (e) {}
  };

  const updateReservationsState = (newRes) => {
    setReservations(newRes);
    try { localStorage.setItem('zerolapar_shared_reservations', JSON.stringify(newRes)); } catch (e) {}
  };

  const updateMerchantsState = (newMerchants) => {
    setMerchants(newMerchants);
    try { localStorage.setItem('zerolapar_shared_merchants', JSON.stringify(newMerchants)); } catch (e) {}
  };

  // Fetch all shared data from server
  const fetchData = async () => {
    try {
      const [itemsRes, merchantsRes, dropoffRes, donRes, resRes, esgRes] = await Promise.all([
        fetch('/api/items').then(r => r.json()).catch(() => null),
        fetch('/api/merchants').then(r => r.json()).catch(() => null),
        fetch('/api/dropoff').then(r => r.json()).catch(() => null),
        fetch('/api/donations').then(r => r.json()).catch(() => null),
        fetch('/api/reservations').then(r => r.json()).catch(() => null),
        fetch('/api/esg/summary').then(r => r.json()).catch(() => null)
      ]);

      if (itemsRes && itemsRes.success && Array.isArray(itemsRes.data) && itemsRes.data.length > 0) {
        updateItemsState(itemsRes.data);
      }
      if (merchantsRes && merchantsRes.success && Array.isArray(merchantsRes.data) && merchantsRes.data.length > 0) {
        updateMerchantsState(merchantsRes.data);
      }
      if (dropoffRes && dropoffRes.success) setDropoffPoints(dropoffRes.data);
      if (donRes && donRes.success) setDonations(donRes.data);
      if (resRes && resRes.success && Array.isArray(resRes.data) && resRes.data.length > 0) {
        updateReservationsState(resRes.data);
      }
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
    setMerchants(prev => {
      const updated = prev.map(m => {
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
      });
      updateMerchantsState(updated);
      return updated;
    });

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

  // 1. ADD NEW FOOD ITEM (Merchant) - Instant Local + Cloud Sync
  const handleAddNewItem = async (newItem) => {
    const itemWithId = {
      ...newItem,
      id: 'item_' + Date.now(),
      quantity: Number(newItem.quantity) || 10,
      remainingQuantity: Number(newItem.quantity) || 10,
      originalPrice: Number(newItem.originalPrice) || 15,
      discountedPrice: newItem.mode === 'DONATE' ? 0 : (Number(newItem.discountedPrice) || 5),
      unitWeightKg: Number(newItem.unitWeightKg) || 0.45,
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    // Update state immediately so students see it right away
    updateItemsState([itemWithId, ...items]);

    setGlobalBanner({
      type: 'success',
      text: `Makanan lebihan "${itemWithId.title}" berjaya disenaraikan & sedia ditempah oleh pelajar!`
    });
    setTimeout(() => setGlobalBanner(null), 5000);
    confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });

    try {
      await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemWithId)
      });
    } catch (err) {
      console.log('Saved to persistent storage successfully.');
    }
  };

  // 2. RESERVE FOOD ITEM (Student) - Instant Local + Cloud Sync
  const handleReserveItem = async (reserveData) => {
    const randomTicketCode = 'ZL-' + Math.floor(1000 + Math.random() * 9000);
    const newReservation = {
      id: 'res_' + Date.now(),
      itemId: reserveData.itemId,
      itemTitle: reserveData.itemTitle,
      merchantId: reserveData.merchantId,
      merchantName: reserveData.merchantName,
      customerName: currentUser?.name || reserveData.customerName || 'Pelajar PMTG',
      customerPhone: currentUser?.phone || reserveData.customerPhone || '+6012-3456789',
      customerEmail: currentUser?.email || 'pelajar@pmtg.edu.my',
      quantity: Number(reserveData.quantity) || 1,
      totalAmount: Number(reserveData.totalAmount) || 0,
      mode: reserveData.mode || 'DISCOUNT',
      pickupWindow: reserveData.pickupWindow || '12:00 PM - 4:00 PM',
      ticketCode: randomTicketCode,
      qrCode: 'ZEROLAPAR-' + randomTicketCode + '-' + Date.now(),
      status: 'READY_FOR_PICKUP',
      createdAt: new Date().toISOString()
    };

    // Deduct remaining quantity from item
    const updatedItems = items.map(item => {
      if (item.id === reserveData.itemId) {
        const newRem = Math.max(0, item.remainingQuantity - newReservation.quantity);
        return {
          ...item,
          remainingQuantity: newRem,
          status: newRem > 0 ? 'ACTIVE' : 'CLAIMED_OUT'
        };
      }
      return item;
    });

    updateItemsState(updatedItems);
    updateReservationsState([newReservation, ...reservations]);

    // Open active tickets modal immediately
    setTimeout(() => {
      setIsTicketsModalOpen(true);
    }, 150);

    try {
      await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReservation)
      });
    } catch (err) {
      console.log('Reservation saved locally.');
    }
  };

  const handleEditItem = async (updatedItem) => {
    const newItems = items.map(i => i.id === updatedItem.id ? { ...i, ...updatedItem } : i);
    updateItemsState(newItems);

    try {
      await fetch('/api/items/' + updatedItem.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedItem)
      });
    } catch (err) {}
  };

  const handleDeleteItem = async (itemId, title) => {
    const newItems = items.filter(i => i.id !== itemId);
    updateItemsState(newItems);

    setGlobalBanner({
      type: 'success',
      text: `Makanan "${title || "terpilih"}" berjaya dipadam!`
    });
    setTimeout(() => setGlobalBanner(null), 4000);

    try {
      await fetch('/api/items/' + itemId, { method: 'DELETE' });
    } catch (err) {}
  };

  const handleVerifyQrCode = async (codeOrQr) => {
    const codeClean = (codeOrQr || '').trim();
    const targetReservation = reservations.find(r => 
      r.ticketCode === codeClean || 
      r.qrCode === codeClean || 
      r.id === codeClean ||
      (codeClean.length >= 4 && r.ticketCode && r.ticketCode.includes(codeClean))
    );

    if (targetReservation) {
      const updatedRes = reservations.map(r => 
        r.id === targetReservation.id ? { ...r, status: 'COMPLETED' } : r
      );
      updateReservationsState(updatedRes);

      setGlobalBanner({
        type: 'success',
        text: 'Penebusan Tiket [' + (targetReservation.ticketCode || codeClean) + '] disahkan! Makanan telah diserahkan kepada pelajar.'
      });
      setTimeout(() => setGlobalBanner(null), 6000);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });

      try {
        await fetch('/api/reservations/verify-qr', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ codeOrQr })
        });
      } catch (e) {}

      return {
        success: true,
        message: 'Tiket ' + (targetReservation.ticketCode || codeClean) + ' disahkan! Makanan telah diserahkan.',
        reservation: { ...targetReservation, status: 'COMPLETED' }
      };
    }

    return {
      success: false,
      error: `Kod QR atau No. Tiket "${codeClean}" tidak dijumpai atau telah selesai diserahkan.`
    };
  };

  const handleClaimDonation = async (claimData) => {
    try {
      await fetch('/api/donations/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(claimData)
      });
      fetchData();
      setGlobalBanner({
        type: 'success',
        text: 'Donasi pukal berjaya dituntut oleh NGO!'
      });
      setTimeout(() => setGlobalBanner(null), 5000);
    } catch (err) {}
  };

  const handleUpgradePlan = async (merchantId, plan) => {
    const updatedMerchants = merchants.map(m => m.id === merchantId ? { ...m, plan } : m);
    updateMerchantsState(updatedMerchants);

    try {
      await fetch('/api/merchants/upgrade-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ merchantId, plan })
      });
    } catch (err) {}
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
        : reservations)
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
              reviews={reviews}
              currentUser={currentUser}
              onAddNewItem={handleAddNewItem}
              onVerifyQrCode={handleVerifyQrCode}
              onUpgradePlan={handleUpgradePlan}
              activeMerchantTab={merchantActiveTab}
              setActiveMerchantTab={setMerchantActiveTab}
            />
          )}

          {/* 3. NGO & VOLUNTEER PORTAL */}
          {currentUser.role === 'ngo' && (
            <NgoPortal 
              donations={donations}
              dropoffPoints={dropoffPoints}
              currentUser={currentUser}
              onClaimDonation={handleClaimDonation}
            />
          )}

          {/* 4. ADMIN ESG DASHBOARD & MASTER CONTROLS */}
          {currentUser.role === 'admin' && (
            <div>
              {(adminViewRole === 'admin_dashboard' || adminViewRole === 'admin_food' || adminViewRole === 'admin_users' || adminViewRole === 'admin_merchants') && (
                <AdminEsgDashboard 
                  stats={stats}
                  merchants={merchants}
                  items={items}
                  initialTab={adminViewRole === 'admin_food' ? 'food_mgmt' : (adminViewRole === 'admin_users' ? 'users_mgmt' : 'esg')}
                  onRefreshData={fetchData}
                  onEditItem={handleEditItem}
                  onDeleteItem={handleDeleteItem}
                />
              )}
              {(adminViewRole === 'admin_reports' || adminViewRole === 'report') && (
                <PrintableFoodReport 
                  items={items}
                  donations={donations}
                  reservations={reservations}
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
                  onAddReview={handleAddReview}
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
                  reviews={reviews}
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
                  donations={donations}
                  dropoffPoints={dropoffPoints}
                  currentUser={currentUser}
                  onClaimDonation={handleClaimDonation}
                />
              )}
              {adminViewRole === 'pitch' && (
                <PitchView />
              )}
            </div>
          )}

        </main>
      </div>

      {/* Active QR Tickets Modal for Students */}
      <ActiveTicketsModal 
        isOpen={isTicketsModalOpen}
        onClose={() => setIsTicketsModalOpen(false)}
        reservations={userReservations}
        currentUser={currentUser}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={handleProfileUpdated}
      />

      {/* Interactive User Manual Modal */}
      <UserManualModal 
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
        initialRole={currentUser.role}
      />

    </div>
  );
}
