import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="bg-gradient-to-br from-hsl(142, 71%, 45%) to-green-600 text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              {t('instant_crop_insurance')}
            </h1>
            <p className="text-xl mb-8 text-green-100">
              {t('hero_description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register">
                <Button 
                  className="bg-white text-hsl(142, 71%, 45%) hover:bg-gray-100 transition-colors px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {t('register_farmer')}
                </Button>
              </Link>
              <Link href="/dashboard/insurer">
                <Button 
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-hsl(142, 71%, 45%) transition-colors px-8 py-3 text-lg font-semibold"
                  size="lg"
                >
                  {t('insurer_dashboard')}
                </Button>
              </Link>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt={t('farmer_working_field')}
              className="rounded-xl shadow-2xl w-full object-cover h-96"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
