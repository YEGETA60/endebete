import React, { useState } from "react";
import { 
  ArrowLeft, MapPin, Star, Zap, Droplets, Wifi, ShieldCheck, Calendar, Info, 
  Heart, Grid, X, Check, Clock, Home, Award, Sparkles, AlertTriangle
} from "lucide-react";
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
  
  // Wishlist Heart state
  const [isFavorite, setIsFavorite] = useState(false);

  // Photo Lightbox Modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  // Guest Review Submission States
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState("");

  const photos = listing.gallery || [listing.image];

  // GPS coordinates
  const gpsLocation = listing.gps || {
    lat: 9.0182 + (parseInt(String(listing.id).replace(/\D/g, "") || "1") % 10) * 0.0024,
    lng: 38.7749 - (parseInt(String(listing.id).replace(/\D/g, "") || "1") % 10) * 0.0018
  };

  const [activeDurationTab, setActiveDurationTab] = useState(
    listing.duration === "monthly" ? "monthly" : "nightly"
  );

  // Price calculations
  const priceETB = 
    activeDurationTab === "monthly" && listing.priceETB_monthly
      ? listing.priceETB_monthly
      : listing.priceETB;

  // Weekend dynamic pricing calculation
  let weekendNightsCount = 0;
  if (activeDurationTab === "nightly") {
    const startDate = new Date(moveInDate + "T00:00:00");
    for (let i = 0; i < stayNights; i++) {
      const checkDate = new Date(startDate);
      checkDate.setDate(startDate.getDate() + i);
      const day = checkDate.getDay();
      if (day === 5 || day === 6) {
        weekendNightsCount++;
      }
    }
  }

  const normalNightsCount = stayNights - weekendNightsCount;
  const normalRate = priceETB;
  const weekendRate = Math.round(priceETB * 1.15);

  const baseTotal = 
    activeDurationTab === "monthly"
      ? priceETB * stayMonths
      : (normalRate * normalNightsCount) + (weekendRate * weekendNightsCount);

  const localServiceFee = Math.round(baseTotal * 0.08);
  const totalETB = baseTotal + localServiceFee;

  const formatCurrency = (amountETB) => {
    if (currency === "USD") {
      return `$${Math.round(amountETB / currencyRate)}`;
    }
    return `${amountETB.toLocaleString()} ብር`;
  };

  const handleBookingSubmit = () => {
    const startDate = new Date(moveInDate + "T00:00:00");
    const durationDays = activeDurationTab === "monthly" ? stayMonths * 30 : stayNights;
    
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

  const ratings = listing.ratingsBreakdown || {
    cleanliness: 4.9,
    accuracy: 4.8,
    communication: 4.95,
    location: 4.9,
    checkIn: 4.9,
    value: 4.8
  };

  return (
    <div style={{ paddingBottom: "40px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Navigation & Title Header Bar */}
      <div className="flex-between" style={{ padding: "16px 16px 12px 16px" }}>
        <button
          id="btn-detail-back"
          onClick={onBack}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            padding: "8px 14px",
            fontSize: "0.8rem",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          <ArrowLeft size={16} />
          <span>{language === "am" ? "ተመለስ" : "Back"}</span>
        </button>

        <button
          id="btn-detail-heart"
          onClick={() => setIsFavorite(!isFavorite)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "var(--bg-white)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            padding: "8px 14px",
            fontSize: "0.8rem",
            fontWeight: "700",
            cursor: "pointer",
            color: isFavorite ? "#E74C3C" : "var(--text-dark)"
          }}
        >
          <Heart size={16} fill={isFavorite ? "#E74C3C" : "transparent"} />
          <span>{isFavorite ? (language === "am" ? "ተቀምጧል" : "Saved") : (language === "am" ? "አስቀምጥ" : "Save")}</span>
        </button>
      </div>

      <div style={{ padding: "0 16px 16px 16px" }}>
        <h1 style={{ fontSize: "1.4rem", fontWeight: "800", marginBottom: "6px", lineHeight: "1.3" }}>
          {language === "am" ? listing.title.am : listing.title.en}
        </h1>
        
        <div className="flex-between" style={{ marginBottom: "16px", fontSize: "0.82rem" }}>
          <div className="flex-row" style={{ gap: "10px", flexWrap: "wrap" }}>
            <span className="flex-row" style={{ gap: "4px", fontWeight: "700" }}>
              <Star size={14} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
              {listing.rating.toFixed(2)} • <span style={{ textDecoration: "underline", color: "var(--text-muted)", fontWeight: "600" }}>{listing.reviewsCount} {language === "am" ? "አስተያየቶች" : "reviews"}</span>
            </span>
            <span>•</span>
            <span className="flex-row" style={{ gap: "4px", color: "var(--text-muted)", fontWeight: "600" }}>
              <MapPin size={14} style={{ color: "var(--terracotta)" }} />
              {language === "am" ? listing.subCity.am : listing.subCity.en}
            </span>
          </div>
        </div>

        {/* 1. Airbnb 5-Photo Mosaic Gallery (Desktop Grid / Mobile Hero Image) */}
        <div style={{ position: "relative", marginBottom: "24px", borderRadius: "20px", overflow: "hidden", boxShadow: "0 6px 20px rgba(0,0,0,0.08)" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: photos.length >= 5 ? "2fr 1fr 1fr" : "1fr",
              gridTemplateRows: photos.length >= 5 ? "180px 180px" : "320px",
              gap: "8px",
              height: photos.length >= 5 ? "368px" : "320px",
              backgroundColor: "#1D1815"
            }}
          >
            {/* Main Primary Image */}
            <div 
              onClick={() => { setSelectedPhotoIndex(0); setIsLightboxOpen(true); }}
              style={{ gridRow: photos.length >= 5 ? "span 2" : "span 1", position: "relative", cursor: "pointer", overflow: "hidden" }}
            >
              <img src={photos[0]} alt="Property photo 1" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>

            {/* Grid secondary photos */}
            {photos.length >= 5 && photos.slice(1, 5).map((photo, idx) => (
              <div
                key={idx}
                onClick={() => { setSelectedPhotoIndex(idx + 1); setIsLightboxOpen(true); }}
                style={{ position: "relative", cursor: "pointer", overflow: "hidden" }}
              >
                <img src={photo} alt={`Property photo ${idx + 2}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            ))}
          </div>

          {/* Show All Photos Floating Button */}
          <button
            id="btn-show-photos"
            onClick={() => setIsLightboxOpen(true)}
            style={{
              position: "absolute",
              bottom: "16px",
              right: "16px",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              color: "var(--text-dark)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "8px 14px",
              fontSize: "0.78rem",
              fontWeight: "700",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              backdropFilter: "blur(4px)"
            }}
          >
            <Grid size={14} />
            <span>{language === "am" ? "ሁሉንም ፎቶዎች አሳይ" : `Show all ${photos.length} photos`}</span>
          </button>
        </div>

        {/* Desktop 2-Column Split Layout */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" }}>
          
          {/* Left Column: Details, Amenities, Rules, Reviews */}
          <div>
            
            {/* Host Profile Header */}
            <div
              className="card-premium"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                marginBottom: "24px"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "var(--terracotta)",
                    color: "#FFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "1.3rem",
                    fontWeight: "bold"
                  }}
                >
                  {listing.host.name.charAt(0)}
                </div>
                <div>
                  <div style={{ fontSize: "0.95rem", fontWeight: "800", display: "flex", alignItems: "center", gap: "6px" }}>
                    <span>Hosted by {listing.host.name}</span>
                    {listing.host.verifiedFayda && (
                      <span style={{ backgroundColor: "rgba(30, 130, 76, 0.1)", color: "var(--ethiopian-green)", padding: "2px 6px", borderRadius: "4px", fontSize: "0.6rem", fontWeight: "700" }}>
                        Fayda ✓
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
                    Response rate: {listing.host.responseRate || "98%"} • Responds {listing.host.responseTime || "within an hour"}
                  </div>
                </div>
              </div>

              <button
                id="btn-contact-host"
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
                {language === "am" ? "አግኝ" : "Message Host"}
              </button>
            </div>

            {/* Airbnb Key Stay Highlights */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "24px" }}>
              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <Award size={22} style={{ color: "var(--terracotta)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: "700" }}>
                    {language === "am" ? "ከፍተኛ ደረጃ የተሰጠው አስተናጋጅ" : "Superhost Status"}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {language === "am" ? "አስተናጋጁ ለእንግዶች ምርጥ አገልግሎት በመስጠት የታወቀ ነው።" : "Highly rated host committed to providing great stays for guests."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <Sparkles size={22} style={{ color: "var(--ethiopian-gold-dark)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: "700" }}>
                    {language === "am" ? "የራስ-ገዝ መግቢያ (Self Check-in)" : "Self Check-in Available"}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {language === "am" ? "በዲጂታል ቁልፍ ወይም በደህንነት ሳጥን በቀላሉ መግባት ይችላሉ።" : "Check yourself in easily with the smart lock or keypad."}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                <Clock size={22} style={{ color: "var(--ethiopian-green)", flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <h4 style={{ fontSize: "0.88rem", fontWeight: "700" }}>
                    {language === "am" ? "ተለዋዋጭ የስረዛ ፖሊሲ" : "Flexible Cancellation"}
                  </h4>
                  <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: 0 }}>
                    {language === "am" ? listing.cancellationPolicy.am : listing.cancellationPolicy.en}
                  </p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "24px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "8px" }}>
                {language === "am" ? "ስለ ማረፊያው" : "About this space"}
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-dark)", lineHeight: "1.6" }}>
                {language === "am" ? listing.description.am : listing.description.en}
              </p>
            </div>

            {/* Amenities Grid */}
            <div style={{ marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "24px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "14px" }}>
                {language === "am" ? "ምን ያካተተ ማቀፊያ አለው?" : "What this place offers"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {listing.amenities.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.82rem", color: "var(--text-dark)" }}>
                    <Check size={16} style={{ color: "var(--ethiopian-green)" }} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Infrastructure Backups section */}
            <div style={{ marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "24px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "12px" }}>
                {language === "am" ? "የመሠረተ ልማት ዋስትናዎች" : "Guaranteed Utility Backups"}
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ backgroundColor: "var(--bg-white)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <Zap size={20} style={{ color: listing.backups.electricity.available ? "var(--ethiopian-gold-dark)" : "var(--text-muted)" }} />
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700" }}>{language === "am" ? "መብራት / ጄነሬተር" : "Electricity"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{listing.backups.electricity.type}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--bg-white)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "center" }}>
                  <Droplets size={20} style={{ color: listing.backups.water.available ? "#3498DB" : "var(--text-muted)" }} />
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700" }}>{language === "am" ? "ውሃ ታንከር" : "Water Well / Tank"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{listing.backups.water.type}</div>
                  </div>
                </div>

                <div style={{ backgroundColor: "var(--bg-white)", border: "1px solid var(--border-color)", padding: "12px", borderRadius: "14px", display: "flex", gap: "10px", alignItems: "center", gridColumn: "1 / -1" }}>
                  <Wifi size={20} style={{ color: listing.backups.wifi.available ? "var(--ethiopian-green)" : "var(--text-muted)" }} />
                  <div>
                    <div style={{ fontSize: "0.78rem", fontWeight: "700" }}>{language === "am" ? "ኢንተርኔት / ዋይፋይ" : "Fiber WiFi & Power UPS"}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{listing.backups.wifi.type}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Map Section */}
            <div style={{ marginBottom: "24px", borderBottom: "1px solid var(--border-color)", paddingBottom: "24px" }}>
              <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "8px" }}>
                📍 {language === "am" ? "የጂፒኤስ መገኛ ካርታ" : "Where you'll be"}
              </h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "12px" }}>
                {language === "am" ? listing.landmark.am : listing.landmark.en}
              </p>
              
              <div style={{ height: "240px", borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                <ActiveMap lat={gpsLocation.lat} lng={gpsLocation.lng} showCircle={true} isInteractive={false} language={language} />
              </div>
            </div>

            {/* 6-Metric Airbnb Ratings Breakdown */}
            <div style={{ marginBottom: "24px" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: "800", marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px" }}>
                <Star size={18} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
                {listing.rating.toFixed(2)} • {listing.reviewsCount} {language === "am" ? "አስተያየቶች" : "reviews"}
              </h3>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
                <div>
                  <div className="flex-between" style={{ fontSize: "0.78rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>{language === "am" ? "ጽዳት" : "Cleanliness"}</span>
                    <span>{ratings.cleanliness}</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "#EFE9DF", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${(ratings.cleanliness / 5) * 100}%`, height: "100%", backgroundColor: "var(--text-dark)" }} />
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: "0.78rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>{language === "am" ? "ትክክለኛነት" : "Accuracy"}</span>
                    <span>{ratings.accuracy}</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "#EFE9DF", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${(ratings.accuracy / 5) * 100}%`, height: "100%", backgroundColor: "var(--text-dark)" }} />
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: "0.78rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>{language === "am" ? "ግንኙነት" : "Communication"}</span>
                    <span>{ratings.communication}</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "#EFE9DF", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${(ratings.communication / 5) * 100}%`, height: "100%", backgroundColor: "var(--text-dark)" }} />
                  </div>
                </div>

                <div>
                  <div className="flex-between" style={{ fontSize: "0.78rem", fontWeight: "600", marginBottom: "4px" }}>
                    <span>{language === "am" ? "አካባቢ" : "Location"}</span>
                    <span>{ratings.location}</span>
                  </div>
                  <div style={{ height: "4px", backgroundColor: "#EFE9DF", borderRadius: "2px", overflow: "hidden" }}>
                    <div style={{ width: `${(ratings.location / 5) * 100}%`, height: "100%", backgroundColor: "var(--text-dark)" }} />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Booking Card */}
          <div>
            <div
              className="card-premium"
              style={{
                position: "sticky",
                top: "84px",
                border: "1.5px solid var(--border-color)",
                boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                padding: "20px"
              }}
            >
              <div className="flex-between" style={{ marginBottom: "16px" }}>
                <div>
                  <span style={{ fontSize: "1.3rem", fontWeight: "800", color: "var(--terracotta)" }}>
                    {formatCurrency(priceETB)}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    {activeDurationTab === "monthly" ? " / month" : " / night"}
                  </span>
                </div>
                <div className="flex-row" style={{ gap: "4px", fontSize: "0.8rem", fontWeight: "700" }}>
                  <Star size={14} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
                  <span>{listing.rating.toFixed(2)}</span>
                </div>
              </div>

              {/* Start Date */}
              <div className="form-group">
                <label className="form-label">{language === "am" ? "መግቢያ ቀን" : "Check-in Date"}</label>
                <input
                  id="input-booking-date"
                  type="date"
                  className="form-input"
                  value={moveInDate}
                  onChange={(e) => setMoveInDate(e.target.value)}
                />
              </div>

              {/* Duration Nights or Months */}
              {activeDurationTab === "nightly" ? (
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የቀናት ብዛት" : "Nights"}</label>
                  <select id="select-booking-nights" className="form-select" value={stayNights} onChange={(e) => setStayNights(Number(e.target.value))}>
                    {[1, 2, 3, 4, 5, 7, 10, 14, 21].map((n) => (
                      <option key={n} value={n}>{n} {language === "am" ? "ቀናት" : "Nights"}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የወራት ብዛት" : "Months"}</label>
                  <select id="select-booking-months" className="form-select" value={stayMonths} onChange={(e) => setStayMonths(Number(e.target.value))}>
                    {[1, 2, 3, 6, 12].map((m) => (
                      <option key={m} value={m}>{m} {language === "am" ? "ወራት" : "Months"}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Guests */}
              <div className="form-group">
                <label className="form-label">{language === "am" ? "እንግዶች" : "Guests"}</label>
                <select id="select-booking-guests" className="form-select" value={guestsCount} onChange={(e) => setGuestsCount(Number(e.target.value))}>
                  {[1, 2, 3, 4, 5, 6].map((g) => (
                    <option key={g} value={g}>{g} {language === "am" ? "እንግዳ" : "Guest(s)"}</option>
                  ))}
                </select>
              </div>

              {/* Price Calculation */}
              <div style={{ margin: "16px 0", fontSize: "0.82rem", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div className="flex-between">
                  <span>{formatCurrency(priceETB)} x {stayNights} nights</span>
                  <span>{formatCurrency(baseTotal)}</span>
                </div>
                <div className="flex-between" style={{ color: "var(--ethiopian-green)" }}>
                  <span>Service fee (8%)</span>
                  <span>{formatCurrency(localServiceFee)}</span>
                </div>
                <div className="flex-between" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px", fontWeight: "800", fontSize: "1rem" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--terracotta)" }}>{formatCurrency(totalETB)}</span>
                </div>
              </div>

              <button id="btn-book-now" onClick={handleBookingSubmit} className="btn-primary" style={{ width: "100%", padding: "14px" }}>
                <Calendar size={18} />
                <span>{language === "am" ? "አሁን ያዝዙ" : "Reserve Stay"}</span>
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Fullscreen Photo Lightbox Modal */}
      {isLightboxOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px"
          }}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              backgroundColor: "rgba(255,255,255,0.2)",
              color: "#FFF",
              border: "none",
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <X size={24} />
          </button>

          <img
            src={photos[selectedPhotoIndex]}
            alt="Fullscreen photo"
            style={{ maxWidth: "90%", maxHeight: "80vh", objectFit: "contain", borderRadius: "12px", marginBottom: "16px" }}
          />

          <div style={{ display: "flex", gap: "8px", overflowX: "auto", maxWidth: "90%", padding: "8px 0" }}>
            {photos.map((p, idx) => (
              <img
                key={idx}
                src={p}
                onClick={() => setSelectedPhotoIndex(idx)}
                alt={`Thumbnail ${idx + 1}`}
                style={{
                  width: "60px",
                  height: "60px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  cursor: "pointer",
                  border: selectedPhotoIndex === idx ? "2px solid var(--terracotta)" : "2px solid transparent",
                  opacity: selectedPhotoIndex === idx ? 1 : 0.6
                }}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
