import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query";
import { customFetch } from "./custom-fetch";

export interface Athlete {
  id: number;
  scheduleId: number;
  name: string;
  studentId: string;
  grade: string;
  sortOrder: number;
}

export interface AthleteInput {
  name: string;
  studentId?: string;
  grade?: string;
  sortOrder?: number;
}

export interface AthleteUpdate {
  name?: string;
  studentId?: string;
  grade?: string;
  sortOrder?: number;
}

// ── Query keys ──────────────────────────────────────────────────────────────

export const getListScheduleAthletesQueryKey = (scheduleId: number) =>
  [`/api/schedules/${scheduleId}/athletes`] as const;

// ── Raw fetchers ─────────────────────────────────────────────────────────────

export const listScheduleAthletes = (scheduleId: number, options?: RequestInit) =>
  customFetch<Athlete[]>(`/api/schedules/${scheduleId}/athletes`, {
    ...options,
    method: "GET",
  });

export const createAthlete = (
  scheduleId: number,
  data: AthleteInput,
  options?: RequestInit
) =>
  customFetch<Athlete>(`/api/schedules/${scheduleId}/athletes`, {
    ...options,
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateAthlete = (
  id: number,
  data: AthleteUpdate,
  options?: RequestInit
) =>
  customFetch<Athlete>(`/api/athletes/${id}`, {
    ...options,
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteAthlete = (id: number, options?: RequestInit) =>
  customFetch<void>(`/api/athletes/${id}`, { ...options, method: "DELETE" });

// ── React Query hooks ────────────────────────────────────────────────────────

export function useListScheduleAthletes(
  scheduleId: number,
  options?: { query?: UseQueryOptions<Athlete[]> }
) {
  return useQuery<Athlete[]>({
    queryKey: getListScheduleAthletesQueryKey(scheduleId),
    queryFn: ({ signal }) => listScheduleAthletes(scheduleId, { signal }),
    ...options?.query,
  });
}

export function useCreateAthlete(
  scheduleId: number,
  options?: { mutation?: UseMutationOptions<Athlete, unknown, AthleteInput> }
) {
  const qc = useQueryClient();
  return useMutation<Athlete, unknown, AthleteInput>({
    mutationFn: (data) => createAthlete(scheduleId, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListScheduleAthletesQueryKey(scheduleId) }),
    ...options?.mutation,
  });
}

export function useUpdateAthlete(
  scheduleId: number,
  options?: {
    mutation?: UseMutationOptions<Athlete, unknown, { id: number; data: AthleteUpdate }>;
  }
) {
  const qc = useQueryClient();
  return useMutation<Athlete, unknown, { id: number; data: AthleteUpdate }>({
    mutationFn: ({ id, data }) => updateAthlete(id, data),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListScheduleAthletesQueryKey(scheduleId) }),
    ...options?.mutation,
  });
}

export function useDeleteAthlete(
  scheduleId: number,
  options?: { mutation?: UseMutationOptions<void, unknown, number> }
) {
  const qc = useQueryClient();
  return useMutation<void, unknown, number>({
    mutationFn: (id) => deleteAthlete(id),
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: getListScheduleAthletesQueryKey(scheduleId) }),
    ...options?.mutation,
  });
}
