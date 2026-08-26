export type PlanDuration = 'monthly' | 'yearly' | 'lifetime';

export interface Plan {
  id?: string;
  productId: string; // The product this plan belongs to
  name: string;
  slug: string; // e.g., 'monthly', 'yearly', 'lifetime'
  price: number;
  regularPrice?: number; // Optional original price for strikethrough/discount
  currency: string;
  durationDays: number | null; // null for lifetime
  lifetime: boolean;
  active: boolean;
  maxDevices: number;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'CANCELLED';

export interface Order {
  id?: string;
  paypalOrderId: string;
  paypalTransactionId?: string; // Set when captured
  customerEmail: string;
  customerName?: string;
  productId: string; // The product being purchased
  planId: string; // references Plan.slug or Plan.id
  amount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  paypalStatus?: string;
  licenseId?: string;
  createdAt: string;
  updatedAt: string;
}

export type LicenseStatus = 'ACTIVE' | 'EXPIRED' | 'REVOKED' | 'REFUNDED' | 'SUSPENDED';

export interface License {
  id?: string;
  key: string;
  productId: string;
  planId: string;
  orderId: string;
  customerEmail: string;
  status: LicenseStatus;
  activated: boolean;
  activationCount: number;
  maxDevices: number;
  expiresAt: string | null; // ISO string, null if lifetime
  createdAt: string;
  updatedAt: string;
  revokedAt?: string | null;
}

export type ActivationStatus = 'ACTIVE' | 'REVOKED';

export interface Activation {
  id?: string;
  licenseId: string;
  deviceId: string;
  browserId?: string;
  activatedAt: string;
  lastSeenAt: string;
  status: ActivationStatus;
}
