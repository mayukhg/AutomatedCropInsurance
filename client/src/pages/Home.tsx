import NavigationHeader from "@/components/NavigationHeader";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      <HeroSection />
      <FeaturesSection />
      
      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <i className="fas fa-seedling text-primary text-2xl mr-2"></i>
                <span className="text-xl font-bold">CropGuard</span>
              </div>
              <p className="text-gray-400 mb-4">Revolutionary crop insurance powered by AI, blockchain, and real-time data.</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <i className="fab fa-linkedin-in"></i>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Farmers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/register" className="hover:text-white transition-colors">Register</a></li>
                <li><a href="/policies" className="hover:text-white transition-colors">Buy Policy</a></li>
                <li><a href="/claim" className="hover:text-white transition-colors">File Claim</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">For Insurers</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Partner with Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="/dashboard/insurer" className="hover:text-white transition-colors">Risk Analytics</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Sales</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <i className="fas fa-phone mr-2"></i>
                  1800-123-4567
                </li>
                <li>
                  <i className="fas fa-envelope mr-2"></i>
                  support@cropguard.com
                </li>
                <li>
                  <i className="fas fa-map-marker-alt mr-2"></i>
                  Available in 12 languages
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 CropGuard. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
