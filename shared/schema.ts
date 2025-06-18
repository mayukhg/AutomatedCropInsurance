import { pgTable, text, serial, integer, boolean, timestamp, decimal, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table for farmers and insurers
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fullName: text("full_name").notNull(),
  mobileNumber: text("mobile_number").notNull().unique(),
  aadhaarNumber: text("aadhaar_number"),
  email: text("email"),
  userType: text("user_type").notNull().default("farmer"), // farmer, insurer, admin
  state: text("state"),
  district: text("district"),
  isVerified: boolean("is_verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Land holdings for farmers
export const landHoldings = pgTable("land_holdings", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => users.id).notNull(),
  area: decimal("area", { precision: 10, scale: 2 }).notNull(), // in hectares
  coordinates: jsonb("coordinates"), // GPS coordinates
  surveyNumber: text("survey_number"),
  isVerified: boolean("is_verified").default(false),
  blockchainHash: text("blockchain_hash"), // Mock blockchain verification
  createdAt: timestamp("created_at").defaultNow(),
});

// Insurance policies
export const policies = pgTable("policies", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => users.id).notNull(),
  landHoldingId: integer("land_holding_id").references(() => landHoldings.id).notNull(),
  policyType: text("policy_type").notNull(), // basic, premium, comprehensive
  coverageAmount: decimal("coverage_amount", { precision: 12, scale: 2 }).notNull(),
  premiumAmount: decimal("premium_amount", { precision: 10, scale: 2 }).notNull(),
  rainfallThreshold: integer("rainfall_threshold").notNull(), // in mm
  season: text("season").notNull(), // kharif, rabi
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  status: text("status").notNull().default("active"), // active, expired, cancelled
  createdAt: timestamp("created_at").defaultNow(),
});

// Claims filed by farmers
export const claims = pgTable("claims", {
  id: serial("id").primaryKey(),
  claimNumber: text("claim_number").notNull().unique(),
  farmerId: integer("farmer_id").references(() => users.id).notNull(),
  policyId: integer("policy_id").references(() => policies.id).notNull(),
  claimAmount: decimal("claim_amount", { precision: 12, scale: 2 }).notNull(),
  actualRainfall: integer("actual_rainfall"), // in mm
  status: text("status").notNull().default("submitted"), // submitted, processing, approved, rejected, settled
  reasonCode: text("reason_code"), // insufficient_rainfall, land_not_verified, etc.
  aiDecision: jsonb("ai_decision"), // AI reasoning and verification details
  settlementTime: integer("settlement_time"), // in hours
  createdAt: timestamp("created_at").defaultNow(),
  processedAt: timestamp("processed_at"),
  settledAt: timestamp("settled_at"),
});

// Payment transactions
export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  claimId: integer("claim_id").references(() => claims.id).notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  bankAccount: text("bank_account"), // masked account number
  ifscCode: text("ifsc_code"),
  transactionId: text("transaction_id"),
  status: text("status").notNull().default("initiated"), // initiated, processing, completed, failed
  paymentMethod: text("payment_method").default("bank_transfer"),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Weather data for claim verification
export const weatherData = pgTable("weather_data", {
  id: serial("id").primaryKey(),
  district: text("district").notNull(),
  state: text("state").notNull(),
  date: timestamp("date").notNull(),
  rainfall: integer("rainfall").notNull(), // in mm
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  humidity: integer("humidity"),
  source: text("source").notNull().default("IMD"), // weather data source
  isVerified: boolean("is_verified").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Chat conversations for AI claim filing
export const chatConversations = pgTable("chat_conversations", {
  id: serial("id").primaryKey(),
  farmerId: integer("farmer_id").references(() => users.id).notNull(),
  claimId: integer("claim_id").references(() => claims.id),
  language: text("language").notNull().default("en"), // en, hi, mr
  messages: jsonb("messages").notNull().default([]), // array of message objects
  status: text("status").notNull().default("active"), // active, completed, abandoned
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Audit trail for all operations
export const auditLog = pgTable("audit_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(), // claim, policy, payment, etc.
  entityId: integer("entity_id").notNull(),
  changes: jsonb("changes"), // before/after data
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(), // info, success, warning, error
  isRead: boolean("is_read").default(false),
  metadata: jsonb("metadata"), // additional data like claim_id, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

// OTP verification
export const otpVerification = pgTable("otp_verification", {
  id: serial("id").primaryKey(),
  mobileNumber: text("mobile_number").notNull(),
  otp: text("otp").notNull(),
  purpose: text("purpose").notNull(), // registration, login, claim_verification
  isUsed: boolean("is_used").default(false),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  landHoldings: many(landHoldings),
  policies: many(policies),
  claims: many(claims),
  chatConversations: many(chatConversations),
  notifications: many(notifications),
}));

export const landHoldingsRelations = relations(landHoldings, ({ one, many }) => ({
  farmer: one(users, {
    fields: [landHoldings.farmerId],
    references: [users.id],
  }),
  policies: many(policies),
}));

export const policiesRelations = relations(policies, ({ one, many }) => ({
  farmer: one(users, {
    fields: [policies.farmerId],
    references: [users.id],
  }),
  landHolding: one(landHoldings, {
    fields: [policies.landHoldingId],
    references: [landHoldings.id],
  }),
  claims: many(claims),
}));

export const claimsRelations = relations(claims, ({ one, many }) => ({
  farmer: one(users, {
    fields: [claims.farmerId],
    references: [users.id],
  }),
  policy: one(policies, {
    fields: [claims.policyId],
    references: [policies.id],
  }),
  payments: many(payments),
  chatConversations: many(chatConversations),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  claim: one(claims, {
    fields: [payments.claimId],
    references: [claims.id],
  }),
}));

export const chatConversationsRelations = relations(chatConversations, ({ one }) => ({
  farmer: one(users, {
    fields: [chatConversations.farmerId],
    references: [users.id],
  }),
  claim: one(claims, {
    fields: [chatConversations.claimId],
    references: [claims.id],
  }),
}));

// Zod schemas for validation
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLandHoldingSchema = createInsertSchema(landHoldings).omit({
  id: true,
  createdAt: true,
});

export const insertPolicySchema = createInsertSchema(policies).omit({
  id: true,
  createdAt: true,
});

export const insertClaimSchema = createInsertSchema(claims).omit({
  id: true,
  createdAt: true,
  processedAt: true,
  settledAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertWeatherDataSchema = createInsertSchema(weatherData).omit({
  id: true,
  createdAt: true,
});

export const insertChatConversationSchema = createInsertSchema(chatConversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertOtpVerificationSchema = createInsertSchema(otpVerification).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type LandHolding = typeof landHoldings.$inferSelect;
export type InsertLandHolding = z.infer<typeof insertLandHoldingSchema>;
export type Policy = typeof policies.$inferSelect;
export type InsertPolicy = z.infer<typeof insertPolicySchema>;
export type Claim = typeof claims.$inferSelect;
export type InsertClaim = z.infer<typeof insertClaimSchema>;
export type Payment = typeof payments.$inferSelect;
export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type WeatherData = typeof weatherData.$inferSelect;
export type InsertWeatherData = z.infer<typeof insertWeatherDataSchema>;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type InsertChatConversation = z.infer<typeof insertChatConversationSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type OtpVerification = typeof otpVerification.$inferSelect;
export type InsertOtpVerification = z.infer<typeof insertOtpVerificationSchema>;
