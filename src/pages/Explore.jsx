import React, { useState } from "react";
import { mockListings } from "../data/mockListings";
import { MapPin, Star, Zap, Droplets, Wifi, Search, Map, Heart } from "lucide-react";
import MapView from "./MapView";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { ETHIOPIAN_CITIES } from "../data/ethiopianLocations";

const subCityData = [
  { nameAm: "አዲስ ከተማ", nameEn: "Addis Ketema", count: 14 },
  { nameAm: "አቃቂ ቃሊቲ", nameEn: "Akaki Kality", count: 13 },
  { nameAm: "አራዳ", nameEn: "Arada", count: 10 },
  { nameAm: "ቦሌ", nameEn: "Bole", count: 14 },
  { nameAm: "ጉለሌ", nameEn: "Gullele", count: 10 },
  { nameAm: "ቂርቆስ", nameEn: "Kirkos", count: 11 },
  { nameAm: "ኮልፌ ቀራንዮ", nameEn: "Kolfe Keranio", count: 15 },
  { nameAm: "ለሚ ኩራ", nameEn: "Lemi Kura", count: 10 },
  { nameAm: "ልደታ", nameEn: "Lideta", count: 10 },
  { nameAm: "ንፋስ ስልክ ላፍቶ", nameEn: "Nifas Silk Lafto", count: 15 },
  { nameAm: "የካ", nameEn: "Yeka", count: 15 }
];

