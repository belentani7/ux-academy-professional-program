export const capstoneCriteriaKeys = ["research", "ai", "wireframes", "ui", "accessibility", "testing", "documentation", "portfolio"] as const;
export const capstoneLevels = ["novice", "competent", "advanced", "professional"] as const;
export type CapstoneCriterion = (typeof capstoneCriteriaKeys)[number];
export type CapstoneLevel = (typeof capstoneLevels)[number];
export type CapstoneCriteria = Record<CapstoneCriterion, CapstoneLevel>;

export function deriveCapstoneLevel(criteria: CapstoneCriteria): CapstoneLevel {
  return capstoneLevels[Math.min(...capstoneCriteriaKeys.map(key => capstoneLevels.indexOf(criteria[key])))];
}

export function meetsCapstoneLevel(level: CapstoneLevel, minimum: CapstoneLevel) {
  return capstoneLevels.indexOf(level) >= capstoneLevels.indexOf(minimum);
}
