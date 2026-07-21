import React, { useState } from "react";
import { Star, MapPin, X, Info } from "lucide-react";

export default function MapView({ listings, language, currency, currencyRate, onSelectListing, selectedSubCity, setSelectedSubCity }) {
  const [activePinId, setActivePinId] = useState(null);

  // Parent sub-city matching list
  const subCityList = [
    { id: "all", nameEn: "All Areas", nameAm: "ሁሉም ሰፈር" },
    { id: "Bole", nameEn: "Bole", nameAm: "ቦሌ", cx: "270", cy: "170" },
    { id: "Kirkos", nameEn: "Kirkos", nameAm: "ቂርቆስ", cx: "180", cy: "180" },
    { id: "Yeka", nameEn: "Yeka", nameAm: "የካ", cx: "270", cy: "95" },
    { id: "Arada", nameEn: "Arada", nameAm: "አራዳ", cx: "180", cy: "105" },
    { id: "Lideta", nameEn: "Lideta", nameAm: "ልደታ", cx: "110", cy: "165" },
    { id: "NifasSilkLafto", nameEn: "Nifas Silk", nameAm: "ንፋስ ስልክ", cx: "115", cy: "245" },
    { id: "KolfeKeranio", nameEn: "Kolfe", nameAm: "ኮልፌ", cx: "50", cy: "125" },
    { id: "Gullele", nameEn: "Gullele", nameAm: "ጉለሌ", cx: "120", cy: "75" },
    { id: "LemiKura", nameEn: "Lemi Kura", nameAm: "ለሚ ኩራ", cx: "340", cy: "140" },
    { id: "AkakiKality", nameEn: "Akaki", nameAm: "አቃቂ", cx: "220", cy: "270" }
  ];

  // Specific absolute positions for listings on the SVG map coordinate grid (viewbox: 0 0 400 350)
  const pinCoordinates = {
    // Bole
    "l1": { x: 260, y: 160 },
    "l5": { x: 290, y: 180 },
    // Kirkos (Sarbet & Kazanchis)
    "l2": { x: 160, y: 200 }, // Sarbet
    "l3": { x: 195, y: 160 }, // Kazanchis
    // Nifas Silk (Lebu)
    "l4": { x: 95, y: 240 },
    // Lideta (Old Airport)
    "l6": { x: 110, y: 175 }
  };

  // Convert ETB price to display tag
  const getPriceTag = (priceETB) => {
    let price = priceETB;
    if (currency === "USD") {
      const priceUSD = Math.round(price / currencyRate);
      return `$${priceUSD}`;
    }
    // format as 4.2k or 12k
    if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}k`;
    }
    return `${price}`;
  };

  // Check if a listing matches the selected map sub-city
  const filteredListings = listings.filter((listing) => {
    if (selectedSubCity === "all") return true;
    const sel = selectedSubCity.toLowerCase();
    const listSub = listing.subCity.en.toLowerCase();
    
    // Check if listing belongs to parent subcity match
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
  });

  const selectedListingDetail = listings.find((l) => l.id === activePinId);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%", overflow: "hidden", display: "flex", flexDirection: "column" }}>
      {/* Map Control Info Banner */}
      <div
        style={{
          padding: "8px 12px",
          backgroundColor: "var(--bg-white)",
          borderBottom: "1px solid var(--border-color)",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 10
        }}
      >
        <span style={{ fontWeight: "700", color: "var(--text-dark)" }}>
          📍 {language === "am" ? "የአዲስ አበባ በይነ-ተግባራዊ ካርታ" : "Interactive Map of Addis Ababa"}
        </span>
        <button
          onClick={() => {
            setSelectedSubCity("all");
            setActivePinId(null);
          }}
          style={{
            border: "none",
            background: "none",
            color: "var(--terracotta)",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          {language === "am" ? "ሁሉንም አሳይ" : "Reset Zoom"}
        </button>
      </div>

      {/* SVG Map Canvas */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#FAF8F4", // warm map grid backdrop
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
        {/* Addis Ababa Vector Outline (Stylized schematic map) */}
        <svg
          viewBox="0 0 400 350"
          style={{
            width: "90%",
            height: "90%",
            maxWidth: "380px"
          }}
        >
          {/* Grid Background Lines */}
          <line x1="0" y1="100" x2="400" y2="100" stroke="#F1EDE5" strokeWidth="1" strokeDasharray="4" />
          <line x1="0" y1="200" x2="400" y2="200" stroke="#F1EDE5" strokeWidth="1" strokeDasharray="4" />
          <line x1="100" y1="0" x2="100" y2="350" stroke="#F1EDE5" strokeWidth="1" strokeDasharray="4" />
          <line x1="200" y1="0" x2="200" y2="350" stroke="#F1EDE5" strokeWidth="1" strokeDasharray="4" />
          <line x1="300" y1="0" x2="300" y2="350" stroke="#F1EDE5" strokeWidth="1" strokeDasharray="4" />

          {/* Kolfe (West Zone) */}
          <polygon
            points="20,100 80,60 120,130 90,190 20,140"
            fill={selectedSubCity === "KolfeKeranio" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "KolfeKeranio" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "KolfeKeranio" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("KolfeKeranio")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Gullele (North Zone) */}
          <polygon
            points="80,60 180,40 170,110 120,130"
            fill={selectedSubCity === "Gullele" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Gullele" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Gullele" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Gullele")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Yeka (North East Zone) */}
          <polygon
            points="180,40 310,60 300,120 220,140 170,110"
            fill={selectedSubCity === "Yeka" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Yeka" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Yeka" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Yeka")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Arada (North Center) */}
          <polygon
            points="170,110 220,100 220,140 150,145"
            fill={selectedSubCity === "Arada" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Arada" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Arada" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Arada")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Lideta (West Center) */}
          <polygon
            points="90,140 150,145 130,200 80,190"
            fill={selectedSubCity === "Lideta" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Lideta" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Lideta" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Lideta")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Kirkos (Center Zone) */}
          <polygon
            points="150,145 220,140 230,210 130,200"
            fill={selectedSubCity === "Kirkos" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Kirkos" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Kirkos" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Kirkos")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Bole (East Zone) */}
          <polygon
            points="220,140 330,120 370,220 280,240 230,210"
            fill={selectedSubCity === "Bole" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "Bole" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "Bole" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("Bole")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Lemi Kura (Far East) */}
          <polygon
            points="330,120 395,130 380,180 370,220"
            fill={selectedSubCity === "LemiKura" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "LemiKura" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "LemiKura" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("LemiKura")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Nifas Silk Lafto (South West) */}
          <polygon
            points="80,190 130,200 160,300 70,280"
            fill={selectedSubCity === "NifasSilkLafto" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "NifasSilkLafto" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "NifasSilkLafto" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("NifasSilkLafto")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Akaki Kality (South East) */}
          <polygon
            points="130,200 230,210 280,240 260,320 160,300"
            fill={selectedSubCity === "AkakiKality" ? "rgba(241, 196, 15, 0.2)" : "#FFFDF9"}
            stroke={selectedSubCity === "AkakiKality" ? "var(--terracotta)" : "#EBE3D5"}
            strokeWidth={selectedSubCity === "AkakiKality" ? "2.5" : "1.5"}
            onClick={() => setSelectedSubCity("AkakiKality")}
            style={{ cursor: "pointer", transition: "all 0.2s" }}
          />

          {/* Label text overlays on the SVG */}
          {subCityList.map((sc) => {
            if (sc.id === "all") return null;
            const isSelected = selectedSubCity === sc.id;
            return (
              <g key={sc.id} onClick={() => setSelectedSubCity(sc.id)} style={{ cursor: "pointer" }}>
                <text
                  x={sc.cx}
                  y={sc.cy}
                  fill={isSelected ? "var(--terracotta)" : "#7E7267"}
                  fontWeight={isSelected ? "bold" : "600"}
                  fontSize="9.5px"
                  textAnchor="middle"
                  style={{ userSelect: "none" }}
                >
                  {language === "am" ? sc.nameAm : sc.nameEn}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Absolute-positioned HTML Listing Pins over the map SVG */}
        {filteredListings.map((listing) => {
          const coords = pinCoordinates[listing.id];
          if (!coords) return null; // fallback if no coords registered for mock stay

          // Check if selected or active
          const isActive = activePinId === listing.id;

          // Convert coordinates from the 400x350 viewBox to percentage offsets
          const percentX = (coords.x / 400) * 100;
          const percentY = (coords.y / 350) * 100;

          // Pick correct price
          const price = listing.duration === "monthly" && listing.priceETB_monthly
            ? listing.priceETB_monthly
            : listing.priceETB;

          return (
            <button
              key={listing.id}
              id={`btn-map-pin-${listing.id}`}
              onClick={() => setActivePinId(listing.id)}
              style={{
                position: "absolute",
                left: `${percentX}%`,
                top: `${percentY}%`,
                transform: "translate(-50%, -50%)",
                backgroundColor: isActive ? "var(--terracotta)" : "var(--bg-white)",
                color: isActive ? "#fff" : "var(--text-dark)",
                border: "1.5px solid var(--border-color)",
                borderRadius: "14px",
                padding: "4px 8px",
                fontSize: "0.68rem",
                fontWeight: "800",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                display: "flex",
                alignItems: "center",
                gap: "2px",
                zIndex: isActive ? 100 : 5,
                transition: "all 0.15s ease"
              }}
            >
              <span>🏡</span>
              <span>{getPriceTag(price)}</span>
            </button>
          );
        })}
      </div>

      {/* Floating Preview Card (Slide-up Airbnb-style panel) */}
      {selectedListingDetail && (
        <div
          style={{
            position: "absolute",
            bottom: "80px", // space above standard BottomNav
            left: "12px",
            right: "12px",
            zIndex: 500,
            animation: "slideUp 0.25s ease-out"
          }}
        >
          <style>{`
            @keyframes slideUp {
              from { transform: translateY(100px); opacity: 0; }
              to { transform: translateY(0); opacity: 1; }
            }
          `}</style>
          
          <div
            className="card-premium flex-row"
            style={{
              padding: 0,
              backgroundColor: "var(--bg-white)",
              overflow: "hidden",
              border: "1.5px solid var(--border-color)",
              boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              gap: 0,
              height: "95px"
            }}
          >
            {/* Close Button */}
            <button
              id="btn-map-preview-close"
              onClick={() => setActivePinId(null)}
              style={{
                position: "absolute",
                top: "6px",
                right: "6px",
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                backgroundColor: "rgba(0,0,0,0.06)",
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 10
              }}
            >
              <X size={10} style={{ color: "var(--text-dark)" }} />
            </button>

            {/* Thumbnail Image */}
            <div style={{ width: "95px", height: "100%", flexShrink: 0 }}>
              <img
                src={selectedListingDetail.image}
                alt={selectedListingDetail.title.en}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Details (Click to open checkout) */}
            <div
              id={`panel-map-preview-detail`}
              onClick={() => onSelectListing(selectedListingDetail.id)}
              style={{
                flex: 1,
                padding: "8px 12px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                textAlign: "left"
              }}
            >
              <div>
                <h4 style={{ fontSize: "0.78rem", fontWeight: "800", display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden", paddingRight: "10px" }}>
                  {language === "am" ? selectedListingDetail.title.am : selectedListingDetail.title.en}
                </h4>
                
                <div className="flex-row" style={{ gap: "4px", fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  <MapPin size={10} style={{ color: "var(--terracotta)" }} />
                  <span style={{ display: "-webkit-box", WebkitLineClamp: 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                    {language === "am" ? selectedListingDetail.landmark.am : selectedListingDetail.landmark.en}
                  </span>
                </div>
              </div>

              <div className="flex-between">
                <div className="flex-row" style={{ gap: "2px" }}>
                  <Star size={10} fill="var(--ethiopian-gold)" stroke="var(--ethiopian-gold)" />
                  <span style={{ fontSize: "0.68rem", fontWeight: "700" }}>{selectedListingDetail.rating}</span>
                </div>
                <strong style={{ fontSize: "0.82rem", color: "var(--terracotta)" }}>
                  {currency === "USD" 
                    ? `$${Math.round(selectedListingDetail.priceETB / currencyRate)}`
                    : `${selectedListingDetail.priceETB.toLocaleString()} ብር`}
                  <span style={{ fontSize: "0.6rem", fontWeight: "normal", color: "var(--text-muted)" }}>
                    {selectedListingDetail.duration === "monthly" ? (language === "am" ? "/በወር" : "/mo") : (language === "am" ? "/ማድርያ" : "/nt")}
                  </span>
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
