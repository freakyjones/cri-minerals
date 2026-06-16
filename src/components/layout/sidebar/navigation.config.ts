import { LayoutDashboard, Map as MapIcon, ShieldAlert, Settings, Inbox, LucideIcon } from 'lucide-react';

export interface NavItemConfig {
  name: string;
  path: string;
  icon?: LucideIcon;
  isAccordion?: boolean;
  disabled?: boolean;
}

export const navItems: NavItemConfig[] = [
  { name: 'Overview Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Analyst Queue', path: '/analyst', icon: Inbox },
  { name: 'Minerals Index', path: '#', isAccordion: true },
  { name: 'Supply Chain Map', path: '/supply-chain', icon: MapIcon },
  { name: 'ESG & Compliance', path: '/compliance', icon: ShieldAlert },
  { name: 'Settings', path: '#', icon: Settings, disabled: true },
];

export const preloadRoute = (path: string) => {
  if (path === '/') import('../../../pages/HomePage');
  if (path === '/analyst') import('../../../pages/AnalystDashboard');
  if (path === '/supply-chain') import('../../../pages/SupplyChainPage');
  if (path === '/compliance') import('../../../pages/CompliancePage');
};
