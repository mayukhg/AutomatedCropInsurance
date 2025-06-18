import { storage } from "../storage";

export class NotificationService {
  // Send claim approved notification
  async sendClaimApprovedNotification(farmerId: number, claimNumber: string, amount: number): Promise<void> {
    try {
      await storage.createNotification({
        userId: farmerId,
        title: "Claim Approved! 🎉",
        message: `Your claim ${claimNumber} has been approved for ₹${amount.toLocaleString()}. Payment will be processed within 12 hours.`,
        type: "success",
        metadata: {
          claimNumber,
          amount,
          type: "claim_approved"
        }
      });
      
      // Mock SMS sending
      console.log(`SMS sent: Your crop insurance claim ${claimNumber} approved for ₹${amount}. Payment in 12hrs.`);
      
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
  
  // Send claim settled notification
  async sendClaimSettledNotification(farmerId: number, claimNumber: string, amount: number): Promise<void> {
    try {
      await storage.createNotification({
        userId: farmerId,
        title: "Payment Completed! 💰",
        message: `₹${amount.toLocaleString()} has been credited to your bank account for claim ${claimNumber}.`,
        type: "success",
        metadata: {
          claimNumber,
          amount,
          type: "payment_completed"
        }
      });
      
      // Mock SMS sending
      console.log(`SMS sent: ₹${amount} credited for claim ${claimNumber}. Check your bank account.`);
      
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
  
  // Send claim rejected notification
  async sendClaimRejectedNotification(farmerId: number, claimNumber: string, reason: string): Promise<void> {
    try {
      await storage.createNotification({
        userId: farmerId,
        title: "Claim Update",
        message: `Your claim ${claimNumber} could not be processed. Reason: ${reason}. Contact support for assistance.`,
        type: "warning",
        metadata: {
          claimNumber,
          reason,
          type: "claim_rejected"
        }
      });
      
      // Mock SMS sending
      console.log(`SMS sent: Claim ${claimNumber} not approved. Reason: ${reason}. Call 1800-123-4567 for help.`);
      
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
  
  // Send policy expiry reminder
  async sendPolicyExpiryReminder(farmerId: number, policyId: number, daysLeft: number): Promise<void> {
    try {
      await storage.createNotification({
        userId: farmerId,
        title: "Policy Expiring Soon ⚠️",
        message: `Your crop insurance policy expires in ${daysLeft} days. Renew now to continue protection.`,
        type: "warning",
        metadata: {
          policyId,
          daysLeft,
          type: "policy_expiry"
        }
      });
      
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
  
  // Send weather alert
  async sendWeatherAlert(farmerId: number, alertType: string, message: string): Promise<void> {
    try {
      await storage.createNotification({
        userId: farmerId,
        title: `Weather Alert: ${alertType}`,
        message: message,
        type: "info",
        metadata: {
          alertType,
          type: "weather_alert"
        }
      });
      
    } catch (error) {
      console.error("Notification error:", error);
    }
  }
  
  // Send OTP via SMS (mock)
  async sendOTP(mobileNumber: string, otp: string, purpose: string): Promise<boolean> {
    try {
      // Mock SMS service
      console.log(`SMS to ${mobileNumber}: Your CropGuard OTP for ${purpose} is ${otp}. Valid for 10 minutes.`);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 98% success rate
      return Math.random() > 0.02;
      
    } catch (error) {
      console.error("SMS error:", error);
      return false;
    }
  }
  
  // Send bulk notifications to multiple users
  async sendBulkNotification(userIds: number[], notification: {
    title: string;
    message: string;
    type: string;
    metadata?: any;
  }): Promise<void> {
    try {
      const notifications = userIds.map(userId => ({
        userId,
        ...notification
      }));
      
      // In production, this would be optimized for bulk insert
      for (const notif of notifications) {
        await storage.createNotification(notif);
      }
      
    } catch (error) {
      console.error("Bulk notification error:", error);
    }
  }
  
  // Send email notification (mock)
  async sendEmail(email: string, subject: string, body: string): Promise<boolean> {
    try {
      console.log(`Email to ${email}: ${subject}\n${body}`);
      
      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return true;
    } catch (error) {
      console.error("Email error:", error);
      return false;
    }
  }
  
  // Get notification preferences
  async getNotificationPreferences(userId: number): Promise<{
    sms: boolean;
    email: boolean;
    push: boolean;
    whatsapp: boolean;
  }> {
    // Mock preferences - in production this would be stored in database
    return {
      sms: true,
      email: false,
      push: true,
      whatsapp: false,
    };
  }
  
  // Update notification preferences
  async updateNotificationPreferences(userId: number, preferences: {
    sms?: boolean;
    email?: boolean;
    push?: boolean;
    whatsapp?: boolean;
  }): Promise<void> {
    // Mock update - in production this would update database
    console.log(`Updated notification preferences for user ${userId}:`, preferences);
  }
}

export const notificationService = new NotificationService();
