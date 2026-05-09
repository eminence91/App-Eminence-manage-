import type { Metadata, Viewport } from "next";
import { WelmiProvider } from "@/components/welmi/store";
import { MobileFrame } from "@/components/welmi/MobileFrame";
import { BottomNav } from "@/components/welmi/BottomNav";
import { CalendarModal } from "@/components/welmi/modals/CalendarModal";
import { ProfilModal } from "@/components/welmi/modals/ProfilModal";
import { StreakModal } from "@/components/welmi/modals/StreakModal";
import { SupportModal } from "@/components/welmi/modals/SupportModal";
import { PaywallModal } from "@/components/welmi/modals/PaywallModal";
import { ActionMenu } from "@/components/welmi/modals/ActionMenu";
import { RicardoModal } from "@/components/welmi/modals/RicardoModal";
import { AddWaterModal, AddWeightModal } from "@/components/welmi/modals/AddWaterModal";

export const metadata: Metadata = {
  title: "Welmi — Nutrition, Fitness & Bien-être",
  description: "Votre coach IA nutrition, fitness et bien-être au quotidien.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#F75660",
};

export default function WelmiLayout({ children }: { children: React.ReactNode }) {
  return (
    <WelmiProvider>
      <MobileFrame>
        <div className="flex-1 overflow-y-auto pb-28">{children}</div>
        <BottomNav />
        <CalendarModal />
        <ProfilModal />
        <StreakModal />
        <SupportModal />
        <PaywallModal />
        <ActionMenu />
        <RicardoModal />
        <AddWaterModal />
        <AddWeightModal />
      </MobileFrame>
    </WelmiProvider>
  );
}
