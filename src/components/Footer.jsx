import React from "react";
import { Phone, Mail, Send, Facebook, Instagram, Youtube, Linkedin, ShieldCheck } from "lucide-react";

export default function Footer({ language, onTabChange }) {
  const footerTranslations = {
    en: {
      brandDesc: "Your trusted Ethiopian property rental marketplace across 60+ major cities.",
      forGuests: "For Guests",
      forHosts: "For Hosts",
      support: "Support",
      legal: "Legal",
      contactUs: "Contact Us",
      followUs: "Follow Us",
      browseStays: "Browse Stays",
      popularDestinations: "Popular Destinations",
      listYourProperty: "List Your Property",
      hostResources: "Host Resources",
      helpCenter: "Help Center",
      safetyTrust: "Fayda Verification & Safety",
      privacyPolicy: "Privacy Policy (Proclamation 1321/2024)",
      termsConditions: "Terms & Conditions",
      rentalGuidelines: "NBE & Local Rental Guidelines",
      phone: "Phone",
      email: "Email",
      copyright: "© 2026 Endebete (Ethiopian Stays). All rights reserved.",
      stayConnected: "Stay connected with us across platforms"
    },
    am: {
      brandDesc: "በ60+ የኢትዮጵያ ዋና ከተሞች ውስጥ ተአማኒ የቤት ኪራይ ገበያ ቦታ።",
      forGuests: "ለእንግዶች",
      forHosts: "ለአስተናጋጆች",
      support: "ድጋፍ",
      legal: "ህጋዊ",
      contactUs: "ያግኙን",
      followUs: "ይከተሉን",
      browseStays: "ማረፊያዎችን ይፈልጉ",
      popularDestinations: "ታዋቂ መዳረሻዎች (60+ ከተሞች)",
      listYourProperty: "ንብረትዎን ያስመዝግቡ",
      hostResources: "የአስተናጋጅ መመሪያዎች",
      helpCenter: "የእርዳታ ማዕከል",
      safetyTrust: "የፋይዳ ማንነት ማረጋገጫ እና ደህንነት",
      privacyPolicy: "የግላዊነት መመሪያ (አዋጅ 1321/2016)",
      termsConditions: "ውሎች እና ሁኔታዎች",
      rentalGuidelines: "የብሔራዊ ባንክ እና የኪራይ ህግጋት",
      phone: "ስልክ",
      email: "ኢሜይል",
      copyright: "© 2026 እንደቤቴ (Ethiopian Stays)። ሁሉም መብቶች የተጠበቁ ናቸው።",
      stayConnected: "በሁሉም መድረኮች ከኛ ጋር ይገናኙ"
    }
  };

  const ft = footerTranslations[language] || footerTranslations.en;

  return (
    <footer
      style={{
        backgroundColor: "#1D1815",
        color: "#E2D9D2",
        padding: "36px 16px 24px 16px",
        marginTop: "40px",
        borderRadius: "24px 24px 0 0",
        fontFamily: "Outfit, sans-serif"
      }}
    >
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        
        {/* Brand Header */}
        <div style={{ marginBottom: "28px", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: "800", color: "#FFF", marginBottom: "6px" }}>
            Endebete <span style={{ fontSize: "0.8rem", color: "var(--ethiopian-gold)", fontWeight: "bold" }}>(እንደቤቴ)</span>
          </h2>
          <p style={{ fontSize: "0.8rem", color: "#A5988F", margin: 0, maxWidth: "480px", lineHeight: "1.4" }}>
            {ft.brandDesc}
          </p>
        </div>

        {/* Links Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "24px",
            marginBottom: "32px"
          }}
        >
          {/* For Guests */}
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {ft.forGuests}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <button onClick={() => onTabChange("explore")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.browseStays}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange("explore")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.popularDestinations}
                </button>
              </li>
            </ul>
          </div>

          {/* For Hosts */}
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {ft.forHosts}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <button onClick={() => onTabChange("host")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.listYourProperty}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange("host")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.hostResources}
                </button>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {ft.support}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <button onClick={() => onTabChange("host")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.safetyTrust}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange("inbox")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.helpCenter}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 style={{ fontSize: "0.85rem", fontWeight: "700", color: "#FFF", marginBottom: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {ft.legal}
            </h3>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, fontSize: "0.78rem", display: "flex", flexDirection: "column", gap: "8px" }}>
              <li>
                <button onClick={() => onTabChange("explore")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.privacyPolicy}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange("explore")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.termsConditions}
                </button>
              </li>
              <li>
                <button onClick={() => onTabChange("explore")} style={{ background: "none", border: "none", color: "#BDC3C7", cursor: "pointer", padding: 0, textAlign: "left", fontSize: "inherit" }}>
                  {ft.rentalGuidelines}
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact & Social Section */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "16px",
            paddingTop: "20px",
            borderTop: "1px solid rgba(255,255,255,0.08)"
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.75rem", color: "#A5988F" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Phone size={14} style={{ color: "var(--ethiopian-gold)" }} />
              <span>{ft.phone}: +251 911 000 000</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Mail size={14} style={{ color: "var(--ethiopian-gold)" }} />
              <span>{ft.email}: info@ethiopianstays.com</span>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <a href="https://t.me" target="_blank" rel="noreferrer" style={{ color: "#FFF", backgroundColor: "rgba(255,255,255,0.08)", padding: "8px", borderRadius: "50%", display: "flex" }}>
              <Send size={16} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{ color: "#FFF", backgroundColor: "rgba(255,255,255,0.08)", padding: "8px", borderRadius: "50%", display: "flex" }}>
              <Facebook size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: "#FFF", backgroundColor: "rgba(255,255,255,0.08)", padding: "8px", borderRadius: "50%", display: "flex" }}>
              <Instagram size={16} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: "#FFF", backgroundColor: "rgba(255,255,255,0.08)", padding: "8px", borderRadius: "50%", display: "flex" }}>
              <Youtube size={16} />
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "0.72rem", color: "#7F8C8D" }}>
          <p style={{ margin: 0 }}>{ft.copyright}</p>
        </div>

      </div>
    </footer>
  );
}
