import React from "react";
import { Calendar, Ticket, MapPin, Receipt, ShieldCheck } from "lucide-react";

export default function Bookings({ language, bookings, onCancelBooking }) {
  return (
    <div style={{ padding: "16px" }}>
      <h2 style={{ fontSize: "1.2rem", fontWeight: "800", marginBottom: "16px" }}>
        {language === "am" ? "የእርስዎ ትዕዛዞች" : "My Bookings"}
      </h2>

      {bookings.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "40px 16px",
            backgroundColor: "var(--bg-white)",
            borderRadius: "20px",
            border: "1px solid var(--border-color)",
            marginTop: "10px"
          }}
        >
          <Calendar size={36} style={{ color: "var(--text-muted)", margin: "0 auto 12px auto" }} />
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
            {language === "am" 
              ? "እስካሁን ምንም ቤት አላዘዙም።" 
              : "You don't have any booked accommodations yet."}
          </p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div
            key={booking.id || booking.trackingId}
            className="card-premium"
            style={{
              backgroundColor: "var(--bg-white)",
              position: "relative",
              padding: "16px"
            }}
          >
            {/* Header Ticket Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--border-color)",
                paddingBottom: "10px",
                marginBottom: "12px"
              }}
            >
              <span
                style={{
                  fontSize: "0.68rem",
                  fontWeight: "700",
                  color: "var(--terracotta)",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Ticket size={14} /> Ref: {booking.trackingId}
              </span>
              <span
                className="badge badge-green"
                style={{
                  fontSize: "0.68rem"
                }}
              >
                {language === "am" ? "ይሁንታ እየጠበቀ" : "Pending Approval"}
              </span>
            </div>

            {/* Title / Info */}
            <h3 style={{ fontSize: "0.95rem", fontWeight: "700", marginBottom: "8px" }}>
              {language === "am" ? booking.listing.title.am : booking.listing.title.en}
            </h3>

            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", spaceY: "4px" }}>
              <div className="flex-row" style={{ gap: "4px", marginBottom: "4px" }}>
                <MapPin size={12} style={{ color: "var(--terracotta)" }} />
                <span>
                  {language === "am" ? booking.listing.subCity.am : booking.listing.subCity.en} -{" "}
                  {language === "am" ? booking.listing.landmark.am : booking.listing.landmark.en}
                </span>
              </div>
              <div style={{ marginBottom: "4px" }}>
                📅 {language === "am" ? "መግቢያ ቀን: " : "Start Date: "} <strong>{booking.moveInDate}</strong>
              </div>
              <div style={{ marginBottom: "4px" }}>
                ⏱️ {language === "am" ? "ቆይታ: " : "Duration: "}
                <strong>
                  {booking.durationTab === "monthly" 
                    ? `${booking.stayDuration} ${language === "am" ? "ወራት" : "months"}`
                    : `${booking.stayDuration} ${language === "am" ? "ቀናት" : "nights"}`}
                </strong>
              </div>
              <div>
                💳 {language === "am" ? "የክፍያ ዘዴ: " : "Payment Method: "}
                <span style={{ textTransform: "uppercase", fontWeight: "bold" }}>
                  {booking.paymentMethod}
                </span>
              </div>
            </div>

            {/* Pricing Section */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                backgroundColor: "var(--bg-cream)",
                padding: "10px",
                borderRadius: "10px",
                marginTop: "12px"
              }}
            >
              <div className="flex-row" style={{ gap: "4px", fontSize: "0.72rem", color: "var(--text-muted)" }}>
                <Receipt size={12} />
                <span>{language === "am" ? "የተከፈለው ጠቅላላ ሂሳብ" : "Total Paid"}</span>
              </div>
              <strong style={{ color: "var(--ethiopian-green)", fontSize: "0.9rem" }}>
                {booking.totalETB.toLocaleString()} ብር
              </strong>
            </div>

            {/* Cancel Button */}
            <button
              id={`btn-cancel-booking-${booking.id}`}
              onClick={() => onCancelBooking(booking.id)}
              style={{
                border: "none",
                background: "none",
                color: "#E74C3C",
                fontSize: "0.75rem",
                fontWeight: "600",
                marginTop: "12px",
                cursor: "pointer",
                display: "block",
                textAlign: "left"
              }}
            >
              {language === "am" ? "ትዕዛዙን ሰርዝ" : "Cancel Reservation Inquiry"}
            </button>
          </div>
        ))
      )}
    </div>
  );
}
