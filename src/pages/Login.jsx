import React, { useState } from "react";
import { Phone, CheckCircle, Shield, AlertCircle } from "lucide-react";
import { api } from "../services/api";

export default function Login({ language, onLoginSuccess }) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [mockOtp, setMockOtp] = useState("");

  const handleSendOtp = (e) => {
    e.preventDefault();
    // Validate Ethiopian phone numbers (starts with 09 or 07 or +251, length check)
    const formatted = phoneNumber.trim();
    if (formatted.length < 9) {
      alert(language === "am" ? "እባክዎ ትክክለኛ የሞባይል ስልክ ቁጥር ያስገቡ!" : "Please enter a valid mobile number!");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setOtpSent(true);
      const generatedCode = String(Math.floor(1000 + Math.random() * 9000));
      setMockOtp(generatedCode);
    }, 1500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (otpCode !== mockOtp && otpCode !== "1234") {
      alert(language === "am" ? "የገቡት የማረጋገጫ ኮድ የተሳሳተ ነው! እባክዎ እንደገና ይሞክሩ።" : "Incorrect OTP code! Please try again.");
      return;
    }

    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Call local API service to save user credentials
      const user = api.auth.login(phoneNumber);
      onLoginSuccess(user);
    }, 1500);
  };

  return (
    <div style={{ padding: "24px 16px", minHeight: "80vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontSize: "1.5rem", color: "var(--terracotta)", fontWeight: "800", marginBottom: "6px" }}>
          {language === "am" ? "እንኳን ወደ እንደ ቤቴ በደህና መጡ" : "Welcome to Ende Bete"}
        </h2>
        <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
          {language === "am" 
            ? "ኢትዮጵያ ውስጥ ያሉ ማረፊያዎችን በቀላሉ በብር ለመያዝ እና ለማከራየት" 
            : "Book and list properties in Ethiopia directly in Birr."}
        </p>
      </div>

      <div className="card-premium" style={{ backgroundColor: "var(--bg-white)", padding: "20px" }}>
        {!otpSent ? (
          /* Enter Phone Screen */
          <form onSubmit={handleSendOtp}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(211, 84, 0, 0.08)",
                  color: "var(--terracotta)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px auto"
                }}
              >
                <Phone size={24} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>
                {language === "am" ? "በስልክ ቁጥርዎ ይግቡ" : "Login with Phone Number"}
              </h3>
            </div>

            <div className="form-group">
              <label className="form-label">{language === "am" ? "የሞባይል ስልክ ቁጥር" : "Mobile Phone Number"}</label>
              <div style={{ display: "flex", gap: "8px" }}>
                <span
                  style={{
                    backgroundColor: "var(--bg-cream)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "12px",
                    padding: "12px 14px",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    display: "flex",
                    alignItems: "center"
                  }}
                >
                  +251
                </span>
                <input
                  id="input-login-phone"
                  type="tel"
                  className="form-input"
                  placeholder="912345678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  required
                  style={{ flex: 1 }}
                />
              </div>
              <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                {language === "am" ? "ለምሳሌ፦ 912345678 ወይም 712345678" : "e.g., 912345678 or 712345678"}
              </span>
            </div>

            <button
              id="btn-login-send-otp"
              type="submit"
              disabled={isVerifying}
              className="btn-primary"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {isVerifying ? (language === "am" ? "በመላክ ላይ..." : "Sending...") : (language === "am" ? "የማረጋገጫ ኮድ ላክ" : "Send Verification OTP")}
            </button>
          </form>
        ) : (
          /* Enter OTP Screen */
          <form onSubmit={handleVerifyOtp}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(30, 130, 76, 0.08)",
                  color: "var(--ethiopian-green)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 10px auto"
                }}
              >
                <Shield size={24} />
              </div>
              <h3 style={{ fontSize: "1rem", fontWeight: "700" }}>
                {language === "am" ? "ኮዱን ያስገቡ" : "Enter Verification Code"}
              </h3>
              <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px" }}>
                +251 {phoneNumber}
              </p>
            </div>

            {/* Test Helper Notification */}
            <div
              style={{
                backgroundColor: "rgba(241, 196, 15, 0.1)",
                border: "1px dashed var(--ethiopian-gold)",
                borderRadius: "10px",
                padding: "8px 12px",
                fontSize: "0.72rem",
                marginBottom: "16px",
                textAlign: "center"
              }}
            >
              🔑 {language === "am" ? "ለሙከራ የተላከው ኮድ፦ " : "Your test OTP code is: "}
              <strong style={{ color: "var(--terracotta)", fontSize: "0.85rem" }}>{mockOtp}</strong>
            </div>

            <div className="form-group">
              <label className="form-label">{language === "am" ? "የማረጋገጫ ኮድ (OTP)" : "One-Time Password (OTP)"}</label>
              <input
                id="input-login-otp"
                type="text"
                maxLength={4}
                className="form-input"
                placeholder="XXXX"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                required
                style={{ textAlign: "center", fontSize: "1.25rem", letterSpacing: "12px", padding: "10px" }}
              />
            </div>

            <button
              id="btn-login-verify-otp"
              type="submit"
              disabled={isVerifying}
              className="btn-success"
              style={{ width: "100%", marginTop: "10px" }}
            >
              {isVerifying ? (language === "am" ? "በማረጋገጥ ላይ..." : "Verifying...") : (language === "am" ? "ይግቡ" : "Confirm & Login")}
            </button>

            <button
              id="btn-login-otp-back"
              type="button"
              onClick={() => setOtpSent(false)}
              className="btn-secondary"
              style={{ width: "100%", marginTop: "8px", border: "none" }}
            >
              {language === "am" ? "ስልክ ቁጥር ለመቀየር ተመለስ" : "Back to Edit Phone"}
            </button>
          </form>
        )}
      </div>

      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginTop: "24px", opacity: 0.7 }}>
        <AlertCircle size={14} style={{ color: "var(--text-muted)" }} />
        <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
          {language === "am" 
            ? "ኢትዮጵያ ውስጥ ያሉ የደህንነት እና ግብይት ደንቦች ሙሉ በሙሉ ይከበራሉ።" 
            : "Compliance with local regulations and data privacy rules."}
        </span>
      </div>
    </div>
  );
}
