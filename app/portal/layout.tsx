import { DashboardLayout } from '@/lib/components/dashboard/dashboard-layout';

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}