export type IndustryType = 'vendas' | 'logistica' | 'saude' | 'financeiro' | 'outro';

export interface DashboardField {
  name: string;
  type: string;
  description: string;
  required: boolean;
  sample: string;
}

export interface StepInfo {
  number: number;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  badge: string;
  keyPoints: string[];
  interactiveTitle: string;
  duration: string;
}

export interface SecurityRole {
  id: 'admin' | 'manager' | 'operator';
  name: string;
  description: string;
  allowedRegions: string[];
  allowedViews: string[];
  sensitiveFieldsVisible: boolean;
}

export interface ProposalRequest {
  companyName: string;
  industry: IndustryType;
  dataSource: string;
  challenges: string;
  keyMetrics: string[];
}

export interface ProposalResponse {
  fields: DashboardField[];
  recommendedCharts: {
    chartType: string;
    description: string;
    rationale: string;
  }[];
  securityLevels: {
    role: string;
    accessType: string;
    scope: string;
  }[];
  implementationTimeline: {
    phase: string;
    duration: string;
    deliverables: string[];
  }[];
  estimatedResources: string;
}
