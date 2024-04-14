export type TrackId = string | number;

export interface TrackSettings<T> {
  id: TrackId;
  type: T;
  name?: string;
}
