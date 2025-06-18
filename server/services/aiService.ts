/**
 * AI Service for Multilingual Claim Processing
 * 
 * This service handles AI-powered chat interactions for claim filing,
 * supports multiple languages (English, Hindi, Marathi), and processes
 * natural language queries to extract claim information automatically.
 */

import { storage } from "../storage";

// Multilingual responses for AI chat interactions
const responses = {
  en: {
    greeting: "Hello! I'm here to help you file your crop insurance claim. Can you please provide your name and mobile number?",
    verifying: "Thank you! Let me verify your information and check your active policies...",
    policyFound: "Great! I found your active policy. Now I'm checking the weather data for your area...",
    weatherCheck: "I'm analyzing rainfall data from meteorological sources for your location and policy period...",
    approved: "Good news! Your claim has been approved. The rainfall in your area was below the threshold required for coverage.",
    rejected: "I'm sorry, but your claim cannot be approved at this time. The rainfall data shows sufficient precipitation for your area.",
    processing: "Your claim is being processed. You'll receive updates via SMS and in the app.",
    askForDetails: "To process your claim, I need to verify a few details. What is the survey number of your land?",
    needMore: "Can you tell me more about the drought conditions you experienced?",
    thankYou: "Thank you for the information. Let me process this for you.",
  },
  hi: {
    greeting: "नमस्ते! मैं आपके फसल बीमा दावे को दर्ज करने में आपकी सहायता के लिए यहाँ हूँ। कृपया अपना नाम और मोबाइल नंबर बताएं।",
    verifying: "धन्यवाद! मैं आपकी जानकारी सत्यापित करता हूँ और आपकी सक्रिय नीतियों की जांच करता हूँ...",
    policyFound: "बहुत अच्छा! मुझे आपकी सक्रिय नीति मिल गई है। अब मैं आपके क्षेत्र के लिए मौसम डेटा की जांच कर रहा हूँ...",
    weatherCheck: "मैं आपके स्थान और नीति अवधि के लिए मौसम विज्ञान स्रोतों से वर्षा डेटा का विश्लेषण कर रहा हूँ...",
    approved: "अच्छी खबर! आपका दावा स्वीकृत हो गया है। आपके क्षेत्र में वर्षा कवरेज के लिए आवश्यक सीमा से कम थी।",
    rejected: "खुशी है, लेकिन इस समय आपका दावा स्वीकृत नहीं किया जा सकता। वर्षा डेटा आपके क्षेत्र के लिए पर्याप्त वर्षा दिखाता है।",
    processing: "आपका दावा संसाधित हो रहा है। आपको SMS और ऐप के माध्यम से अपडेट मिलेंगे।",
    askForDetails: "आपके दावे को संसाधित करने के लिए, मुझे कुछ विवरणों को सत्यापित करने की आवश्यकता है। आपकी भूमि का सर्वे नंबर क्या है?",
    needMore: "क्या आप मुझे उन सूखे की स्थितियों के बारे में और बता सकते हैं जिनका आपने अनुभव किया?",
    thankYou: "जानकारी के लिए धन्यवाद। मुझे इसे आपके लिए संसाधित करने दें।",
  },
  mr: {
    greeting: "नमस्कार! मी तुमच्या पीक विमा दाव्यासाठी मदत करण्यासाठी इथे आहे. कृपया तुमचे नाव आणि मोबाइल नंबर सांगा.",
    verifying: "धन्यवाद! मी तुमची माहिती सत्यापित करत आहे आणि तुमच्या सक्रिय धोरणांची तपासणी करत आहे...",
    policyFound: "छान! मला तुमची सक्रिय धोरण सापडली आहे. आता मी तुमच्या भागासाठी हवामान डेटाची तपासणी करत आहे...",
    weatherCheck: "मी तुमच्या स्थानासाठी आणि धोरण कालावधीसाठी हवामान विज्ञान स्रोतांकडून पावसाच्या डेटाचे विश्लेषण करत आहे...",
    approved: "चांगली बातमी! तुमचा दावा मंजूर झाला आहे. तुमच्या भागात पावसाचे प्रमाण कव्हरेजसाठी आवश्यक मर्यादेपेक्षा कमी होते.",
    rejected: "मला खेद आहे, परंतु या वेळी तुमचा दावा मंजूर केला जाऊ शकत नाही. पावसाच्या डेटामध्ये तुमच्या भागासाठी पुरेसा पाऊस दिसत आहे.",
    processing: "तुमचा दावा प्रक्रिया केला जात आहे. तुम्हाला SMS आणि अॅपद्वारे अपडेट मिळतील.",
    askForDetails: "तुमचा दावा प्रक्रिया करण्यासाठी, मला काही तपशील सत्यापित करावे लागतील. तुमच्या जमिनीचा सर्व्हे नंबर काय आहे?",
    needMore: "तुम्ही मला तुम्ही अनुभवलेल्या दुष्काळी परिस्थितीबद्दल अधिक सांगू शकाल का?",
    thankYou: "माहितीसाठी धन्यवाद. मला हे तुमच्यासाठी प्रक्रिया करू द्या.",
  },
};

