import { mockListings } from "../data/mockListings";

// Helper to safely parse localStorage
const load = (key, defaultValue) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
};

// Helper to safely save to localStorage
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Error writing to localStorage", e);
  }
};

// Initial setup: populate listings if empty
if (!localStorage.getItem("eb_listings")) {
  save("eb_listings", mockListings);
}

// Initial setup: default host requests if empty
const defaultRequests = [
  {
    id: "req-1",
    listingTitle: "Bole Classic Boutique Hotel - Deluxe Suite",
    guestName: "Yonas Kassa",
    moveInDate: "2026-06-15",
    stayDuration: 3,
    durationTab: "nightly",
    totalETB: 13230,
    status: "pending"
  }
];
if (!localStorage.getItem("eb_booking_requests")) {
  save("eb_booking_requests", defaultRequests);
}

export const api = {
  // Authentication services
  auth: {
    getUser: () => load("eb_user", null),

    login: (phoneNumber) => {
      const user = {
        phoneNumber,
        id: "usr-" + Math.floor(Math.random() * 10000),
        faydaVerified: false,
        faydaId: ""
      };
      save("eb_user", user);

      // Async sync with server session endpoint if online
      fetch("/_api/auth/session")
        .then((res) => res.ok && res.json())
        .then((data) => {
          if (data && data.user) {
            save("eb_user", { ...user, serverUser: data.user });
          }
        })
        .catch(() => {});

      return user;
    },

    logout: () => {
      localStorage.removeItem("eb_user");
      fetch("/_api/auth/logout", { method: "POST" }).catch(() => {});
    },

    updateFayda: (faydaId, fullName) => {
      const user = load("eb_user", null);
      if (user) {
        user.faydaVerified = true;
        user.faydaId = faydaId;
        user.fullName = fullName;
        save("eb_user", user);
      }
      return user;
    },

    updatePayout: (payoutConfig) => {
      const user = load("eb_user", null);
      if (user) {
        user.payoutConfig = payoutConfig;
        save("eb_user", user);
      }
      return user;
    }
  },

  // Stays / Listings services
  listings: {
    getAll: () => {
      const all = load("eb_listings", mockListings);
      return all.map((l) => ({
        ...l,
        reviews: l.reviews || [
          {
            id: "rev-1",
            guestName: "Selamawit Kebede",
            faydaVerified: true,
            rating: 5,
            comment: {
              am: "እጅግ በጣም ንጹህ እና ምቹ ቤት ነው! የውሃ ታንከሩ እና ጄነሬተሩ አስተማማኝ ናቸው።",
              en: "Very clean and comfortable home! The backup generator and water tank were reliable."
            },
            date: "2026-05-15"
          },
          {
            id: "rev-2",
            guestName: "Daniel Abraham",
            faydaVerified: true,
            rating: 4,
            comment: {
              am: "ቦታው በጣም ይመቻል፤ አስተናጋጁም መልካም ሰው ነው። ዋይፋዩ ፈጣን ነው።",
              en: "Great location and very kind host. The fiber internet was fast."
            },
            date: "2026-05-20"
          }
        ]
      }));
    },

    create: (listingData) => {
      const currentListings = load("eb_listings", mockListings);
      const updatedListings = [listingData, ...currentListings];
      save("eb_listings", updatedListings);

      // Async sync to server API if database is active
      fetch("/_api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: listingData.title?.en || listingData.title || "New Property",
          description: listingData.description?.en || listingData.description || "Ethiopian Stay Property",
          location: listingData.subCity || "Addis Ababa",
          pricePerNight: listingData.pricing?.nightlyRate || 3500,
          bedrooms: listingData.specifications?.bedrooms || 1,
          bathrooms: listingData.specifications?.bathrooms || 1,
          maxGuests: listingData.specifications?.maxGuests || 2,
          amenities: listingData.amenities || ["WiFi", "Parking"],
          photoUrls: listingData.images || []
        })
      }).catch(() => {});

      return updatedListings;
    },

    addReview: (listingId, reviewData) => {
      const all = api.listings.getAll();
      const updated = all.map((l) => {
        if (l.id === listingId) {
          const currentReviews = l.reviews || [];
          const newReviews = [reviewData, ...currentReviews];
          const sumRatings = newReviews.reduce((sum, r) => sum + r.rating, 0);
          const newAvgRating = Math.round((sumRatings / newReviews.length) * 100) / 100;
          return {
            ...l,
            reviews: newReviews,
            rating: newAvgRating,
            reviewsCount: newReviews.length
          };
        }
        return l;
      });
      save("eb_listings", updated);
      return updated;
    }
  },

  // Bookings services
  bookings: {
    getUserBookings: () => load("eb_bookings", []),

    create: (bookingData) => {
      const currentBookings = load("eb_bookings", []);

      if (bookingData.idempotencyKey) {
        const existing = currentBookings.find((b) => b.idempotencyKey === bookingData.idempotencyKey);
        if (existing) {
          return existing;
        }
      }

      const newBooking = {
        ...bookingData,
        id: "b-" + Math.floor(Math.random() * 100000),
        status: "pending"
      };
      const updatedBookings = [newBooking, ...currentBookings];
      save("eb_bookings", updatedBookings);

      const hostRequests = load("eb_booking_requests", defaultRequests);
      const existingHostReq = bookingData.idempotencyKey && hostRequests.find((r) => r.idempotencyKey === bookingData.idempotencyKey);

      if (!existingHostReq) {
        const newRequest = {
          id: "req-" + Math.floor(Math.random() * 1000),
          idempotencyKey: bookingData.idempotencyKey,
          listingTitle: bookingData.listing.title.en,
          guestName: "Me (Verified Guest)",
          moveInDate: bookingData.moveInDate,
          stayDuration: bookingData.stayDuration,
          durationTab: bookingData.durationTab,
          totalETB: bookingData.totalETB,
          status: "pending",
          guestsCount: bookingData.guests || 2
        };
        save("eb_booking_requests", [newRequest, ...hostRequests]);
      }

      return newBooking;
    },

    cancel: (bookingId) => {
      const currentBookings = load("eb_bookings", []);
      const filtered = currentBookings.filter((b) => b.id !== bookingId);
      save("eb_bookings", filtered);
      return filtered;
    }
  },

  // Host dashboard services
  host: {
    getRequests: () => load("eb_booking_requests", defaultRequests),

    updateRequestStatus: (requestId, status) => {
      const currentRequests = load("eb_booking_requests", defaultRequests);
      const updated = currentRequests.map((req) =>
        req.id === requestId ? { ...req, status } : req
      );
      save("eb_booking_requests", updated);
      return updated;
    }
  },

  // Blocked dates services
  blockedDates: {
    getForListing: (listingId) => {
      const all = load("eb_blocked_dates", {});
      return all[listingId] || [];
    },
    saveForListing: (listingId, dates) => {
      const all = load("eb_blocked_dates", {});
      all[listingId] = dates;
      save("eb_blocked_dates", all);

      // Async sync to server API
      fetch("/_api/properties/availability/block", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: typeof listingId === "number" ? listingId : 1,
          startDate: dates[0] || new Date().toISOString(),
          endDate: dates[dates.length - 1] || new Date().toISOString()
        })
      }).catch(() => {});

      return dates;
    }
  }
};
