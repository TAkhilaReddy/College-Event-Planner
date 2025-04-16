export interface EventData {
  event_id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  category_id: number;
  category_name: string;
}

export interface CategoryData {
  category_id: number;
  name: string;
}