export interface Task {
  id: string;
  user_id: string;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  created_at: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
}
