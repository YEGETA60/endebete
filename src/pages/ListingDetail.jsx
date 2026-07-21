import React, { useState } from "react";
import { ArrowLeft, MapPin, Star, Zap, Droplets, Wifi, ShieldCheck, Calendar, Info, Home } from "lucide-react";
import ActiveMap from "../components/ActiveMap";
import { api } from "../services/api";


export default function ListingDetail({ 
  listing, 
  language, 
  currency, 
  currencyRate, 
  onBack, 
  onBook, 
  user, 
  onAddReview, 
  onContactHost,
  initialCheckInDate = "2026-06-10",
  initialStayLength = 2,
  initialStayType = "nightly",
  initialGuests = 1
}) {
  const [stayNights, setStayNights] = useState(initialStayType === "nightly" ? initialStayLength : 2);
  const [stayMonths, setStayMonths] = useState(initialStayType === "monthly" ? initialStayLength : 3);
  const [moveInDate, setMoveInDate] = useState(initialCheckInDate);
  const [guestsCount, setGuestsCount] = useState(initialGuests);
  
  // Guest Review Submission States
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  // Get GPS coordinates (either saved by Host or generated deterministically for mocks)
  const gpsLocation = listing.gps || {
    lat: 9.0182 + (parseInt(String(listing.id).replace(/\D/g, "") || "1") % 10) * 0.0024,
    lng: 38.7749 - (parseInt(String(listing.id).replace(/\D/g, "") || "1") % 10) * 0.0018
  };

  const isMonthly = listing.duration === "monthly" || (listing.duration === "both" && listing.priceETB_monthly !== undefined);
  // Default selection based on availability
  const [activeDurationTab, setActiveDurationTab] = useState(
    listing.duration === "monthly" ? "monthly" : "nightly"
  );

  // Price calculations
  const priceETB = 
    activeDurationTab === "monthly" && listing.priceETB_monthly
      ? listing.priceETB_monthly
      : listing.priceETB;

  // Check how many weekend nights (Friday/Saturday) are included in the nightly stay
  let weekendNightsCount = 0;
  if (activeDurationTab === "nightly") {
    const startDate = new Date(moveInDate + "T00:00:00");
    for (let i = 0; i < stayNights; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const day = checkDate.getDay();
      if (day === 5 || day === 6) { // Friday or Saturday night
        weekendNightsCount++;
      }
    }
  }

  const normalNightsCount = stayNights - weekendNightsCount;
  const normalRate = priceETB;
  const weekendRate = Math.round(priceETB * 1.15); // 15% weekend dynamic surcharge

  const baseTotal = 
    activeDurationTab === "monthly"
      ? priceETB * stayMonths
      : (normalRate * normalNightsCount) + (weekendRate * weekendNightsCount);

  const localServiceFee = Math.round(baseTotal * 0.08); // 8% platform fee (covers 3.5-4.5% Chapa gateway fees + operational margin)
  const totalETB = baseTotal + localServiceFee;

  const formatCurrency = (amountETB) => {
    if (currency === "USD") {
      return `$${Math.round(amountETB / currencyRate)}`;
    }
    return `${amountETB.toLocaleString()} ብር`;
  };

  const handleBookingSubmit = () => {
    // 1. Calculate check-in date range
    const startDate = new Date(moveInDate + "T00:00:00");
    const durationDays = activeDurationTab === "monthly" ? stayMonths * 30 : stayNights;
    
    // 2. Fetch blocked and booked dates to prevent double booking
    const currentBlocked = api.blockedDates.getForListing(listing.id);
    const bookingRequests = api.host.getRequests();
    const approvedRequestsForListing = bookingRequests.filter(
      (r) => r.status === "approved" && r.listingTitle === listing.title.en
    );
    
    const bookedDates = [];
    approvedRequestsForListing.forEach((req) => {
      const reqStart = new Date(req.moveInDate + "T00:00:00");
      for (let j = 0; j < req.stayDuration; j++) {
        const d = new Date(reqStart);
        d.setDate(reqStart.getDate() + j);
        bookedDates.push(d.toISOString().split("T")[0]);
      }
    });

    // 3. Verify availability day by day
    for (let i = 0; i < durationDays; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const checkDateStr = checkDate.toISOString().split("T")[0];
      
      if (currentBlocked.includes(checkDateStr)) {
        alert(
          language === "am"
            ? `ይቅርታ! የመረጡት ቀን (${checkDateStr}) በአስተናጋጁ ተዘግቷል። እባክዎ ሌላ ቀን ይምረጡ።`
            : `Sorry! The date ${checkDateStr} is blocked by the host. Please choose another date range.`
        );
        return;
      }
      
      if (bookedDates.includes(checkDateStr)) {
        alert(
          language === "am"
            ? `ይቅርታ! የመረጡት ቀን (${checkDateStr}) ቀድሞ በሌላ ሰው ተይዟል። እባክዎ ሌላ ቀን ይምረጡ።`
            : `Sorry! The date ${checkDateStr} is already booked by another guest. Please choose another date range.`
        );
        return;
      }
    }

    onBook({
      listing,
      durationTab: activeDurationTab,
      stayDuration: activeDurationTab === "monthly" ? stayMonths : stayNights,
      moveInDate,
      baseTotal,
      serviceFee: localServiceFee,
      totalETB,
      guests: guestsCount
    });
  };


  return (
    <div style={{ paddingBottom: "30px" }}>
      {/* Detail Image Header */}
      <div style={{ height: "240px", position: "relative", backgroundColor: "#eee" }}>
        <img
          src={listing.image}
          alt={listing.title.en}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {/* Back Button */}
        <button
          id="btn-detail-back"
          onClick={onBack}
          style={{
            position: "absolute",
            top: "16px",
            left: "16px",
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }}
        >
          <ArrowLeft size={18} style={{ color: "var(--text-dark)" }} />
        </button>

        {/* Floating Category Badge */}
        <span
          style={{
            position: "absolute",
            bottom: "16px",
            right: "16px",
            backgroundColor: "rgba(28, 24, 20, 0.8)",
            color: "#fff",
            padding: "6px 12px",
            borderRadius: "20px",
            fontSize: "0.75rem",
            fontWeight: "600",
            backdropFilter: "blur(4px)"
          }}
        >
          {listing.type === "hotel" && "🏨 Hotel"}
          {listing.type === "guesthouse" && "🏠 Guest House"}
          {listing.type === "room" && "🛏️ Single Room"}
          {listing.type === "home" && "🏡 Full Home / Villa"}
          {listing.type === "apartment" && "🏢 Apartment"}
        </span>
      </div>

      <div style={{ padding: "16px" }}>
        {/* Core Info */}
        <div className="flex-between" style={{ marginBottom: "8px" }}>
          <div className="flex-row" style={{ gap: "4px", color: "var(--text-muted)", fontSize: "0.8rem", fontWeight: "600" }}>
            <MapPin size={14} style={{ color: "var(--terracotta)" }} />
            <span>{language === "am" ? listing.subCity.am : listing.subCity.en}</span>
          </div>
          <div className="flex-row" style={{ gap: "4px" }}>
            <Star size={14} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
            <span style={{ fontSize: "0.85rem", fontWeight: "700" }}>{listing.rating}</span>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
              ({listing.reviewsCount} {language === "am" ? "አስተያየቶች" : "reviews"})
            </span>
          </div>
        </div>

        <h2 style={{ fontSize: "1.2rem", fontWeight: "700", marginBottom: "12px", lineHeight: "1.4" }}>
          {language === "am" ? listing.title.am : listing.title.en}
        </h2>

        {/* Landmark Section - Address Strategy */}
        <div
          style={{
            backgroundColor: "rgba(211, 84, 0, 0.05)",
            border: "1px dashed var(--terracotta)",
            borderRadius: "14px",
            padding: "12px",
            marginBottom: "20px"
          }}
        >
          <h4 style={{ fontSize: "0.85rem", color: "var(--terracotta)", fontWeight: "700", marginBottom: "4px" }}>
            📍 {language === "am" ? "የአካባቢ መግለጫ / ምልክት (Landmark)" : "Landmarks & Address Guide"}
          </h4>
          <p style={{ fontSize: "0.82rem", color: "var(--text-dark)", lineHeight: "1.4" }}>
            {language === "am" ? listing.landmark.am : listing.landmark.en}
          </p>
        </div>

        {/* GPS Location Map Card with 100m Privacy Radius */}
        <div
          className="card-premium"
          style={{
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border-color)",
            padding: "12px",
            borderRadius: "16px",
            marginBottom: "20px"
          }}
        >
          <h4 style={{ fontSize: "0.85rem", color: "var(--text-dark)", fontWeight: "700", marginBottom: "4px", display: "flex", justifyContent: "space-between" }}>
            <span>📍 {language === "am" ? "የጂፒኤስ መገኛ ካርታ" : "Property Location Map"}</span>
            <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", fontWeight: "normal" }}>
              {gpsLocation.lat.toFixed(5)}°, {gpsLocation.lng.toFixed(5)}°
            </span>
          </h4>
          
          <div 
            style={{ 
              position: "relative", 
              width: "100%", 
              height: "200px", 
              borderRadius: "12px", 
              overflow: "hidden", 
              backgroundColor: "#E5E9F0",
              border: "1px solid rgba(0,0,0,0.06)",
              marginTop: "8px",
              marginBottom: "8px"
            }}
          >
            <ActiveMap
              lat={gpsLocation.lat}
              lng={gpsLocation.lng}
              showCircle={true}
              isInteractive={false}
              language={language}
            />
          </div>

          <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.4", margin: 0 }}>
            ℹ️ {language === "am" 
              ? "ለእንግዶች እና በአስተናጋጆች ደህንነት ሲባል ትክክለኛው የቤት ቁጥር ተደብቋል። ይህ ካርታ በ100 ሜትር ራዲየስ ውስጥ ግምታዊ አካባቢን ያሳያል።" 
              : "For guest and host privacy, the exact address is hidden. The marker shows a general 100m visual search radius."}
          </p>
        </div>

        {/* Backup Utilities section */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "10px" }}>
            {language === "am" ? "አስተማማኝ መሠረተ ልማቶች" : "Infrastructure Backups"}
          </h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {/* Electricity Backup */}
            <div
              style={{
                backgroundColor: "var(--bg-white)",
                border: "1px solid var(--border-color)",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Zap size={18} style={{ color: listing.backups.electricity.available ? "var(--ethiopian-gold)" : "var(--text-muted)" }} />
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                  {language === "am" ? "መብራት / ጄነሬተር" : "Electricity"}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  {listing.backups.electricity.available 
                    ? listing.backups.electricity.type 
                    : (language === "am" ? "የለም" : "No Backup")}
                </div>
              </div>
            </div>

            {/* Water Backup */}
            <div
              style={{
                backgroundColor: "var(--bg-white)",
                border: "1px solid var(--border-color)",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Droplets size={18} style={{ color: listing.backups.water.available ? "#3498DB" : "var(--text-muted)" }} />
              <div>
                <div style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                  {language === "am" ? "ውሃ ታንከር" : "Water Backup"}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  {listing.backups.water.available 
                    ? listing.backups.water.type 
                    : (language === "am" ? "የለም" : "No Backup")}
                </div>
              </div>
            </div>

            {/* WiFi Backup */}
            <div
              style={{
                backgroundColor: "var(--bg-white)",
                border: "1px solid var(--border-color)",
                padding: "10px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                gridColumn: "1 / -1"
              }}
            >
              <Wifi size={18} style={{ color: listing.backups.wifi.available ? "var(--ethiopian-green)" : "var(--text-muted)" }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.75rem", fontWeight: "700" }}>
                  {language === "am" ? "ኢንተርኔት / ዋይፋይ" : "WiFi & Internet Backup"}
                </div>
                <div style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>
                  {listing.backups.wifi.available 
                    ? listing.backups.wifi.type 
                    : (language === "am" ? "የለም" : "No Internet Backup")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "8px" }}>
            {language === "am" ? "መግለጫ" : "Description"}
          </h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", lineHeight: "1.5" }}>
            {language === "am" ? listing.description.am : listing.description.en}
          </p>
        </div>

        {/* Host Details & Fayda ID Badge */}
        <div
          className="card-premium"
          style={{
            backgroundColor: "var(--bg-white)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "24px"
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.2rem",
              fontWeight: "bold",
              color: "var(--terracotta)"
            }}
          >
            {listing.host.name.charAt(0)}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: "700" }}>{listing.host.name}</span>
              {listing.host.verifiedFayda && (
                <span
                  style={{
                    backgroundColor: "rgba(30, 130, 76, 0.1)",
                    color: "var(--ethiopian-green)",
                    padding: "2px 6px",
                    borderRadius: "4px",
                    fontSize: "0.6rem",
                    fontWeight: "700",
                    display: "flex",
                    alignItems: "center",
                    gap: "2px"
                  }}
                >
                  <ShieldCheck size={10} /> Verified
                </span>
              )}
            </div>
            <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
              {listing.host.verifiedFayda 
                ? `Fayda ID: ${listing.host.faydaId}` 
                : (language === "am" ? "የፋይዳ መለያ አልተረጋገጠም" : "No Fayda verification yet")}
            </div>
          </div>
          <button
            id="btn-message-host"
            onClick={onContactHost}
            style={{
              padding: "8px 14px",
              borderRadius: "20px",
              border: "1.5px solid var(--terracotta)",
              backgroundColor: "transparent",
              color: "var(--terracotta)",
              fontSize: "0.75rem",
              fontWeight: "700",
              cursor: "pointer"
            }}
          >
            {language === "am" ? "አግኝ" : "Message"}
          </button>
        </div>

        {/* Booking Form Card */}
        <div
          className="card-premium"
          style={{
            border: "1.5px solid var(--border-color)",
            boxShadow: "0 6px 20px rgba(0,0,0,0.06)",
            padding: "16px"
          }}
        >
          {/* Duration Tab Switcher if Listing supports both */}
          {listing.duration === "both" && (
            <div
              style={{
                display: "flex",
                backgroundColor: "var(--bg-cream)",
                borderRadius: "10px",
                padding: "2px",
                marginBottom: "14px"
              }}
            >
              <button
                id="btn-detail-tab-nightly"
                onClick={() => setActiveDurationTab("nightly")}
                style={{
                  flex: 1,
                  border: "none",
                  background: activeDurationTab === "nightly" ? "var(--bg-white)" : "transparent",
                  color: activeDurationTab === "nightly" ? "var(--terracotta)" : "var(--text-muted)",
                  fontWeight: "700",
                  padding: "6px 0",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                {language === "am" ? "በቀን (የአጭር ጊዜ)" : "Nightly Stay"}
              </button>
              <button
                id="btn-detail-tab-monthly"
                onClick={() => setActiveDurationTab("monthly")}
                style={{
                  flex: 1,
                  border: "none",
                  background: activeDurationTab === "monthly" ? "var(--bg-white)" : "transparent",
                  color: activeDurationTab === "monthly" ? "var(--terracotta)" : "var(--text-muted)",
                  fontWeight: "700",
                  padding: "6px 0",
                  borderRadius: "8px",
                  fontSize: "0.75rem",
                  cursor: "pointer"
                }}
              >
                {language === "am" ? "በወር (የረጅም ጊዜ)" : "Monthly Rent"}
              </button>
            </div>
          )}

          {/* Form Fields */}
          <div className="form-group">
            <label className="form-label">
              {language === "am" ? "መግቢያ ቀን" : "Move-in / Start Date"}
            </label>
            <input
              id="input-booking-date"
              type="date"
              className="form-input"
              value={moveInDate}
              onChange={(e) => setMoveInDate(e.target.value)}
            />
          </div>

          {activeDurationTab === "nightly" ? (
            <div className="form-group">
              <label className="form-label">
                {language === "am" ? "የቀናት ብዛት" : "Number of Nights"}
              </label>
              <select
                id="select-booking-nights"
                className="form-select"
                value={stayNights}
                onChange={(e) => setStayNights(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 7, 10, 14, 21].map((n) => (
                  <option key={n} value={n}>
                    {n} {language === "am" ? "ቀናት" : "Nights"}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="form-group">
              <label className="form-label">
                {language === "am" ? "የኪራይ ወራት ብዛት" : "Contract Duration (Months)"}
              </label>
              <select
                id="select-booking-months"
                className="form-select"
                value={stayMonths}
                onChange={(e) => setStayMonths(Number(e.target.value))}
              >
                {[1, 2, 3, 6, 12].map((m) => (
                  <option key={m} value={m}>
                    {m} {language === "am" ? "ወራት" : "Months"}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-group" style={{ marginTop: "12px" }}>
            <label className="form-label">
              {language === "am" ? "የነዋሪዎች ብዛት (እንግዶች)" : "Number of Guests"}
            </label>
            <select
              id="select-booking-guests"
              className="form-select"
              value={guestsCount}
              onChange={(e) => setGuestsCount(Number(e.target.value))}
              style={{ borderRadius: "10px", fontSize: "0.78rem" }}
            >
              {[1, 2, 3, 4, 5, 6].map((g) => (
                <option key={g} value={g}>
                  {g} {g === 1 ? (language === "am" ? "እንግዳ" : "Guest") : (language === "am" ? "እንግዶች" : "Guests")}
                </option>
              ))}
            </select>
          </div>

          {/* Pricing breakdown */}
          <div style={{ margin: "14px 0", fontSize: "0.8rem", color: "var(--text-dark)" }}>
            {activeDurationTab === "nightly" && weekendNightsCount > 0 ? (
              <>
                <div className="flex-between" style={{ marginBottom: "6px" }}>
                  <span>
                    {formatCurrency(normalRate)} x {normalNightsCount} {language === "am" ? "የሳምንት ቀናት" : "Weekday Nights"}
                  </span>
                  <span>{formatCurrency(normalRate * normalNightsCount)}</span>
                </div>
                <div className="flex-between" style={{ marginBottom: "6px", color: "var(--terracotta)" }}>
                  <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    {formatCurrency(weekendRate)} x {weekendNightsCount} {language === "am" ? "የእረፍት ቀናት (+15% ተለዋዋጭ)" : "Weekend Nights (+15% dynamic)"}
                    <span style={{ backgroundColor: "rgba(211,84,0,0.1)", color: "var(--terracotta)", padding: "1px 4px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "bold" }}>
                      {language === "am" ? "ተለዋዋጭ" : "Dynamic"}
                    </span>
                  </span>
                  <span>{formatCurrency(weekendRate * weekendNightsCount)}</span>
                </div>
              </>
            ) : (
              <div className="flex-between" style={{ marginBottom: "6px" }}>
                <span>
                  {formatCurrency(priceETB)} x{" "}
                  {activeDurationTab === "nightly" 
                    ? `${stayNights} ${language === "am" ? "ቀናት" : "Nights"}`
                    : `${stayMonths} ${language === "am" ? "ወራት" : "Months"}`}
                </span>
                <span>{formatCurrency(baseTotal)}</span>
              </div>
            )}
            <div className="flex-between" style={{ marginBottom: "8px", color: "var(--ethiopian-green)" }}>
              <span className="flex-row" style={{ gap: "4px" }}>
                {language === "am" ? "የአገልግሎት ክፍያ (8%)" : "Service Fee (8%)"}
                <Info size={12} title="Local competitive fee" />
              </span>
              <span>{formatCurrency(localServiceFee)}</span>
            </div>
            <div
              className="flex-between"
              style={{
                borderTop: "1px solid var(--border-color)",
                paddingTop: "8px",
                fontWeight: "800",
                fontSize: "0.95rem"
              }}
            >
              <span>{language === "am" ? "ጠቅላላ ድምር" : "Total Payable"}</span>
              <span style={{ color: "var(--terracotta)" }}>{formatCurrency(totalETB)}</span>
            </div>
          </div>

          {/* Checkout Trigger Button */}
          <button
            id="btn-book-now"
            onClick={handleBookingSubmit}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            <Calendar size={18} />
            {language === "am" ? "አሁን ያዝዙ" : "Reserve Stay"}
          </button>
        </div>

        {/* Reviews & Trust Section */}
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>
            ⭐ {language === "am" ? `የእንግዶች አስተያየቶች (${listing.reviewsCount || 0})` : `Guest Reviews (${listing.reviewsCount || 0})`}
          </h3>

          {/* Form to submit review if logged in */}
          {user ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!userComment.trim()) {
                  alert(language === "am" ? "እባክዎ መጀመሪያ አስተያየትዎን ይጻፉ!" : "Please write a comment first!");
                  return;
                }
                const reviewData = {
                  id: "rev-" + Math.floor(Math.random() * 100000),
                  guestName: user.fullName || `User ${user.phoneNumber.slice(-4)}`,
                  faydaVerified: user.faydaVerified,
                  rating: userRating,
                  comment: {
                    am: userComment,
                    en: userComment
                  },
                  date: new Date().toLocaleDateString()
                };
                if (onAddReview) {
                  onAddReview(listing.id, reviewData);
                  setUserComment("");
                  alert(language === "am" ? "አስተያየትዎ በትክክል ተመዝግቧል!" : "Review submitted successfully!");
                }
              }}
              className="card-premium"
              style={{ backgroundColor: "var(--bg-white)", padding: "14px", marginBottom: "16px" }}
            >
              <h4 style={{ fontSize: "0.85rem", fontWeight: "700", marginBottom: "10px", color: "var(--terracotta)" }}>
                ✍️ {language === "am" ? "አስተያየትዎን ይጻፉ" : "Write a Verified Review"}
              </h4>
              
              <div className="form-group" style={{ marginBottom: "12px" }}>
                <label className="form-label">{language === "am" ? "ደረጃ ይስጡ" : "Rating"}</label>
                <select
                  id="select-review-rating"
                  className="form-select"
                  value={userRating}
                  onChange={(e) => setUserRating(Number(e.target.value))}
                  style={{ padding: "8px 12px", fontSize: "0.8rem", width: "100%" }}
                >
                  {[5, 4, 3, 2, 1].map(num => (
                    <option key={num} value={num}>{num} {language === "am" ? "ኮከብ" : "Stars"}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "12px" }}>
                <label className="form-label">{language === "am" ? "አስተያየት" : "Comment"}</label>
                <textarea
                  id="textarea-review-comment"
                  className="form-input"
                  rows={3}
                  value={userComment}
                  onChange={(e) => setUserComment(e.target.value)}
                  placeholder={language === "am" ? "ማረፊያውን እንዴት አገኙት?..." : "How was your stay?..."}
                  required
                  style={{ resize: "none", fontSize: "0.8rem", padding: "10px" }}
                />
              </div>

              <button id="btn-submit-review" type="submit" className="btn-success" style={{ width: "100%", padding: "10px", fontSize: "0.8rem" }}>
                {language === "am" ? "አስተያየቱን ላክ" : "Post Review"}
              </button>
            </form>
          ) : (
            <div style={{ padding: "12px", backgroundColor: "rgba(44, 37, 32, 0.04)", borderRadius: "12px", textAlign: "center", marginBottom: "16px" }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                💬 {language === "am" ? "አስተያየት ለመጻፍ እባክዎ መጀመሪያ ይግቡ።" : "Log in to post a verified review."}
              </span>
            </div>
          )}

          {/* List of existing reviews */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {(listing.reviews || []).map((rev) => (
              <div key={rev.id} className="card-premium" style={{ backgroundColor: "var(--bg-white)", padding: "12px", marginBottom: 0 }}>
                <div className="flex-between" style={{ marginBottom: "6px" }}>
                  <div className="flex-row" style={{ gap: "6px" }}>
                    <strong style={{ fontSize: "0.82rem", color: "var(--text-dark)" }}>{rev.guestName}</strong>
                    {rev.faydaVerified && (
                      <span
                        style={{
                          backgroundColor: "rgba(30, 130, 76, 0.1)",
                          color: "var(--ethiopian-green)",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontSize: "0.55rem",
                          fontWeight: "700"
                        }}
                      >
                        Fayda ✓
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: "0.68rem", color: "var(--text-muted)" }}>{rev.date}</span>
                </div>

                <div className="flex-row" style={{ gap: "2px", marginBottom: "6px" }}>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={10}
                      fill={i < rev.rating ? "var(--ethiopian-gold)" : "transparent"}
                      stroke="var(--ethiopian-gold)"
                    />
                  ))}
                </div>

                <p style={{ fontSize: "0.78rem", color: "var(--text-dark)", lineHeight: "1.4" }}>
                  {language === "am" ? rev.comment.am : rev.comment.en}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
