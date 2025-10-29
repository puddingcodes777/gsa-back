export const CollectableTypes = [
  "comic Books",
  "magazines",
  "pokemon",
  "basketball",
  "baseball",
  "soccer",
  "football"
] as const;

export type CollectableType = (typeof CollectableTypes)[number];

export const isCollectableType = (value: string): value is CollectableType =>
  CollectableTypes.includes(value as CollectableType);

// export const CertTypes = [
//   "Standard",
//   "Autograph",
//   "Set Registry",
//   "Bulk",
//   "Cross-over",
//   "Vintage",
// ] as const;

// export type CertType = (typeof CertTypes)[number];

export interface Collectable {
  uid: string;
  name?: string;
  manufacturer?: string;
  type: CollectableType;
  description: string;
  year: number;
  width: number;
  height: number;
  sport: string;
  image: string;
  report?: Report;
  user?: string;
}

export interface Report {
  grade: string;
  surface: number;
  center: number;
  corner: number;
  edge: number;
  certNumber: string;
  certType: string;
}