export default function Explore({ language, currency, currencyRate, onSelectListing, searchParams, setSearchParams, onHostClick, onTabChange }) {
  const [viewMode, setViewMode] = useState("list"); // list | map
  const [favorites, setFavorites] = useState([]);

  const [localArea, setLocalArea] = useState(searchParams.area || "all");
  const [localStayType, setLocalStayType] = useState(searchParams.stayType || "nightly");
  const [localCheckInDate, setLocalCheckInDate] = useState(searchParams.checkInDate || "2026-06-10");
  const [localStayLength, setLocalStayLength] = useState(searchParams.stayLength || 2);
  const [localGuests, setLocalGuests] = useState(searchParams.guests || 1);
  const [localPropertyType, setLocalPropertyType] = useState(searchParams.propertyType || "all");

  const [hasSearched, setHasSearched] = useState(true);

  const { area, stayType, checkInDate, stayLength, guests, propertyType } = searchParams;

  const selectedSubCity = area;
  const setSelectedSubCity = (val) => {
    setLocalArea(val);
    setSearchParams(prev => ({
      ...prev,
      area: val
    }));
  };
  const durationFilter = stayType;

  // Price conversion helper
  const formatPrice = (priceETB, listingDuration) => {
    const period = language === "am" 
      ? (listingDuration === "nightly" ? "/ሌሊት" : "/በወር") 
      : (listingDuration === "nightly" ? "/night" : "/month");

    if (currency === "USD") {
      const priceUSD = Math.round(priceETB / currencyRate);
      return `$${priceUSD} ${period}`;
    }
    return `${priceETB.toLocaleString()} ብር ${period}`;
  };

  const filteredListings = mockListings.filter((listing) => {
    // 1. Duration filter
    const matchesDuration = 
      listing.duration === stayType || 
      listing.duration === "both";

    // 2. Sub-city/Woreda filter matching localized neighborhoods
    const matchesSubCity = (() => {
      if (area === "all") return true;
      const sel = area.toLowerCase();
      const listSub = listing.subCity.en.toLowerCase();
      
      const subCityKeys = [
        { key: "bole", match: ["bole"] },
        { key: "kirkos", match: ["kirkos", "sarbet", "kazanchis"] },
        { key: "yeka", match: ["yeka"] },
        { key: "arada", match: ["arada", "piassa"] },
        { key: "lideta", match: ["lideta", "old airport"] },
        { key: "gullele", match: ["gullele"] },
        { key: "akaki", match: ["akaki"] },
        { key: "kolfe", match: ["kolfe"] },
        { key: "lemi", match: ["lemi"] },
        { key: "addisketema", match: ["addis ketema"] },
        { key: "nifassilk", match: ["nifas silk", "lebu"] }
      ];

      const matchedKey = subCityKeys.find(item => sel.includes(item.key));
      if (matchedKey) {
        return matchedKey.match.some(m => listSub.includes(m));
      }
      return listSub.includes(sel) || sel.includes(listSub);
    })();

    // 3. Property Type filter
    const matchesPropertyType = 
      propertyType === "all" || 
      listing.type === propertyType;

    // 4. Capacity filter matching occupants
    const capacity = listing.capacity || (listing.type === "home" ? 6 : listing.type === "guesthouse" ? 4 : listing.type === "apartment" ? 3 : 2);
    const matchesGuests = capacity >= guests;

    return matchesDuration && matchesSubCity && matchesPropertyType && matchesGuests;
  });

  const handleSearchSubmit = () => {
    setSearchParams({
      area: localArea,
      stayType: localStayType,
      checkInDate: localCheckInDate,
      stayLength: localStayLength,
      guests: localGuests,
      propertyType: localPropertyType
    });
    setHasSearched(true);
  };

  const handleScrollToSearch = () => {
    document.getElementById("search-planner")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ padding: "0 16px 16px 16px", position: "relative", minHeight: "100%", maxWidth: "1300px", margin: "0 auto" }}>
      
      {/* Hero Section from Floot (Addis Ababa Skyline at night with CTA buttons) */}
      <Hero
        language={language}
        onRenterClick={handleScrollToSearch}
        onHostClick={onHostClick}
      />

      {/* 1. Premium Search Planner Card (Airbnb & Booking.com style) */}
      <div
        id="search-planner"
        className="card-premium"
        style={{
          backgroundColor: "var(--bg-white)",
          border: "1.5px solid var(--border-color)",
          borderRadius: "20px",
          padding: "16px",
          marginBottom: "16px",
          boxShadow: "0 6px 18px rgba(44, 37, 32, 0.06)",
          fontFamily: "Outfit, sans-serif"
        }}
      >
        <div className="search-planner-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
          
          {/* Where to - Area Select */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              📍 {language === "am" ? "አካባቢ / ወረዳ" : "Where to (Area/Woreda)"}
            </label>
            <select
              id="search-area-select"
              className="form-select"
              value={localArea}
              onChange={(e) => setLocalArea(e.target.value)}
              style={{ fontSize: "0.78rem", padding: "8px 10px", borderRadius: "10px" }}
            >
              <option value="all">{language === "am" ? "ሁሉም አካባቢዎች እና ከተሞች" : "All Cities & Woredas"}</option>
              <optgroup label={language === "am" ? "የኢትዮጵያ 60+ ዋና ከተሞች" : "60+ Major Ethiopian Cities"}>
                {ETHIOPIAN_CITIES.map((city) => (
                  <option key={city} value={city}>
                    📍 {city}
                  </option>
                ))}
              </optgroup>
              {subCityData.map((sc) => {
                const woredas = [];
                for (let w = 1; w <= sc.count; w++) {
                  woredas.push(w);
                }
                return (
                  <optgroup 
                    key={sc.nameEn} 
                    label={language === "am" ? `አዲስ አበባ: ${sc.nameAm} (${sc.nameEn})` : `Addis Ababa: ${sc.nameEn} (${sc.nameAm})`}
                  >
                    {woredas.map((w) => {
                      const padded = w < 10 ? `0${w}` : `${w}`;
                      const val = `${sc.nameEn.replace(/\s+/g, "")}Woreda${padded}`;
                      const labelEn = `${sc.nameEn} - Woreda ${padded}`;
                      const labelAm = `${sc.nameAm} - ወረዳ ${padded}`;
                      return (
                        <option key={val} value={val}>
                          {language === "am" ? labelAm : labelEn}
                        </option>
                      );
                    })}
                  </optgroup>
                );
              })}
            </select>
          </div>

          {/* Stay Type */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              📅 {language === "am" ? "የቆይታ አይነት" : "Stay Type"}
            </label>
            <select
              id="search-duration-type"
              className="form-select"
              value={localStayType}
              onChange={(e) => setLocalStayType(e.target.value)}
              style={{ fontSize: "0.78rem", padding: "8px 10px", borderRadius: "10px" }}
            >
              <option value="nightly">{language === "am" ? "በቀን (Nightly)" : "Nightly Stay"}</option>
              <option value="monthly">{language === "am" ? "በወር (Monthly)" : "Monthly Rent"}</option>
            </select>
          </div>

          {/* Check-in Date */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              🗓️ {language === "am" ? "መግቢያ ቀን" : "Check-in Date"}
            </label>
            <input
              id="search-checkin-date"
              type="date"
              className="form-input"
              value={localCheckInDate}
              onChange={(e) => setLocalCheckInDate(e.target.value)}
              style={{ fontSize: "0.78rem", padding: "6px 10px", borderRadius: "10px" }}
            />
          </div>

          {/* Stays duration numeric length */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              ⏱️ {localStayType === "nightly" 
                ? (language === "am" ? "የቀናት ብዛት" : "Number of Nights") 
                : (language === "am" ? "የወራት ብዛት" : "Number of Months")}
            </label>
            <input
              id="search-stay-length"
              type="number"
              min={1}
              className="form-input"
              value={localStayLength}
              onChange={(e) => setLocalStayLength(Math.max(1, Number(e.target.value)))}
              style={{ fontSize: "0.78rem", padding: "6px 10px", borderRadius: "10px" }}
            />
          </div>

          {/* Occupants / Guest count select */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              👥 {language === "am" ? "የነዋሪዎች ብዛት (እንግዶች)" : "Number of Guests"}
            </label>
            <select
              id="search-occupants"
              className="form-select"
              value={localGuests}
              onChange={(e) => setLocalGuests(Number(e.target.value))}
              style={{ fontSize: "0.78rem", padding: "8px 10px", borderRadius: "10px" }}
            >
              <option value={1}>1 {language === "am" ? "እንግዳ" : "Guest"}</option>
              <option value={2}>2 {language === "am" ? "እንግዶች" : "Guests"}</option>
              <option value={3}>3 {language === "am" ? "እንግዶች" : "Guests"}</option>
              <option value={4}>4+ {language === "am" ? "እንግዶች" : "Guests"}</option>
            </select>
          </div>

          {/* Property Type selection */}
          <div className="form-group" style={{ margin: 0 }}>
            <label className="form-label" style={{ fontSize: "0.68rem", fontWeight: "800", color: "var(--text-dark)", textTransform: "uppercase" }}>
              🏠 {language === "am" ? "የቤት አይነት" : "Property Type"}
            </label>
            <select
              id="search-property-type"
              className="form-select"
              value={localPropertyType}
              onChange={(e) => setLocalPropertyType(e.target.value)}
              style={{ fontSize: "0.78rem", padding: "8px 10px", borderRadius: "10px" }}
            >
              <option value="all">{language === "am" ? "ሁሉም የቤት አይነቶች" : "All Types"}</option>
              <option value="home">{language === "am" ? "ቪላ / ሙሉ ቤት" : "Villa / House"}</option>
              <option value="apartment">{language === "am" ? "አፓርታማ (Apartment)" : "Apartment"}</option>
              <option value="hotel">{language === "am" ? "ሆቴል ክፍል (Hotel)" : "Hotel Room"}</option>
              <option value="guesthouse">{language === "am" ? "እንግዳ ማረፊያ (Guest House)" : "Guest House"}</option>
              <option value="room">{language === "am" ? "ነጠላ ክፍል (Single Room)" : "Single Room"}</option>
            </select>
          </div>
        </div>

        {/* Search Submit Button */}
        <button
          id="btn-search-submit"
          onClick={handleSearchSubmit}
          className="btn-primary"
          style={{
            width: "100%",
            marginTop: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            padding: "10px 16px",
            borderRadius: "12px",
            fontSize: "0.82rem",
            fontWeight: "800",
            cursor: "pointer",
            border: "none",
            backgroundColor: "var(--terracotta)",
            color: "#FFF",
            boxShadow: "0 4px 10px rgba(211, 84, 0, 0.2)"
          }}
        >
          <Search size={14} />
          <span>{language === "am" ? "ፈልግ (Search)" : "Search Places"}</span>
        </button>
      </div>

      {/* Landing Search Prompt OR Search Results Content */}
      {!hasSearched ? (
        <div
          style={{
            textAlign: "center",
            padding: "48px 16px",
            backgroundColor: "var(--bg-white)",
            borderRadius: "20px",
            border: "1.5px solid var(--border-color)",
            boxShadow: "0 4px 12px rgba(44, 37, 32, 0.02)",
            marginTop: "8px",
            fontFamily: "Outfit, sans-serif"
          }}
        >
          <div style={{ fontSize: "2.8rem", marginBottom: "14px", animation: "bounce 2s infinite" }}>🔍</div>
          <style>{`
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-8px); }
            }
          `}</style>
          <h3 style={{ fontSize: "0.95rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "8px" }}>
            {language === "am" ? "የማረፊያ ቦታዎን ይፈልጉ" : "Find Your Next Accommodation"}
          </h3>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: "1.5", maxWidth: "300px", margin: "0 auto" }}>
            {language === "am"
              ? "የሚፈልጉትን አካባቢ፣ የቆይታ ሁኔታ እና የቤት ዓይነት መርጠው ፈልግ የሚለውን በመጫን ያሉትን ማረፊያዎች ያግኙ።"
              : "Choose your preferred area/woreda, stay type, and accommodation style above, then tap Search to discover available stays."}
          </p>
        </div>
      ) : (
        <>
          {/* Conditional Map Mode */}
          {viewMode === "map" ? (
            <div style={{ flex: 1, margin: "0 -16px -16px -16px", position: "relative", minHeight: "400px" }}>
              <MapView
                listings={filteredListings}
                language={language}
                currency={currency}
                currencyRate={currencyRate}
                onSelectListing={onSelectListing}
                selectedSubCity={selectedSubCity}
                setSelectedSubCity={setSelectedSubCity}
              />
            </div>
          ) : (
            <>
              {/* 4. Hero Recommendations Banner */}
              <div
                style={{
                  background: "linear-gradient(135deg, #2C2520 0%, #1D1815 100%)",
                  borderRadius: "18px",
                  padding: "16px",
                  color: "#FFF",
                  position: "relative",
                  overflow: "hidden",
                  marginBottom: "20px",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.08)"
                }}
              >
                <div style={{ position: "absolute", top: "-40px", right: "-40px", width: "120px", height: "120px", borderRadius: "50%", background: "radial-gradient(circle, rgba(211,84,0,0.18) 0%, transparent 70%)" }} />
                
                <span 
                  style={{ 
                    fontSize: "0.55rem", 
                    backgroundColor: "var(--terracotta)", 
                    color: "#FFF", 
                    padding: "2px 8px", 
                    borderRadius: "8px", 
                    fontWeight: "bold",
                    textTransform: "uppercase"
                  }}
                >
                  {language === "am" ? "እንደ ቤቴ" : "ENDE BETE CHANNELS"}
                </span>
                <h4 style={{ fontSize: "0.88rem", color: "#FFF", marginTop: "8px", fontWeight: "700" }}>
                  {language === "am" ? "የመሠረተ ልማት ዋስትና ያላቸው ማረፊያዎች" : "Guaranteed Utility Backups"}
                </h4>
                <p style={{ fontSize: "0.7rem", color: "#BDC3C7", marginTop: "4px", lineHeight: "1.3" }}>
                  {language === "am" 
                    ? "በአዲስ አበባ ውስጥ አስተማማኝ ጄነሬተር፣ የውሃ ታንከር እና ዋይፋይ ያላቸውን ምርጥ ቤቶች ይመልከቱ።" 
                    : "Browse vetted listings containing backup electricity, reserve water wells, and high-speed fiber internet."}
                </p>
              </div>

              {/* Stays Header */}
              <div className="flex-between" style={{ marginBottom: "14px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "700" }}>
                  {language === "am" ? "የተገኙ ማረፊያዎች" : "Discover Stays"}
                </h3>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: "600" }}>
                  {filteredListings.length} {language === "am" ? "ቤቶች ተገኝተዋል" : "places found"}
                </span>
              </div>

              {/* Listings Grid - Responsive multi-column layout for PC & Mobile */}
              <div className="explore-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {filteredListings.length === 0 ? (
                  <div
                    style={{
                      textAlign: "center",
                      padding: "40px 16px",
                      backgroundColor: "var(--bg-white)",
                      borderRadius: "16px",
                      border: "1px solid var(--border-color)"
                    }}
                  >
                    <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>
                      {language === "am" 
                        ? "በመረጡት ማጣሪያ መሰረት የተገኘ ቤት የለም። እባክዎ ፍለጋውን ይቀይሩ።" 
                        : "No accommodations found matching your search. Please adjust filters."}
                    </p>
                  </div>
                ) : (
                  filteredListings.map((listing) => {
                    const price = 
                      durationFilter === "monthly" && listing.priceETB_monthly
                        ? listing.priceETB_monthly
                        : listing.priceETB;

                    return (
                      <div
                        key={listing.id}
                        onClick={() => onSelectListing(listing.id)}
                        style={{
                          cursor: "pointer",
                          position: "relative"
                        }}
                      >
                        {/* Image Box */}
                        <div style={{ height: "200px", position: "relative", borderRadius: "16px", overflow: "hidden", backgroundColor: "#eee" }}>
                          <img
                            src={listing.image}
                            alt={listing.title.en}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                          />
                          
                          {/* Swipe Dots indicator */}
                          <div 
                            style={{ 
                              position: "absolute", 
                              bottom: "12px", 
                              left: "50%", 
                              transform: "translateX(-50%)", 
                              display: "flex", 
                              gap: "4px",
                              zIndex: 2
                            }}
                          >
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "#FFF" }} />
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
                            <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.4)" }} />
                          </div>

                          {/* Heart Wishlist Overlay */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setFavorites(prev => 
                                prev.includes(listing.id) 
                                  ? prev.filter(id => id !== listing.id) 
                                  : [...prev, listing.id]
                              );
                            }}
                            style={{
                              position: "absolute",
                              top: "12px",
                              right: "12px",
                              background: "rgba(0, 0, 0, 0.3)",
                              border: "none",
                              borderRadius: "50%",
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              cursor: "pointer",
                              zIndex: 3,
                              backdropFilter: "blur(2px)"
                            }}
                          >
                            <Heart size={16} fill={favorites.includes(listing.id) ? "#E74C3C" : "transparent"} stroke={favorites.includes(listing.id) ? "#E74C3C" : "#FFF"} />
                          </button>

                          {/* Fayda Badge overlay */}
                          {listing.host.verifiedFayda && (
                            <div
                              style={{
                                position: "absolute",
                                top: "12px",
                                left: "12px",
                                backgroundColor: "rgba(255,255,255,0.92)",
                                color: "var(--text-dark)",
                                borderRadius: "14px",
                                padding: "4px 8px",
                                fontSize: "0.6rem",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                gap: "2px",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
                                backdropFilter: "blur(2px)"
                              }}
                            >
                              <span style={{ color: "var(--ethiopian-green)", fontWeight: "bold" }}>Fayda Verified</span>
                              <span style={{ fontSize: "0.55rem", color: "var(--ethiopian-green)" }}>✓</span>
                            </div>
                          )}

                          {/* Utilities Backup Box Overlay */}
                          <div
                            style={{
                              position: "absolute",
                              bottom: "12px",
                              left: "12px",
                              display: "flex",
                              gap: "4px",
                              backgroundColor: "rgba(28, 24, 20, 0.75)",
                              padding: "4px 8px",
                              borderRadius: "8px",
                              backdropFilter: "blur(4px)"
                            }}
                          >
                            {listing.backups.electricity.available && (
                              <Zap size={11} style={{ color: "var(--ethiopian-gold)", strokeWidth: 3 }} />
                            )}
                            {listing.backups.water.available && (
                              <Droplets size={11} style={{ color: "#5DADE2", strokeWidth: 3 }} />
                            )}
                            {listing.backups.wifi.available && (
                              <Wifi size={11} style={{ color: "var(--ethiopian-green-light)", strokeWidth: 3 }} />
                            )}
                          </div>
                        </div>

                        {/* Metadata Content */}
                        <div style={{ marginTop: "10px", padding: "0 2px" }}>
                          
                          {/* Title & Rating */}
                          <div className="flex-between" style={{ marginBottom: "2px" }}>
                            <h4
                              style={{
                                fontSize: "0.85rem",
                                fontWeight: "700",
                                color: "var(--text-dark)",
                                lineHeight: "1.3",
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                flex: 1
                              }}
                            >
                              {language === "am" ? listing.title.am : listing.title.en}
                            </h4>
                            
                            <div className="flex-row" style={{ gap: "2px", marginLeft: "8px" }}>
                              <Star size={11} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
                              <span style={{ fontSize: "0.78rem", fontWeight: "700" }}>{listing.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          {/* Sub-city & Landmark info */}
                          <p
                            style={{
                              fontSize: "0.75rem",
                              color: "var(--text-muted)",
                              marginBottom: "2px",
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden"
                            }}
                          >
                            {language === "am" ? listing.subCity.am : listing.subCity.en} • {language === "am" ? listing.landmark.am : listing.landmark.en}
                          </p>

                          {/* Accommodation type caption */}
                          <p style={{ fontSize: "0.68rem", color: "#A5988F", marginBottom: "6px" }}>
                            {listing.type === "hotel" && (language === "am" ? "የቅንጦት ሆቴል ማረፊያ" : "Full hotel service suite")}
                            {listing.type === "guesthouse" && (language === "am" ? "ምቹ የእንግዳ ማረፊያ" : "Private compound stay")}
                            {listing.type === "room" && (language === "am" ? "ነጠላ ኪራይ ክፍል" : "Private room stay")}
                            {listing.type === "home" && (language === "am" ? "ቪላ / ሙሉ ቤት" : "Entire villa/house")}
                            {listing.type === "apartment" && (language === "am" ? "ዘመናዊ አፓርታማ" : "Modern studio/apartment")}
                          </p>

                          {/* Price & Host details */}
                          <div className="flex-between">
                            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                              {language === "am" ? "አቅራቢ፦ " : "Host: "}
                              <strong style={{ color: "var(--text-dark)" }}>{listing.host.name}</strong>
                            </span>
                            <span style={{ fontSize: "0.88rem", fontWeight: "800", color: "var(--terracotta)" }}>
                              {formatPrice(price, durationFilter)}
                            </span>
                          </div>

                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* 5. Bottom Floating Layout Toggle Pill Button (Airbnb dark charcoal design) */}
      {hasSearched && (
        <button
          id="btn-explore-layout-toggle"
          onClick={() => setViewMode((prev) => (prev === "list" ? "map" : "list"))}
          style={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#2C2520",
            color: "#FFF",
            border: "none",
            borderRadius: "30px",
            padding: "10px 18px",
            fontSize: "0.78rem",
            fontWeight: "800",
            cursor: "pointer",
            boxShadow: "0 6px 20px rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            zIndex: 600,
            transition: "transform 0.15s ease"
          }}
        >
          {viewMode === "list" ? (
            <>
              <Map size={14} style={{ color: "var(--ethiopian-gold)" }} />
              <span>{language === "am" ? "ካርታ አሳይ" : "Show Map"}</span>
            </>
          ) : (
            <>
              <span>📋</span>
              <span>{language === "am" ? "ዝርዝር አሳይ" : "Show List"}</span>
            </>
          )}
        </button>
      )}

      {/* Floot Legal Footer */}
      <Footer language={language} onTabChange={onTabChange} />

    </div>
  );
}
