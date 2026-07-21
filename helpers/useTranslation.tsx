import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './useAuth';

export type Language = 'en' | 'am';

export const translations = {
  en: {
    search: "Search",
    signIn: "Sign In",
    signUp: "Sign Up",
    logOut: "Log Out",
    dashboard: "Dashboard",
    myTrips: "My Trips",
    myListings: "My Listings",
    createListing: "Create Listing",
    editListing: "Edit Listing",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    loading: "Loading...",
    noResults: "No results found.",
    viewDetails: "View Details",
    send: "Send",
    reply: "Reply",
    close: "Close",
    guests: "Guests",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    perNight: "per night",
    amenities: "Amenities",
    location: "Location",
    description: "Description",
    title: "Title",
    price: "Price",
    status: "Status",
    pending: "Pending",
    replied: "Replied",
    message: "Message",
    checkIn: "Check-In",
    checkOut: "Check-Out",
    name: "Name",
    email: "Email",
    password: "Password",
    welcome: "Welcome",
    home: "Home",
    wifi: "WiFi",
    parking: "Parking",
    kitchen: "Kitchen",
    ac: "Air Conditioning",
    tv: "TV",
    washingMachine: "Washing Machine",
    garden: "Garden",
    pool: "Pool",
    heroTitle: "Endebete",
    heroSubtitle: "Feel at home, anywhere in Ethiopia.",
    heroDescription: "From condos to traditional tukuls, boutique hotels to lakeside resorts — all in one place.",
    heroTagline: "Amharic & English · Pay in USD, and ETB — Telebirr, CBE Birr & Chapa supported",
    searchPlaceholder: "Where are you going?",
    featuredListings: "Featured Listings",
    allLocations: "All Locations",
    filterByLocation: "Filter by Location",
    numberOfGuests: "Number of Guests",
    aboutThisPlace: "About this place",
    meetYourHost: "Meet your host",
    sendInquiry: "Send Inquiry",
    inquiryMessage: "Hello, I'm interested in this property...",
    signInToInquire: "Sign in to send an inquiry",
    sentInquiries: "Sent Inquiries",
    receivedInquiries: "Received Inquiries",
    activeListings: "Active Listings",
    noListings: "You don't have any listings yet.",
    noInquiries: "No inquiries found.",
    addNewListing: "Add New Listing",
    inquiriesReceived: "Inquiries Received",
    listingTitle: "Listing Title",
    listingDescription: "Listing Description",
    selectLocation: "Select Location",
    pricePerNight: "Price per Night (ETB)",
    photoUrls: "Photos",
    addPhotoUrl: "Add Photo",
    uploadPhotos: "Upload Photos",
    dragPhotosHere: "Drag photos here or click to browse",
    coverPhoto: "Cover",
    maxPhotos: "Maximum 5 photos, max 10MB each",
    uploading: "Uploading...",
    photoUploadError: "Failed to upload photo",
    maxGuests: "Max Guests",
    availabilityStatus: "Availability Status",
    active: "Active",
    inactive: "Inactive",
    signInTitle: "Welcome Back",
    signUpTitle: "Create an Account",
    testCredentials: "",
    orSignUp: "Or sign up",
    orSignIn: "Or sign in",
    alreadyHaveAccount: "Already have an account?",
    dontHaveAccount: "Don't have an account?",
    english: "English",
    amharic: "አማርኛ",
    switchLanguage: "Switch Language",
    currency: "ETB",
    all: "All",
    guest: "Guest",
    host: "Host",
    you: "You",
    edit: "Edit",
    messages: "Messages",
    noMessages: "No messages yet.",
    viewMessages: "View Messages",
    mapView: "Map View",
    gridView: "Grid View",
    calendar: "Calendar",
    manageAvailability: "Manage Availability",
    blocked: "Blocked",
    booked: "Booked",
    blockDates: "Block Dates",
    unblockDates: "Unblock",
    blockedDates: "Blocked Dates",
    inquiryDates: "Inquiry Dates",
    confirmBlock: "Block these dates?",
    confirmUnblock: "Unblock these dates?",
    calendarHelp: "Click and drag to select dates to block. Click a blocked event to unblock it.",
    backToDashboard: "Back to Dashboard",
    locationOnMap: "Location on Map",
    sortBy: "Sort By",
    sortNewest: "Newest First",
    sortPriceLow: "Price: Low to High",
    sortPriceHigh: "Price: High to Low",
    share: "Share",
    copyLink: "Copy Link",
    linkCopied: "Link copied!",
    totalPrice: "Total Price",
    nights: "nights",
    hostProfile: "Host Profile",
    memberSince: "Member since",
    propertiesListed: "Properties Listed",
    viewAllListings: "View All Listings",
    contactHost: "Contact Host",
    welcomeHeading: "Rent a Home. Or List Yours.",
    welcomeSubheading: "Whether you're looking for a cozy retreat or listing your property — we've got you covered.",
    imARenter: "I'm a Renter",
    imAHost: "I'm a Host",
    exploreHomes: "Explore Homes",
    listYourProperty: "List Your Property",
    renterDescription: "Browse beautiful homes across Ethiopia",
    hostDescription: "Start earning from your property today",
    payNote: "Pay in USD or ETB"
  },
  am: {
    search: "ፈልግ",
    signIn: "ግባ",
    signUp: "ተመዝገቡ",
    logOut: "ይውጡ",
    dashboard: "ዳሽቦርድ",
    myTrips: "ጉዞዎቼ",
    myListings: "ማስታወቂያዎቼ",
    createListing: "አዲስ ማስታወቂያ ይፍጠሩ",
    editListing: "ማስታወቂያ ያስተካክሉ",
    save: "ያስቀምጡ",
    cancel: "ይሰርዙ",
    delete: "ያጥፉ",
    loading: "በመጫን ላይ...",
    noResults: "ውጤት አልተገኘም።",
    viewDetails: "ዝርዝሩን ይመልከቱ",
    send: "ላክ",
    reply: "መልስ",
    close: "ዝጋ",
    guests: "የእንግዳ ብዛት",
    bedrooms: "መኝታ ክፍሎች",
    bathrooms: "መታጠቢያ ክፍሎች",
    perNight: "በአዳር",
    amenities: "አገልግሎቶች",
    location: "ቦታ",
    description: "መግለጫ",
    title: "ርዕስ",
    price: "ዋጋ",
    status: "ሁኔታ",
    pending: "በመጠባበቅ ላይ",
    replied: "ተመልሷል",
    message: "መልእክት",
    checkIn: "የመግቢያ ቀን",
    checkOut: "የመውጫ ቀን",
    name: "ስም",
    email: "ኢሜል",
    password: "የይለፍ ቃል",
    welcome: "እንኳን ደህና መጡ",
    home: "ዋና ገጽ",
    wifi: "ዋይፋይ (WiFi)",
    parking: "መኪና ማቆሚያ",
    kitchen: "ወጥ ቤት",
    ac: "አየር ማቀዝቀዣ",
    tv: "ቲቪ",
    washingMachine: "የልብስ ማጠቢያ ማሽን",
    garden: "ጓሮ",
    pool: "መዋኛ ገንዳ",
    heroTitle: "እንደቤቴ",
    heroSubtitle: "ቤት ለእንግዳ !",
    heroDescription: "ከኮንዶሚኒየም እስከ ባህላዊ ጎጆ፣ ከቡቲክ ሆቴል እስከ ሐይቅ ዳር ሪዞርት — ሁሉም በአንድ ቦታ።",
    heroTagline: "በአማርኛ እና በእንግሊዝኛ · በብር ይክፈሉ",
    searchPlaceholder: "የት መሄድ ይፈልጋሉ?",
    featuredListings: "ተለይተው የቀረቡ ቤቶች ዝርዝር",
    allLocations: "ሁሉም አካባቢዎች",
    filterByLocation: "በአካባቢ ያጣሩ",
    numberOfGuests: "የእንግዶች ቁጥር",
    aboutThisPlace: "ስለ ቤቱ",
    meetYourHost: "አስተናጋጅዎን ይወቁ",
    sendInquiry: "ጥያቄ ይላኩ",
    inquiryMessage: "ሰላም፣ ስለዚህ ቤት መጠየቅ እፈልጋለሁ...",
    signInToInquire: "ጥያቄ ለመላክ እባክዎ ይግቡ",
    sentInquiries: "የላኩት ጥያቄዎች",
    receivedInquiries: "የደረሱዎት ጥያቄዎች",
    activeListings: "ገቢር ማስታወቂያዎች",
    noListings: "እስካሁን ምንም ማስታወቂያ አላስገቡም።",
    noInquiries: "ምንም ጥያቄ አልተገኘም።",
    addNewListing: "አዲስ ማስታወቂያ ያክሉ",
    inquiriesReceived: "የደረሱ ጥያቄዎች",
    listingTitle: "የማስታወቂያ ርዕስ",
    listingDescription: "የማስታወቂያ ዝርዝር",
    selectLocation: "አካባቢ ይምረጡ",
    pricePerNight: "የአንድ ሌሊት ዋጋ (ብር)",
    photoUrls: "ፎቶዎች",
    addPhotoUrl: "ፎቶ ያክሉ",
    uploadPhotos: "ፎቶዎችን ያስቀምጡ",
    dragPhotosHere: "ፎቶዎችን እዚህ ይጎትቱ ወይም ለመምረጥ ይጫኑ",
    coverPhoto: "ሽፋን",
    maxPhotos: "ከፍተኛ 5 ፎቶዎች፣ እያንዳንዱ ከ10MB አይበልጥ",
    uploading: "በመስቀል ላይ...",
    photoUploadError: "ፎቶ መስቀል አልተሳካም",
    maxGuests: "ከፍተኛ የእንግዶች ቁጥር",
    availabilityStatus: "የመገኘት ሁኔታ",
    active: "ገቢር",
    inactive: "ቦዝኗል",
    signInTitle: "እንኳን ደህና መጡ",
    signUpTitle: "አዲስ መለያ ይፍጠሩ",
    testCredentials: "",
    orSignUp: "ወይም ተመዝገቡ",
    orSignIn: "ወይም ይግቡ",
    alreadyHaveAccount: "መለያ አለዎት?",
    dontHaveAccount: "መለያ የለዎትም?",
    english: "English",
    amharic: "አማርኛ",
    switchLanguage: "ቋንቋ ይቀይሩ",
    currency: "ብር",
    all: "ሁሉም",
    guest: "እንግዳ",
    host: "አስተናጋጅ",
    you: "እርስዎ",
    edit: "ያስተካክሉ",
    messages: "መልዕክቶች",
    noMessages: "እስካሁን ምንም መልዕክት የለም።",
    viewMessages: "መልዕክቶችን ይመልከቱ",
    mapView: "የካርታ እይታ",
    gridView: "የዝርዝር እይታ",
    calendar: "የቀን መቁጠሪያ",
    manageAvailability: "የመገኘት ሁኔታ ያስተዳድሩ",
    blocked: "ታግዷል",
    booked: "ተይዟል",
    blockDates: "ቀናት ያግዱ",
    unblockDates: "ይክፈቱ",
    blockedDates: "የታገዱ ቀናት",
    inquiryDates: "የጥያቄ ቀናት",
    confirmBlock: "እነዚህን ቀናት ያግዱ?",
    confirmUnblock: "እነዚህን ቀናት ይክፈቱ?",
    calendarHelp: "ቀናትን ለማገድ ጠቅ አድርገው ይጎትቱ። የታገደ ቀን ለመክፈት ጠቅ ያድርጉ።",
    backToDashboard: "ወደ ዳሽቦርድ ተመለስ",
    locationOnMap: "በካርታ ላይ ያለ ቦታ",
    sortBy: "በ... ደርድር",
    sortNewest: "አዲስ ቀደም",
    sortPriceLow: "ዋጋ: ዝቅ ወደ ከፍ",
    sortPriceHigh: "ዋጋ: ከፍ ወደ ዝቅ",
    share: "ያጋሩ",
    copyLink: "ሊንክ ይቅዱ",
    linkCopied: "ሊንክ ተቀድቷል!",
    totalPrice: "ጠቅላላ ዋጋ",
    nights: "ሌሊቶች",
    hostProfile: "የአስተናጋጅ ገጽ",
    memberSince: "አባል ከ",
    propertiesListed: "የተመዘገቡ ቤቶች",
    viewAllListings: "ሁሉንም ማስታወቂያዎች ይመልከቱ",
    contactHost: "አስተናጋጁን ያግኙ",
    welcomeHeading: "ቤት ይከራዩ- ወይም ቤትዎን ያከራዩ።",
    welcomeSubheading: "ምቹ ቤት ይፈልጉም ወይም ቤትዎን ያከራዩ — እኛ አለን።",
    imARenter: "ተከራይ ነኝ",
    imAHost: "አስተናጋጅ ነኝ",
    exploreHomes: "ቤቶችን ያስሱ",
    listYourProperty: "ቤትዎን ያስተዋውቁ",
    renterDescription: "በመላው ኢትዮጵያ ያሉ ቆንጆ ቤቶችን ይመልከቱ",
    hostDescription: "ዛሬ ከቤትዎ ገቢ ማግኘት ይጀምሩ",
    payNote: "በዶላር ወይም በብር ይክፈሉ"
  }
};

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const { authState } = useAuth();
  
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('preferredLanguage') as Language) || 'en';
    }
    return 'en';
  });

  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (authState.type === 'authenticated' && authState.user.preferredLanguage) {
       const userLang = authState.user.preferredLanguage as Language;
       if (userLang === 'en' || userLang === 'am') {
         setLanguageState(userLang);
         localStorage.setItem('preferredLanguage', userLang);
       }
    }
    setIsInitialized(true);
  }, [authState]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', lang);
    }
  };

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key] || key;
  };

  if (!isInitialized) return null;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useTranslation must be used within LanguageProvider');
  return context;
};

export const formatBirr = (amount: number) => {
  return `ETB ${amount.toLocaleString()}`;
};