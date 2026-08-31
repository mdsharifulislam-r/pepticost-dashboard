// ---------- Generic API envelope ----------
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export interface QueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  [key: string]: string | number | boolean | undefined;
}

// ---------- Auth ----------
export type UserRole = "USER" | "ADMIN" | "SUPER_ADMIN";

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  accessToken: string;
  contact?: string;
  image?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface VerifyOtpPayload {
  email: string;
  oneTimeCode: number;
}

export interface VerifyOtpResult {
  accessToken: string;
}

export interface ResetPasswordPayload {
  newPassword: string;
  confirmPassword: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface Profile {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  contact?: string;
  image?: string;
  document?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ---------- Peptides ----------
export interface Peptide {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PeptidePayload {
  name: string;
}

// ---------- Vendor ----------
export type VendorQuality = "Premium" | "Standard" | "Economy" | string;
export type VendorStatus = "active" | "delete";
export type VendorPaymentMethod =
  | "Credit/Debit Card"
  | "Paypal"
  | "Stripe"
  | "Bank"
  | "Apple Pay"
  | "Google Pay";

export interface Vendor {
  _id: string;
  name: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  about: string;
  price_per_unit: number;
  peptide: string | Peptide;
  total_price: number;
  unit: number;
  quality?: VendorQuality;
  has_discount?: boolean;
  discount_amount?: number;
  is_stock?: boolean;
  delivery_cost?: number;
  payment_methods: VendorPaymentMethod[];
  coupon_code?: string;
  website_url: string;
  discounted_price?: number;
  peptide_amount?: number;
  status: VendorStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorPayload {
  name: string;
  is_verified: boolean;
  rating: number;
  total_reviews: number;
  about: string;
  price_per_unit: number;
  peptide: string;
  unit: number;
  quality?: VendorQuality;
  has_discount?: boolean;
  discount_amount?: number;
  is_stock?: boolean;
  delivery_cost?: number;
  payment_methods: VendorPaymentMethod[];
  coupon_code?: string;
  website_url: string;
  peptide_amount?: number;
  status: VendorStatus;
}

// ---------- FAQ ----------
export interface Faq {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FaqPayload {
  question: string;
  answer: string;
}

// ---------- Blog ----------
export type BlogCategory =
  | "Peptide Pricing"
  | "Research"
  | "Guides"
  | "Vendor Reviews"
  | "News";

export interface Blog {
  _id: string;
  headline: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogPayload {
  headline: string;
  content: string;
  category: BlogCategory;
  tags: string[];
  image?: File;
}

// ---------- Disclaimer ----------
export type DisclaimerType = "terms" | "privacy" | "about";

export interface Disclaimer {
  _id: string;
  type: DisclaimerType;
  content: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface DisclaimerPayload {
  type: DisclaimerType;
  content: string;
}

// ---------- Banner ----------
export type BannerStatus = "active" | "inactive";

export interface Banner {
  _id: string;
  image: string;
  title: string;
  link: string;
  status: BannerStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface BannerPayload {
  title: string;
  link: string;
  status?: BannerStatus;
  image?: File;
}

// ---------- Support ----------
export type SupportStatus = "pending" | "resolved" | "replied";

export interface Support {
  _id: string;
  name: string;
  email: string;
  contact: string;
  message: string;
  status: SupportStatus;
  reply?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SupportReplyPayload {
  reply: string;
}

// ---------- Application ----------
export type ApplicationStatus = "pending" | "reviewed" | "resolved" | "delete";

export interface Application {
  _id: string;
  name: string;
  email: string;
  phone: string;
  company_name: string;
  message: string;
  status: ApplicationStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApplicationStatusPayload {
  status: Exclude<ApplicationStatus, "pending">;
}

// ---------- Admin Dashboard Stats & Graph ----------
export interface AdminStats {
  vendors: number;
  supportMessages: number;
  blogs: number;
  applications: number;
}

export interface YearWiseCount {
  year: number;
  count: number;
}

export interface MonthlyBreakdownCount {
  month: string;
  count: number;
}

export interface ApplicationGraphData {
  yearWise: YearWiseCount[];
  monthlyBreakdown: MonthlyBreakdownCount[];
}
