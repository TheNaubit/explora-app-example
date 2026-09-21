export type ActivityCategory = "Outdoors" | "Culture" | "Workshops" | "Leisure";

export type Activity = {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  location: string;
  durationMinutes: number;
};

export type ActivitiesDataset = {
  schemaVersion: number;
  activities: Activity[];
};
