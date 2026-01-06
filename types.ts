
export enum InvoiceStatus {
  DRAFT = 'Draft',
  SENT = 'Sent',
  PAID = 'Paid',
  OVERDUE = 'Overdue'
}

export interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  address: string;
  phone?: string;
}

export interface PrintTemplateSettings {
  primaryColor: string;
  layout: 'modern' | 'classic' | 'minimal';
  showLogo: boolean;
  headerFont: string;
  footerText: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  email: string;
  website: string;
  taxRate: number;
  currency: string;
  template: PrintTemplateSettings;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  issueDate: string;
  dueDate: string;
  items: LineItem[];
  status: InvoiceStatus;
  taxRate: number;
  notes?: string;
  total: number;
}

export interface DashboardStats {
  totalRevenue: number;
  pendingAmount: number;
  paidCount: number;
  pendingCount: number;
}
