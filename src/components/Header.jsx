import React from "react";
import { Languages, LogOut } from "lucide-react";

export default function Header({ language, setLanguage, currency, setCurrency, user, onLogout }) {
  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "am" ? "en" : "am"));
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "ETB" ? "USD" : "ETB"));
  };

  return (
    <header
      style={{
        height: "var(--header-height)",
        backgroundColor: "var(--bg-white)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 100,
        boxShadow: "0 2px 6px rgba(44, 37, 32, 0.04)"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: "1.25rem",
            color: "var(--terracotta)",
            fontWeight: "700",
            lineHeight: 1.1
          }}
        >
          {language === "am" ? "እንደ ቤቴ" : "Ende Bete"}
        </h1>
        <span
          style={{
            fontSize: "0.68rem",
            color: "var(--ethiopian-green)",
            fontWeight: "600",
            letterSpacing: "0.5px"
          }}
        >
          {language === "am" ? "እንደ ቤቴ ኑሩ!" : "Like My Home"}
        </span>
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
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
            padding: "6px 10px",
            fontSize: "0.72rem",
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
            padding: "6px 10px",
            fontSize: "0.72rem",
            fontWeight: "700",
            color: "var(--text-dark)",
            cursor: "pointer"
          }}
        >
          <Languages size={12} style={{ color: "var(--text-muted)" }} />
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
              width: "30px",
              height: "30px",
              color: "#E74C3C",
              cursor: "pointer"
            }}
            title={language === "am" ? "ውጣ" : "Logout"}
          >
            <LogOut size={13} />
          </button>
        )}
      </div>
    </header>
  );
}

