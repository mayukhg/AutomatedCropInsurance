import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Registration from "@/pages/Registration";
import PolicySelection from "@/pages/PolicySelection";
import ClaimFiling from "@/pages/ClaimFiling";
import FarmerDashboard from "@/pages/FarmerDashboard";
import InsurerDashboard from "@/pages/InsurerDashboard";
import PaymentTracking from "@/pages/PaymentTracking";
import { I18nProvider } from "./lib/i18n";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/register" component={Registration} />
      <Route path="/policies" component={PolicySelection} />
      <Route path="/claim" component={ClaimFiling} />
      <Route path="/dashboard/farmer/:farmerId" component={FarmerDashboard} />
      <Route path="/dashboard/insurer" component={InsurerDashboard} />
      <Route path="/payment/:claimId" component={PaymentTracking} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </I18nProvider>
    </QueryClientProvider>
  );
}

export default App;
