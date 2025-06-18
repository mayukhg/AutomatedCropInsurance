import {
  users,
  landHoldings,
  policies,
  claims,
  payments,
  weatherData,
  chatConversations,
  notifications,
  otpVerification,
  auditLog,
  type User,
  type InsertUser,
  type LandHolding,
  type InsertLandHolding,
  type Policy,
  type InsertPolicy,
  type Claim,
  type InsertClaim,
  type Payment,
  type InsertPayment,
  type WeatherData,
  type InsertWeatherData,
  type ChatConversation,
  type InsertChatConversation,
  type Notification,
  type InsertNotification,
  type OtpVerification,
  type InsertOtpVerification,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByMobile(mobileNumber: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User>;

  // Land holding operations
  createLandHolding(landHolding: InsertLandHolding): Promise<LandHolding>;
  getLandHoldingsByFarmer(farmerId: number): Promise<LandHolding[]>;
  updateLandHolding(id: number, updates: Partial<InsertLandHolding>): Promise<LandHolding>;

  // Policy operations
  createPolicy(policy: InsertPolicy): Promise<Policy>;
  getPoliciesByFarmer(farmerId: number): Promise<Policy[]>;
  getPolicy(id: number): Promise<Policy | undefined>;
  getPolicyWithDetails(id: number): Promise<any>;

  // Claim operations
  createClaim(claim: InsertClaim): Promise<Claim>;
  getClaimsByFarmer(farmerId: number): Promise<Claim[]>;
  getClaim(id: number): Promise<Claim | undefined>;
  getClaimByNumber(claimNumber: string): Promise<Claim | undefined>;
  updateClaim(id: number, updates: Partial<Claim>): Promise<Claim>;
  getAllClaims(limit?: number): Promise<Claim[]>;

  // Payment operations
  createPayment(payment: InsertPayment): Promise<Payment>;
  getPaymentsByClaim(claimId: number): Promise<Payment[]>;
  updatePayment(id: number, updates: Partial<Payment>): Promise<Payment>;

  // Weather data operations
  createWeatherData(data: InsertWeatherData): Promise<WeatherData>;
  getWeatherData(district: string, state: string, startDate: Date, endDate: Date): Promise<WeatherData[]>;

  // Chat conversation operations
  createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation>;
  getChatConversation(id: number): Promise<ChatConversation | undefined>;
  updateChatConversation(id: number, updates: Partial<ChatConversation>): Promise<ChatConversation>;
  getChatConversationsByFarmer(farmerId: number): Promise<ChatConversation[]>;

  // Notification operations
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: number): Promise<Notification[]>;
  markNotificationAsRead(id: number): Promise<void>;

  // OTP operations
  createOtpVerification(otp: InsertOtpVerification): Promise<OtpVerification>;
  getOtpVerification(mobileNumber: string, purpose: string): Promise<OtpVerification | undefined>;
  markOtpAsUsed(id: number): Promise<void>;

  // Analytics operations
  getDashboardStats(farmerId?: number): Promise<any>;
  getInsurerStats(): Promise<any>;

  // Audit operations
  createAuditLog(log: any): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByMobile(mobileNumber: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User> {
    const [updatedUser] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return updatedUser;
  }

  // Land holding operations
  async createLandHolding(landHolding: InsertLandHolding): Promise<LandHolding> {
    const [newLandHolding] = await db.insert(landHoldings).values(landHolding).returning();
    return newLandHolding;
  }

  async getLandHoldingsByFarmer(farmerId: number): Promise<LandHolding[]> {
    return await db.select().from(landHoldings).where(eq(landHoldings.farmerId, farmerId));
  }

  async updateLandHolding(id: number, updates: Partial<InsertLandHolding>): Promise<LandHolding> {
    const [updatedLandHolding] = await db
      .update(landHoldings)
      .set(updates)
      .where(eq(landHoldings.id, id))
      .returning();
    return updatedLandHolding;
  }

  // Policy operations
  async createPolicy(policy: InsertPolicy): Promise<Policy> {
    const [newPolicy] = await db.insert(policies).values(policy).returning();
    return newPolicy;
  }

  async getPoliciesByFarmer(farmerId: number): Promise<Policy[]> {
    return await db.select().from(policies).where(eq(policies.farmerId, farmerId)).orderBy(desc(policies.createdAt));
  }

  async getPolicy(id: number): Promise<Policy | undefined> {
    const [policy] = await db.select().from(policies).where(eq(policies.id, id));
    return policy;
  }

  async getPolicyWithDetails(id: number): Promise<any> {
    const result = await db
      .select({
        policy: policies,
        farmer: users,
        landHolding: landHoldings,
      })
      .from(policies)
      .leftJoin(users, eq(policies.farmerId, users.id))
      .leftJoin(landHoldings, eq(policies.landHoldingId, landHoldings.id))
      .where(eq(policies.id, id));
    
    return result[0];
  }

  // Claim operations
  async createClaim(claim: InsertClaim): Promise<Claim> {
    const [newClaim] = await db.insert(claims).values(claim).returning();
    return newClaim;
  }

  async getClaimsByFarmer(farmerId: number): Promise<Claim[]> {
    return await db.select().from(claims).where(eq(claims.farmerId, farmerId)).orderBy(desc(claims.createdAt));
  }

  async getClaim(id: number): Promise<Claim | undefined> {
    const [claim] = await db.select().from(claims).where(eq(claims.id, id));
    return claim;
  }

  async getClaimByNumber(claimNumber: string): Promise<Claim | undefined> {
    const [claim] = await db.select().from(claims).where(eq(claims.claimNumber, claimNumber));
    return claim;
  }

  async updateClaim(id: number, updates: Partial<Claim>): Promise<Claim> {
    const [updatedClaim] = await db
      .update(claims)
      .set(updates)
      .where(eq(claims.id, id))
      .returning();
    return updatedClaim;
  }

  async getAllClaims(limit: number = 100): Promise<Claim[]> {
    return await db.select().from(claims).orderBy(desc(claims.createdAt)).limit(limit);
  }

  // Payment operations
  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [newPayment] = await db.insert(payments).values(payment).returning();
    return newPayment;
  }

  async getPaymentsByClaim(claimId: number): Promise<Payment[]> {
    return await db.select().from(payments).where(eq(payments.claimId, claimId));
  }

  async updatePayment(id: number, updates: Partial<Payment>): Promise<Payment> {
    const [updatedPayment] = await db
      .update(payments)
      .set(updates)
      .where(eq(payments.id, id))
      .returning();
    return updatedPayment;
  }

  // Weather data operations
  async createWeatherData(data: InsertWeatherData): Promise<WeatherData> {
    const [newData] = await db.insert(weatherData).values(data).returning();
    return newData;
  }

  async getWeatherData(district: string, state: string, startDate: Date, endDate: Date): Promise<WeatherData[]> {
    return await db
      .select()
      .from(weatherData)
      .where(
        and(
          eq(weatherData.district, district),
          eq(weatherData.state, state),
          gte(weatherData.date, startDate),
          lte(weatherData.date, endDate)
        )
      )
      .orderBy(weatherData.date);
  }

  // Chat conversation operations
  async createChatConversation(conversation: InsertChatConversation): Promise<ChatConversation> {
    const [newConversation] = await db.insert(chatConversations).values(conversation).returning();
    return newConversation;
  }

  async getChatConversation(id: number): Promise<ChatConversation | undefined> {
    const [conversation] = await db.select().from(chatConversations).where(eq(chatConversations.id, id));
    return conversation;
  }

  async updateChatConversation(id: number, updates: Partial<ChatConversation>): Promise<ChatConversation> {
    const [updatedConversation] = await db
      .update(chatConversations)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(chatConversations.id, id))
      .returning();
    return updatedConversation;
  }

  async getChatConversationsByFarmer(farmerId: number): Promise<ChatConversation[]> {
    return await db
      .select()
      .from(chatConversations)
      .where(eq(chatConversations.farmerId, farmerId))
      .orderBy(desc(chatConversations.createdAt));
  }

  // Notification operations
  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [newNotification] = await db.insert(notifications).values(notification).returning();
    return newNotification;
  }

  async getNotificationsByUser(userId: number): Promise<Notification[]> {
    return await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  }

  async markNotificationAsRead(id: number): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  // OTP operations
  async createOtpVerification(otp: InsertOtpVerification): Promise<OtpVerification> {
    const [newOtp] = await db.insert(otpVerification).values(otp).returning();
    return newOtp;
  }

  async getOtpVerification(mobileNumber: string, purpose: string): Promise<OtpVerification | undefined> {
    const [otp] = await db
      .select()
      .from(otpVerification)
      .where(
        and(
          eq(otpVerification.mobileNumber, mobileNumber),
          eq(otpVerification.purpose, purpose),
          eq(otpVerification.isUsed, false),
          gte(otpVerification.expiresAt, new Date())
        )
      )
      .orderBy(desc(otpVerification.createdAt));
    return otp;
  }

  async markOtpAsUsed(id: number): Promise<void> {
    await db.update(otpVerification).set({ isUsed: true }).where(eq(otpVerification.id, id));
  }

  // Analytics operations
  async getDashboardStats(farmerId?: number): Promise<any> {
    if (farmerId) {
      // Farmer dashboard stats
      const activePolicies = await db
        .select({ count: sql<number>`count(*)` })
        .from(policies)
        .where(and(eq(policies.farmerId, farmerId), eq(policies.status, "active")));

      const totalClaims = await db
        .select({ count: sql<number>`count(*)` })
        .from(claims)
        .where(eq(claims.farmerId, farmerId));

      const settledClaims = await db
        .select({ 
          count: sql<number>`count(*)`,
          totalAmount: sql<number>`sum(claim_amount)`
        })
        .from(claims)
        .where(and(eq(claims.farmerId, farmerId), eq(claims.status, "settled")));

      return {
        activePolicies: activePolicies[0]?.count || 0,
        totalClaims: totalClaims[0]?.count || 0,
        settledClaims: settledClaims[0]?.count || 0,
        totalSettlementAmount: settledClaims[0]?.totalAmount || 0,
      };
    }

    return {};
  }

  async getInsurerStats(): Promise<any> {
    const totalPolicies = await db
      .select({ count: sql<number>`count(*)` })
      .from(policies);

    const activeClaims = await db
      .select({ count: sql<number>`count(*)` })
      .from(claims)
      .where(eq(claims.status, "processing"));

    const autoApprovedClaims = await db
      .select({ count: sql<number>`count(*)` })
      .from(claims)
      .where(eq(claims.status, "approved"));

    const avgSettlementTime = await db
      .select({ avg: sql<number>`avg(settlement_time)` })
      .from(claims)
      .where(eq(claims.status, "settled"));

    const totalApprovedClaims = await db
      .select({ count: sql<number>`count(*)` })
      .from(claims)
      .where(eq(claims.status, "approved"));

    const autoApprovalRate = totalApprovedClaims[0]?.count > 0 
      ? (autoApprovedClaims[0]?.count / totalApprovedClaims[0]?.count) * 100 
      : 0;

    return {
      totalPolicies: totalPolicies[0]?.count || 0,
      activeClaims: activeClaims[0]?.count || 0,
      autoApprovalRate: Math.round(autoApprovalRate * 10) / 10,
      avgSettlementTime: Math.round((avgSettlementTime[0]?.avg || 0) * 10) / 10,
    };
  }

  // Audit operations
  async createAuditLog(log: any): Promise<void> {
    await db.insert(auditLog).values(log);
  }
}

export const storage = new DatabaseStorage();
