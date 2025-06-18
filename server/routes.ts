import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { 
  insertUserSchema, 
  insertLandHoldingSchema, 
  insertPolicySchema, 
  insertClaimSchema,
  insertOtpVerificationSchema 
} from "@shared/schema";
import { weatherService } from "./services/weatherService";
import { blockchainService } from "./services/blockchainService";
import { aiService } from "./services/aiService";
import { paymentService } from "./services/paymentService";
import { notificationService } from "./services/notificationService";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication endpoints
  app.post("/api/auth/send-otp", async (req, res) => {
    try {
      const { mobileNumber, purpose = "registration" } = req.body;
      
      if (!mobileNumber) {
        return res.status(400).json({ message: "Mobile number is required" });
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      await storage.createOtpVerification({
        mobileNumber,
        otp,
        purpose,
        expiresAt,
      });

      // In production, send actual SMS
      console.log(`OTP for ${mobileNumber}: ${otp}`);

      res.json({ 
        message: "OTP sent successfully",
        // For demo purposes, return OTP (remove in production)
        otp: process.env.NODE_ENV === "development" ? otp : undefined
      });
    } catch (error) {
      console.error("Send OTP error:", error);
      res.status(500).json({ message: "Failed to send OTP" });
    }
  });

  app.post("/api/auth/verify-otp", async (req, res) => {
    try {
      const { mobileNumber, otp, purpose = "registration" } = req.body;
      
      const otpRecord = await storage.getOtpVerification(mobileNumber, purpose);
      
      if (!otpRecord || otpRecord.otp !== otp) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      await storage.markOtpAsUsed(otpRecord.id);
      
      res.json({ message: "OTP verified successfully" });
    } catch (error) {
      console.error("Verify OTP error:", error);
      res.status(500).json({ message: "Failed to verify OTP" });
    }
  });

  // User registration and profile
  app.post("/api/users/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByMobile(userData.mobileNumber);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists with this mobile number" });
      }

      const user = await storage.createUser({
        ...userData,
        isVerified: true, // Since OTP was verified
      });

      res.status(201).json(user);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Failed to register user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ message: "Failed to get user" });
    }
  });

  app.post("/api/users/login", async (req, res) => {
    try {
      const { mobileNumber } = req.body;
      
      const user = await storage.getUserByMobile(mobileNumber);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Failed to login" });
    }
  });

  // Land holdings
  app.post("/api/land-holdings", async (req, res) => {
    try {
      const landHoldingData = insertLandHoldingSchema.parse(req.body);
      
      // Mock blockchain verification
      const blockchainHash = await blockchainService.verifyLandOwnership(
        landHoldingData.farmerId,
        landHoldingData.surveyNumber ?? undefined
      );

      const landHolding = await storage.createLandHolding({
        ...landHoldingData,
        isVerified: !!blockchainHash,
        blockchainHash,
      });

      res.status(201).json(landHolding);
    } catch (error) {
      console.error("Create land holding error:", error);
      res.status(500).json({ message: "Failed to create land holding" });
    }
  });

  app.get("/api/land-holdings/farmer/:farmerId", async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const landHoldings = await storage.getLandHoldingsByFarmer(farmerId);
      res.json(landHoldings);
    } catch (error) {
      console.error("Get land holdings error:", error);
      res.status(500).json({ message: "Failed to get land holdings" });
    }
  });

  // Policies
  app.post("/api/policies", async (req, res) => {
    try {
      const policyData = insertPolicySchema.parse(req.body);
      const policy = await storage.createPolicy(policyData);
      res.status(201).json(policy);
    } catch (error) {
      console.error("Create policy error:", error);
      res.status(500).json({ message: "Failed to create policy" });
    }
  });

  app.get("/api/policies/farmer/:farmerId", async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const policies = await storage.getPoliciesByFarmer(farmerId);
      res.json(policies);
    } catch (error) {
      console.error("Get policies error:", error);
      res.status(500).json({ message: "Failed to get policies" });
    }
  });

  // Policy types and pricing
  app.get("/api/policy-types", async (req, res) => {
    try {
      const policyTypes = [
        {
          id: "basic",
          name: "Basic Protection",
          premiumPerHectare: 2500,
          coveragePerHectare: 25000,
          rainfallThreshold: 100,
          settlementTime: 24,
          features: [
            "Coverage up to ₹25,000/hectare",
            "Rainfall threshold: <100mm",
            "AI-powered instant claims",
            "24-hour settlement"
          ]
        },
        {
          id: "premium",
          name: "Premium Protection",
          premiumPerHectare: 4000,
          coveragePerHectare: 50000,
          rainfallThreshold: 120,
          settlementTime: 12,
          features: [
            "Coverage up to ₹50,000/hectare",
            "Rainfall threshold: <120mm",
            "Priority AI support",
            "12-hour settlement",
            "SMS + App notifications"
          ],
          recommended: true
        },
        {
          id: "comprehensive",
          name: "Comprehensive",
          premiumPerHectare: 6500,
          coveragePerHectare: 75000,
          rainfallThreshold: 150,
          settlementTime: 6,
          features: [
            "Coverage up to ₹75,000/hectare",
            "Rainfall threshold: <150mm",
            "Dedicated support agent",
            "6-hour settlement",
            "Multiple contact methods"
          ]
        }
      ];

      res.json(policyTypes);
    } catch (error) {
      console.error("Get policy types error:", error);
      res.status(500).json({ message: "Failed to get policy types" });
    }
  });

  // Claims
  app.post("/api/claims", async (req, res) => {
    try {
      const claimData = insertClaimSchema.parse(req.body);
      
      // Generate unique claim number
      const claimNumber = `CR-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;
      
      const claim = await storage.createClaim({
        ...claimData,
        claimNumber,
        status: "submitted",
      });

      // Start automated claim processing
      processClaimAsync(claim.id);

      res.status(201).json(claim);
    } catch (error) {
      console.error("Create claim error:", error);
      res.status(500).json({ message: "Failed to create claim" });
    }
  });

  app.get("/api/claims/farmer/:farmerId", async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const claims = await storage.getClaimsByFarmer(farmerId);
      res.json(claims);
    } catch (error) {
      console.error("Get claims error:", error);
      res.status(500).json({ message: "Failed to get claims" });
    }
  });

  app.get("/api/claims/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const claim = await storage.getClaim(id);
      
      if (!claim) {
        return res.status(404).json({ message: "Claim not found" });
      }

      res.json(claim);
    } catch (error) {
      console.error("Get claim error:", error);
      res.status(500).json({ message: "Failed to get claim" });
    }
  });

  // AI Chat for claims
  app.post("/api/chat/conversations", async (req, res) => {
    try {
      const { farmerId, language = "en" } = req.body;
      
      const conversation = await storage.createChatConversation({
        farmerId,
        language,
        messages: [],
      });

      res.status(201).json(conversation);
    } catch (error) {
      console.error("Create conversation error:", error);
      res.status(500).json({ message: "Failed to create conversation" });
    }
  });

  app.post("/api/chat/conversations/:id/messages", async (req, res) => {
    try {
      const conversationId = parseInt(req.params.id);
      const { message, sender = "user" } = req.body;
      
      const conversation = await storage.getChatConversation(conversationId);
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      const messages = [...(conversation.messages as any[]), {
        id: Date.now(),
        sender,
        message,
        timestamp: new Date().toISOString(),
      }];

      let aiResponse = null;
      if (sender === "user") {
        // Get AI response
        aiResponse = await aiService.processMessage(message, conversation.language, conversation.farmerId);
        
        messages.push({
          id: Date.now() + 1,
          sender: "ai",
          message: aiResponse.message,
          timestamp: new Date().toISOString(),
          metadata: aiResponse.metadata,
        });
      }

      await storage.updateChatConversation(conversationId, { messages });

      res.json({ 
        messages,
        aiResponse: aiResponse?.message 
      });
    } catch (error) {
      console.error("Send message error:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  app.get("/api/chat/conversations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await storage.getChatConversation(id);
      
      if (!conversation) {
        return res.status(404).json({ message: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ message: "Failed to get conversation" });
    }
  });

  // Payments
  app.get("/api/payments/claim/:claimId", async (req, res) => {
    try {
      const claimId = parseInt(req.params.claimId);
      const payments = await storage.getPaymentsByClaim(claimId);
      res.json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      res.status(500).json({ message: "Failed to get payments" });
    }
  });

  // Dashboard analytics
  app.get("/api/dashboard/farmer/:farmerId", async (req, res) => {
    try {
      const farmerId = parseInt(req.params.farmerId);
      const stats = await storage.getDashboardStats(farmerId);
      res.json(stats);
    } catch (error) {
      console.error("Get farmer dashboard error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  app.get("/api/dashboard/insurer", async (req, res) => {
    try {
      const stats = await storage.getInsurerStats();
      const recentClaims = await storage.getAllClaims(10);
      
      res.json({
        stats,
        recentClaims,
      });
    } catch (error) {
      console.error("Get insurer dashboard error:", error);
      res.status(500).json({ message: "Failed to get dashboard stats" });
    }
  });

  // Notifications
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await storage.getNotificationsByUser(userId);
      res.json(notifications);
    } catch (error) {
      console.error("Get notifications error:", error);
      res.status(500).json({ message: "Failed to get notifications" });
    }
  });

  app.post("/api/notifications/:id/read", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.markNotificationAsRead(id);
      res.json({ message: "Notification marked as read" });
    } catch (error) {
      console.error("Mark notification read error:", error);
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });

  // Weather data (for testing and seeding)
  app.post("/api/weather-data", async (req, res) => {
    try {
      const weatherData = req.body;
      const data = await storage.createWeatherData(weatherData);
      res.status(201).json(data);
    } catch (error) {
      console.error("Create weather data error:", error);
      res.status(500).json({ message: "Failed to create weather data" });
    }
  });

  // Automated claim processing function
  async function processClaimAsync(claimId: number) {
    try {
      const claim = await storage.getClaim(claimId);
      if (!claim) return;

      // Update status to processing
      await storage.updateClaim(claimId, { 
        status: "processing",
        processedAt: new Date()
      });

      // Get policy details
      const policy = await storage.getPolicyWithDetails(claim.policyId);
      if (!policy) return;

      // Verify land ownership via blockchain
      const isLandVerified = await blockchainService.verifyLandOwnership(
        claim.farmerId,
        policy.landHolding?.surveyNumber
      );

      if (!isLandVerified) {
        await storage.updateClaim(claimId, {
          status: "rejected",
          reasonCode: "land_not_verified",
        });
        return;
      }

      // Get weather data for the policy period
      const weatherData = await weatherService.getRainfallData(
        policy.farmer.district,
        policy.farmer.state,
        policy.policy.validFrom,
        policy.policy.validTo
      );

      const totalRainfall = weatherData.reduce((sum, data) => sum + data.rainfall, 0);

      // Check if rainfall is below threshold
      if (totalRainfall >= policy.policy.rainfallThreshold) {
        await storage.updateClaim(claimId, {
          status: "rejected",
          reasonCode: "rainfall_above_threshold",
          actualRainfall: totalRainfall,
        });
        return;
      }

      // Calculate claim amount (proportional to shortfall)
      const rainfallShortfall = policy.policy.rainfallThreshold - totalRainfall;
      const shortfallPercentage = rainfallShortfall / policy.policy.rainfallThreshold;
      const claimAmount = policy.policy.coverageAmount * shortfallPercentage;

      // AI decision logic
      const aiDecision = {
        landVerified: isLandVerified,
        actualRainfall: totalRainfall,
        thresholdRainfall: policy.policy.rainfallThreshold,
        shortfallPercentage: Math.round(shortfallPercentage * 100),
        recommendedAmount: Math.round(claimAmount),
        confidence: 0.95,
        reasoning: `Rainfall of ${totalRainfall}mm is below threshold of ${policy.policy.rainfallThreshold}mm. Land ownership verified via blockchain.`
      };

      // Approve the claim
      const settlementTime = Math.floor(Math.random() * 12) + 1; // 1-12 hours
      await storage.updateClaim(claimId, {
        status: "approved",
        claimAmount: claimAmount.toString(),
        actualRainfall: totalRainfall,
        aiDecision,
        settlementTime,
      });

      // Initiate payment
      const payment = await storage.createPayment({
        claimId,
        amount: claimAmount.toString(),
        bankAccount: "****7890", // Mock bank account
        ifscCode: "SBIN0001234", // Mock IFSC
        transactionId: `TXN${Date.now()}`,
        status: "initiated",
      });

      // Process payment (mock)
      setTimeout(async () => {
        await paymentService.processPayment(payment.id);
        await storage.updateClaim(claimId, { 
          status: "settled",
          settledAt: new Date()
        });

        // Send notification
        await notificationService.sendClaimSettledNotification(claim.farmerId, claim.claimNumber, claimAmount);
      }, 2000); // 2 second delay to simulate processing

      // Send approval notification
      await notificationService.sendClaimApprovedNotification(claim.farmerId, claim.claimNumber, claimAmount);

    } catch (error) {
      console.error("Process claim error:", error);
      // Update claim to failed status
      await storage.updateClaim(claimId, {
        status: "rejected",
        reasonCode: "processing_error",
      });
    }
  }

  const httpServer = createServer(app);
  return httpServer;
}
