import React from "react";
import { ChevronDown } from "lucide-react";

export default function Hero({ language, onRenterClick, onHostClick }) {
  const content = {
    am: {
      heroTitle: "እንደቤቴ",
      heroSubtitle: "ቤት ለእንግዳ!",
      welcomeHeading: "ቤት ይከራዩ - ወይም ቤትዎን ያክራዩ::",
      imARenter: "ተከራይ ነኝ",
      renterDescription: "በመላው ኢትዮጵያ ያሉ ቆንጆ ቤቶችን ይመልከቱ",
      payNote: "በዶላር ወይም በብር ይክፈሉ",
      imAHost: "አስተናጋጅ ነኝ",
      hostDescription: "ዛሬ ከቤትዎ ገቢ ማግኘት ይጀምሩ",
      featuredListings: "ተለይተው የቀረቡ ቤቶች ዝርዝር"
    },
    en: {
      heroTitle: "Endebete",
      heroSubtitle: "A Home for Guests!",
      welcomeHeading: "Rent a Home - or Rent Out Your Home.",
      imARenter: "I am a Renter",
      renterDescription: "Explore beautiful homes across Ethiopia",
      payNote: "Pay in USD or ETB",
      imAHost: "I am a Host",
      hostDescription: "Start earning income from your home today",
      featuredListings: "Featured Stays List"
    }
  };

  const t = content[language] || content.en;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "calc(100vh - 70px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        borderRadius: "0 0 24px 24px",
        marginBottom: "24px",
        color: "#FFF",
        padding: "32px 16px 24px 16px"
      }}
    >
      {/* Background Image with Dark Gradient Overlay */}
      <img
        src="/assets/hero-ethiopia.jpg"
        alt="Addis Ababa Skyline at Night"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.45) 0%, rgba(0, 0, 0, 0.8) 100%)",
          zIndex: 1
        }}
      />

      {/* Top Branding Header */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          textAlign: "center",
          marginTop: "16px"
        }}
      >
        <h1
          style={{
            fontFamily: "Noto Serif Ethiopic, Outfit, serif",
            fontSize: "clamp(2.4rem, 6vw, 3.8rem)",
            fontWeight: "800",
            color: "#FFFFFF",
            margin: 0,
            textShadow: "0 2px 12px rgba(0,0,0,0.6)"
          }}
        >
          {t.heroTitle}
        </h1>
        <p
          style={{
            fontFamily: "Noto Serif Ethiopic, Georgia, serif",
            fontSize: "clamp(1.4rem, 4vw, 2.2rem)",
            fontWeight: "500",
            fontStyle: "italic",
            color: "#F1C40F",
            margin: "4px 0 0 0",
            textShadow: "0 2px 10px rgba(0,0,0,0.7)"
          }}
        >
          {t.heroSubtitle}
        </p>
      </div>

      {/* Middle Welcome & Action Cards */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
          margin: "32px 0"
        }}
      >
        <h2
          style={{
            fontFamily: "Noto Serif Ethiopic, Outfit, sans-serif",
            fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
            fontWeight: "700",
            color: "#FFFFFF",
            marginBottom: "20px",
            textShadow: "0 2px 10px rgba(0,0,0,0.6)"
          }}
        >
          {t.welcomeHeading}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px", width: "100%" }}>
          {/* Action Card 1: Renter (Filled Terracotta) */}
          <button
            id="btn-hero-renter"
            onClick={onRenterClick}
            style={{
              width: "100%",
              backgroundColor: "var(--terracotta)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "14px",
              padding: "16px 20px",
              cursor: "pointer",
              boxShadow: "0 6px 20px rgba(211, 84, 0, 0.4)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "#FFF" }}>{t.imARenter}</span>
            <span style={{ fontSize: "0.78rem", opacity: 0.9, fontWeight: "500" }}>{t.renterDescription}</span>
            <span style={{ fontSize: "0.7rem", opacity: 0.8, fontWeight: "400", marginTop: "2px" }}>{t.payNote}</span>
          </button>

          {/* Action Card 2: Host (Transparent Outlined) */}
          <button
            id="btn-hero-host"
            onClick={onHostClick}
            style={{
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              color: "#FFFFFF",
              border: "2px solid #FFFFFF",
              borderRadius: "14px",
              padding: "16px 20px",
              cursor: "pointer",
              backdropFilter: "blur(4px)",
              transition: "transform 0.2s ease, background-color 0.2s ease",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <span style={{ fontSize: "1.15rem", fontWeight: "800", color: "#FFF" }}>{t.imAHost}</span>
            <span style={{ fontSize: "0.78rem", opacity: 0.9, fontWeight: "500" }}>{t.hostDescription}</span>
          </button>
        </div>
      </div>

      {/* Bottom Scroll Down Indicator */}
      <button
        id="btn-hero-scroll-down"
        onClick={onRenterClick}
        style={{
          position: "relative",
          zIndex: 2,
          background: "transparent",
          border: "none",
          color: "#FFFFFF",
          fontSize: "0.78rem",
          fontWeight: "600",
          cursor: "pointer",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          opacity: 0.9,
          animation: "heroBounce 2s infinite"
        }}
      >
        <span>{t.featuredListings}</span>
        <ChevronDown size={24} />
      </button>

      <style>{`
        @keyframes heroBounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-8px); }
          60% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
