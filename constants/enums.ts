// Sumber kebenaran untuk semua enum di database spec V1.
// Dipakai untuk dropdown form, badge warna, dan filter.
// Value harus match persis dengan enum type di Postgres (Phase 2).

export const USER_ROLES = ["DSR", "SPV", "MANAGER", "ADMIN"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export const SEGMENTS = [
  "FLEET",
  "TRANSPORT",
  "MANUFACTURING",
  "CONSTRUCTION",
  "MINING",
  "WORKSHOP",
  "DISTRIBUTOR",
  "RESELLER",
  "AGRICULTURE",
  "MARINE",
  "OTHER",
] as const;
export type Segment = (typeof SEGMENTS)[number];

export const CUSTOMER_STATUSES = [
  "PROSPECT",
  "ACTIVE",
  "DORMANT",
  "INACTIVE",
  "LOST",
] as const;
export type CustomerStatus = (typeof CUSTOMER_STATUSES)[number];

export const PRIORITIES = ["A", "B", "C"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CONTACT_TYPES = [
  "PURCHASING",
  "MAINTENANCE",
  "USER",
  "OWNER",
  "MANAGER",
  "FINANCE",
  "OTHER",
] as const;
export type ContactType = (typeof CONTACT_TYPES)[number];

export const INFLUENCE_LEVELS = ["LOW", "MEDIUM", "HIGH"] as const;
export type InfluenceLevel = (typeof INFLUENCE_LEVELS)[number];

export const DECISION_POWERS = ["NONE", "INFLUENCER", "DECISION_MAKER"] as const;
export type DecisionPower = (typeof DECISION_POWERS)[number];

export const PRODUCT_STATUSES = [
  "CURRENT",
  "TRIAL",
  "PROPOSED",
  "REJECTED",
] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const VISIT_TYPES = [
  "PROSPECTING",
  "FOLLOW_UP",
  "ROUTINE",
  "PRESENTATION",
  "TRIAL",
  "NEGOTIATION",
  "COMPLAINT",
  "TECHNICAL",
  "COLLECTION",
  "RELATIONSHIP",
] as const;
export type VisitType = (typeof VISIT_TYPES)[number];

export const VISIT_STATUSES = [
  "PLANNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
] as const;
export type VisitStatus = (typeof VISIT_STATUSES)[number];

export const CUSTOMER_RESPONSES = [
  "INTERESTED",
  "CONSIDERING",
  "NEUTRAL",
  "NOT_INTERESTED",
] as const;
export type CustomerResponse = (typeof CUSTOMER_RESPONSES)[number];

export const PHOTO_TYPES = [
  "CUSTOMER",
  "EQUIPMENT",
  "EXISTING_PRODUCT",
  "NAMEPLATE",
  "WORKSHOP",
  "DOCUMENT",
  "OTHER",
] as const;
export type PhotoType = (typeof PHOTO_TYPES)[number];

export const OPPORTUNITY_STAGES = [
  "PROSPECT",
  "QUALIFIED",
  "PRESENTATION",
  "TRIAL",
  "QUOTATION",
  "NEGOTIATION",
  "WON",
  "LOST",
] as const;
export type OpportunityStage = (typeof OPPORTUNITY_STAGES)[number];

export const FOLLOW_UP_ACTIVITY_TYPES = [
  "CALL",
  "WHATSAPP",
  "EMAIL",
  "VISIT",
  "SEND_QUOTATION",
  "SEND_SAMPLE",
  "TRIAL_FOLLOWUP",
  "TECHNICAL_FOLLOWUP",
  "COLLECTION",
  "OTHER",
] as const;
export type FollowUpActivityType = (typeof FOLLOW_UP_ACTIVITY_TYPES)[number];

export const FOLLOW_UP_PRIORITIES = ["LOW", "MEDIUM", "HIGH"] as const;
export type FollowUpPriority = (typeof FOLLOW_UP_PRIORITIES)[number];

export const FOLLOW_UP_STATUSES = ["PENDING", "COMPLETED", "CANCELLED"] as const;
export type FollowUpStatus = (typeof FOLLOW_UP_STATUSES)[number];

// Warna badge per status, konsisten dipakai di semua screen.
// Pakai Tailwind class supaya langsung kepake di komponen.
export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "bg-green-100 text-green-800",
  PROSPECT: "bg-blue-100 text-blue-800",
  DORMANT: "bg-amber-100 text-amber-800",
  INACTIVE: "bg-gray-100 text-gray-600",
  LOST: "bg-red-100 text-red-800",
  WON: "bg-green-100 text-green-800",
  INTERESTED: "bg-green-100 text-green-800",
  CONSIDERING: "bg-amber-100 text-amber-800",
  NEUTRAL: "bg-gray-100 text-gray-600",
  NOT_INTERESTED: "bg-red-100 text-red-800",
  PENDING: "bg-amber-100 text-amber-800",
  PLANNED: "bg-blue-100 text-blue-800",
  IN_PROGRESS: "bg-amber-100 text-amber-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-gray-100 text-gray-600",
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  A: "bg-red-100 text-red-800",
  B: "bg-amber-100 text-amber-800",
  C: "bg-gray-100 text-gray-600",
};
