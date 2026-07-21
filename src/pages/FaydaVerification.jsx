import React, { useState } from "react";
import { ShieldCheck, FileText, UploadCloud, AlertCircle } from "lucide-react";

export default function FaydaVerification({ language, userFaydaVerified, setUserFaydaVerified, faydaId, setFaydaId }) {
  const [tempId, setTempId] = useState(faydaId || "ET-8822-7711-");
  const [fullName, setFullName] = useState("");
  const [docUploaded, setDocUploaded] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!fullName || tempId.length < 12 || !docUploaded) {
      alert(language === "am" ? "እባክዎ ሁሉንም መስኮች ይሙሉ እና ፎቶ ይጫኑ!" : "Please fill all fields and upload ID card photo!");
      return;
    }
    
    setIsVerifying(true);
    // Simulate checking Fayda system API
    setTimeout(() => {
      setIsVerifying(false);
      setUserFaydaVerified(true);
      setFaydaId(tempId);
    }, 2000);
  };

  const handleReset = () => {
    setUserFaydaVerified(false);
    setFaydaId("");
    setFullName("");
    setDocUploaded(false);
    setTempId("ET-");
  };

  return (
    <div style={{ padding: "16px" }}>
      <div style={{ textAlign: "center", marginBottom: "20px", marginTop: "10px" }}>
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            backgroundColor: userFaydaVerified ? "rgba(30, 130, 76, 0.1)" : "rgba(211, 84, 0, 0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 12px auto",
            color: userFaydaVerified ? "var(--ethiopian-green)" : "var(--terracotta)"
          }}
        >
          <ShieldCheck size={32} />
        </div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: "800" }}>
          {language === "am" ? "ብሔራዊ ፋይዳ (Fayda ID) ማረጋገጫ" : "National Fayda ID Verification"}
        </h2>
        <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: "4px" }}>
          {language === "am" 
            ? "የማጭበርበር ድርጊቶችን ለመከላከል እና መተማመንን ለመፍጠር የፋይዳ መታወቂያዎን ያረጋግጡ።" 
            : "Verify your identity using the Ethiopian National ID (Fayda) system to build trust."}
        </p>
      </div>

      {userFaydaVerified ? (
        /* Verified State Screen */
        <div
          className="card-premium"
          style={{
            border: "1.5px solid var(--ethiopian-green)",
            backgroundColor: "var(--bg-white)",
            textAlign: "center",
            padding: "24px 16px"
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              backgroundColor: "rgba(30, 130, 76, 0.1)",
              color: "var(--ethiopian-green)",
              padding: "6px 14px",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: "700",
              marginBottom: "16px"
            }}
          >
            <ShieldCheck size={16} /> Verified / ተረጋግጧል
          </div>

          <h3 style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "8px" }}>
            {language === "am" ? "መለያዎ በትክክል ተረጋግጧል!" : "Verification Complete!"}
          </h3>
          
          <div
            style={{
              backgroundColor: "var(--bg-cream)",
              borderRadius: "12px",
              padding: "12px",
              margin: "12px 0 20px 0",
              fontSize: "0.8rem",
              textAlign: "left"
            }}
          >
            <div style={{ marginBottom: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የተጠቃሚ ስም: " : "Full Name: "}</span>
              <strong>{fullName || "Elias Teklay"}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "ፋይዳ መለያ ቁጥር: " : "Fayda Number: "}</span>
              <strong>{faydaId}</strong>
            </div>
          </div>

          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            {language === "am" 
              ? "አሁን እንደ አስተማማኝ ተጠቃሚ ቤቶችን ማዘዝ እና ማከራየት ይችላሉ።" 
              : "You are now verified. You can book stays and publish properties on the platform."}
          </p>

          <button
            id="btn-fayda-reset"
            onClick={handleReset}
            className="btn-secondary"
            style={{ width: "100%", fontSize: "0.85rem" }}
          >
            {language === "am" ? "ማረጋገጫውን ሰርዝ / በሌላ ቀይር" : "Reset Verification"}
          </button>
        </div>
      ) : (
        /* Form Unverified State */
        <form onSubmit={handleVerify} className="card-premium" style={{ backgroundColor: "var(--bg-white)" }}>
          <div
            style={{
              display: "flex",
              gap: "8px",
              backgroundColor: "rgba(241, 196, 15, 0.1)",
              padding: "10px",
              borderRadius: "12px",
              marginBottom: "16px",
              alignItems: "flex-start"
            }}
          >
            <AlertCircle size={18} style={{ color: "var(--ethiopian-gold-dark)", flexShrink: 0, marginTop: "2px" }} />
            <p style={{ fontSize: "0.72rem", color: "var(--text-dark)", lineHeight: "1.4" }}>
              {language === "am" 
                ? "ማሳሰቢያ፦ ቤቶችን ለመመዝገብ (Host) ወይም ለማዘዝ (Book) በመጀመሪያ ማንነትዎን ማረጋገጥ ይኖርብዎታል።" 
                : "Note: To avoid scams, verifying your national identity is required before listing properties or booking stays."}
            </p>
          </div>

          <div className="form-group">
            <label className="form-label">
              {language === "am" ? "ሙሉ ስም (በመታወቂያው መሠረት)" : "Full Name (As written on ID)"}
            </label>
            <input
              id="input-fayda-name"
              type="text"
              className="form-input"
              required
              placeholder={language === "am" ? "ለምሳሌ፦ እሌኒ ወልደአብ" : "e.g., Eleni Woldeab"}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              {language === "am" ? "የፋይዳ መለያ ቁጥር" : "Fayda Number (Ethiopian National ID)"}
            </label>
            <input
              id="input-fayda-number"
              type="text"
              className="form-input"
              required
              placeholder="ET-XXXX-XXXX-XXXX"
              value={tempId}
              onChange={(e) => setTempId(e.target.value)}
            />
          </div>

          {/* Simulated File Upload */}
          <div className="form-group">
            <label className="form-label">
              {language === "am" ? "የዲጂታል ካርድ ፎቶ/ቅጂ ይጫኑ" : "Upload Digital Card Photo"}
            </label>
            <div
              onClick={() => setDocUploaded(true)}
              style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "12px",
                padding: "20px 10px",
                textAlign: "center",
                cursor: "pointer",
                backgroundColor: docUploaded ? "rgba(30, 130, 76, 0.05)" : "var(--bg-cream)",
                borderColor: docUploaded ? "var(--ethiopian-green)" : "var(--border-color)",
                transition: "all 0.2s ease"
              }}
            >
              {docUploaded ? (
                <div>
                  <ShieldCheck size={28} style={{ color: "var(--ethiopian-green)", margin: "0 auto 6px auto" }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: "700", color: "var(--ethiopian-green)" }}>
                    {language === "am" ? "ካርዱ በትክክል ተጭኗል" : "fayda_card_verified.jpg"}
                  </span>
                </div>
              ) : (
                <div>
                  <UploadCloud size={28} style={{ color: "var(--text-muted)", margin: "0 auto 6px auto" }} />
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                    {language === "am" ? "እዚህ ይጫኑ (ካሜራ/ፋይል)" : "Tap to upload (Camera/Image)"}
                  </span>
                </div>
              )}
            </div>
          </div>

          <button
            id="btn-fayda-submit"
            type="submit"
            disabled={isVerifying}
            className="btn-success"
            style={{ width: "100%", marginTop: "8px" }}
          >
            {isVerifying ? (
              <span>{language === "am" ? "በማጣራት ላይ..." : "Connecting to Fayda..."}</span>
            ) : (
              <span>{language === "am" ? "ማንነትን አረጋግጥ" : "Submit for Verification"}</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
