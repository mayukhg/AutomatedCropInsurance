import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import NavigationHeader from "@/components/NavigationHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface PolicyType {
  id: string;
  name: string;
  premiumPerHectare: number;
  coveragePerHectare: number;
  rainfallThreshold: number;
  settlementTime: number;
  features: string[];
  recommended?: boolean;
}

export default function PolicySelection() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const { data: policyTypes, isLoading } = useQuery<PolicyType[]>({
    queryKey: ["/api/policy-types"],
  });

  const selectPolicyMutation = useMutation({
    mutationFn: async (policyType: PolicyType) => {
      // In a real app, this would create a policy purchase flow
      // For now, we'll just redirect to claim filing
      return policyType;
    },
    onSuccess: () => {
      toast({
        title: "Policy Selected",
        description: "Redirecting to complete your policy purchase...",
      });
      setTimeout(() => {
        setLocation("/claim");
      }, 1500);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <NavigationHeader />
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader />
      
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Protection Plan</h2>
            <p className="text-xl text-gray-600">Drought insurance policies tailored for Indian farmers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {policyTypes?.map((policy) => (
              <Card 
                key={policy.id}
                className={`hover:shadow-lg transition-shadow ${
                  policy.recommended 
                    ? 'border-2 border-primary ring-2 ring-primary/20' 
                    : 'border-2 border-gray-200 hover:border-primary'
                } relative`}
              >
                {policy.recommended && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-primary text-white px-4 py-1">
                      Recommended
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-xl font-semibold mb-2">
                    {policy.name}
                  </CardTitle>
                  <div className="text-3xl font-bold text-primary mb-2">
                    ₹{policy.premiumPerHectare.toLocaleString()}
                  </div>
                  <p className="text-gray-600">per hectare/season</p>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {policy.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <i className="fas fa-check text-green-600 mr-2 mt-1 text-sm"></i>
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mb-6 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Coverage:</span>
                      <span className="font-semibold">₹{policy.coveragePerHectare.toLocaleString()}/hectare</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rainfall threshold:</span>
                      <span className="font-semibold">&lt;{policy.rainfallThreshold}mm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Settlement time:</span>
                      <span className="font-semibold">{policy.settlementTime} hours</span>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      policy.recommended 
                        ? 'bg-primary hover:bg-primary/90' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    onClick={() => selectPolicyMutation.mutate(policy)}
                    disabled={selectPolicyMutation.isPending}
                  >
                    {selectPolicyMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Selecting...
                      </>
                    ) : (
                      "Select Plan"
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Need Help Choosing?
              </h3>
              <p className="text-blue-700 mb-4">
                Our AI assistant can help you select the best policy based on your farm size, location, and risk profile.
              </p>
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                <i className="fas fa-robot mr-2"></i>
                Chat with AI Assistant
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
