import type { ColumnType } from "kysely";

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;

export type InquiryStatus = "pending" | "replied";

export type Json = JsonValue;
export type JsonArray = JsonValue[];
export type JsonObject = { [x: string]: JsonValue | undefined };
export type JsonPrimitive = boolean | number | string | null;
export type JsonValue = JsonArray | JsonObject | JsonPrimitive;

export type PropertyStatus = "active" | "inactive";
export type Timestamp = ColumnType<Date, Date | string, Date | string>;
export type UserRole = "admin" | "user";

export interface Inquiries {
  checkInDate: Timestamp;
  checkOutDate: Timestamp;
  createdAt: Generated<Timestamp | null>;
  guestId: number;
  id: Generated<number>;
  message: string;
  numGuests: Generated<number>;
  propertyId: number;
  status: Generated<InquiryStatus>;
  updatedAt: Generated<Timestamp | null>;
}

export interface LoginAttempts {
  attemptedAt: Generated<Timestamp | null>;
  email: string;
  id: Generated<number>;
  success: Generated<boolean | null>;
}

export interface Messages {
  createdAt: Generated<Timestamp | null>;
  id: Generated<number>;
  inquiryId: number;
  senderId: number;
  text: string;
}

export interface Properties {
  amenities: Generated<string[] | null>;
  bathrooms: Generated<number>;
  bedrooms: Generated<number>;
  createdAt: Generated<Timestamp | null>;
  description: string;
  id: Generated<number>;
  latitude: number | null;
  location: string;
  longitude: number | null;
  maxGuests: Generated<number>;
  photoUrls: Generated<string[] | null>;
  pricePerNight: number;
  status: Generated<PropertyStatus>;
  title: string;
  updatedAt: Generated<Timestamp | null>;
  userId: number;
}

export interface PropertyBlockedDates {
  createdAt: Generated<Timestamp | null>;
  endDate: Timestamp;
  id: Generated<number>;
  propertyId: number;
  reason: string | null;
  startDate: Timestamp;
}

export interface PushSubscriptions {
  createdAt: Generated<Timestamp | null>;
  id: Generated<number>;
  identity: string;
  subscription: Json;
  userId: number;
}

export interface Sessions {
  createdAt: Generated<Timestamp | null>;
  expiresAt: Timestamp;
  id: string;
  lastAccessed: Generated<Timestamp | null>;
  userId: number;
}

export interface UserPasswords {
  createdAt: Generated<Timestamp | null>;
  id: Generated<number>;
  passwordHash: string;
  userId: number;
}

export interface Users {
  avatarUrl: string | null;
  createdAt: Generated<Timestamp | null>;
  displayName: string;
  email: string;
  id: Generated<number>;
  preferredLanguage: Generated<string>;
  role: Generated<UserRole>;
  faydaStatus?: Generated<string>;
  faydaId?: string | null;
  verifiedAt?: Timestamp | null;
  updatedAt: Generated<Timestamp | null>;
}

export interface UserFavorites {
  id: Generated<number>;
  userId: number;
  propertyId: number;
  createdAt: Generated<Timestamp | null>;
}

export interface DB {
  inquiries: Inquiries;
  loginAttempts: LoginAttempts;
  messages: Messages;
  properties: Properties;
  propertyBlockedDates: PropertyBlockedDates;
  pushSubscriptions: PushSubscriptions;
  sessions: Sessions;
  userPasswords: UserPasswords;
  users: Users;
  userFavorites: UserFavorites;
}

export const UserRoleArrayValues: [UserRole, ...UserRole[]] = ["admin", "user"];
export const PropertyStatusArrayValues: [PropertyStatus, ...PropertyStatus[]] = ["active", "inactive"];
export const InquiryStatusArrayValues: [InquiryStatus, ...InquiryStatus[]] = ["pending", "replied"];
