import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import BottomNav from "./components/BottomNav";
import Explore from "./pages/Explore";
import ListingDetail from "./pages/ListingDetail";
import FaydaVerification from "./pages/FaydaVerification";
import PaymentSim from "./pages/PaymentSim";
import HostDashboard from "./pages/HostDashboard";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Inbox from "./pages/Inbox";
import { api } from "./services/api";

export default function App() {
  // Global configurations
  const [language, setLanguage] = useState("am"); // default Amharic
  const [currency, setCurrency] = useState("ETB"); // default ETB
  const currencyRate = 120; // 1 USD = 120 ETB

  // Page Routing & Navigation
  const [activeTab, setActiveTab] = useState("explore");
  const [selectedListingId, setSelectedListingId] = useState(null);
  const [paymentBooking, setPaymentBooking] = useState(null); // active checkout data
  const [searchParams, setSearchParams] = useState({
    area: "all",
    stayType: "nightly",
    checkInDate: "2026-06-10",
    stayLength: 2,
    guests: 1,
    propertyType: "all"
  });

  // User details (Guest & Host) loaded from API
  const [user, setUser] = useState(api.auth.getUser());

  // Master Listings and Bookings sync with API storage
  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [myListings, setMyListings] = useState([]);

  // Load state from local API
  useEffect(() => {
    setListings(api.listings.getAll());
    setBookings(api.bookings.getUserBookings());
    setBookingRequests(api.host.getRequests());
  }, []);

  // Update myListings when listings or user state changes
  useEffect(() => {
    if (user) {
      const allListings = api.listings.getAll();
      // Mock: listings added by host have 'ET-HOST-VERIFIED' or were added during this session, or default l1
      const hostStays = allListings.filter(
        (l) => l.host.faydaId === "ET-HOST-VERIFIED" || l.host.faydaId === user.faydaId || l.id === "l1"
      );
      setMyListings(hostStays);
    } else {
      setMyListings([]);
    }
  }, [user, listings]);

  // Auth Handlers
  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    if (window.confirm(language === "am" ? "እርግጠኛ ነዎት መውጣት ይፈልጋሉ?" : "Are you sure you want to log out?")) {
      api.auth.logout();
      setUser(null);
      setActiveTab("explore");
      setSelectedListingId(null);
      setPaymentBooking(null);
    }
  };

  const handleFaydaVerify = (faydaId, fullName) => {
    const updatedUser = api.auth.updateFayda(faydaId, fullName);
    setUser(updatedUser);
  };

  // Handle selected listing click
  const handleSelectListing = (id) => {
    setSelectedListingId(id);
  };

  // Close listing details and return to list
  const handleBackToExplore = () => {
    setSelectedListingId(null);
  };

  // Trigger booking checkout flow
  const handleBookListing = (bookingDetails) => {
    // 1. Force Login Check
    if (!user) {
      alert(
        language === "am"
          ? "ይህንን ለማድረግ እባክዎ መጀመሪያ በስልክ ቁጥርዎ ይግቡ!"
          : "Please login with your phone number to reserve accommodations!"
      );
      // We will let the routing render the login screen by changing tab, or rendering login overlay
      return;
    }
    // 2. Fayda Validation Check
    if (!user.faydaVerified) {
      alert(
        language === "am"
          ? "ትዕዛዝ ከመፈጸምዎ በፊት እባክዎ በ'አስተናጋጅ' ገጽ ላይ ማንነትዎን ያረጋግጡ!"
          : "Please verify your identity using Fayda ID on the Host page before booking a stay!"
      );
      setActiveTab("host");
      setSelectedListingId(null);
      return;
    }
    setPaymentBooking(bookingDetails);
  };

  // Handle successful payment simulation
  const handlePaymentSuccess = (completedBooking) => {
    // 1. Submit through API
    api.bookings.create(completedBooking);
    
    // 2. Sync UI state
    setBookings(api.bookings.getUserBookings());
    setBookingRequests(api.host.getRequests());

    // 3. Clear detail and payment views, redirect to bookings tab
    setPaymentBooking(null);
    setSelectedListingId(null);
    setActiveTab("bookings");
  };

  // Cancel checkout
  const handleCancelPayment = () => {
    setPaymentBooking(null);
  };

  // Cancel reservation inquiry
  const handleCancelBooking = (bookingId) => {
    if (window.confirm(language === "am" ? "እርግጠኛ ነዎት ይህንን የቤት ትዕዛዝ መሰረዝ ይፈልጋሉ?" : "Are you sure you want to cancel this booking request?")) {
      const updated = api.bookings.cancel(bookingId);
      setBookings(updated);
    }
  };

  // Add new listing from Host Dashboard
  const handleAddListing = (newListing) => {
    const updated = api.listings.create(newListing);
    setListings(updated);
    alert(language === "am" ? "ቤትዎ በትክክል ተመዝግቧል!" : "Property listed successfully!");
  };

  // Host Action: Approve/Reject request
  const handleRequestStatusChange = (requestId, status) => {
    const updated = api.host.updateRequestStatus(requestId, status);
    setBookingRequests(updated);
  };

  // Automatically reset Selected Listing if user switches tab
  useEffect(() => {
    setSelectedListingId(null);
    setPaymentBooking(null);

    // Security: when the renter search system is active (explore tab), 
    // automatically log out the host account to prevent unauthorized access.
    if (activeTab === "explore" && user?.isHost) {
      api.auth.logout();
      setUser(null);
    }
  }, [activeTab, user]);

  // Find listing if detail view is requested
  const selectedListing = listings.find((l) => l.id === selectedListingId);

  return (
    <div className="app-container">
      {/* App Header */}
      <Header
        language={language}
        setLanguage={setLanguage}
        currency={currency}
        setCurrency={setCurrency}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content scroll window */}
      <main className="main-content">
        {paymentBooking ? (
          /* Payment Sim Overrides main tab view if booking is active */
          <PaymentSim
            bookingData={paymentBooking}
            language={language}
            onPaymentSuccess={handlePaymentSuccess}
            onCancel={handleCancelPayment}
          />
        ) : selectedListing ? (
          /* Listing Detail Overrides Explore tab list if a listing is clicked */
          <ListingDetail
            listing={selectedListing}
            language={language}
            currency={currency}
            currencyRate={currencyRate}
            onBack={handleBackToExplore}
            onBook={handleBookListing}
            user={user}
            onAddReview={(listingId, reviewData) => {
              const updated = api.listings.addReview(listingId, reviewData);
              setListings(updated);
            }}
            onContactHost={() => setActiveTab("inbox")}
            initialCheckInDate={searchParams.checkInDate}
            initialStayLength={searchParams.stayLength}
            initialStayType={searchParams.stayType}
            initialGuests={searchParams.guests}
          />
        ) : (
          /* Standard Tab Routing */
          <>
            {/* Explore doesn't require authentication */}
            {activeTab === "explore" && (
              <Explore
                language={language}
                currency={currency}
                currencyRate={currencyRate}
                onSelectListing={handleSelectListing}
                searchParams={searchParams}
                setSearchParams={setSearchParams}
                onHostClick={() => setActiveTab("host")}
              />
            )}

            {/* Private Tab Check Gate */}
            {activeTab !== "explore" && !user ? (
              <Login
                language={language}
                onLoginSuccess={handleLoginSuccess}
              />
            ) : (
              <>
                {activeTab === "bookings" && (
                  <Bookings
                    language={language}
                    bookings={bookings}
                    onCancelBooking={handleCancelBooking}
                  />
                )}
                {activeTab === "inbox" && (
                  <Inbox
                    language={language}
                    user={user}
                  />
                )}
                {activeTab === "host" && (
                  <HostDashboard
                    language={language}
                    currency={currency}
                    userFaydaVerified={user?.faydaVerified || false}
                    onAddListing={handleAddListing}
                    myListings={myListings}
                    setMyListings={setMyListings}
                    bookingRequests={bookingRequests}
                    setBookingRequests={setBookingRequests}
                    onRequestStatusChange={handleRequestStatusChange}
                    user={user}
                    onUpdatePayout={(payoutConfig) => {
                      const updatedUser = api.auth.updatePayout(payoutConfig);
                      setUser(updatedUser);
                    }}
                    onVerifyFayda={(faydaId, fullName) => {
                      const updatedUser = api.auth.updateFayda(faydaId, fullName);
                      setUser(updatedUser);
                    }}
                    onSwitchToTraveling={() => setActiveTab("explore")}
                    onRegisterHost={(regDetails) => {
                      const updated = { 
                        ...user, 
                        isHost: true, 
                        faydaVerified: true,
                        faydaId: regDetails.faydaId,
                        fullName: regDetails.fullName,
                        subCity: regDetails.subCity,
                        payoutConfig: {
                          method: regDetails.payoutMethod,
                          account: regDetails.payoutAccount || "telebirr-0912345678",
                          name: regDetails.fullName
                        }
                      };
                      localStorage.setItem("eb_user", JSON.stringify(updated));
                      setUser(updated);
                    }}
                    onLoginExistingHost={() => {
                      const updated = { 
                        ...user, 
                        isHost: true, 
                        faydaVerified: true,
                        fullName: "Yohannes Kebede Hailemariam",
                        faydaId: "ET-9823-8823-1123"
                      };
                      localStorage.setItem("eb_user", JSON.stringify(updated));
                      setUser(updated);
                    }}
                  />
                )}
              </>
            )}
          </>
        )}
      </main>

      {/* App Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
      />
    </div>
  );
}
