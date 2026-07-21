import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function ActiveMap({ lat, lng, showCircle = true, isInteractive = false, onChangeLocation, language }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markerInstance = useRef(null);
  const circleInstance = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) return;

    // Create Leaflet map instance centered on target
    const map = L.map(mapRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: isInteractive, // show zoom buttons only if interactive
      attributionControl: false // keep it clean
    });

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19
    }).addTo(map);

    // Custom terracotta home icon marker
    const homeIcon = L.divIcon({
      html: `
        <div style="background-color: #D35400; border: 2px solid white; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3);">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>`,
      className: "",
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    // Set marker
    const marker = L.marker([lat, lng], {
      icon: homeIcon,
      draggable: isInteractive
    }).addTo(map);

    // Set privacy boundary circle (100m diameter = 50m radius)
    let circle = null;
    if (showCircle) {
      circle = L.circle([lat, lng], {
        color: "#1E824C",
        fillColor: "#1E824C",
        fillOpacity: 0.12,
        radius: 50,
        dashArray: "4, 4",
        weight: 1.5
      }).addTo(map);
    }

    // References to manipulate later
    mapInstance.current = map;
    markerInstance.current = marker;
    circleInstance.current = circle;

    // Handle interactive behavior
    if (isInteractive && onChangeLocation) {
      // 1. Drag marker
      marker.on("dragend", (event) => {
        const position = event.target.getLatLng();
        onChangeLocation({ lat: position.lat, lng: position.lng });
        if (circle) {
          circle.setLatLng(position);
        }
      });

      // 2. Click on map to place marker
      map.on("click", (event) => {
        const { lat: clickLat, lng: clickLng } = event.latlng;
        marker.setLatLng([clickLat, clickLng]);
        if (circle) {
          circle.setLatLng([clickLat, clickLng]);
        }
        onChangeLocation({ lat: clickLat, lng: clickLng });
      });
    }

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, []);

  // Update map center & marker if lat/lng props change externally
  useEffect(() => {
    if (mapInstance.current && markerInstance.current) {
      const newPos = [lat, lng];
      
      // Update marker position
      markerInstance.current.setLatLng(newPos);
      
      // Update circle position if it exists
      if (circleInstance.current) {
        circleInstance.current.setLatLng(newPos);
      }
      
      // Fly to new position
      mapInstance.current.setView(newPos, mapInstance.current.getZoom());
    }
  }, [lat, lng]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Map Target Container */}
      <div 
        ref={mapRef} 
        style={{ 
          width: "100%", 
          height: "100%", 
          zIndex: 1 
        }} 
      />

      {/* Floating interactive instructions badge if interactive */}
      {isInteractive && (
        <div 
          style={{ 
            position: "absolute", 
            top: "8px", 
            left: "50%", 
            transform: "translateX(-50%)", 
            backgroundColor: "rgba(44, 37, 32, 0.95)", 
            color: "#FFF", 
            padding: "4px 10px", 
            borderRadius: "14px", 
            fontSize: "0.62rem", 
            fontWeight: "bold",
            pointerEvents: "none",
            zIndex: 10,
            textAlign: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            whiteSpace: "nowrap"
          }}
        >
          {language === "am" 
            ? "📍 ካርታውን በመንካት ወይም ምልክቱን በመጎተት ማረፊያውን ይምረጡ" 
            : "📍 Click map or drag marker to set exact stay location"}
        </div>
      )}
    </div>
  );
}
