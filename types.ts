
export interface UserSettings {
  isSetupComplete: boolean;
  breakfastTime: string;
  lunchTime: string;
  dinnerTime: string;
  contactName: string;
  contactPhone: string;
}

export interface MealLog {
  id: string;
  timestamp: number;
  mealType: 'Breakfast' | 'Lunch' | 'Dinner' | 'Extra';
  response: 'YES' | 'NOT_YET';
}

export interface AppState {
  settings: UserSettings;
  logs: MealLog[];
  lastSmsSentAt: number | null;
}
