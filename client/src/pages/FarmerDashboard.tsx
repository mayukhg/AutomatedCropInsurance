import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2, Plus, Shield, Umbrella, CheckCircle, Clock } from "lucide-react";
import type { User, Policy, Claim } from "@/types";

export default function FarmerDashboard() {
  const { farmerId } = useParams();
  const { t } = useTranslation();

  const { data: farmer, isLoading: farmerLoading } = useQuery<User>({
    queryKey: [`/api/users/${farmerId}`],
    enabled: !!farmerId,
  });

  const { data: policies, isLoading: policiesLoading } = useQuery<Policy[]>({
    queryKey: [`/api/policies/farmer/${farmerId}`],
    enabled: !!farmerId,
  });

  const { data: claims, isLoading: claimsLoading } = useQuery<Claim[]>({
    queryKey: [`/api/claims/farmer/${farmerId}`],
    enabled: !!farmerId,
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/dashboard/farmer/${farmerId}`],
    enabled: !!farmerId,
  });

  if (farmerLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const activePolicies = policies?.filter(p => p.status === 'active') || [];
  const recentClaims = claims?.slice(0, 3) || [];

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
      case 'settled':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {t('welcome_back')}, {farmer?.fullName || 'Farmer'}!
              </h1>
              <p className="text-gray-600 mt-1">{t('manage_policies_claims')}</p>
            </div>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="text-right">
                <p className="text-sm text-gray-600">{t('next_premium_due')}</p>
                <p className="font-semibold">15 Oct 2024</p>
              </div>
              <Link href="/claim">
                <Button className="bg-hsl(142, 71%, 45%) hover:bg-hsl(142, 71%, 40%)">
                  <Plus className="w-4 h-4 mr-2" />
                  {t('new_claim')}
                </Button>
              </Link>
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-r from-hsl(142, 71%, 45%) to-green-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">{t('active_policies')}</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? <Skeleton className="h-6 w-8" /> : dashboardStats?.activePolicies || 0}
                    </p>
                  </div>
                  <Shield className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-hsl(207, 90%, 54%) to-blue-600 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">{t('total_coverage')}</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? <Skeleton className="h-6 w-16" /> : `₹${dashboardStats?.totalCoverage?.toLocaleString() || '0'}`}
                    </p>
                  </div>
                  <Umbrella className="h-8 w-8 text-blue-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-green-500 to-green-400 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm">{t('claims_settled')}</p>
                    <p className="text-2xl font-bold">
                      {statsLoading ? <Skeleton className="h-6 w-12" /> : `₹${dashboardStats?.totalSettlementAmount?.toLocaleString() || '0'}`}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-200" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-hsl(33, 100%, 50%) to-orange-500 text-white">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm">{t('avg_settlement')}</p>
                    <p className="text-2xl font-bold">8 hours</p>
                  </div>
                  <Clock className="h-8 w-8 text-orange-200" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Active Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('active_policies')}</CardTitle>
              </CardHeader>
              <CardContent>
                {policiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : activePolicies.length > 0 ? (
                  <div className="space-y-4">
                    {activePolicies.map((policy) => (
                      <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">
                            {policy.policyType.charAt(0).toUpperCase() + policy.policyType.slice(1)} Protection - {policy.season} 2024
                          </span>
                          <Badge className="bg-green-100 text-green-800">
                            {t('active')}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{t('coverage')}: ₹{parseFloat(policy.coverageAmount).toLocaleString()} per hectare</p>
                          <p>{t('rainfall_threshold')}: &lt;{policy.rainfallThreshold}mm</p>
                          <p>{t('valid_until')}: {new Date(policy.validTo).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{t('no_active_policies')}</p>
                    <Link href="/policies">
                      <Button variant="outline">
                        {t('buy_policy')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Claims */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold">{t('recent_claims')}</CardTitle>
              </CardHeader>
              <CardContent>
                {claimsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : recentClaims.length > 0 ? (
                  <div className="space-y-4">
                    {recentClaims.map((claim) => (
                      <div key={claim.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{t('claim')} #{claim.claimNumber}</span>
                          <Badge className={getClaimStatusColor(claim.status)}>
                            {t(claim.status)}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>{t('filed')}: {new Date(claim.createdAt).toLocaleDateString()}</p>
                          <p>{t('amount')}: ₹{parseFloat(claim.claimAmount || '0').toLocaleString()}</p>
                          {claim.actualRainfall && (
                            <p>{t('actual_rainfall')}: {claim.actualRainfall}mm</p>
                          )}
                          {claim.settledAt && (
                            <p>{t('settled')}: {new Date(claim.settledAt).toLocaleDateString()}</p>
                          )}
                        </div>
                        {claim.status === 'settled' && (
                          <Link href={`/payment/${claim.id}`}>
                            <Button variant="outline" size="sm" className="mt-2">
                              {t('view_payment')}
                            </Button>
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-4">{t('no_claims_yet')}</p>
                    <Link href="/claim">
                      <Button variant="outline">
                        {t('file_first_claim')}
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
