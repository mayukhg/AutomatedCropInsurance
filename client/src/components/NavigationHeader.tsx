import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTranslation } from "@/hooks/useTranslation";
import { Menu, X } from "lucide-react";

export default function NavigationHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { language, setLanguage, t } = useTranslation();

  const isActive = (path: string) => {
    return location === path ? "text-hsl(142, 71%, 45%)" : "text-gray-600 hover:text-hsl(142, 71%, 45%)";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <i className="fas fa-seedling text-hsl(142, 71%, 45%) text-2xl mr-2"></i>
              <span className="text-xl font-bold text-gray-900">CropGuard</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <Link href="/">
                <a className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/")}`}>
                  {t('home')}
                </a>
              </Link>
              <Link href="/policies">
                <a className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/policies")}`}>
                  {t('policies')}
                </a>
              </Link>
              <Link href="/claim">
                <a className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/claim")}`}>
                  {t('claims')}
                </a>
              </Link>
              <Link href="/dashboard/insurer">
                <a className={`px-3 py-2 text-sm font-medium transition-colors ${isActive("/dashboard/insurer")}`}>
                  {t('dashboard')}
                </a>
              </Link>
            </div>
          </div>

          {/* Right side controls */}
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">हिंदी</SelectItem>
                <SelectItem value="mr">मराठी</SelectItem>
              </SelectContent>
            </Select>

            {/* Login Button */}
            <Link href="/register">
              <Button className="bg-hsl(142, 71%, 45%) text-white hover:bg-hsl(142, 71%, 40%) transition-colors">
                {t('login')}
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-2">
              <Link href="/">
                <a 
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive("/")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('home')}
                </a>
              </Link>
              <Link href="/policies">
                <a 
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive("/policies")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('policies')}
                </a>
              </Link>
              <Link href="/claim">
                <a 
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive("/claim")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('claims')}
                </a>
              </Link>
              <Link href="/dashboard/insurer">
                <a 
                  className={`block px-3 py-2 text-sm font-medium transition-colors ${isActive("/dashboard/insurer")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t('dashboard')}
                </a>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
