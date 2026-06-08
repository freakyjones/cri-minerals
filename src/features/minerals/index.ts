// Hooks
export { useMinerals, useMineral } from './hooks/useMineral';
export { useMineralDashboard, CATEGORIES } from './hooks/useMineralDashboard';

// Components
export { default as MineralCard } from './components/MineralCard';
export { default as MineralPageHeader } from './components/MineralPageHeader';
export { default as PrimaryApplications } from './components/PrimaryApplications';
export { default as ChokePoints } from './components/ChokePoints';
export { default as SharePieChart } from './components/SharePieChart';
export { default as ProductionChart } from './components/ProductionChart';
export { default as GlobalMap } from './components/GlobalMap';
export { default as SummaryStats } from './components/SummaryStats';
export { default as EsgAlertCard } from './components/EsgAlertCard';
export { default as MineralTimeline } from './components/MineralTimeline';
export { default as RiskHeatmap } from './components/RiskHeatmap';
export { default as CategoryFilter } from './components/CategoryFilter';

// Types and Schema
export { mineralSchema, mineralsArraySchema } from './schema/mineralSchema';
export type { Mineral } from './schema/mineralSchema';
