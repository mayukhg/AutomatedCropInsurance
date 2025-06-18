import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { CheckCircle, Clock, CreditCard, FileText } from "lucide-react";
import type { Claim, Payment } from "@/types";

export default function PaymentTracking() {
  const { claimId } = useParams();
  const { t } = useTranslation();

  const { data: claim, isLoading: claimLoading } = useQuery<Claim>({
    queryKey: [`/api/claims/${claimId}`],
    enabled: !!claimId,
  });

  const { data: payments, isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: [`/api/payments/claim/${claimId}`],
    enabled: !!claimId,
  });

  const latestPayment = payments?.[0];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const paymentSteps = [
    {
      id: 'approved',
      title: t('claim_approved'),
      description: t('ai_verified_conditions'),
      timestamp: claim?.processedAt,
      completed: claim?.status === 'approved' || claim?.status === 'settled',
    },
    {
      id: 'initiated',
      title: t('payment_initiated'),
      description: t('transfer_started_bank'),
      timestamp: latestPayment?.createdAt,
      completed: latestPayment?.status !== 'initiated',
    },
    {
      id: 'processing',
      title: t('payment_processing'),
      description: t('bank_processing_transfer'),
      timestamp: latestPayment?.status === 'processing' ? latestPayment.createdAt : undefined,
      completed: latestPayment?.status === 'completed',
    },
    {
      id: 'completed',
      title: t('payment_completed'),
      description: t('amount_credited_account'),
      timestamp: latestPayment?.completedAt,
      completed: latestPayment?.status === 'completed',
    },
  ];

  if (claimLoading || paymentsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64 mb-4" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('payment_tracking')}</h2>
            <p className="text-gray-600">{t('track_payments_settlements')}</p>
          </div>

          <Card className="shadow-lg">
            <CardContent className="p-6">
              {/* Payment Status Card */}
              {latestPayment && (
                <div className="bg-gradient-to-r from-green-500 to-green-400 text-white rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{t('latest_payment_status')}</h3>
                      <p className="text-green-100">{t('claim')} #{claim?.claimNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        {formatCurrency(parseFloat(latestPayment.amount))}
                      </p>
                      <Badge variant="secondary" className="bg-white text-green-700">
                        {t(latestPayment.status)}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}

              {/* Payment Timeline */}
              <div className="relative">
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
                
                <div className="space-y-6">
                  {paymentSteps.map((step, index) => (
                    <div key={step.id} className="flex items-start">
                      <div className={`w-8 h-8 ${
                        step.completed 
                          ? 'bg-green-600 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      } rounded-full flex items-center justify-center text-sm font-bold relative z-10 mr-4`}>
                        {step.completed ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Clock className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                          {step.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-1">{step.description}</p>
                        {step.timestamp && (
                          <p className="text-xs text-gray-500">
                            {formatDateTime(step.timestamp)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bank Details */}
              {latestPayment && (
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <CreditCard className="w-4 h-4 mr-2" />
                    {t('bank_account_details')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">{t('account_number')}</p>
                      <p className="font-mono">{latestPayment.bankAccount}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('bank_name')}</p>
                      <p>State Bank of India</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('ifsc_code')}</p>
                      <p className="font-mono">{latestPayment.ifscCode}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">{t('transaction_id')}</p>
                      <p className="font-mono">{latestPayment.transactionId}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Receipt Download */}
              {latestPayment?.status === 'completed' && (
                <div className="mt-6 text-center">
                  <button className="inline-flex items-center px-4 py-2 bg-hsl(207, 90%, 54%) text-white rounded-lg hover:bg-hsl(207, 90%, 49%) transition-colors">
                    <FileText className="w-4 h-4 mr-2" />
                    {t('download_receipt')}
                  </button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