export class AIService {
  async processMessage(message: string, language: string = "en", farmerId: number): Promise<{
    message: string;
    metadata?: any;
  }> {
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const lang = language as keyof typeof responses;
      const msgs = responses[lang] || responses.en;
      
      const lowerMessage = message.toLowerCase();
      
      // Simple rule-based responses (in production this would use actual NLP/LLM)
      if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("start")) {
        return {
          message: msgs.greeting,
          metadata: { step: "greeting" }
        };
      }
      
      if (lowerMessage.includes("name") && lowerMessage.includes("mobile")) {
        // Extract name and mobile (simplified)
        return {
          message: msgs.verifying,
          metadata: { step: "verifying" }
        };
      }
      
      if (lowerMessage.includes("survey") || lowerMessage.includes("land")) {
        return {
          message: msgs.askForDetails,
          metadata: { step: "land_details" }
        };
      }
      
      if (lowerMessage.includes("drought") || lowerMessage.includes("dry") || lowerMessage.includes("rain")) {
        // Start claim processing
        const claimResult = await this.mockClaimProcessing(farmerId);
        
        if (claimResult.approved) {
          return {
            message: `${msgs.approved}\n\nClaim Details:\n• Amount: ₹${claimResult.amount}\n• Rainfall: ${claimResult.rainfall}mm\n• Settlement: Within 12 hours`,
            metadata: { 
              step: "approved",
              claimId: claimResult.claimId,
              amount: claimResult.amount
            }
          };
        } else {
          return {
            message: `${msgs.rejected}\n\nReason: ${claimResult.reason}`,
            metadata: { 
              step: "rejected",
              reason: claimResult.reason
            }
          };
        }
      }
      
      // Default response
      return {
        message: msgs.needMore,
        metadata: { step: "clarification" }
      };
      
    } catch (error) {
      console.error("AI service error:", error);
      return {
        message: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        metadata: { error: true }
      };
    }
  }
  
  private async mockClaimProcessing(farmerId: number): Promise<{
    approved: boolean;
    amount?: number;
    rainfall?: number;
    claimId?: number;
    reason?: string;
  }> {
    // Get farmer's active policies
    const policies = await storage.getPoliciesByFarmer(farmerId);
    
    if (policies.length === 0) {
      return {
        approved: false,
        reason: "No active policy found"
      };
    }
    
    // Simulate weather check
    const mockRainfall = Math.floor(Math.random() * 150); // 0-150mm
    const policy = policies[0];
    const threshold = policy.rainfallThreshold;
    
    if (mockRainfall >= threshold) {
      return {
        approved: false,
        rainfall: mockRainfall,
        reason: `Rainfall ${mockRainfall}mm is above threshold ${threshold}mm`
      };
    }
    
    // Calculate claim amount
    const shortfall = (threshold - mockRainfall) / threshold;
    const amount = Math.floor(parseFloat(policy.coverageAmount) * shortfall);
    
    return {
      approved: true,
      amount,
      rainfall: mockRainfall,
      claimId: Math.floor(Math.random() * 10000),
    };
  }
  
  // Translate text between languages
  async translateText(text: string, fromLang: string, toLang: string): Promise<string> {
    // Mock translation - in production would use actual translation service
    if (fromLang === toLang) return text;
    
    // Simple mock translations for demo
    const translations: { [key: string]: { [key: string]: string } } = {
      "Hello": {
        hi: "नमस्ते",
        mr: "नमस्कार"
      },
      "Thank you": {
        hi: "धन्यवाद",
        mr: "धन्यवाद"
      }
    };
    
    return translations[text]?.[toLang] || text;
  }
  
  // Get AI confidence score for claim decision
  getClaimConfidence(rainfall: number, threshold: number, landVerified: boolean): number {
    let confidence = 0.8; // Base confidence
    
    const rainfallDiff = Math.abs(rainfall - threshold);
    const thresholdRatio = rainfallDiff / threshold;
    
    // Higher confidence if rainfall is significantly different from threshold
    if (thresholdRatio > 0.3) confidence += 0.15;
    else if (thresholdRatio > 0.1) confidence += 0.05;
    
    // Higher confidence if land is verified
    if (landVerified) confidence += 0.05;
    
    return Math.min(confidence, 0.98); // Cap at 98%
  }
}

export const aiService = new AIService();
