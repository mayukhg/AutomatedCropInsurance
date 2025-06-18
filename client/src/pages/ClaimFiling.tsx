import { useState } from "react";
import NavigationHeader from "@/components/NavigationHeader";
import AIChat from "@/components/AIChat";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function ClaimFiling() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">File Your Claim</h2>
            <p className="text-gray-600">Chat with our AI assistant to process your drought claim instantly</p>
          </div>

          <Card className="shadow-lg overflow-hidden">
            {/* Chat Header */}
            <CardHeader className="bg-primary text-white p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-robot text-white"></i>
                  </div>
                  <div>
                    <CardTitle className="text-white font-semibold">CropGuard AI Assistant</CardTitle>
                    <p className="text-sm text-green-100">Online • Ready to help with your claim</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" className="text-white hover:text-green-100 hover:bg-white/10">
                    <i className="fas fa-volume-up"></i>
                  </Button>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger className="w-24 bg-white bg-opacity-20 text-white text-sm border-white/30">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">हिंदी</SelectItem>
                      <SelectItem value="mr">मराठी</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <AIChat language={selectedLanguage} />
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                How Our AI Claim Processing Works
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-comments text-blue-600"></i>
                  </div>
                  <p className="text-blue-700">
                    <strong>1. Chat with AI</strong><br />
                    Describe your situation in your preferred language
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-search text-blue-600"></i>
                  </div>
                  <p className="text-blue-700">
                    <strong>2. Instant Verification</strong><br />
                    AI checks land records and weather data
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <i className="fas fa-check-circle text-blue-600"></i>
                  </div>
                  <p className="text-blue-700">
                    <strong>3. Quick Decision</strong><br />
                    Get approval and payment within hours
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
