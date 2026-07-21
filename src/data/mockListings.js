export const mockListings = [
  {
    id: "l1",
    title: {
      am: "ቦሌ ክላሲክ ቡቲክ ሆቴል - የላቀ ክፍል",
      en: "Bole Classic Boutique Hotel - Deluxe Suite"
    },
    type: "hotel",
    subCity: {
      am: "ቦሌ",
      en: "Bole"
    },
    landmark: {
      am: "ኤድና ሞል ጀርባ፣ ከቦሌ መድኃኔዓለም 50 ሜትር",
      en: "Behind Edna Mall, 50m from Bole Medhanialem Church"
    },
    duration: "nightly",
    priceETB: 4200, // per night
    rating: 4.85,
    reviewsCount: 124,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "AC", "Gym", "Breakfast Included", "Bar", "Parking", "Elevator", "Dedicated Workspace"],
    houseRules: {
      checkIn: "3:00 PM - 10:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: true,
      petsAllowed: false,
      smokingAllowed: false,
      quietHours: "10:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Flexible",
      am: "ነፃ ስረዛ፦ ከመግቢያው ቀን 48 ሰዓት በፊት ሙሉ ተመላሽ ክፍያ ያግኙ።",
      en: "Free cancellation: Cancel up to 48 hours before check-in for a full refund."
    },
    ratingsBreakdown: {
      cleanliness: 4.9,
      accuracy: 4.8,
      communication: 5.0,
      location: 4.95,
      checkIn: 4.9,
      value: 4.8
    },
    backups: {
      electricity: { available: true, type: "Automatic Generator" },
      water: { available: true, type: "10,000L Reserve Tank" },
      wifi: { available: true, type: "Dedicated Fiber" }
    },
    host: {
      name: "Elias Teklay",
      verifiedFayda: true,
      faydaId: "ET-9823-8823-1123",
      rating: 4.9,
      responseRate: "99%",
      responseTime: "within an hour"
    },
    description: {
      am: "በቦሌ እምብርት ላይ የሚገኝ ዘመናዊ እና ምቹ የሆቴል ክፍል፤ አስተማማኝ የኤሌክትሪክ ጄነሬተር እና የውሃ ታንከር ያለው። ለዲያስፖራዎች እና ለቱሪስቶች ተመራጭ።",
      en: "Modern and comfortable hotel suite in the heart of Bole. Features reliable backup generator and large water reserve tank. Highly recommended for diaspora and tourists."
    }
  },
  {
    id: "l2",
    title: {
      am: "ሳር ቤት ምቹ የእንግዳ ማረፊያ (ግልጽ ግቢ)",
      en: "Sarbet Cozy Guest House (Private Compound)"
    },
    type: "guesthouse",
    subCity: {
      am: "ቂርቆስ / ሳር ቤት",
      en: "Kirkos / Sarbet"
    },
    landmark: {
      am: "ካናዳ ኤምባሲ አጠገብ፣ ከዋናው መንገድ ዝቅ ብሎ",
      en: "Near Canadian Embassy, just off the main road"
    },
    duration: "monthly",
    priceETB: 65000, // per month
    rating: 4.65,
    reviewsCount: 38,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600573472550-8090b5e0745e?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "Kitchen", "Washing Machine", "Garden", "Security Guard", "Pet Friendly", "Dedicated Workspace"],
    houseRules: {
      checkIn: "2:00 PM - 9:00 PM",
      checkOut: "12:00 PM",
      selfCheckIn: true,
      petsAllowed: true,
      smokingAllowed: false,
      quietHours: "10:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Moderate",
      am: "ከመግቢያው 5 ቀን በፊት ከተሰረዘ 50% ተመላሽ ይደረጋል።",
      en: "50% refund if cancelled up to 5 days before check-in."
    },
    ratingsBreakdown: {
      cleanliness: 4.7,
      accuracy: 4.6,
      communication: 4.8,
      location: 4.8,
      checkIn: 4.7,
      value: 4.6
    },
    backups: {
      electricity: { available: true, type: "Solar Battery Backup" },
      water: { available: true, type: "5,000L Reserve Tank" },
      wifi: { available: true, type: "4G Router + UPS" }
    },
    host: {
      name: "Fikirte Abreha",
      verifiedFayda: true,
      faydaId: "ET-1102-8834-9988",
      rating: 4.7,
      responseRate: "97%",
      responseTime: "within a few hours"
    },
    description: {
      am: "ሳርቤት አካባቢ ጸጥተኛ ግቢ ውስጥ የሚገኝ ሙሉ የእንግዳ ማረፊያ። የራሱ የአትክልት ስፍራ እና ለ2 መኪና የሚሆን ማቆሚያ አለው። ረዘም ላለ ጊዜ ለሚቀመጡ ተመራጭ ነው።",
      en: "Entire cozy guest house in a quiet compound in Sarbet. Features a private garden and parking for 2 cars. Perfect for medium-to-long term stays."
    }
  },
  {
    id: "l3",
    title: {
      am: "ካዛንቺስ ዘመናዊ ስቱዲዮ አፓርታማ",
      en: "Kazanchis Modern Studio Apartment"
    },
    type: "apartment",
    subCity: {
      am: "ካዛንቺስ",
      en: "Kazanchis"
    },
    landmark: {
      am: "ኢንተርኮንትኔንታል ሆቴል አጠገብ፣ የተባበሩት መንግስታት (UN) ቅርብ",
      en: "Next to Intercontinental Hotel, walking distance to UN ECA"
    },
    duration: "both",
    priceETB: 3500,
    priceETB_monthly: 85000,
    rating: 4.92,
    reviewsCount: 72,
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "Elevator", "Kitchen", "Gym Access", "24/7 Security", "Balcony", "Dedicated Workspace", "Washer"],
    houseRules: {
      checkIn: "3:00 PM - 11:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: true,
      petsAllowed: false,
      smokingAllowed: false,
      quietHours: "10:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Flexible",
      am: "ነፃ ስረዛ፦ ከመግቢያው ቀን 48 ሰዓት በፊት ሙሉ ተመላሽ ክፍያ ያግኙ።",
      en: "Free cancellation: Cancel up to 48 hours before check-in for a full refund."
    },
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 4.9,
      communication: 4.95,
      location: 4.95,
      checkIn: 4.9,
      value: 4.85
    },
    backups: {
      electricity: { available: true, type: "Building Generator" },
      water: { available: true, type: "Central Reserve Water" },
      wifi: { available: true, type: "Fiber Broadband" }
    },
    host: {
      name: "Tewodros Assefa",
      verifiedFayda: true,
      faydaId: "ET-4432-8877-2234",
      rating: 4.85,
      responseRate: "100%",
      responseTime: "within an hour"
    },
    description: {
      am: "ካዛንቺስ በሚገኝ ዘመናዊ አፓርታማ ውስጥ 10ኛ ፎቅ ላይ ያለ ስቱዲዮ። ምርጥ የአዲስ አበባን እይታ የሚያሳይ በረንዳ አለው። የ24 ሰዓት ጥበቃ እና ጄነሬተር ይገኛል።",
      en: "10th floor studio apartment in a modern building in Kazanchis. Stunning city views of Addis Ababa from the balcony. Includes 24/7 security and generator."
    }
  },
  {
    id: "l4",
    title: {
      am: "ለቡ ቆንጆ ነጠላ ክፍል (በቤተሰብ ቤት ውስጥ)",
      en: "Lebu Nice Single Room (In Family Home)"
    },
    type: "room",
    subCity: {
      am: "ለቡ",
      en: "Lebu"
    },
    landmark: {
      am: "ለቡ መብራት ኃይል፣ ከቫርኔሮ ካፌ በስተጀርባ",
      en: "Lebu Mebrat Hail, behind Varnero Cafe"
    },
    duration: "monthly",
    priceETB: 12000,
    rating: 4.55,
    reviewsCount: 16,
    image: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1540518614846-7ede433c517a?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "Shared Kitchen", "Hot Water", "Shared Living Area"],
    houseRules: {
      checkIn: "2:00 PM - 8:00 PM",
      checkOut: "10:00 AM",
      selfCheckIn: false,
      petsAllowed: false,
      smokingAllowed: false,
      quietHours: "9:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Strict",
      am: "ከመግቢያው 14 ቀን በፊት ከተሰረዘ 50% ተመላሽ ያግኙ።",
      en: "Cancel up to 14 days before check-in for a 50% refund."
    },
    ratingsBreakdown: {
      cleanliness: 4.6,
      accuracy: 4.5,
      communication: 4.7,
      location: 4.5,
      checkIn: 4.6,
      value: 4.7
    },
    backups: {
      electricity: { available: false, type: "No Generator" },
      water: { available: true, type: "2,000L Shared Tank" },
      wifi: { available: true, type: "4G Mobile Router" }
    },
    host: {
      name: "Konjit Zewdu",
      verifiedFayda: true,
      faydaId: "ET-7711-4455-8899",
      rating: 4.6,
      responseRate: "95%",
      responseTime: "within a few hours"
    },
    description: {
      am: "ለቡ አካባቢ ምቹ በሆነ የቤተሰብ መኖሪያ ቤት ውስጥ የሚገኝ ነጠላ ክፍል፤ ለተማሪዎች ወይም ሥራ ለጀመሩ ወጣቶች ተስማሚ እና ርካሽ ዋጋ ያለው።",
      en: "Budget-friendly single bedroom in a warm family home in Lebu. Highly suitable for students or young professionals looking for an affordable room."
    }
  },
  {
    id: "l5",
    title: {
      am: "ቦሌ አትላስ የቅንጦት ባለ 3 መኝታ ቤት ቪላ",
      en: "Bole Atlas Luxury 3-Bedroom Villa"
    },
    type: "home",
    subCity: {
      am: "ቦሌ አትላስ",
      en: "Bole Atlas"
    },
    landmark: {
      am: "አትላስ ሆቴል ጀርባ፣ ከቦሌ ሩዋንዳ መንገድ አቅራቢያ",
      en: "Behind Atlas Hotel, close to Bole Rwanda road"
    },
    duration: "both",
    priceETB: 9500,
    priceETB_monthly: 220000,
    rating: 4.98,
    reviewsCount: 45,
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "Kitchen", "Washing Machine", "Garden", "Garage Parking", "Security Guard", "Office Space", "Dedicated Workspace"],
    houseRules: {
      checkIn: "3:00 PM - 10:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: true,
      petsAllowed: true,
      smokingAllowed: false,
      quietHours: "10:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Flexible",
      am: "ነፃ ስረዛ፦ ከመግቢያው ቀን 48 ሰዓት በፊት ሙሉ ተመላሽ ክፍያ ያግኙ።",
      en: "Free cancellation: Cancel up to 48 hours before check-in for a full refund."
    },
    ratingsBreakdown: {
      cleanliness: 5.0,
      accuracy: 5.0,
      communication: 5.0,
      location: 4.95,
      checkIn: 5.0,
      value: 4.9
    },
    backups: {
      electricity: { available: true, type: "Automatic Generator + Solar" },
      water: { available: true, type: "15,000L Tank + Water Well" },
      wifi: { available: true, type: "High-speed Fiber Broadband" }
    },
    host: {
      name: "Henok Mulugheta",
      verifiedFayda: true,
      faydaId: "ET-5599-2233-1100",
      rating: 5.0,
      responseRate: "100%",
      responseTime: "within minutes"
    },
    description: {
      am: "ቦሌ አትላስ መካነ ሰላም አካባቢ የሚገኝ ባለ 3 መኝታ ቪላ። እጅግ ዘመናዊ ዕቃዎች፣ ሰፊ ግቢ፣ የ24 ሰዓት ጥበቃ፣ አስተማማኝ የውሃ ጉድጓድ እና የጄነሬተር አገልግሎት አለው።",
      en: "Fully furnished 3-bedroom villa in the prime Bole Atlas area. Features high-end furniture, spacious compound, 24/7 security guard, private water well, and large generator."
    }
  },
  {
    id: "l6",
    title: {
      am: "አሮጌ አየር ማረፊያ (ኦልድ ኤርፖርት) ምቹ ስቱዲዮ",
      en: "Old Airport Cozy Shared Guest Unit"
    },
    type: "guesthouse",
    subCity: {
      am: "አሮጌ አየር ማረፊያ",
      en: "Old Airport"
    },
    landmark: {
      am: "ከፈረንሳይ ትምህርት ቤት (Lycée) አቅራቢያ",
      en: "Near the French School (Lycée Guebre-Mariam)"
    },
    duration: "monthly",
    priceETB: 45000,
    rating: 4.78,
    reviewsCount: 22,
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"
    ],
    amenities: ["WiFi", "Kitchenette", "Hot Water", "Shared Compound", "Parking"],
    houseRules: {
      checkIn: "2:00 PM - 9:00 PM",
      checkOut: "11:00 AM",
      selfCheckIn: true,
      petsAllowed: false,
      smokingAllowed: false,
      quietHours: "10:00 PM - 7:00 AM"
    },
    cancellationPolicy: {
      type: "Moderate",
      am: "ከመግቢያው 5 ቀን በፊት ከተሰረዘ 50% ተመላሽ ያግኙ።",
      en: "50% refund if cancelled up to 5 days before check-in."
    },
    ratingsBreakdown: {
      cleanliness: 4.8,
      accuracy: 4.7,
      communication: 4.85,
      location: 4.8,
      checkIn: 4.75,
      value: 4.7
    },
    backups: {
      electricity: { available: true, type: "Inverter Battery Backup" },
      water: { available: true, type: "5,000L Reserve Tank" },
      wifi: { available: true, type: "Fiber Broadband + UPS" }
    },
    host: {
      name: "Tizita Hailu",
      verifiedFayda: true,
      faydaId: "ET-8833-2211-5544",
      rating: 4.8,
      responseRate: "98%",
      responseTime: "within an hour"
    },
    description: {
      am: "ኦልድ ኤርፖርት ሰፈር ውስጥ የሚገኝ ጸጥተኛ የእንግዳ ማረፊያ ስቱዲዮ፤ የራሱ ማብሰያ ክፍለ-ጊዜ እና የኤሌክትሪክ ኢንቨርተር ያለው።",
      en: "Quiet, self-contained guest studio in Old Airport. Equipped with its own kitchenette and an electrical inverter backup for power cuts."
    }
  }
];
