import React from "react";
import { Languages, LogOut, Search, CalendarDays, MessageSquare, UserCheck, ShieldCheck } from "lucide-react";

export default function Header({ language, setLanguage, currency, setCurrency, user, onLogout, activeTab, setActiveTab }) {
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "am" ? "en" : "am"));
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "ETB" ? "USD" : "ETB"));
  };

  const navItems = [
    { id: "explore", icon: Search, label: { am: "ተከራይ", en: "Explore Stays" } },
    { id: "bookings", icon: CalendarDays, label: { am: "ትዕዛዞች", en: "Bookings" } },
    { id: "inbox", icon: MessageSquare, label: { am: "መልዕክት", en: "Inbox" } },
    { id: "host", icon: UserCheck, label: { am: "አስተናጋጅ", en: "Become a Host" } },
    { id: "fayda", icon: ShieldCheck, label: { am: "ፋይዳ ማረጋገጫ", en: "Fayda Verification" } }
  ];

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "var(--bg-white)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 8px rgba(44, 37, 32, 0.04)"
      }}
    >
      {/* Brand Logo */}
      <div 
        onClick={() => setActiveTab && setActiveTab("explore")}
        style={{ cursor: "pointer", display: "flex", flexDirection: "column" }}
      >
        <h1
          style={{
            fontSize: "1.35rem",
            color: "var(--terracotta)",
            fontWeight: "800",
            lineHeight: 1.1,
            margin: 0
          }}
        >
          {language === "am" ? "እንደ ቤቴ" : "Endebete"}
        </h1>
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--ethiopian-green)",
            fontWeight: "700",
            letterSpacing: "0.5px"
          }}
        >
          {language === "am" ? "እንደ ቤቴ ኑሩ!" : "Like My Home"}
        </span>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="desktop-nav" style={{ gap: "20px", alignItems: "center" }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              style={{
                background: "none",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: isActive ? "800" : "600",
                color: isActive ? "var(--terracotta)" : "var(--text-dark)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                borderRadius: "10px",
                backgroundColor: isActive ? "rgba(211, 84, 0, 0.06)" : "transparent",
                transition: "all 0.2s ease"
              }}
            >
              <Icon size={16} style={{ color: isActive ? "var(--terracotta)" : "var(--text-muted)" }} />
              <span>{language === "am" ? item.label.am : item.label.en}</span>
            </button>
          );
        })}
      </nav>

      {/* Action Switchers */}
      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        {/* Currency Switcher */}
        <button
          id="btn-currency-toggle"
          onClick={toggleCurrency}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "var(--bg-cream)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            padding: "6px 12px",
            fontSize: "0.78rem",
            fontWeight: "700",
            color: "var(--text-dark)",
            cursor: "pointer"
          }}
        >
          <span style={{ color: currency === "USD" ? "var(--ethiopian-green)" : "var(--terracotta)" }}>
            {currency}
          </span>
        </button>

        {/* Language Switcher */}
        <button
          id="btn-language-toggle"
          onClick={toggleLanguage}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            backgroundColor: "var(--bg-cream)",
            border: "1px solid var(--border-color)",
            borderRadius: "20px",
            padding: "6px 12px",
            fontSize: "0.78rem",
            fontWeight: "700",
            color: "var(--text-dark)",
            cursor: "pointer"
          }}
        >
          <Languages size={14} style={{ color: "var(--text-muted)" }} />
          <span>{language === "am" ? "English" : "አማርኛ"}</span>
        </button>

        {/* Logout Button if authenticated */}
        {user && (
          <button
            id="btn-logout"
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "rgba(231, 76, 60, 0.08)",
              border: "1px solid rgba(231, 76, 60, 0.15)",
              borderRadius: "50%",
              width: "34px",
              height: "34px",
              color: "#E74C3C",
              cursor: "pointer"
            }}
            title={language === "am" ? "ውጣ" : "Logout"}
          >
            <LogOut size={15} />
          </button>
        )}
      </div>
    </header>
  );
}
