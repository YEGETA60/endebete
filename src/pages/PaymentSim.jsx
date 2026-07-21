import React, { useState } from "react";
import { ArrowLeft, Wallet, CreditCard, Building, CheckCircle2, Ticket, QrCode } from "lucide-react";

export default function PaymentSim({ bookingData, language, onPaymentSuccess, onCancel }) {
  const [selectedMethod, setSelectedMethod] = useState("telebirr"); // telebirr | cbe | chapa
  const [paymentStep, setPaymentStep] = useState("select"); // select | pay | success | interrupted
  const [simulateTimeout, setSimulateTimeout] = useState(false);
  const [interrupted, setInterrupted] = useState(false);
  const [idempotencyKey] = useState(() => "idem-" + Math.floor(100000 + Math.random() * 900000));
  
  // Telebirr simulation states
  const [phoneNumber, setPhoneNumber] = useState("09");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  
  // CBE simulation states
  const [cbeRef, setCbeRef] = useState("");

  // Card simulation states
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  const [loading, setLoading] = useState(false);

  const totalAmount = bookingData?.totalETB || 0;

  const handlePhoneSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert(language === "am" ? "እባክዎ ትክክለኛ ስልክ ቁጥር ያስገቡ!" : "Please enter a valid phone number!");
      return;
    }
    setOtpSent(true);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otpCode.length < 4) {
      alert(language === "am" ? "እባክዎ የተላከውን ኮድ ያስገቡ!" : "Please enter the verification code!");
      return;
    }
    processPayment();
  };

  const handleCbeSubmit = (e) => {
    e.preventDefault();
    if (!cbeRef) {
      alert(language === "am" ? "እባክዎ የግብይቱን ማመሳከሪያ ቁጥር (Ref Number) ያስገቡ!" : "Please enter the CBE reference number!");
      return;
    }
    processPayment();
  };

  const handleCardSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/_api/payments/chapa-initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalAmount,
          email: bookingData?.guestEmail || "guest@ethiopianstays.com",
          firstName: "Guest",
          title: bookingData?.listing?.title?.en || "Accommodation Booking"
        })
      });
      const data = await res.json();
      if (data && data.checkoutUrl && !data.isSimulated) {
        window.location.href = data.checkoutUrl;
        return;
      }
    } catch (err) {
      console.warn("Chapa backend call fallback to simulation:", err);
    }
    processPayment();
  };

  const processPayment = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (simulateTimeout && !interrupted) {
        setInterrupted(true);
        setPaymentStep("interrupted");
      } else {
        setPaymentStep("success");
      }
    }, 1500);
  };

  const handleSuccessDone = () => {
    const trackingId = "EB-" + Math.floor(100000 + Math.random() * 900000);
    onPaymentSuccess({
      ...bookingData,
      trackingId,
      paymentMethod: selectedMethod,
      bookingDate: new Date().toLocaleDateString(),
      idempotencyKey: idempotencyKey
    });
  };

  return (
    <div style={{ padding: "16px" }}>
      {/* Header */}
      {paymentStep !== "success" && (
        <div className="flex-row" style={{ gap: "12px", marginBottom: "20px" }}>
          <button
            id="btn-pay-back"
            onClick={onCancel}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              backgroundColor: "var(--bg-white)",
              border: "1px solid var(--border-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer"
            }}
          >
            <ArrowLeft size={16} />
          </button>
          <h2 style={{ fontSize: "1.1rem", fontWeight: "800" }}>
            {language === "am" ? "ክፍያ ፈጽም" : "Payment Checkout"}
          </h2>
        </div>
      )}

      {paymentStep === "select" ? (
        /* STEP 1: Select Payment Method */
        <div>
          {/* Order Details Panel */}
          <div
            className="card-premium"
            style={{
              backgroundColor: "var(--bg-white)",
              padding: "14px",
              marginBottom: "20px"
            }}
          >
            <h3 style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: "600", marginBottom: "6px" }}>
              {language === "am" ? "ክፍያ የሚፈጽሙበት ቤት" : "Booking accommodation"}
            </h3>
            <div style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "10px" }}>
              {language === "am" ? bookingData?.listing?.title.am : bookingData?.listing?.title.en}
            </div>
            <div className="flex-between" style={{ borderTop: "1px solid var(--border-color)", paddingTop: "10px" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "600" }}>
                {language === "am" ? "ለመክፈል የተጠየቀው ሂሳብ፦" : "Total to Pay:"}
              </span>
              <span style={{ fontSize: "1.1rem", fontWeight: "800", color: "var(--terracotta)" }}>
                {totalAmount.toLocaleString()} ብር
              </span>
            </div>
          </div>

          {/* System Design Simulation Controls */}
          <div
            className="card-premium"
            style={{
              backgroundColor: "rgba(41, 128, 185, 0.05)",
              border: "1.5px solid rgba(41, 128, 185, 0.2)",
              padding: "12px",
              borderRadius: "14px",
              marginBottom: "20px"
            }}
          >
            <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer" }}>
              <input
                id="checkbox-simulate-timeout"
                type="checkbox"
                checked={simulateTimeout}
                onChange={(e) => setSimulateTimeout(e.target.checked)}
                style={{ marginTop: "3px" }}
              />
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: "700", color: "#2980B9", display: "block" }}>
                  ⚙️ {language === "am" ? "የኔትወርክ መቆራረጥን አስመስል" : "Simulate Network Interruption"}
                </span>
                <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", display: "block", lineHeight: "1.3", marginTop: "2px" }}>
                  {language === "am" 
                    ? "ከክፍያ ጋር የተያያዙ ስህተቶችን እና የIdempotency መፍትሄዎችን ለመሞከር ይህንን ያብሩት።" 
                    : "Simulates a gateway timeout to test the idempotent retry recovery mechanism."}
                </span>
              </div>
            </label>
            {simulateTimeout && (
              <div style={{ marginTop: "8px", fontSize: "0.68rem", color: "var(--terracotta)", fontWeight: "600" }}>
                ⚠️ Token generated for session: <code>{idempotencyKey}</code>
              </div>
            )}
          </div>

          <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "12px" }}>
            {language === "am" ? "የክፍያ አማራጭ ይምረጡ" : "Choose Payment Wallet/Method"}
          </h3>

          {/* Telebirr Toggle */}
          <div
            id="panel-method-telebirr"
            onClick={() => setSelectedMethod("telebirr")}
            className="card-premium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              borderColor: selectedMethod === "telebirr" ? "var(--terracotta)" : "var(--border-color)",
              backgroundColor: selectedMethod === "telebirr" ? "rgba(211, 84, 0, 0.04)" : "var(--bg-white)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "#2980B9",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                fontSize: "1.4rem"
              }}
            >
              t
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>telebirr (ቴሌብር)</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {language === "am" ? "በኢትዮ ቴሌኮም ሞባይል ቦርሳ በቀጥታ መክፈያ" : "Ethio Telecom mobile wallet - Instant pay"}
              </div>
            </div>
          </div>

          {/* CBE Birr Toggle */}
          <div
            id="panel-method-cbe"
            onClick={() => setSelectedMethod("cbe")}
            className="card-premium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              borderColor: selectedMethod === "cbe" ? "var(--terracotta)" : "var(--border-color)",
              backgroundColor: selectedMethod === "cbe" ? "rgba(211, 84, 0, 0.04)" : "var(--bg-white)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "var(--ethiopian-green)",
                color: "var(--ethiopian-gold)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <Building size={22} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>CBE Birr / Bank Transfer</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {language === "am" ? "በኢትዮጵያ ንግድ ባንክ በዝውውር (Transfer) መክፈያ" : "Commercial Bank of Ethiopia transfer"}
              </div>
            </div>
          </div>

          {/* Chapa Gateway Toggle */}
          <div
            id="panel-method-chapa"
            onClick={() => setSelectedMethod("chapa")}
            className="card-premium"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              cursor: "pointer",
              borderColor: selectedMethod === "chapa" ? "var(--terracotta)" : "var(--border-color)",
              backgroundColor: selectedMethod === "chapa" ? "rgba(211, 84, 0, 0.04)" : "var(--bg-white)"
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "10px",
                backgroundColor: "#8E44AD",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <CreditCard size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: "0.9rem", fontWeight: "700" }}>Chapa Local & Int. Cards</div>
              <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                {language === "am" ? "በአገር ውስጥ እና ዓለም አቀፍ የባንክ ካርዶች መክፈያ" : "Visa/Mastercard, CBE, Awash, Hibret"}
              </div>
            </div>
          </div>

          <button
            id="btn-pay-continue"
            onClick={() => setPaymentStep("pay")}
            className="btn-primary"
            style={{ width: "100%", marginTop: "10px" }}
          >
            {language === "am" ? "ቀጥል" : "Continue to Checkout"}
          </button>
        </div>
      ) : paymentStep === "pay" ? (
        /* STEP 2: Actual simulation form based on payment method */
        <div className="card-premium" style={{ backgroundColor: "var(--bg-white)" }}>
          {selectedMethod === "telebirr" && (
            /* Telebirr Checkout UI */
            <div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1rem", color: "#2980B9", fontWeight: "700" }}>telebirr Simulation</h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Ethio Telecom Official API Integration</span>
              </div>

              {!otpSent ? (
                <form onSubmit={handlePhoneSubmit}>
                  <div className="form-group">
                    <label className="form-label">{language === "am" ? "የቴሌብር ስልክ ቁጥር" : "Telebirr Phone Number"}</label>
                    <input
                      id="input-pay-phone"
                      type="text"
                      className="form-input"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="0912345678"
                      required
                    />
                  </div>
                  <button id="btn-telebirr-otp" type="submit" className="btn-primary" style={{ width: "100%", backgroundColor: "#2980B9" }}>
                    {language === "am" ? "የማረጋገጫ ኮድ ላክ" : "Send SMS Verification PIN"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleOtpSubmit}>
                  <div style={{ backgroundColor: "rgba(30, 130, 76, 0.05)", padding: "10px", borderRadius: "10px", fontSize: "0.7rem", marginBottom: "12px", textAlign: "center" }}>
                    {language === "am" ? "ባለ 4 አሃዝ ጊዜያዊ ኮድ በምስል ስልክዎ ላይ ተልኳል!" : "A mock 4-digit code was sent to your phone!"}
                  </div>
                  <div className="form-group">
                    <label className="form-label">{language === "am" ? "የማረጋገጫ ኮድ ያስገቡ" : "SMS Verification PIN"}</label>
                    <input
                      id="input-pay-otp"
                      type="text"
                      maxLength={4}
                      className="form-input"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="1234"
                      required
                      style={{ textAlign: "center", fontSize: "1.2rem", letterSpacing: "8px" }}
                    />
                  </div>
                  <button id="btn-telebirr-verify" type="submit" disabled={loading} className="btn-success" style={{ width: "100%" }}>
                    {loading ? (language === "am" ? "በመክፈል ላይ..." : "Processing...") : `${language === "am" ? "ክፍያውን አረጋግጥ" : "Authorize payment"} - ${totalAmount.toLocaleString()} ብር`}
                  </button>
                </form>
              )}
            </div>
          )}

          {selectedMethod === "cbe" && (
            /* CBE Bank Transfer Checkout UI */
            <div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1rem", color: "var(--ethiopian-green)", fontWeight: "700" }}>Commercial Bank of Ethiopia (CBE)</h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Manual Bank Transfer Flow</span>
              </div>

              <div
                style={{
                  backgroundColor: "var(--bg-cream)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "12px",
                  padding: "12px",
                  fontSize: "0.78rem",
                  marginBottom: "16px"
                }}
              >
                <div style={{ marginBottom: "6px" }}>
                  <strong>{language === "am" ? "የባንክ አካውንት ስም: " : "Account Name: "}</strong>
                  <span>Ende Bete Rental Platform PLC</span>
                </div>
                <div style={{ marginBottom: "6px" }}>
                  <strong>{language === "am" ? "አካውንት ቁጥር: " : "Account Number: "}</strong>
                  <code style={{ fontSize: "0.85rem", color: "var(--terracotta)", fontWeight: "bold" }}>1000499283748</code>
                </div>
                <div>
                  <strong>{language === "am" ? "የግብይት ማጣቀሻ (Reference): " : "Transaction Reference: "}</strong>
                  <code style={{ fontSize: "0.85rem", color: "var(--ethiopian-green)", fontWeight: "bold" }}>EB-TR-{bookingData?.listing?.id}</code>
                </div>
              </div>

              <form onSubmit={handleCbeSubmit}>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginBottom: "12px", lineHeight: "1.4" }}>
                  {language === "am" 
                    ? "እባክዎ በሞባይል ባንኪንግዎ ወይም ቅርንጫፍ በመሄድ ከላይ ባለው ቁጥር ላይ ሂሳቡን ያስገቡ። ከዚያም ከባንክ ያገኙትን የማመሳከሪያ ቁጥር (Ref. Number) ከታች ያስገቡ።" 
                    : "Please make a transfer of the exact amount using CBE Mobile Banking. Once complete, paste your Transaction Reference (FT number) below."}
                </div>
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የግብይት ማመሳከሪያ ቁጥር (FT reference)" : "CBE Reference Number (FTxxxxx)"}</label>
                  <input
                    id="input-pay-cbe-ref"
                    type="text"
                    className="form-input"
                    value={cbeRef}
                    onChange={(e) => setCbeRef(e.target.value)}
                    placeholder="FT26154H92B8"
                    required
                  />
                </div>
                <button id="btn-cbe-submit" type="submit" disabled={loading} className="btn-success" style={{ width: "100%" }}>
                  {loading ? (language === "am" ? "በማጣራት ላይ..." : "Verifying Transfer...") : (language === "am" ? "ክፍያውን አረጋግጥ" : "Confirm Bank Transfer")}
                </button>
              </form>
            </div>
          )}

          {selectedMethod === "chapa" && (
            /* Chapa Card Gateway Checkout UI */
            <div>
              <div style={{ textAlign: "center", marginBottom: "16px" }}>
                <h3 style={{ fontSize: "1rem", color: "#8E44AD", fontWeight: "700" }}>Chapa Payment Gateway</h3>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Simulating Secure Local Card Checkout</span>
              </div>

              <form onSubmit={handleCardSubmit}>
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የካርድ ባለቤት ስም" : "Cardholder Name"}</label>
                  <input id="input-pay-card-name" type="text" className="form-input" placeholder="Eleni Woldeab" required />
                </div>
                <div className="form-group">
                  <label className="form-label">{language === "am" ? "የካርድ ቁጥር" : "Card Number"}</label>
                  <input
                    id="input-pay-card-number"
                    type="text"
                    className="form-input"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                  />
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div className="form-group">
                    <label className="form-label">{language === "am" ? "የማብቂያ ቀን" : "Expiry Date"}</label>
                    <input
                      id="input-pay-card-expiry"
                      type="text"
                      className="form-input"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV</label>
                    <input
                      id="input-pay-card-cvv"
                      type="password"
                      className="form-input"
                      placeholder="123"
                      maxLength={3}
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <button id="btn-chapa-submit" type="submit" disabled={loading} className="btn-success" style={{ width: "100%", backgroundColor: "#8E44AD" }}>
                  {loading ? (language === "am" ? "በማጣራት ላይ..." : "Authorizing Card...") : `${language === "am" ? "ይክፈሉ" : "Pay Now"} - ${totalAmount.toLocaleString()} ብር`}
                </button>
              </form>
            </div>
          )}
        </div>
      ) : (
        /* STEP 3: Booking Success Ticket Screen */
        <div style={{ textAlign: "center", padding: "10px 0" }}>
          <div style={{ color: "var(--ethiopian-green)", marginBottom: "16px" }}>
            <CheckCircle2 size={56} style={{ margin: "0 auto" }} />
          </div>
          
          <h2 style={{ fontSize: "1.25rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "6px" }}>
            {language === "am" ? "ትዕዛዝዎ በትክክል ተመዝግቧል!" : "Booking Reserved Successfully!"}
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "20px" }}>
            {language === "am" 
              ? "የቤቱ ባለቤት በፋይዳ መለያዎ ማንነትዎን በማጣራት በ24 ሰዓት ውስጥ መልስ ይሰጥዎታል።" 
              : "The host has been notified. Since you verified with your Fayda ID, approval is expedited!"}
          </p>

          {/* Ticket styling */}
          <div
            className="card-premium"
            style={{
              textAlign: "left",
              backgroundColor: "var(--bg-white)",
              padding: "16px",
              border: "1px dashed var(--border-color)",
              position: "relative",
              marginBottom: "24px"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px dashed var(--border-color)", paddingBottom: "12px", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--terracotta)" }}>
                <Ticket size={16} />
                <span style={{ fontSize: "0.72rem", fontWeight: "700" }}>እንደ ቤቴ Stay Receipt</span>
              </div>
              <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
                Ref: {Math.floor(1000 + Math.random() * 9000)}
              </span>
            </div>

            <div style={{ fontSize: "0.78rem", marginBottom: "14px" }}>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "ማረፊያ: " : "Stay: "}</span>
                <strong>{language === "am" ? bookingData?.listing?.title.am : bookingData?.listing?.title.en}</strong>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "መግቢያ ቀን: " : "Move-in: "}</span>
                <strong>{bookingData?.moveInDate}</strong>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የቆይታ ጊዜ: " : "Duration: "}</span>
                <strong>
                  {bookingData?.durationTab === "monthly" 
                    ? `${bookingData?.stayDuration} ${language === "am" ? "ወራት" : "months"}`
                    : `${bookingData?.stayDuration} ${language === "am" ? "ቀናት (አዳሮች)" : "nights"}`}
                </strong>
              </div>
              <div style={{ marginBottom: "6px" }}>
                <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የነዋሪዎች ብዛት: " : "Guests: "}</span>
                <strong>
                  {bookingData?.guests || 1} {bookingData?.guests === 1 ? (language === "am" ? "እንግዳ" : "Guest") : (language === "am" ? "እንግዶች" : "Guests")}
                </strong>
              </div>
              <div>
                <span style={{ color: "var(--text-muted)" }}>{language === "am" ? "የክፍያ ዘዴ: " : "Paid via: "}</span>
                <strong style={{ textTransform: "uppercase" }}>{selectedMethod}</strong>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--bg-cream)",
                padding: "8px 12px",
                borderRadius: "10px"
              }}
            >
              <span style={{ fontSize: "0.72rem", fontWeight: "700" }}>{language === "am" ? "ጠቅላላ ክፍያ: " : "Amount Paid:"}</span>
              <strong style={{ color: "var(--ethiopian-green)", fontSize: "0.95rem" }}>
                {totalAmount.toLocaleString()} ብር
              </strong>
            </div>

            {/* Simulating QR code receipt */}
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px" }}>
              <div style={{ textAlign: "center", padding: "6px", border: "1px solid var(--border-color)", borderRadius: "8px", backgroundColor: "#fff" }}>
                <QrCode size={40} style={{ color: "var(--text-dark)" }} />
                <div style={{ fontSize: "0.55rem", color: "var(--text-muted)", marginTop: "2px" }}>QR-CHECKIN</div>
              </div>
            </div>
          </div>

          <button
            id="btn-success-done"
            onClick={handleSuccessDone}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {language === "am" ? "ወደ አስስ ተመለስ" : "Back to Explore"}
          </button>
        </div>
      )}

      {paymentStep === "interrupted" && (
        <div style={{ textAlign: "center", padding: "20px 0" }}>
          <div style={{ color: "var(--terracotta)", marginBottom: "16px" }}>
            <span style={{ fontSize: "3rem" }}>⚠️</span>
          </div>
          <h2 style={{ fontSize: "1.2rem", fontWeight: "800", color: "var(--text-dark)", marginBottom: "10px" }}>
            {language === "am" ? "የግንኙነት መቆራረጥ አጋጥሟል!" : "Network Connection Interrupted!"}
          </h2>
          <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: "1.5", marginBottom: "20px" }}>
            {language === "am" 
              ? "ክፍያውን በመፈጸም ላይ ሳለ የኔትወርክ መቆራረጥ አጋጥሟል። ነገር ግን የትዕዛዝ መለያዎ (Idempotency Key) በትክክል ተይዟል።"
              : "A simulated network timeout occurred. Your transaction request was dispatched but the response was lost."}
          </p>

          <div
            className="card-premium"
            style={{
              backgroundColor: "rgba(211, 84, 0, 0.05)",
              border: "1px solid rgba(211, 84, 0, 0.2)",
              borderRadius: "14px",
              padding: "14px",
              textAlign: "left",
              marginBottom: "20px"
            }}
          >
            <h4 style={{ fontSize: "0.85rem", color: "var(--terracotta)", fontWeight: "700", marginTop: 0, marginBottom: "6px" }}>
              💡 System Design Feature: Idempotency Key
            </h4>
            <div style={{ fontSize: "0.75rem", color: "var(--text-dark)", lineHeight: "1.4", marginBottom: "8px" }}>
              <strong>Token:</strong> <code>{idempotencyKey}</code>
            </div>
            <p style={{ fontSize: "0.72rem", color: "var(--text-muted)", lineHeight: "1.4", margin: 0 }}>
              {language === "am"
                ? "ድጋሚ ሲሞክሩ ይህ መለያ ስለሚላክ ባንኩ ወይም ሲስተማችን ሂሳብዎን በስህተት ሁለት ጊዜ እንዳይቆርጥ እና በካላንደር ላይ ሁለት ቦታ እንዳይይዝ ይከላከላል።"
                : "Retrying with this key guarantees the server resolves the existing transaction rather than processing a second payment or booking a duplicate stay."}
            </p>
          </div>

          <button
            id="btn-retry-payment"
            onClick={processPayment}
            disabled={loading}
            className="btn-primary"
            style={{ width: "100%" }}
          >
            {loading ? (language === "am" ? "ድጋሚ በመሞከር ላይ..." : "Retrying Payment...") : (language === "am" ? "ክፍያውን ድጋሚ ሞክር" : "Retry Authorization")}
          </button>
        </div>
      )}
    </div>
  );
}
