import React, { useState } from "react";
import { Plus, ShieldAlert, CheckCircle, MapPin, Zap, Droplets, Wifi, Power, MessageSquare, AlertCircle, Crosshair, Home, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import ActiveMap from "../components/ActiveMap";
import { api } from "../services/api";


export default function HostDashboard({ language, currency, userFaydaVerified, onAddListing, myListings, bookingRequests, setBookingRequests, onRequestStatusChange, user, onUpdatePayout, onVerifyFayda, onSwitchToTraveling, onRegisterHost, onLoginExistingHost }) {
  const [activeHostTab, setActiveHostTab] = useState("today"); // today | calendar | listings | messages
  const [activeTodayFilter, setActiveTodayFilter] = useState("today"); // today | upcoming
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTelegramSim, setShowTelegramSim] = useState(false);
  const [telegramStatus, setTelegramStatus] = useState("idle"); // idle | active | approved | rejected
  const [showSandwichMenu, setShowSandwichMenu] = useState(false);

  // Host registration local states
  const [regName, setRegName] = useState(user?.fullName || "");
  const [regFayda, setRegFayda] = useState("ET-" + Math.floor(1000 + Math.random() * 9000) + "-1122-3344");
  const [regSubCity, setRegSubCity] = useState("Bole");
  const [regPayoutMethod, setRegPayoutMethod] = useState("telebirr");
  const [regPayoutAccount, setRegPayoutAccount] = useState("");
  const [regFormView, setRegFormView] = useState(false);

  // Settings page overlay states
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [activeSettingsTab, setActiveSettingsTab] = useState("personal"); // personal | security | privacy | notifications | taxes | payments | languages

  // Field values editing states
  const [editFieldName, setEditFieldName] = useState(false);
  const [editFieldPreferred, setEditFieldPreferred] = useState(false);
  const [editFieldEmail, setEditFieldEmail] = useState(false);
  const [editFieldPhone, setEditFieldPhone] = useState(false);

  // Field values temporary edit storage
  const [tempLegalName, setTempLegalName] = useState(user?.fullName || "Yohannes Kebede Hailemariam");
  const [tempPreferredName, setTempPreferredName] = useState(user?.preferredName || "Yohannes");
  const [tempEmail, setTempEmail] = useState(user?.email || "y***s@gmail.com");
  const [tempPhone, setTempPhone] = useState(user?.phoneNumber || "+251 912 345 678");

  // Fayda ID verification inputs
  const [faydaInput, setFaydaInput] = useState("ET-" + Math.floor(1000 + Math.random() * 9000) + "-1122-3344");
  const [nameInput, setNameInput] = useState(user?.fullName || "Yohannes Kebede Hailemariam");

  // Chat messaging states for host
  const [chatMessages, setChatMessages] = useState([]);
  const [hostReplyText, setHostReplyText] = useState("");

  // Load chat messages when host tab changes or on mount
  React.useEffect(() => {
    const saved = localStorage.getItem("eb_chat_messages");
    if (saved) {
      setChatMessages(JSON.parse(saved));
    }
  }, [activeHostTab]);

  // Sync temp variables if user changes
  React.useEffect(() => {
    if (user) {
      setTempLegalName(user.fullName || "Yohannes Kebede Hailemariam");
      setTempPreferredName(user.preferredName || "Yohannes");
      setTempPhone(user.phoneNumber || "+251 912 345 678");
    }
  }, [user]);



  // Calendar management states
  const [selectedCalendarListingId, setSelectedCalendarListingId] = useState("l1");
  const [selectedMonthKey, setSelectedMonthKey] = useState("2026-06"); // YYYY-MM
  const [selectedCalendarDate, setSelectedCalendarDate] = useState("2026-06-19"); // Pre-select a date in June 2026
  const [blockedDates, setBlockedDates] = useState([]);

  // Sync selected listing if list updates and selectedListingId is not in it
  React.useEffect(() => {
    if (myListings.length > 0) {
      const exists = myListings.some(l => l.id === selectedCalendarListingId);
      if (!exists) {
        setSelectedCalendarListingId(myListings[0].id);
      }
    }
  }, [myListings]);

  // Load blocked dates from API service
  React.useEffect(() => {
    if (selectedCalendarListingId) {
      setBlockedDates(api.blockedDates.getForListing(selectedCalendarListingId));
    }
  }, [selectedCalendarListingId]);

  // Save blocked dates helper
  const handleToggleBlockedDate = (dateStr) => {
    let newBlocked;
    if (blockedDates.includes(dateStr)) {
      newBlocked = blockedDates.filter(d => d !== dateStr);
    } else {
      newBlocked = [...blockedDates, dateStr];
    }
    setBlockedDates(newBlocked);
    api.blockedDates.saveForListing(selectedCalendarListingId, newBlocked);
  };


  // Earnings calculations
  const approvedBookings = bookingRequests.filter((r) => r.status === "approved");
  const totalEarnings = approvedBookings.reduce((sum, r) => sum + r.totalETB, 0);

  // Payout Config States
  const [payoutMethod, setPayoutMethod] = useState(user?.payoutConfig?.method || "telebirr");
  const [payoutAccount, setPayoutAccount] = useState(user?.payoutConfig?.account || "");
  const [payoutName, setPayoutName] = useState(user?.payoutConfig?.name || "");
  const [showPayoutForm, setShowPayoutForm] = useState(false);

  React.useEffect(() => {
    if (user?.payoutConfig) {
      setPayoutMethod(user.payoutConfig.method || "telebirr");
      setPayoutAccount(user.payoutConfig.account || "");
      setPayoutName(user.payoutConfig.name || "");
    }
  }, [user]);

  // GPS Location States for listing creation
  const [gpsLocation, setGpsLocation] = useState(null);
  const [isLocating, setIsLocating] = useState(false);

  const handleGetLocation = () => {
    setIsLocating(true);
    if (!navigator.geolocation) {
      alert(language === "am" ? "ይቅርታ! የእርስዎ ስልክ ጂፒኤስ አገልግሎት አይሰጥም።" : "Geolocation is not supported by your browser.");
      setGpsLocation({ lat: 9.0182, lng: 38.7749, mocked: true });
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setGpsLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          mocked: false
        });
        setIsLocating(false);
      },
      (error) => {
        console.warn("Geolocation failed, using mock coordinates", error);
        setGpsLocation({
          lat: 9.0182 + (Math.random() - 0.5) * 0.01,
          lng: 38.7749 + (Math.random() - 0.5) * 0.01,
          mocked: true
        });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Form fields
  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [type, setType] = useState("guesthouse");
  const [subCity, setSubCity] = useState("Bole");
  const [landmarkEn, setLandmarkEn] = useState("");
  const [landmarkAm, setLandmarkAm] = useState("");
  const [duration, setDuration] = useState("nightly");
  const [priceETB, setPriceETB] = useState(2500);
  const [priceMonthlyETB, setPriceMonthlyETB] = useState(45000);
  
  // Backups
  const [hasGen, setHasGen] = useState(true);
  const [genType, setGenType] = useState("Automatic Generator");
  const [hasWater, setHasWater] = useState(true);
  const [waterType, setWaterType] = useState("5,000L Reserve Tank");
  const [hasWifi, setHasWifi] = useState(true);
  const [wifiType, setWifiType] = useState("Fiber Broadband");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!titleEn || !titleAm || !landmarkEn || !landmarkAm) {
      alert(language === "am" ? "እባክዎ ሁሉንም መረጃዎች ይሙሉ!" : "Please fill in all listing details!");
      return;
    }

    const newListing = {
      id: "host-l-" + Math.floor(Math.random() * 1000),
      title: { am: titleAm, en: titleEn },
      type,
      subCity: {
        am: subCity === "Bole" ? "ቦሌ" : subCity === "Sarbet" ? "ሳር ቤት" : subCity === "Kazanchis" ? "ካዛንቺስ" : subCity === "Lebu" ? "ለቡ" : "ኦልድ ኤርፖርት",
        en: subCity
      },
      landmark: { am: landmarkAm, en: landmarkEn },
      duration,
      priceETB: Number(priceETB),
      priceETB_monthly: duration === "monthly" || duration === "both" ? Number(priceMonthlyETB) : undefined,
      rating: 5.0,
      reviewsCount: 0,
      image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
      amenities: ["WiFi", "Kitchen", "Security"],
      backups: {
        electricity: { available: hasGen, type: hasGen ? genType : "None" },
        water: { available: hasWater, type: hasWater ? waterType : "None" },
        wifi: { available: hasWifi, type: hasWifi ? wifiType : "None" }
      },
      host: {
        name: "Verified Host",
        verifiedFayda: true,
        faydaId: "ET-HOST-VERIFIED",
        rating: 5.0
      },
      gps: gpsLocation,
      description: {
        am: `${titleAm} ቦሌ አዲስ አበባ በሚገኝ እጅግ ዘመናዊ ሰፈር ውስጥ ምቹ ማረፊያ።`,
        en: `${titleEn} is a beautiful and cozy stay located in Addis Ababa.`
      }
    };

    onAddListing(newListing);
    
    // Reset form
    setTitleEn("");
    setTitleAm("");
    setLandmarkEn("");
    setLandmarkAm("");
    setGpsLocation(null);
    setShowAddForm(false);
  };

  const handleApproveRequest = (id) => {
    if (onRequestStatusChange) {
      onRequestStatusChange(id, "approved");
    } else {
      setBookingRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "approved" } : req))
      );
    }
  };

  const handleRejectRequest = (id) => {
    if (onRequestStatusChange) {
      onRequestStatusChange(id, "rejected");
    } else {
      setBookingRequests((prev) =>
        prev.map((req) => (req.id === id ? { ...req, status: "rejected" } : req))
      );
    }
  };

  // Simulate Telegram action
  const triggerTelegramSim = () => {
    if (bookingRequests.length === 0) {
      alert(language === "am" ? "ምንም የኪራይ ጥያቄ የለም!" : "No booking requests available to simulate!");
      return;
    }
    setTelegramStatus("active");
    setShowTelegramSim(true);
  };

  const handleTelegramApprove = () => {
    const targetId = bookingRequests[0].id;
    handleApproveRequest(targetId);
    setTelegramStatus("approved");
    setTimeout(() => {
      setShowTelegramSim(false);
      setTelegramStatus("idle");
    }, 1500);
  };

  const handleTelegramReject = () => {
    const targetId = bookingRequests[0].id;
    handleRejectRequest(targetId);
    setTelegramStatus("rejected");
    setTimeout(() => {
      setShowTelegramSim(false);
      setTelegramStatus("idle");
    }, 1500);
  };

  // If user hasn't registered to host a home, show the hosting landing page first.
  if (!user?.isHost) {
    return (
      <div style={{ padding: "24px 16px", fontFamily: "Outfit, sans-serif", maxWidth: "480px", margin: "0 auto" }}>
        
        {/* Header Section */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              backgroundColor: "rgba(211, 84, 0, 0.08)",
              color: "var(--terracotta)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px auto"
            }}
          >
            <Home size={28} />
          </div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "4px" }}>
            {language === "am" ? "በእንደ ቤቴ ላይ ቤትዎን ያከራዩ" : "Become a Host on Ende Bete"}
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
            {language === "am" ? "ከተረጋገጡ ተከራዮች ጋር በደህንነት ይገናኙ!" : "Connect securely with verified renters!"}
          </p>
        </div>

        {!regFormView ? (
          /* Choice View */
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Benefits Grid */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", textAlign: "left", backgroundColor: "var(--bg-white)", padding: "16px", border: "1px solid var(--border-color)", borderRadius: "14px" }}>
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.25rem" }}>💰</span>
                <div>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: "700", margin: 0, color: "var(--text-dark)" }}>
                    {language === "am" ? "ጥሩ ገቢ ያግኙ" : "Earn Competitive Income"}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    {language === "am" ? "በቀን ወይም በወር በማከራየት በብር ወይም በዶላር ክፍያ ያግኙ።" : "Set your own rates and get paid in ETB or USD dynamically."}
                  </p>
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.25rem" }}>🛡️</span>
                <div>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: "700", margin: 0, color: "var(--text-dark)" }}>
                    {language === "am" ? "የፋይዳ ጥበቃ ዋስትና" : "Fayda Digital ID Verification"}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    {language === "am" ? "ሁሉም እንግዶች የፋይዳ ብሔራዊ መታወቂያ የተረጋገጠባቸው ናቸው።" : "Every guest is verified using the national ID system for your safety."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.25rem" }}>📱</span>
                <div>
                  <h4 style={{ fontSize: "0.82rem", fontWeight: "700", margin: 0, color: "var(--text-dark)" }}>
                    {language === "am" ? "ቀላል ቁጥጥር" : "Manage with Ease"}
                  </h4>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "2px 0 0 0" }}>
                    {language === "am" ? "የቀን መቁጠሪያ፣ ዋጋዎችን እና መልዕክቶችን በአንድ ቦታ ይቆጣጠሩ።" : "Manage bookings, block unavailable dates, and chat live on the app."}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                id="btn-register-new-host-trigger"
                onClick={() => setRegFormView(true)}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.82rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "var(--terracotta)",
                  color: "#FFF",
                  boxShadow: "0 4px 12px rgba(211, 84, 0, 0.15)"
                }}
              >
                👤 {language === "am" ? "አዲስ አስተናጋጅ ምዝገባ" : "Register as a New Host"}
              </button>

              <button
                id="btn-login-current-host-trigger"
                onClick={onLoginExistingHost}
                className="btn-success"
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "12px",
                  fontSize: "0.82rem",
                  fontWeight: "800",
                  cursor: "pointer",
                  border: "none",
                  backgroundColor: "var(--ethiopian-green)",
                  color: "#FFF",
                  boxShadow: "0 4px 12px rgba(30, 130, 76, 0.15)"
                }}
              >
                🔑 {language === "am" ? "እንደ ነባር አስተናጋጅ ግባ (Today)" : "Log In as Current Host"}
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form View with Back Button */
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* Back to Options button */}
            <button
              onClick={() => setRegFormView(false)}
              style={{
                border: "none",
                background: "none",
                color: "var(--text-muted)",
                fontSize: "0.75rem",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 0",
                alignSelf: "flex-start"
              }}
            >
              ← {language === "am" ? "ወደ አማራጮች ይመለሱ" : "Back to Options"}
            </button>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!regName.trim() || !regFayda.trim() || !regPayoutAccount.trim()) {
                  alert(language === "am" ? "እባክዎ ሁሉንም መረጃዎች በትክክል ይሙሉ!" : "Please fill in all registration fields!");
                  return;
                }
                onRegisterHost({
                  fullName: regName,
                  faydaId: regFayda,
                  subCity: regSubCity,
                  payoutMethod: regPayoutMethod,
                  payoutAccount: regPayoutAccount
                });
                alert(
                  language === "am"
                    ? "የአስተናጋጅነት መለያዎ ተመዝግቦ በፋይዳ መለያዎ ጸድቋል!"
                    : "Host registration completed & verified with Fayda successfully!"
                );
              }}
              className="card-premium"
              style={{
                backgroundColor: "var(--bg-white)",
                padding: "16px",
                border: "1.5px solid var(--border-color)",
                borderRadius: "16px",
                textAlign: "left"
              }}
            >
              <h4 style={{ fontSize: "0.82rem", fontWeight: "800", color: "var(--terracotta)", marginBottom: "14px", textTransform: "uppercase" }}>
                📋 {language === "am" ? "የአስተናጋጅ ምዝገባ ፎርም" : "Host Registration Details"}
              </h4>

              {/* Legal Name */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.68rem" }}>
                  👤 {language === "am" ? "ህጋዊ ሙሉ ስም" : "Legal Full Name"}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  placeholder="e.g., Yohannes Kebede"
                  required
                  style={{ fontSize: "0.78rem", padding: "8px 10px" }}
                />
              </div>

              {/* Fayda ID */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.68rem" }}>
                  🛡️ {language === "am" ? "የፋይዳ ብሔራዊ ዲጂታል መታወቂያ" : "Fayda National ID"}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={regFayda}
                  onChange={(e) => setRegFayda(e.target.value)}
                  placeholder="ET-1234-5678-9012"
                  required
                  style={{ fontSize: "0.78rem", padding: "8px 10px" }}
                />
              </div>

              {/* Sub-City Location */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.68rem" }}>
                  📍 {language === "am" ? "የቤት ክፍለ ከተማ / ሰፈር" : "Property Sub-City Area"}
                </label>
                <select
                  className="form-select"
                  value={regSubCity}
                  onChange={(e) => setRegSubCity(e.target.value)}
                  style={{ fontSize: "0.78rem", padding: "8px 10px" }}
                >
                  <option value="Bole">Bole (ቦሌ)</option>
                  <option value="Sarbet">Sarbet (ሳር ቤት)</option>
                  <option value="Kazanchis">Kazanchis (ካዛንቺስ)</option>
                  <option value="Lebu">Lebu (ለቡ)</option>
                  <option value="Old Airport">Old Airport (ኦልድ ኤርፖርት)</option>
                </select>
              </div>

              {/* Payout Method */}
              <div className="form-group">
                <label className="form-label" style={{ fontSize: "0.68rem" }}>
                  💳 {language === "am" ? "ክፍያ መቀበያ መንገድ" : "Preferred Payout Method"}
                </label>
                <select
                  className="form-select"
                  value={regPayoutMethod}
                  onChange={(e) => setRegPayoutMethod(e.target.value)}
                  style={{ fontSize: "0.78rem", padding: "8px 10px" }}
                >
                  <option value="telebirr">Telebirr (ቴሌብር)</option>
                  <option value="cbe">CBE Birr / Bank Transfer (የኢትዮጵያ ንግድ ባንክ)</option>
                </select>
              </div>

              {/* Payout Account Number */}
              <div className="form-group" style={{ marginBottom: "18px" }}>
                <label className="form-label" style={{ fontSize: "0.68rem" }}>
                  🔢 {language === "am" ? "የሂሳብ ቁጥር / ስልክ ቁጥር" : "Payout Account / Phone Number"}
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={regPayoutAccount}
                  onChange={(e) => setRegPayoutAccount(e.target.value)}
                  placeholder={regPayoutMethod === "telebirr" ? "0912345678" : "1000123456789"}
                  required
                  style={{ fontSize: "0.78rem", padding: "8px 10px" }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: "800",
                  backgroundColor: "var(--terracotta)"
                }}
              >
                {language === "am" ? "ምዝገባውን አጠናቅቅ" : "Complete Registration"}
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "16px", minHeight: "100%", backgroundColor: "var(--bg-cream)", position: "relative" }}>
      
      {/* 1. Airbnb Hosting Top Header (aligned to user screenshot) */}
      <div 
        style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          borderBottom: "1px solid var(--border-color)", 
          padding: "0 4px 8px 4px", 
          marginBottom: "16px",
          backgroundColor: "var(--bg-cream)"
        }}
      >
        {/* Left: Tab options */}
        <div style={{ display: "flex", gap: "16px" }}>
          {["today", "calendar", "listings", "messages"].map((tab) => {
            const isActive = activeHostTab === tab;
            const labels = {
              today: { am: "ዛሬ", en: "Today" },
              calendar: { am: "የቀን መቁጠሪያ", en: "Calendar" },
              listings: { am: "ቤቶች", en: "Listings" },
              messages: { am: "መልዕክቶች", en: "Messages" }
            };
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveHostTab(tab);
                  setShowAddForm(false); // close form if navigating tabs
                }}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: isActive ? "2px solid var(--text-dark)" : "2px solid transparent",
                  padding: "4px 2px 8px 2px",
                  fontSize: "0.78rem",
                  fontWeight: isActive ? "800" : "600",
                  color: isActive ? "var(--text-dark)" : "var(--text-muted)",
                  cursor: "pointer",
                  textTransform: "capitalize",
                  transition: "all 0.15s ease"
                }}
              >
                {language === "am" ? labels[tab].am : labels[tab].en}
              </button>
            );
          })}
        </div>

        {/* Right: Switch to traveling & Profile */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            onClick={() => {
              if (onSwitchToTraveling) {
                onSwitchToTraveling();
              } else {
                alert(language === "am" ? "ወደ መፈለጊያ ገጽ በመመለስ ላይ..." : "Switching to traveling...");
              }
            }}
            style={{
              background: "none",
              border: "none",
              fontSize: "0.72rem",
              fontWeight: "700",
              color: "var(--text-dark)",
              cursor: "pointer",
              textDecoration: "none"
            }}
          >
            {language === "am" ? "ወደ መፈለጊያ ቀይር" : "Switch to traveling"}
          </button>
          
          {/* Avatar */}
          <div 
            style={{ 
              width: "28px", 
              height: "28px", 
              borderRadius: "50%", 
              overflow: "hidden", 
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" 
              alt="Host profile" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </div>

          {/* Hamburger Menu icon */}
          <div 
            onClick={() => setShowSandwichMenu(true)}
            id="btn-sandwich-menu"
            style={{ color: "var(--text-dark)", cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <span style={{ fontSize: "1.1rem", lineHeight: "1" }}>☰</span>
          </div>
        </div>
      </div>

      {/* Telegram Bot Simulation Overlay Modal */}
      {showTelegramSim && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <div
            style={{
              backgroundColor: "#2B5278",
              color: "#fff",
              width: "100%",
              maxWidth: "340px",
              borderRadius: "16px",
              padding: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
            }}
          >
            <div className="flex-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "12px" }}>
              <div className="flex-row" style={{ gap: "8px" }}>
                <div style={{ backgroundColor: "#0088cc", borderRadius: "50%", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "0.8rem", marginLeft: "2px", fontWeight: "bold" }}>🤖</span>
                </div>
                <div>
                  <h4 style={{ fontSize: "0.8rem", fontWeight: "bold" }}>@EndeBeteBot</h4>
                  <span style={{ fontSize: "0.6rem", opacity: 0.7 }}>Telegram Notification Service</span>
                </div>
              </div>
              <span style={{ fontSize: "0.6rem", opacity: 0.6 }}>Telegram Alert</span>
            </div>

            {telegramStatus === "active" ? (
              <div>
                <p style={{ fontSize: "0.78rem", marginBottom: "12px", lineHeight: "1.4" }}>
                  🔔 <strong>New Reservation Inquiry Received!</strong>
                </p>
                <div style={{ backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "10px", padding: "10px", fontSize: "0.75rem", marginBottom: "14px" }}>
                  <div>Guest: <strong>{bookingRequests[0]?.guestName}</strong></div>
                  <div>Stay: <strong>{bookingRequests[0]?.listingTitle}</strong></div>
                  <div>Move-in: <strong>{bookingRequests[0]?.moveInDate}</strong></div>
                  <div style={{ color: "#2ECC71" }}>Revenue: <strong>{bookingRequests[0]?.totalETB.toLocaleString()} Birr</strong></div>
                </div>
                
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={handleTelegramApprove}
                    style={{
                      flex: 1,
                      backgroundColor: "#2ECC71",
                      color: "#fff",
                      border: "none",
                      padding: "8px 0",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Approve Check-in
                  </button>
                  <button
                    onClick={handleTelegramReject}
                    style={{
                      flex: 1,
                      backgroundColor: "#E74C3C",
                      color: "#fff",
                      border: "none",
                      padding: "8px 0",
                      borderRadius: "8px",
                      fontSize: "0.75rem",
                      fontWeight: "bold",
                      cursor: "pointer"
                    }}
                  >
                    Reject
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <CheckCircle size={36} style={{ color: telegramStatus === "approved" ? "#2ECC71" : "#E74C3C", margin: "0 auto 10px auto" }} />
                <p style={{ fontSize: "0.85rem", fontWeight: "bold" }}>
                  {telegramStatus === "approved" ? "Inquiry Approved via Telegram!" : "Inquiry Rejected via Telegram!"}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Conditionally Render Content by Sub-Tab */}
      
      {/* 2. TODAY SUB-TAB VIEW (Matches user's screenshot layout) */}
      {activeHostTab === "today" && (
        <div>
          {/* Sub-pills: Today / Upcoming */}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={() => setActiveTodayFilter("today")}
              style={{
                backgroundColor: activeTodayFilter === "today" ? "#2C2520" : "#F4ECE1",
                color: activeTodayFilter === "today" ? "#FFF" : "var(--text-dark)",
                border: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
              }}
            >
              {language === "am" ? "ዛሬ" : "Today"}
            </button>
            <button
              onClick={() => setActiveTodayFilter("upcoming")}
              style={{
                backgroundColor: activeTodayFilter === "upcoming" ? "#2C2520" : "#F4ECE1",
                color: activeTodayFilter === "upcoming" ? "#FFF" : "var(--text-dark)",
                border: "none",
                borderRadius: "20px",
                padding: "8px 16px",
                fontSize: "0.78rem",
                fontWeight: "700",
                cursor: "pointer",
                transition: "all 0.15s ease",
                boxShadow: "0 2px 5px rgba(0,0,0,0.03)"
              }}
            >
              {language === "am" ? "ቀጣይ" : "Upcoming"}
            </button>
          </div>

          {/* Filtering bookingRequests based on sub-pill */}
          {(() => {
            const displayRequests = activeTodayFilter === "today" 
              ? bookingRequests // Approved & Pending stays
              : []; // Upcoming check-ins

            const approvedCount = displayRequests.filter(r => r.status === "approved").length;
            const pendingCount = displayRequests.filter(r => r.status === "pending").length;
            const totalCount = approvedCount + pendingCount;

            return (
              <div>
                {/* Header text */}
                <h2 style={{ fontSize: "1.5rem", fontWeight: "700", margin: "16px 0 24px 0", color: "var(--text-dark)", letterSpacing: "-0.5px" }}>
                  {language === "am"
                    ? (totalCount === 0 ? "ምንም የቤት ትዕዛዞች የሉዎትም" : `እርስዎ ${totalCount} የቤት ትዕዛዞች አሉዎት`)
                    : `You have ${totalCount} reservation${totalCount === 1 ? "" : "s"}`}
                </h2>

                {/* Cards Container */}
                {totalCount === 0 ? (
                  <div 
                    className="card-premium"
                    style={{
                      backgroundColor: "var(--bg-white)",
                      border: "1px solid var(--border-color)",
                      borderRadius: "24px",
                      padding: "40px 16px",
                      textAlign: "center",
                      color: "var(--text-muted)",
                      fontSize: "0.82rem",
                      marginBottom: "20px"
                    }}
                  >
                    {language === "am" ? "በዚህ ቀን ምንም የቤት ትዕዛዞች የሉዎትም።" : "You have no reservations today."}
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginBottom: "24px" }}>
                    {displayRequests.map((req) => (
                      <div 
                        key={req.id}
                        className="card-premium"
                        style={{
                          backgroundColor: "var(--bg-white)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "24px",
                          padding: "24px 16px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          boxShadow: "0 4px 14px rgba(44, 37, 32, 0.04)",
                          textAlign: "center",
                          position: "relative"
                        }}
                      >
                        {/* Status badge */}
                        <span 
                          style={{ 
                            position: "absolute",
                            top: "12px",
                            right: "16px",
                            fontSize: "0.62rem",
                            backgroundColor: req.status === "approved" ? "rgba(30,130,76,0.1)" : "rgba(241,196,15,0.15)",
                            color: req.status === "approved" ? "var(--ethiopian-green)" : "var(--ethiopian-gold-dark)",
                            padding: "3px 8px",
                            borderRadius: "10px",
                            fontWeight: "bold",
                            textTransform: "uppercase"
                          }}
                        >
                          {req.status}
                        </span>

                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "16px" }}>
                          {language === "am" ? "ሙሉ ቀን" : "All day"}
                        </span>

                        {/* Airbnb-style overlapping avatars */}
                        <div style={{ display: "flex", justifyContent: "center", position: "relative", height: "60px", width: "105px", marginBottom: "16px" }}>
                          {/* Circle 1: Light blue with initials */}
                          <div 
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "50%",
                              backgroundColor: "#E0F2FE", // Airbnb light blue
                              color: "#0369A1", // Airbnb dark blue
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "1.3rem",
                              fontWeight: "800",
                              border: "3px solid #FFF",
                              position: "absolute",
                              left: "12px"
                            }}
                          >
                            {req.guestName.charAt(0)}
                          </div>
                          {/* Circle 2: Light gray overlay with guest count indicator */}
                          <div 
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "50%",
                              backgroundColor: "#F1F5F9",
                              color: "var(--text-dark)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "0.9rem",
                              fontWeight: "700",
                              border: "3px solid #FFF",
                              position: "absolute",
                              right: "12px",
                              zIndex: 1
                            }}
                          >
                            +1
                          </div>
                        </div>

                        {/* Guest check-in caption matching screenshot */}
                        <h3 
                          style={{ 
                            fontSize: "1.05rem", 
                            fontWeight: "700", 
                            color: "var(--text-dark)", 
                            lineHeight: "1.4",
                            maxWidth: "280px",
                            margin: "0 auto",
                            fontFamily: "Outfit, sans-serif"
                          }}
                        >
                          {language === "am"
                            ? `${req.guestName} የ${req.guestsCount || 2} እንግዶች ስብስብ ለ${req.stayDuration} ተጨማሪ ${req.durationTab === "monthly" ? "ወራት" : "ቀናት"} ይቆያል`
                            : `${req.guestName}’s group of ${req.guestsCount || 2} stays for ${req.stayDuration} more ${req.durationTab === "monthly" ? "months" : "days"}`}
                        </h3>

                        <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "8px" }}>
                          Property: <strong>{req.listingTitle}</strong> • Move-in: <strong>{req.moveInDate}</strong>
                        </div>

                        {/* Interactive buttons for pending request */}
                        {req.status === "pending" && (
                          <div style={{ display: "flex", gap: "8px", width: "100%", maxWidth: "260px", marginTop: "16px" }}>
                            <button
                              onClick={() => handleApproveRequest(req.id)}
                              className="btn-success"
                              style={{ flex: 1, padding: "8px 10px", fontSize: "0.75rem", borderRadius: "8px" }}
                            >
                              {language === "am" ? "እቀበላለሁ" : "Approve"}
                            </button>
                            <button
                              onClick={() => handleRejectRequest(req.id)}
                              className="btn-secondary"
                              style={{ flex: 1, padding: "8px 10px", fontSize: "0.75rem", borderRadius: "8px", color: "#E74C3C", borderColor: "rgba(231,76,60,0.2)" }}
                            >
                              {language === "am" ? "እምቢተኛ" : "Reject"}
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Host Payout & Earnings Summary Card */}
          <div
            className="card-premium"
            style={{
              background: "linear-gradient(135deg, var(--text-dark) 0%, #3a322b 100%)",
              color: "#fff",
              padding: "16px",
              marginBottom: "20px",
              boxShadow: "0 6px 15px rgba(0,0,0,0.1)"
            }}
          >
            <div className="flex-between" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "10px", marginBottom: "10px" }}>
              <span style={{ fontSize: "0.72rem", color: "var(--ethiopian-gold)", fontWeight: "700" }}>
                💰 {language === "am" ? "የገቢ ማጠቃለያ" : "Earnings Summary"}
              </span>
              <button
                id="btn-host-payout-toggle"
                onClick={() => setShowPayoutForm(!showPayoutForm)}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--ethiopian-gold)",
                  fontSize: "0.68rem",
                  fontWeight: "700",
                  cursor: "pointer"
                }}
              >
                {showPayoutForm ? (language === "am" ? "ዝጋ" : "Close Setup") : (language === "am" ? "የክፍያ መለያ አዋቅር" : "Configure Payout")}
              </button>
            </div>

            {showPayoutForm ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!payoutAccount || !payoutName) {
                    alert(language === "am" ? "እባክዎ መረጃዎችን በትክክል ያስገቡ!" : "Please enter valid account credentials!");
                    return;
                  }
                  if (onUpdatePayout) {
                    onUpdatePayout({
                      method: payoutMethod,
                      account: payoutAccount,
                      name: payoutName
                    });
                    setShowPayoutForm(false);
                    alert(language === "am" ? "የክፍያ መለያዎ በትክክል ተስተካክሏል!" : "Payout account updated successfully!");
                  }
                }}
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <label className="form-label" style={{ color: "#eee", fontSize: "0.7rem" }}>{language === "am" ? "የክፍያ መቀበያ አቅራቢ" : "Payout Method"}</label>
                  <select
                    id="select-payout-method"
                    className="form-select"
                    value={payoutMethod}
                    onChange={(e) => setPayoutMethod(e.target.value)}
                    style={{ padding: "8px", fontSize: "0.75rem", width: "100%", backgroundColor: "#fff", color: "var(--text-dark)" }}
                  >
                    <option value="telebirr">telebirr (ቴሌብር)</option>
                    <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="cbe_birr">CBE Birr</option>
                    <option value="awash">Awash Bank</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <label className="form-label" style={{ color: "#eee", fontSize: "0.7rem" }}>{language === "am" ? "የአካውንት ስም" : "Account Holder Name"}</label>
                  <input
                    id="input-payout-name"
                    type="text"
                    className="form-input"
                    value={payoutName}
                    onChange={(e) => setPayoutName(e.target.value)}
                    placeholder="e.g., Henok Mulugheta"
                    required
                    style={{ padding: "8px", fontSize: "0.75rem" }}
                  />
                </div>
                <div className="form-group" style={{ marginBottom: "8px" }}>
                  <label className="form-label" style={{ color: "#eee", fontSize: "0.7rem" }}>{language === "am" ? "የአካውንት / ሞባይል ቁጥር" : "Account / Phone Number"}</label>
                  <input
                    id="input-payout-account"
                    type="text"
                    className="form-input"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="e.g., 0911223344 or 100048293"
                    required
                    style={{ padding: "8px", fontSize: "0.75rem" }}
                  />
                </div>
                <button id="btn-save-payout" type="submit" className="btn-primary" style={{ padding: "8px", fontSize: "0.75rem", backgroundColor: "var(--ethiopian-green)", boxShadow: "none" }}>
                  {language === "am" ? "አስቀምጥ" : "Save Payout Setup"}
                </button>
              </form>
            ) : (
              <div>
                <div style={{ fontSize: "1.6rem", fontWeight: "800", color: "var(--ethiopian-green-light)", marginBottom: "8px" }}>
                  {totalEarnings.toLocaleString()} ብር
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.72rem", opacity: 0.8 }}>
                  <span>{language === "am" ? "የጸደቁ ትዕዛዞች: " : "Approved stays: "} <strong>{approvedBookings.length}</strong></span>
                  <span>{language === "am" ? "ያልጸደቁ: " : "Pending stays: "} <strong>{bookingRequests.filter(r => r.status === "pending").length}</strong></span>
                </div>

                <div
                  style={{
                    backgroundColor: "rgba(255,255,255,0.05)",
                    borderRadius: "10px",
                    padding: "8px 12px",
                    marginTop: "12px",
                    fontSize: "0.7rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  }}
                >
                  <div>
                    <span style={{ opacity: 0.6 }}>{language === "am" ? "ማስተላለፊያ፦" : "Destination: "}</span>
                    <strong style={{ textTransform: "uppercase" }}>{user?.payoutConfig?.method || payoutMethod}</strong>
                  </div>
                  <div>
                    <span style={{ opacity: 0.6 }}>{language === "am" ? "ቁጥር፦" : "Acc: "}</span>
                    <strong>{user?.payoutConfig?.account || payoutAccount || (language === "am" ? "አልተወሰነም" : "Not set")}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Telegram Bot Simulation Alert Card */}
          <div
            className="card-premium"
            style={{
              backgroundColor: "rgba(0, 136, 204, 0.05)",
              border: "1px dashed #0088cc",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}
          >
            <div className="flex-between">
              <span className="flex-row" style={{ gap: "6px", fontSize: "0.8rem", color: "#0088cc", fontWeight: "bold" }}>
                🤖 Telegram Alert Simulator
              </span>
              <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(30,130,76,0.1)", color: "var(--ethiopian-green)", padding: "2px 6px", borderRadius: "4px", fontWeight: "bold" }}>
                Active ●
              </span>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-dark)", lineHeight: "1.4" }}>
              {language === "am"
                ? "ትዕዛዞችን በቀጥታ በቴሌግራም ቦት ለመቆጣጠር ሙከራውን ይጀምሩ። አዲስ የቤት ኪራይ ጥያቄ ሲመጣ ቴሌግራም ላይ መልዕክት ይደርሰዎታል።"
                : "Simulate approving booking inquiries directly using our interactive Telegram notification bot."}
            </p>
            <button
              id="btn-telegram-sim-trigger"
              onClick={triggerTelegramSim}
              className="btn-secondary"
              style={{
                borderColor: "#0088cc",
                color: "#0088cc",
                padding: "6px 12px",
                fontSize: "0.75rem",
                borderRadius: "8px",
                backgroundColor: "transparent",
                fontWeight: "700"
              }}
            >
              🚀 {language === "am" ? "የቴሌግራም መልእክት አስመስል" : "Simulate Telegram Alert"}
            </button>
          </div>
        </div>
      )}

      {/* 3. CALENDAR SUB-TAB VIEW (Active & Interactive Calendar System) */}
      {activeHostTab === "calendar" && (() => {
        const selectedListing = myListings.find(l => l.id === selectedCalendarListingId) || myListings[0] || (myListings.length === 0 ? api.listings.getAll()[0] : null);
        
        // Month generation
        const generateMonthOptions = () => {
          const startYear = 2026;
          const startMonth = 5; // June is index 5
          const options = [];
          const monthNamesEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthNamesAm = ["ጥር (January)", "የካቲት (February)", "መጋቢት (March)", "ሚያዝያ (April)", "ግንቦት (May)", "ሰኔ (June)", "ሐምሌ (July)", "ነሐሴ (August)", "መስከረም (September)", "ጥቅምት (October)", "ኅዳር (November)", "ታኅሣሥ (December)"];
          for (let i = 0; i < 36; i++) {
            const d = new Date(startYear, startMonth + i, 1);
            const yr = d.getFullYear();
            const mIndex = d.getMonth();
            const key = `${yr}-${String(mIndex + 1).padStart(2, "0")}`;
            options.push({
              key,
              year: yr,
              monthIndex: mIndex,
              label: language === "am" ? `${monthNamesAm[mIndex]} ${yr}` : `${monthNamesEn[mIndex]} ${yr}`
            });
          }
          return options;
        };
        
        const monthOptions = generateMonthOptions();
        
        // Compute calendar days
        const [yearStr, monthStr] = selectedMonthKey.split("-");
        const year = parseInt(yearStr);
        const month = parseInt(monthStr) - 1;
        const totalDays = new Date(year, month + 1, 0).getDate();
        const startDayOffset = new Date(year, month, 1).getDay();

        // Helper to check bookings
        const getBookingForDate = (dateStr) => {
          if (!selectedListing) return null;
          const targetTime = new Date(dateStr + "T00:00:00").getTime();
          return bookingRequests.find((req) => {
            if (req.status !== "approved") return false;
            if (req.listingTitle !== selectedListing.title.en) return false;
            
            const start = new Date(req.moveInDate + "T00:00:00");
            const startTime = start.getTime();
            
            const end = new Date(start);
            end.setDate(start.getDate() + req.stayDuration);
            const endTime = end.getTime();
            
            return targetTime >= startTime && targetTime < endTime;
          });
        };

        // Format Date Helper
        const getFormattedDate = (dateStr) => {
          const [y, m, d] = dateStr.split("-").map(Number);
          const monthsEn = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          const monthsAm = ["ጥር", "የካቲት", "መጋቢት", "ሚያዝያ", "ግንቦት", "ሰኔ", "ሐምሌ", "ነሐሴ", "መስከረም", "ጥቅምት", "ኅዳር", "ታኅሣሥ"];
          if (language === "am") {
            return `${monthsAm[m - 1]} ${d} ቀን ${y} ዓ.ም`;
          }
          return `${monthsEn[m - 1]} ${d}, ${y}`;
        };

        const activeDayBooking = getBookingForDate(selectedCalendarDate);
        const isDateBlocked = blockedDates.includes(selectedCalendarDate);

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            {/* Listing Selector Dropdown */}
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.72rem", fontWeight: "700", color: "var(--text-muted)", textTransform: "uppercase" }}>
                {language === "am" ? "ቤት ይምረጡ" : "Select Listing to Manage"}
              </label>
              <select
                id="select-calendar-listing"
                value={selectedCalendarListingId}
                onChange={(e) => {
                  setSelectedCalendarListingId(e.target.value);
                  const [y, m] = selectedMonthKey.split("-");
                  setSelectedCalendarDate(`${y}-${m}-19`);
                }}
                style={{
                  width: "100%",
                  padding: "10px",
                  fontSize: "0.82rem",
                  fontWeight: "700",
                  borderRadius: "10px",
                  border: "1px solid var(--border-color)",
                  backgroundColor: "#fff",
                  color: "var(--text-dark)",
                  cursor: "pointer",
                  outline: "none"
                }}
              >
                {myListings.length === 0 ? (
                  <option value="l1">Bole Classic Boutique Hotel - Deluxe Suite</option>
                ) : (
                  myListings.map((l) => (
                    <option key={l.id} value={l.id}>
                      {language === "am" ? l.title.am : l.title.en}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Month Navigator Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <select
                  value={selectedMonthKey}
                  onChange={(e) => {
                    setSelectedMonthKey(e.target.value);
                    const [y, m] = e.target.value.split("-");
                    setSelectedCalendarDate(`${y}-${m}-19`);
                  }}
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "800",
                    border: "none",
                    background: "transparent",
                    color: "var(--text-dark)",
                    cursor: "pointer",
                    outline: "none",
                    fontFamily: "Outfit, sans-serif",
                    padding: "0"
                  }}
                >
                  {monthOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  onClick={() => {
                    const idx = monthOptions.findIndex(o => o.key === selectedMonthKey);
                    if (idx > 0) {
                      const prevKey = monthOptions[idx - 1].key;
                      setSelectedMonthKey(prevKey);
                      const [y, m] = prevKey.split("-");
                      setSelectedCalendarDate(`${y}-${m}-19`);
                    }
                  }}
                  disabled={monthOptions.findIndex(o => o.key === selectedMonthKey) === 0}
                  style={{
                    border: "1px solid var(--border-color)",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: monthOptions.findIndex(o => o.key === selectedMonthKey) === 0 ? 0.3 : 1
                  }}
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  onClick={() => {
                    const idx = monthOptions.findIndex(o => o.key === selectedMonthKey);
                    if (idx < monthOptions.length - 1) {
                      const nextKey = monthOptions[idx + 1].key;
                      setSelectedMonthKey(nextKey);
                      const [y, m] = nextKey.split("-");
                      setSelectedCalendarDate(`${y}-${m}-19`);
                    }
                  }}
                  disabled={monthOptions.findIndex(o => o.key === selectedMonthKey) === monthOptions.length - 1}
                  style={{
                    border: "1px solid var(--border-color)",
                    backgroundColor: "#fff",
                    borderRadius: "50%",
                    width: "28px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    opacity: monthOptions.findIndex(o => o.key === selectedMonthKey) === monthOptions.length - 1 ? 0.3 : 1
                  }}
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>

            {/* Left Panel: Calendar Grid */}
            <div className="card-premium" style={{ backgroundColor: "var(--bg-white)", padding: "12px", border: "1px solid var(--border-color)" }}>
              {/* Day Titles */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "0px", textAlign: "center", marginBottom: "8px" }}>
                {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
                  <span key={idx} style={{ fontSize: "0.68rem", fontWeight: "700", color: "var(--text-muted)", paddingBottom: "4px" }}>{day}</span>
                ))}
              </div>

              {/* Grid Cells */}
              <div 
                style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(7, 1fr)", 
                  borderTop: "1px solid #EDEDED",
                  borderLeft: "1px solid #EDEDED",
                  borderRadius: "8px",
                  overflow: "hidden"
                }}
              >
                {/* Preceding empty cells */}
                {[...Array(startDayOffset)].map((_, i) => (
                  <div 
                    key={`empty-${i}`} 
                    style={{ 
                      backgroundColor: "#F7F7F7", 
                      borderRight: "1px solid #EDEDED",
                      borderBottom: "1px solid #EDEDED",
                      minHeight: "56px"
                    }} 
                  />
                ))}

                {/* Days list */}
                {[...Array(totalDays)].map((_, i) => {
                  const day = i + 1;
                  const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  
                  const booking = getBookingForDate(dateStr);
                  const isBooked = !!booking;
                  const isBlocked = blockedDates.includes(dateStr);
                  const isSelected = dateStr === selectedCalendarDate;

                  // Determine booking bar border radius
                  let isStartOfBooking = false;
                  let isEndOfBooking = false;
                  if (isBooked) {
                    isStartOfBooking = dateStr === booking.moveInDate;
                    
                    // Check if tomorrow is booked by the same request
                    const tomorrow = new Date(year, month, day + 1);
                    const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, "0")}-${String(tomorrow.getDate()).padStart(2, "0")}`;
                    const tomorrowBooking = getBookingForDate(tomorrowStr);
                    isEndOfBooking = !tomorrowBooking || tomorrowBooking.id !== booking.id;
                  }

                  // Determine striped background for blocked dates
                  const backgroundStyle = isBlocked 
                    ? "repeating-linear-gradient(45deg, #FAF6F4, #FAF6F4 6px, #F5EAE6 6px, #F5EAE6 12px)"
                    : isBooked ? "#FFF" : "transparent";

                  return (
                    <div
                      key={day}
                      onClick={() => {
                        setSelectedCalendarDate(dateStr);
                      }}
                      style={{
                        position: "relative",
                        minHeight: "56px",
                        borderRight: "1px solid #EDEDED",
                        borderBottom: "1px solid #EDEDED",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "flex-start",
                        padding: "4px",
                        cursor: "pointer",
                        background: backgroundStyle,
                        transition: "all 0.15s ease"
                      }}
                    >
                      {/* Day Number Wrapper */}
                      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "20px",
                            height: "20px",
                            borderRadius: "50%",
                            border: isSelected ? "2px solid #FF385C" : "none",
                            color: isSelected ? "#FF385C" : "var(--text-dark)",
                            fontSize: "0.75rem",
                            fontWeight: isSelected ? "800" : "600"
                          }}
                        >
                          {day}
                        </span>
                      </div>

                      {/* Render Continuous Booking Bar if Booked */}
                      {isBooked && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            left: isStartOfBooking ? "2px" : "-1px",
                            right: isEndOfBooking ? "2px" : "-1px",
                            height: "18px",
                            backgroundColor: "#1F1F1F",
                            color: "#fff",
                            fontSize: "0.58rem",
                            fontWeight: "800",
                            display: "flex",
                            alignItems: "center",
                            paddingLeft: isStartOfBooking ? "4px" : "1px",
                            borderTopLeftRadius: isStartOfBooking ? "4px" : "0px",
                            borderBottomLeftRadius: isStartOfBooking ? "4px" : "0px",
                            borderTopRightRadius: isEndOfBooking ? "4px" : "0px",
                            borderBottomRightRadius: isEndOfBooking ? "4px" : "0px",
                            zIndex: 10,
                            overflow: "hidden",
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis"
                          }}
                          title={`${booking.guestName} (${booking.listingTitle})`}
                        >
                          {(isStartOfBooking || new Date(dateStr + "T00:00:00").getDay() === 0 || day === 1) && (
                            <span style={{ paddingLeft: "2px" }}>
                              {booking.guestName.split(" ")[0]}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Small blocked indicator cross if blocked but not booked */}
                      {isBlocked && !isBooked && (
                        <span 
                          style={{ 
                            fontSize: "0.5rem", 
                            color: "var(--terracotta)", 
                            fontWeight: "bold", 
                            position: "absolute", 
                            bottom: "4px", 
                            right: "4px" 
                          }}
                        >
                          ✕ Blocked
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Settings Sidebar / Bottom Detail Card */}
            <div 
              className="card-premium" 
              style={{ 
                backgroundColor: "var(--bg-white)", 
                border: "1px solid var(--border-color)", 
                padding: "16px",
                borderRadius: "16px"
              }}
            >
              <div className="flex-between" style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "12px" }}>
                <div>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: "800", color: "var(--text-dark)" }}>
                    📅 {getFormattedDate(selectedCalendarDate)}
                  </h4>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                    {selectedListing ? (language === "am" ? selectedListing.title.am : selectedListing.title.en) : ""}
                  </span>
                </div>
                
                {/* Status Badge */}
                {activeDayBooking ? (
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(211,84,0,0.1)", color: "var(--terracotta)", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" }}>
                    {language === "am" ? "የተያዘ" : "BOOKED"}
                  </span>
                ) : isDateBlocked ? (
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(231,76,60,0.1)", color: "#E74C3C", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" }}>
                    {language === "am" ? "የተዘጋ" : "BLOCKED"}
                  </span>
                ) : (
                  <span style={{ fontSize: "0.68rem", backgroundColor: "rgba(30,130,76,0.1)", color: "var(--ethiopian-green)", padding: "3px 8px", borderRadius: "10px", fontWeight: "bold" }}>
                    {language === "am" ? "ክፍት" : "AVAILABLE"}
                  </span>
                )}
              </div>

              {/* Pricing row matching Airbnb sidebar */}
              <div className="flex-between" style={{ marginBottom: "14px" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {language === "am" ? "ዋጋ በቀን" : "Nightly Base Price"}
                  </span>
                  <div style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--text-dark)", marginTop: "2px" }}>
                    {selectedListing ? selectedListing.priceETB.toLocaleString() : "0"} Birr
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {language === "am" ? "የመድረክ ክፍያ (8%)" : "Service Fee (8%)"}
                  </span>
                  <div style={{ fontSize: "0.9rem", fontWeight: "600", color: "var(--text-muted)", marginTop: "2px" }}>
                    {selectedListing ? Math.round(selectedListing.priceETB * 0.08).toLocaleString() : "0"} Birr
                  </div>
                </div>
              </div>

              {/* Detail block if date is booked */}
              {activeDayBooking ? (
                <div 
                  style={{ 
                    backgroundColor: "rgba(44, 37, 32, 0.03)", 
                    border: "1px solid var(--border-color)", 
                    borderRadius: "12px", 
                    padding: "12px",
                    fontSize: "0.75rem",
                    marginBottom: "12px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px"
                  }}
                >
                  <div className="flex-between">
                    <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "እንግዳ" : "Confirmed Guest"}:</span>
                    <strong style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                      👤 {activeDayBooking.guestName}
                      <span style={{ fontSize: "0.6rem", color: "var(--ethiopian-green)", backgroundColor: "rgba(30,130,76,0.1)", padding: "1px 4px", borderRadius: "3px" }}>Fayda Checked</span>
                    </strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የመግቢያ ቀን" : "Check-in Date"}:</span>
                    <strong>{activeDayBooking.moveInDate}</strong>
                  </div>
                  <div className="flex-between">
                    <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የቆይታ ጊዜ" : "Nights Booked"}:</span>
                    <strong>{activeDayBooking.stayDuration} {language === "am" ? "ቀናት" : "nights"}</strong>
                  </div>
                  <div className="flex-between" style={{ borderTop: "1px solid rgba(0,0,0,0.06)", paddingTop: "6px", marginTop: "4px" }}>
                    <span style={{ fontWeight: "700" }}>{language === "am" ? "ጠቅላላ ገቢ" : "Payout Earnings"}:</span>
                    <strong style={{ color: "var(--ethiopian-green)", fontSize: "0.8rem" }}>{activeDayBooking.totalETB.toLocaleString()} Birr</strong>
                  </div>
                  
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", fontStyle: "italic", textAlign: "center" }}>
                    🔒 Booked stay dates cannot be modified.
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.4", margin: "0 0 4px 0" }}>
                    {isDateBlocked 
                      ? (language === "am" ? "ይህ ቀን ተዘግቷል። እንግዶች በዚህ ቀን መግባት ወይም መያዝ አይችሉም።" : "This date is currently blocked. Guests will not be able to book stays starting on this day.")
                      : (language === "am" ? "ይህ ቀን ክፍት ነው። እንግዶች መያዝ ይችላሉ። ለመዝጋት ከታች ያለውን ይጫኑ።" : "This date is open and available. Tap below to block it from incoming reservations.")}
                  </p>
                  
                  <button
                    onClick={() => handleToggleBlockedDate(selectedCalendarDate)}
                    className={isDateBlocked ? "btn-success" : "btn-secondary"}
                    style={{
                      width: "100%",
                      padding: "10px",
                      fontSize: "0.8rem",
                      borderRadius: "10px",
                      fontWeight: "800",
                      backgroundColor: isDateBlocked ? "var(--ethiopian-green)" : "#1F1F1F",
                      color: "#fff",
                      border: "none",
                      boxShadow: "none"
                    }}
                  >
                    {isDateBlocked 
                      ? (language === "am" ? "ቀኑን ክፍት አድርግ" : "Make Date Available") 
                      : (language === "am" ? "ቀኑን ዝጋ (ብሎክ)" : "Block Selected Date")}
                  </button>
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* 4. LISTINGS SUB-TAB VIEW (Manage & Publish stays) */}
      {activeHostTab === "listings" && (
        <div>
          {/* Header block with button */}
          <div className="flex-between" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>
              {language === "am" ? "የእርስዎ መዝገቦች" : "My Listed Stays"}
            </h3>
            <button
              id="btn-host-toggle-form"
              onClick={() => setShowAddForm(!showAddForm)}
              className="btn-primary"
              style={{ padding: "8px 12px", fontSize: "0.75rem", borderRadius: "10px" }}
            >
              {showAddForm ? (language === "am" ? "ዝጋ" : "Close") : (
                <>
                  <Plus size={14} />
                  {language === "am" ? "አዲስ ማረፊያ መዝግብ" : "List Stay"}
                </>
              )}
            </button>
          </div>

          {showAddForm ? (
            /* Publish stay form (with GPS Active Locator) */
            <form onSubmit={handleSubmit} className="card-premium" style={{ backgroundColor: "var(--bg-white)" }}>
              <h3 style={{ fontSize: "0.92rem", fontWeight: "700", marginBottom: "12px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
                {language === "am" ? "አዲስ የማረፊያ መረጃ መዝግብ" : "Enter Property Details"}
              </h3>

              <div className="form-group">
                <label className="form-label">{language === "am" ? "የቤት ስም (በአማርኛ)" : "Property Title (Amharic)"}</label>
                <input
                  id="input-host-title-am"
                  type="text"
                  className="form-input"
                  value={titleAm}
                  onChange={(e) => setTitleAm(e.target.value)}
                  placeholder="ለምሳሌ፡ ቦሌ ምቹ የእንግዳ ማረፊያ"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === "am" ? "የቤት ስም (በእንግሊዝኛ)" : "Property Title (English)"}</label>
                <input
                  id="input-host-title-en"
                  type="text"
                  className="form-input"
                  value={titleEn}
                  onChange={(e) => setTitleEn(e.target.value)}
                  placeholder="e.g., Bole Cozy Guest House"
                  required
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የማረፊያ ዓይነት" : "Category"}</label>
                  <select id="select-host-type" className="form-select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="hotel">{language === "am" ? "ሆቴል 🏨" : "Hotel"}</option>
                    <option value="guesthouse">{language === "am" ? "እንግዳ ማረፊያ 🏠" : "Guest House"}</option>
                    <option value="room">{language === "am" ? "ነጠላ ክፍል 🛏️" : "Single Room"}</option>
                    <option value="home">{language === "am" ? "ሙሉ ቤት/ቪላ 🏡" : "Full Home"}</option>
                    <option value="apartment">{language === "am" ? "አፓርታማ 🏢" : "Apartment"}</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">{language === "am" ? "አካባቢ / ሰፈር" : "Sub-City Area"}</label>
                  <select id="select-host-subcity" className="form-select" value={subCity} onChange={(e) => setSubCity(e.target.value)}>
                    <option value="Bole">Bole (ቦሌ)</option>
                    <option value="Sarbet">Sarbet (ሳር ቤት)</option>
                    <option value="Kazanchis">Kazanchis (ካዛንቺስ)</option>
                    <option value="Lebu">Lebu (ለቡ)</option>
                    <option value="Old Airport">Old Airport (ኦልድ ኤርፖርት)</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">{language === "am" ? "የኪራይ ቆይታ" : "Rental Duration"}</label>
                <select id="select-host-duration" className="form-select" value={duration} onChange={(e) => setDuration(e.target.value)}>
                  <option value="nightly">{language === "am" ? "በቀን ብቻ (Nightly)" : "Nightly Stay"}</option>
                  <option value="monthly">{language === "am" ? "በወር ብቻ (Monthly)" : "Monthly Rent"}</option>
                  <option value="both">{language === "am" ? "ሁለቱንም አማራጮች" : "Both (Nightly & Monthly)"}</option>
                </select>
              </div>

              {/* Pricing */}
              {(duration === "nightly" || duration === "both") && (
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የአንድ ቀን ዋጋ (በብር)" : "Nightly Price (ETB)"}</label>
                  <input
                    id="input-host-price-night"
                    type="number"
                    className="form-input"
                    value={priceETB}
                    onChange={(e) => setPriceETB(e.target.value)}
                  />
                </div>
              )}

              {(duration === "monthly" || duration === "both") && (
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የአንድ ወር ዋጋ (በብር)" : "Monthly Price (ETB)"}</label>
                  <input
                    id="input-host-price-month"
                    type="number"
                    className="form-input"
                    value={priceMonthlyETB}
                    onChange={(e) => setPriceMonthlyETB(e.target.value)}
                  />
                </div>
              )}

              {/* Landmarks */}
              <div className="form-group">
                <label className="form-label">{language === "am" ? "የአካባቢው ምልክት መግለጫ (በአማርኛ)" : "Directions / Landmarks (Amharic)"}</label>
                <textarea
                  id="textarea-host-landmark-am"
                  className="form-input"
                  rows={2}
                  value={landmarkAm}
                  onChange={(e) => setLandmarkAm(e.target.value)}
                  placeholder="ለምሳሌ፡ ቦሌ መድኃኔዓለም ጀርባ"
                  required
                  style={{ resize: "none" }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">{language === "am" ? "የአካባቢው ምልክት መግለጫ (በእንግሊዝኛ)" : "Directions / Landmarks (English)"}</label>
                <textarea
                  id="textarea-host-landmark-en"
                  className="form-input"
                  rows={2}
                  value={landmarkEn}
                  onChange={(e) => setLandmarkEn(e.target.value)}
                  placeholder="e.g., Behind Edna Mall"
                  required
                  style={{ resize: "none" }}
                />
              </div>

              {/* GPS Active Locator */}
              <div className="form-group" style={{ marginBottom: "20px" }}>
                <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span>{language === "am" ? "የጂፒኤስ መገኛ (GPS Location)" : "GPS Property Location"}</span>
                  {gpsLocation && (
                    <span style={{ fontSize: "0.68rem", color: "var(--ethiopian-green)", fontWeight: "bold" }}>
                      ✓ {gpsLocation.mocked ? "Simulated" : "Live Active"}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="btn-secondary"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px",
                    padding: "10px",
                    fontSize: "0.78rem",
                    borderRadius: "10px",
                    borderColor: "var(--terracotta)",
                    color: "var(--terracotta)",
                    backgroundColor: "rgba(211, 84, 0, 0.04)",
                    marginBottom: "8px"
                  }}
                >
                  <Crosshair size={14} className={isLocating ? "spin-animation" : ""} />
                  {isLocating ? "Locating..." : "Use Phone GPS Location"}
                </button>
                {gpsLocation && (
                  <div style={{ position: "relative", width: "100%", height: "200px", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                    <ActiveMap
                      lat={gpsLocation.lat}
                      lng={gpsLocation.lng}
                      showCircle={true}
                      isInteractive={true}
                      onChangeLocation={(newCoords) => {
                        setGpsLocation({
                          ...gpsLocation,
                          lat: newCoords.lat,
                          lng: newCoords.lng
                        });
                      }}
                      language={language}
                    />
                  </div>
                )}
              </div>

              {/* Utilities selection */}
              <div style={{ marginBottom: "16px" }}>
                <label className="form-label">{language === "am" ? "የመሠረተ ልማት ማረጋገጫዎች" : "Backup Utilities Selection"}</label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
                  <input type="checkbox" checked={hasGen} onChange={(e) => setHasGen(e.target.checked)} />
                  <span style={{ fontSize: "0.8rem" }}>⚡ Generator Backup</span>
                </div>
                {hasGen && <input type="text" className="form-input" value={genType} onChange={(e) => setGenType(e.target.value)} />}

                <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
                  <input type="checkbox" checked={hasWater} onChange={(e) => setHasWater(e.target.checked)} />
                  <span style={{ fontSize: "0.8rem" }}>💧 Water Reserve</span>
                </div>
                {hasWater && <input type="text" className="form-input" value={waterType} onChange={(e) => setWaterType(e.target.value)} />}

                <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "8px 0" }}>
                  <input type="checkbox" checked={hasWifi} onChange={(e) => setHasWifi(e.target.checked)} />
                  <span style={{ fontSize: "0.8rem" }}>📶 Dedicated WiFi Network</span>
                </div>
                {hasWifi && <input type="text" className="form-input" value={wifiType} onChange={(e) => setWifiType(e.target.value)} />}
              </div>

              <button id="btn-host-submit" type="submit" className="btn-success" style={{ width: "100%", marginTop: "10px" }}>
                {language === "am" ? "ማረፊያውን መዝግብ" : "Publish Listing"}
              </button>
            </form>
          ) : (
            /* Listings Grid */
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {myListings.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", border: "1px dashed var(--border-color)", borderRadius: "14px" }}>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {language === "am" ? "እስካሁን ምንም ቤት አልመዘገቡም።" : "You haven't listed any properties yet."}
                  </p>
                </div>
              ) : (
                myListings.map((listing) => (
                  <div
                    key={listing.id}
                    className="card-premium"
                    style={{
                      backgroundColor: "var(--bg-white)",
                      display: "flex",
                      gap: "10px",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src={listing.image}
                      alt={listing.title.en}
                      style={{ width: "50px", height: "50px", borderRadius: "8px", objectFit: "cover" }}
                    />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                        {language === "am" ? listing.title.am : listing.title.en}
                      </h4>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                        {language === "am" ? listing.subCity.am : listing.subCity.en} • {listing.duration}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--terracotta)" }}>
                      {listing.priceETB.toLocaleString()} ብር
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* 5. MESSAGES SUB-TAB VIEW (Manage conversations with guests) */}
      {activeHostTab === "messages" && (() => {
        const filteredHostChats = chatMessages.filter(
          (m) => (m.sender === "guest_me" && m.receiver === "host_yohannes") ||
                 (m.sender === "host_yohannes" && m.receiver === "guest_me")
        );

        const handleHostSend = () => {
          if (!hostReplyText.trim()) return;
          const newMsg = {
            id: "msg-" + Date.now(),
            sender: "host_yohannes",
            receiver: "guest_me",
            text: hostReplyText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          const updated = [...chatMessages, newMsg];
          setChatMessages(updated);
          localStorage.setItem("eb_chat_messages", JSON.stringify(updated));
          setHostReplyText("");
        };

        return (
          <div className="card-premium" style={{ backgroundColor: "var(--bg-white)", display: "flex", flexDirection: "column", gap: "10px" }}>
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "6px", borderBottom: "1px solid var(--border-color)", paddingBottom: "6px" }}>
              💬 {language === "am" ? "የአስተናጋጅ መልዕክት ሳጥን" : "Host Messaging Inbox"}
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", gap: "8px", borderBottom: "1px solid var(--border-color)", paddingBottom: "10px", marginBottom: "6px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "var(--bg-cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem", fontWeight: "bold", color: "var(--terracotta)", textAlign: "center", lineHeight: "36px" }}>
                G
              </div>
              <div>
                <div style={{ fontSize: "0.85rem", fontWeight: "700" }}>Me (Verified Guest)</div>
                <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Fayda Verified Stay Request</div>
              </div>
            </div>

            {/* Chat Stream */}
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "8px", padding: "10px", backgroundColor: "var(--bg-cream)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              {filteredHostChats.length === 0 ? (
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>No messages yet</span>
              ) : (
                filteredHostChats.map((msg) => {
                  const isHost = msg.sender === "host_yohannes";
                  return (
                    <div
                      key={msg.id}
                      style={{
                        alignSelf: isHost ? "flex-end" : "flex-start",
                        maxWidth: "80%",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: isHost ? "flex-end" : "flex-start"
                      }}
                    >
                      <div
                        style={{
                          padding: "8px 12px",
                          borderRadius: isHost ? "14px 14px 2px 14px" : "14px 14px 14px 2px",
                          backgroundColor: isHost ? "var(--terracotta)" : "#fff",
                          color: isHost ? "#fff" : "var(--text-dark)",
                          fontSize: "0.78rem",
                          lineHeight: "1.3",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                          border: isHost ? "none" : "1px solid var(--border-color)"
                        }}
                      >
                        {msg.text}
                      </div>
                      <span style={{ fontSize: "0.55rem", color: "var(--text-muted)", marginTop: "2px" }}>
                        {msg.timestamp}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
            
            {/* Quick Chat simulator input */}
            <div style={{ marginTop: "8px" }}>
              <textarea
                id="textarea-host-reply"
                className="form-input"
                rows={2}
                value={hostReplyText}
                onChange={(e) => setHostReplyText(e.target.value)}
                style={{ fontSize: "0.75rem", padding: "8px", resize: "none" }}
                placeholder={language === "am" ? "ለእንግዳው ምላሽ ይጻፉ..." : "Type your reply to Guest..."}
              />
              <button 
                id="btn-host-reply-send"
                onClick={handleHostSend}
                className="btn-primary" 
                style={{ width: "100%", padding: "8px", fontSize: "0.75rem", marginTop: "8px" }}
              >
                {language === "am" ? "መልዕክት ላክ" : "Send Reply"}
              </button>
            </div>
          </div>
        );
      })()}

      {/* 6. SANDWICH MENU OVERLAY SCREEN */}
      {showSandwichMenu && (
        <div
          id="host-sandwich-menu-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 2500,
            padding: "24px 18px",
            display: "flex",
            flexDirection: "column",
            fontFamily: "Outfit, sans-serif",
            overflowY: "auto"
          }}
        >
          {/* Header */}
          <div className="flex-between" style={{ marginBottom: "20px" }}>
            <h2 style={{ fontSize: "1.8rem", fontWeight: "800", color: "var(--text-dark)", margin: 0, letterSpacing: "-0.5px" }}>
              {language === "am" ? "ማውጫ" : "Menu"}
            </h2>
            <button
              onClick={() => setShowSandwichMenu(false)}
              style={{
                background: "none",
                border: "none",
                fontSize: "1.2rem",
                fontWeight: "600",
                cursor: "pointer",
                color: "var(--text-dark)",
                padding: "4px"
              }}
            >
              ✕
            </button>
          </div>

          {/* Grid Cards: Earnings & Insights */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
            {/* Earnings Card */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "140px"
              }}
            >
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                  {language === "am" ? "ገቢ" : "Earnings"}
                </h4>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0, lineHeight: "1.3" }}>
                  {totalEarnings.toLocaleString()} Birr {language === "am" ? "በሰኔ ወር ውስጥ" : "total for June"}
                </p>
              </div>

              {/* Chart Bar Graphic (matching pink/red/orange gradient in screenshot) */}
              <div style={{ display: "flex", alignItems: "flex-end", height: "45px", marginTop: "8px" }}>
                <div 
                  style={{ 
                    width: "18px", 
                    height: "40px", 
                    borderRadius: "4px", 
                    background: "linear-gradient(to top, #DA005F, #FF385C, #FF7E40)" 
                  }} 
                />
                <div style={{ width: "3px" }} />
                <div style={{ width: "12px", height: "2px", backgroundColor: "#EAEAEA", borderRadius: "1px" }} />
              </div>
            </div>

            {/* Insights Card */}
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid var(--border-color)",
                borderRadius: "16px",
                padding: "16px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: "140px"
              }}
            >
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "700", color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                  {language === "am" ? "ግንዛቤዎች" : "Insights"}
                </h4>
                <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", margin: 0 }}>
                  {myListings.reduce((sum, l) => sum + (l.reviewsCount || 0), 0) + 12} {language === "am" ? "አስተያየቶች" : "reviews"}
                </p>
              </div>

              {/* Large Star rating display */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "4px", color: "var(--text-dark)" }}>
                <span style={{ fontSize: "1.1rem" }}>★</span>
                <span style={{ fontSize: "1.8rem", fontWeight: "800" }}>4.85</span>
              </div>
            </div>
          </div>

          {/* Create a new listing Banner */}
          <div
            onClick={() => {
              setShowSandwichMenu(false);
              setActiveHostTab("listings");
              setShowAddForm(true);
            }}
            style={{
              backgroundColor: "#FAF6F0",
              border: "1px solid rgba(44, 37, 32, 0.05)",
              borderRadius: "16px",
              padding: "14px 16px",
              display: "flex",
              alignItems: "center",
              gap: "14px",
              cursor: "pointer",
              marginBottom: "24px",
              transition: "background-color 0.15s ease"
            }}
          >
            <div style={{ fontSize: "1.6rem" }}>🏡</div>
            <div>
              <h4 style={{ fontSize: "0.82rem", fontWeight: "700", color: "var(--text-dark)", margin: "0 0 2px 0" }}>
                {language === "am" ? "አዲስ ማረፊያ መዝግብ" : "Create a new listing"}
              </h4>
              <p style={{ fontSize: "0.68rem", color: "var(--text-muted)", margin: 0 }}>
                {language === "am" ? "ቤት፣ ሆቴል ወይም ክፍል ያከራዩ" : "Host a home, experience, or service."}
              </p>
            </div>
          </div>

          {/* Vertical Menu Options List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            
            {/* Account Settings */}
            <div
              onClick={() => {
                setShowSandwichMenu(false);
                setShowAccountSettings(true);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 6px",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F5"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>⚙</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-dark)" }}>
                {language === "am" ? "የመለያ ቅንብሮች" : "Account settings"}
              </span>
            </div>

            {/* Languages & Currency */}
            <div
              onClick={() => {
                setShowSandwichMenu(false);
                alert(language === "am" ? "ቋንቋና ገንዘብን ለመቀየር ከላይ ያለውን የላይኛው ራስጌ ይጠቀሙ።" : "Use the top header bar to change language & currency configurations.");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 6px",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F5"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>🌐</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-dark)" }}>
                {language === "am" ? "ቋንቋዎች እና ገንዘብ" : "Languages & currency"}
              </span>
            </div>

            {/* Hosting Resources */}
            <div
              onClick={() => {
                alert(language === "am" ? "የአስተናጋጅነት መመሪያዎች፡ 1. የፋይዳ ማንነት ማረጋገጥ 2. የጄነሬተር እና ውሃ ታንከር ማሟላት 3. CBE/ቴሌብር መለያ ማዋቀር።" : "Hosting resources: 1. Complete Fayda ID check 2. Ensure Generator & Water tank back-ups 3. Bind CBE/Telebirr accounts.");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 6px",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F5"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>📖</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-dark)" }}>
                {language === "am" ? "የአስተናጋጅነት መረጃዎች" : "Hosting resources"}
              </span>
            </div>

            {/* Get Help */}
            <div
              onClick={() => {
                alert(language === "am" ? "ለእርዳታ በስልክ 952 ወይም በቴሌግራም ቦት @EndeBeteBot ያግኙን።" : "For support, contact us via phone at 952 or telegram bot @EndeBeteBot.");
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 6px",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F5"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "var(--text-muted)" }}>❓</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-dark)" }}>
                {language === "am" ? "እርዳታ ያግኙ" : "Get help"}
              </span>
            </div>

            {/* Demo Reset Option */}
            <div
              onClick={() => {
                if (window.confirm(language === "am" ? "ለሙከራ የአስተናጋጅነት መለያዎን መሰረዝ እና ወደ ተከራይነት መመለስ ይፈልጋሉ?" : "Do you want to reset your host status and return to renter mode for testing?")) {
                  setShowSandwichMenu(false);
                  const updated = { ...user };
                  delete updated.isHost;
                  delete updated.faydaVerified;
                  delete updated.faydaId;
                  delete updated.fullName;
                  delete updated.subCity;
                  delete updated.payoutConfig;
                  
                  localStorage.setItem("eb_user", JSON.stringify(updated));
                  onSwitchToTraveling();
                  window.location.reload();
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "12px 6px",
                cursor: "pointer",
                borderBottom: "1px solid #F5F5F5",
                marginTop: "10px",
                color: "#E74C3C"
              }}
            >
              <span style={{ fontSize: "1.1rem", color: "#E74C3C" }}>🔄</span>
              <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#E74C3C" }}>
                {language === "am" ? "ወደ ተከራይነት መልስ (ለሙከራ)" : "Reset to Renter Mode (Demo)"}
              </span>
            </div>

          </div>

        </div>
      )}

      {/* 7. ACCOUNT SETTINGS SPLIT SCREEN OVERLAY */}
      {showAccountSettings && (
        <div
          id="account-settings-overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#fff",
            zIndex: 2600,
            display: "flex",
            flexDirection: "column",
            fontFamily: "Outfit, sans-serif",
            overflow: "hidden"
          }}
        >
          {/* Header bar */}
          <div 
            style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              padding: "16px 20px", 
              borderBottom: "1px solid var(--border-color)", 
              backgroundColor: "#fff" 
            }}
          >
            {/* Left: Logo/Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ color: "#FF385C", fontSize: "1.4rem", fontWeight: "900", display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: "1.5rem" }}>✨</span>
                <span style={{ fontSize: "1.05rem", fontWeight: "800", marginLeft: "6px", color: "var(--text-dark)" }}>እንደ ቤቴ Settings</span>
              </div>
            </div>
            
            {/* Right: Done button */}
            <button
              onClick={() => {
                setShowAccountSettings(false);
                setEditFieldName(false);
                setEditFieldPreferred(false);
                setEditFieldEmail(false);
                setEditFieldPhone(false);
              }}
              style={{
                backgroundColor: "#1F1F1F",
                border: "none",
                borderRadius: "20px",
                padding: "8px 20px",
                fontSize: "0.78rem",
                fontWeight: "800",
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.15s ease"
              }}
            >
              {language === "am" ? "ተከናውኗል" : "Done"}
            </button>
          </div>

          {/* Main split-screen panel container */}
          <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
            
            {/* Left column: Sidebar navigation (35%) */}
            <div 
              style={{ 
                width: "35%", 
                borderRight: "1px solid var(--border-color)", 
                backgroundColor: "#FAF9F7", 
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                padding: "12px 6px"
              }}
            >
              {[
                { id: "personal", label: { am: "የግል መረጃ", en: "Personal information" }, icon: "👤" },
                { id: "security", label: { am: "መግቢያና ደህንነት", en: "Login & security" }, icon: "🛡️" },
                { id: "privacy", label: { am: "ግላዊነት", en: "Privacy" }, icon: "✋" },
                { id: "notifications", label: { am: "ማሳወቂያዎች", en: "Notifications" }, icon: "🔔" },
                { id: "taxes", label: { am: "ግብሮች", en: "Taxes" }, icon: "🧮" },
                { id: "payments", label: { am: "ክፍያዎችና ገቢዎች", en: "Payments" }, icon: "💳" },
                { id: "languages", label: { am: "ቋንቋና ገንዘብ", en: "Languages & currency" }, icon: "🌐" }
              ].map((tab) => {
                const isTabActive = activeSettingsTab === tab.id;
                return (
                  <div
                    key={tab.id}
                    onClick={() => {
                      setActiveSettingsTab(tab.id);
                      setEditFieldName(false);
                      setEditFieldPreferred(false);
                      setEditFieldEmail(false);
                      setEditFieldPhone(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 8px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      backgroundColor: isTabActive ? "#EAE3D9" : "transparent",
                      color: isTabActive ? "var(--text-dark)" : "var(--text-muted)",
                      fontWeight: isTabActive ? "800" : "600",
                      fontSize: "0.72rem",
                      marginBottom: "4px",
                      transition: "all 0.15s ease"
                    }}
                  >
                    <span style={{ fontSize: "0.95rem" }}>{tab.icon}</span>
                    <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {language === "am" ? tab.label.am : tab.label.en}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Right column: Form details (65%) */}
            <div style={{ width: "65%", padding: "20px 16px", overflowY: "auto", backgroundColor: "#fff" }}>
              
              {/* Active Tab: Personal Information */}
              {activeSettingsTab === "personal" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "20px" }}>
                    {language === "am" ? "የግል መረጃ" : "Personal information"}
                  </h2>

                  {/* Legal Name */}
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="flex-between">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {language === "am" ? "ሕጋዊ ስም" : "Legal name"}
                      </span>
                      <button
                        onClick={() => {
                          if (editFieldName) {
                            if (user) {
                              api.auth.updateFayda(user.faydaId, tempLegalName);
                              alert(language === "am" ? "ስምዎ በትክክል ተስተካክሏል!" : "Legal name updated successfully!");
                            }
                          }
                          setEditFieldName(!editFieldName);
                        }}
                        style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {editFieldName ? (language === "am" ? "አስቀምጥ" : "Save") : (language === "am" ? "አስተካክል" : "Edit")}
                      </button>
                    </div>
                    {editFieldName ? (
                      <input
                        type="text"
                        value={tempLegalName}
                        onChange={(e) => setTempLegalName(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--border-color)", borderRadius: "6px", marginTop: "6px" }}
                      />
                    ) : (
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                        {tempLegalName}
                      </p>
                    )}
                  </div>

                  {/* Preferred Name */}
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="flex-between">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {language === "am" ? "የሚመረጥ የመጀመሪያ ስም" : "Preferred first name"}
                      </span>
                      <button
                        onClick={() => {
                          if (editFieldPreferred) {
                            alert(language === "am" ? "የመጀመሪያ ስምዎ ተቀምጧል!" : "Preferred first name updated!");
                          }
                          setEditFieldPreferred(!editFieldPreferred);
                        }}
                        style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {editFieldPreferred ? (language === "am" ? "አስቀምጥ" : "Save") : (language === "am" ? "አስተካክል" : "Edit")}
                      </button>
                    </div>
                    {editFieldPreferred ? (
                      <input
                        type="text"
                        value={tempPreferredName}
                        onChange={(e) => setTempPreferredName(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--border-color)", borderRadius: "6px", marginTop: "6px" }}
                      />
                    ) : (
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                        {tempPreferredName}
                      </p>
                    )}
                  </div>

                  {/* Host Display Name Option */}
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="flex-between">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {language === "am" ? "የአስተናጋጅ ስም ማሳያ" : "Host display name for experiences and services"}
                      </span>
                      <button
                        onClick={() => alert("Settings saved!")}
                        style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textDecoration: "underline", cursor: "pointer" }}
                      >
                        Edit
                      </button>
                    </div>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                      Show my first name only
                    </p>
                  </div>

                  {/* Email Address */}
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="flex-between">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {language === "am" ? "ኢሜይል አድራሻ" : "Email address"}
                      </span>
                      <button
                        onClick={() => {
                          if (editFieldEmail) {
                            alert(language === "am" ? "ኢሜይል ተቀምጧል!" : "Email address updated!");
                          }
                          setEditFieldEmail(!editFieldEmail);
                        }}
                        style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {editFieldEmail ? (language === "am" ? "አስቀምጥ" : "Save") : (language === "am" ? "አስተካክል" : "Edit")}
                      </button>
                    </div>
                    {editFieldEmail ? (
                      <input
                        type="email"
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--border-color)", borderRadius: "6px", marginTop: "6px" }}
                      />
                    ) : (
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                        {tempEmail}
                      </p>
                    )}
                  </div>

                  {/* Phone Number */}
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <div className="flex-between">
                      <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                        {language === "am" ? "ስልክ ቁጥር" : "Phone number"}
                      </span>
                      <button
                        onClick={() => {
                          if (editFieldPhone) {
                            alert(language === "am" ? "ስልክ ቁጥርዎ ተቀምጧል!" : "Phone number updated!");
                          }
                          setEditFieldPhone(!editFieldPhone);
                        }}
                        style={{ background: "none", border: "none", fontSize: "0.75rem", fontWeight: "700", color: "var(--text-dark)", textDecoration: "underline", cursor: "pointer" }}
                      >
                        {editFieldPhone ? (language === "am" ? "አስቀምጥ" : "Save") : (language === "am" ? "አስተካክል" : "Edit")}
                      </button>
                    </div>
                    {editFieldPhone ? (
                      <input
                        type="text"
                        value={tempPhone}
                        onChange={(e) => setTempPhone(e.target.value)}
                        style={{ width: "100%", padding: "6px 8px", fontSize: "0.78rem", border: "1px solid var(--border-color)", borderRadius: "6px", marginTop: "6px" }}
                      />
                    ) : (
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: "4px 0 0 0" }}>
                        {tempPhone}
                      </p>
                    )}
                    <span style={{ fontSize: "0.62rem", color: "var(--text-muted)", display: "block", marginTop: "4px" }}>
                      {language === "am" ? "ለተረጋገጡ እንግዶች እና እንደ ቤቴ መድረክ ግንኙነት ማድረጊያ ቁጥር።" : "Contact number for confirmed guests and Ende Bete."}
                    </span>
                  </div>

                  {/* Identity Verification */}
                  <div style={{ paddingBottom: "12px" }}>
                    <span style={{ fontSize: "0.8rem", fontWeight: "700", color: "var(--text-dark)" }}>
                      {language === "am" ? "የማንነት ማረጋገጫ (Fayda)" : "Identity verification"}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                      <span style={{ fontSize: "1.15rem", color: "var(--ethiopian-green)" }}>🛡️</span>
                      <div>
                        <div style={{ fontSize: "0.75rem", fontWeight: "700", color: "var(--ethiopian-green)" }}>
                          {language === "am" ? "የተረጋገጠ ማንነት" : "Identity Verified"}
                        </div>
                        <div style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                          Fayda ID: <strong>{user?.faydaId || "ET-VERIFIED"}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              )}

              {/* Active Tab: Login & Security */}
              {activeSettingsTab === "security" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "20px" }}>
                    {language === "am" ? "መግቢያና ደህንነት" : "Login & security"}
                  </h2>
                  
                  <div style={{ borderBottom: "1px solid #F0F0F0", paddingBottom: "12px", marginBottom: "16px" }}>
                    <h4 style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                      {language === "am" ? "የስልክ ፒን ኮድ ማረጋገጫ" : "SMS PIN Verification"}
                    </h4>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: 0 }}>
                      {language === "am" ? "ገባሪ (ለደህንነት ሲባል በእያንዳንዱ መግቢያ ይላካል)" : "Active (Sent at every login checkpoint for security)"}
                    </p>
                  </div>

                  <div style={{ paddingBottom: "12px" }}>
                    <h4 style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--text-dark)", margin: "0 0 4px 0" }}>
                      {language === "am" ? "ገባሪ መሣሪያዎች" : "Active Devices"}
                    </h4>
                    <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", margin: "0 0 8px 0" }}>
                      {language === "am" ? "የአሁኑ መሣሪያ መለያዎን እያገኘ ነው" : "Current phone device accessing your portal"}
                    </p>
                    <div style={{ padding: "8px", backgroundColor: "#FAF9F7", border: "1px solid var(--border-color)", borderRadius: "8px", fontSize: "0.68rem" }}>
                      📱 Web View Mobile Simulator ● Online
                    </div>
                  </div>
                </div>
              )}

              {/* Active Tab: Payments & Payouts */}
              {activeSettingsTab === "payments" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "20px" }}>
                    {language === "am" ? "ክፍያዎችና ገቢዎች" : "Payments & Payouts"}
                  </h2>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.4", marginBottom: "16px" }}>
                    {language === "am"
                      ? "የእንግዳ ክፍያዎችን የሚቀበሉበትን የቴሌብር፣ CBE ወይም የባንክ መለያዎን ያዋቅሩ።"
                      : "Configure the payout account details where you receive CBE bank transfers and mobile money payments."}
                  </p>

                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (onUpdatePayout) {
                        onUpdatePayout({
                          method: payoutMethod,
                          account: payoutAccount,
                          name: payoutName
                        });
                        alert(language === "am" ? "የክፍያ መለያዎ በትክክል ተቀምጧል!" : "Payout settings saved successfully!");
                      }
                    }}
                    style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "#FAF9F7", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-color)" }}
                  >
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.7rem" }}>{language === "am" ? "የክፍያ መቀበያ አቅራቢ" : "Payout Method"}</label>
                      <select
                        className="form-select"
                        value={payoutMethod}
                        onChange={(e) => setPayoutMethod(e.target.value)}
                        style={{ padding: "8px", fontSize: "0.75rem", width: "100%" }}
                      >
                        <option value="telebirr">telebirr (ቴሌብር)</option>
                        <option value="cbe">Commercial Bank of Ethiopia (CBE)</option>
                        <option value="cbe_birr">CBE Birr</option>
                        <option value="awash">Awash Bank</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.7rem" }}>{language === "am" ? "የአካውንት ባለቤት ስም" : "Account Holder Name"}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={payoutName}
                        onChange={(e) => setPayoutName(e.target.value)}
                        required
                        style={{ padding: "8px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label" style={{ fontSize: "0.7rem" }}>{language === "am" ? "የአካውንት / ሞባይል ቁጥር" : "Account / Phone Number"}</label>
                      <input
                        type="text"
                        className="form-input"
                        value={payoutAccount}
                        onChange={(e) => setPayoutAccount(e.target.value)}
                        required
                        style={{ padding: "8px", fontSize: "0.75rem" }}
                      />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: "10px", fontSize: "0.75rem", backgroundColor: "var(--ethiopian-green)", color: "#fff", border: "none", boxShadow: "none" }}>
                      {language === "am" ? "የክፍያ መለያ አስቀምጥ" : "Save Payout Configuration"}
                    </button>
                  </form>
                </div>
              )}

              {/* Active Tab: Languages & Currency */}
              {activeSettingsTab === "languages" && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "20px" }}>
                    {language === "am" ? "ቋንቋ እና ገንዘብ" : "Languages & currency"}
                  </h2>

                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: "1.4", marginBottom: "16px" }}>
                    {language === "am"
                      ? "የስርዓቱን ዋና ቋንቋ እና መገበያያ ገንዘብ ይቀይሩ።"
                      : "Change the display language and transaction currency."}
                  </p>

                  <div style={{ backgroundColor: "#FAF9F7", padding: "14px", borderRadius: "12px", border: "1px solid var(--border-color)", display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                        Active Language:
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                        {language === "am" ? "አማርኛ (Amharic)" : "English (US)"}
                      </span>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: "bold", display: "block", marginBottom: "4px" }}>
                        Active Currency:
                      </span>
                      <span style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                        {currency === "USD" ? "USD ($)" : "ETB (ብር)"}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", fontStyle: "italic", borderTop: "1px solid #EAEAEA", paddingTop: "8px" }}>
                      💡 Toggle languages & currency in the main header of the app.
                    </div>
                  </div>
                </div>
              )}

              {/* Active Tabs: Privacy, Taxes, Booking permissions, Notifications templates */}
              {["privacy", "notifications", "taxes"].includes(activeSettingsTab) && (
                <div>
                  <h2 style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "20px" }}>
                    {activeSettingsTab === "privacy" && (language === "am" ? "ግላዊነት" : "Privacy")}
                    {activeSettingsTab === "notifications" && (language === "am" ? "ማሳወቂያዎች" : "Notifications")}
                    {activeSettingsTab === "taxes" && (language === "am" ? "ግብሮች" : "Taxes")}
                  </h2>
                  <div style={{ padding: "30px 16px", textAlign: "center", backgroundColor: "#FAF9F7", border: "1px dashed var(--border-color)", borderRadius: "12px", color: "var(--text-muted)", fontSize: "0.78rem" }}>
                    ℹ️ {language === "am" ? "ይህ አገልግሎት ገባሪ ነው" : "This setting configuration is active & secured by Fayda ID security guidelines."}
                  </div>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </div>
  );
}


