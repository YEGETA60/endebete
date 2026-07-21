import "./loadEnv.js";
import { db } from "./helpers/db";
import { hash } from "bcryptjs";

async function main() {
  console.log("🌱 Seeding Rental Management (ethiopianstays.com) database...");

  const hostEmail = "host@ethiopianstays.com";
  let host = await db
    .selectFrom("users")
    .select(["id", "email"])
    .where("email", "=", hostEmail)
    .executeTakeFirst();

  if (!host) {
    const passwordHash = await hash("Password123!", 10);
    const [newUser] = await db
      .insertInto("users")
      .values({
        email: hostEmail,
        displayName: "Yohannes Kassa",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250",
        preferredLanguage: "am",
        role: "user",
      })
      .returning(["id", "email"])
      .execute();

    await db
      .insertInto("userPasswords")
      .values({
        userId: newUser.id,
        passwordHash,
      })
      .execute();

    host = newUser;
    console.log(`✅ Created demo host user: ${hostEmail} (Password: Password123!)`);
  } else {
    console.log(`ℹ️ Demo host user already exists: ${hostEmail}`);
  }

  const sampleProperties = [
    {
      title: "Bole Classic Boutique Hotel - Deluxe Suite",
      description: "Spacious 2-bedroom luxury condo located in the heart of Bole Atlas. Walking distance to popular cafes, restaurants, and top amenities. High-speed WiFi and generator backup.",
      location: "Addis Ababa - Bole",
      pricePerNight: 4500,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      amenities: ["WiFi", "Parking", "Kitchen", "Generator", "Security Guard", "Balcony"],
      photoUrls: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=1200",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1200"
      ],
      latitude: 8.995,
      longitude: 38.788,
      userId: host.id,
      status: "active" as const,
    },
    {
      title: "Charming Lakefront Villa in Bishoftu",
      description: "Peaceful lakeside villa overlooking Lake Babogaya. Private garden, outdoor BBQ area, stunning sunrise views, and full kitchen facilities for family weekend getaways.",
      location: "Bishoftu (Debre Zeit)",
      pricePerNight: 6200,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      amenities: ["WiFi", "Lake View", "Garden", "Kitchen", "BBQ Grill", "Parking"],
      photoUrls: [
        "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=1200"
      ],
      latitude: 8.750,
      longitude: 38.983,
      userId: host.id,
      status: "active" as const,
    }
  ];

  for (const prop of sampleProperties) {
    const existing = await db
      .selectFrom("properties")
      .select("id")
      .where("title", "=", prop.title)
      .executeTakeFirst();

    if (!existing) {
      await db.insertInto("properties").values(prop).execute();
      console.log(`🏡 Inserted property: ${prop.title}`);
    }
  }

  console.log("✨ Seeding completed successfully!");
  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
