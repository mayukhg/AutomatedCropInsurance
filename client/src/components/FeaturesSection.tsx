import { Bot, Zap, UserPlus } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";

export default function FeaturesSection() {
  const { t } = useTranslation();

  const features = [
    {
      icon: <UserPlus className="text-white text-2xl" />,
      title: t('quick_registration'),
      description: t('quick_registration_desc'),
      bgColor: "bg-hsl(142, 71%, 45%)",
    },
    {
      icon: <Bot className="text-white text-2xl" />,
      title: t('ai_powered_claims'),
      description: t('ai_powered_claims_desc'),
      bgColor: "bg-hsl(207, 90%, 54%)",
    },
    {
      icon: <Zap className="text-white text-2xl" />,
      title: t('instant_settlement'),
      description: t('instant_settlement_desc'),
      bgColor: "bg-hsl(33, 100%, 50%)",
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('how_it_works')}</h2>
          <p className="text-xl text-gray-600">{t('simple_transparent_instant')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-gray-50 rounded-xl hover:shadow-lg transition-shadow">
              <div className={`w-16 h-16 ${feature.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
