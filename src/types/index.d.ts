export interface Board {
  id: number;
  title: string;
  columns: Column[];
}

export interface Column {
  id: number;
  name: string;
  tasks: Task[];
}

export interface Task {
  id: number;
  title: string;
  priority: "Low" | "Medium" | "High";
  columnId: number;
  complated: boolean;
  editing?: boolean;
}
