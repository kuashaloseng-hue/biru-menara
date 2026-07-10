export interface ScheduleMatchInput {
  sport: string;
  gender: string;
  level: string;
  /** @nullable */
  venue?: string | null;
  /** @nullable */
  date?: string | null;
  /** @nullable */
  time?: string | null;
  /** @nullable */
  notes?: string | null;
  status?: string;
  /** @nullable */
  result?: string | null;
  sortOrder?: number;
  published?: boolean;
}
