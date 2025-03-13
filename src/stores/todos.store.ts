import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";
import type { Board, Column, Task } from "../types/index.d";

export const useTodosStore = defineStore("todos-store", () => {
  const router = useRouter();
  const route = useRoute();

  const boards = ref<Board[]>([
    {
      id: 1,
      title: "Test board",
      columns: [
        {
          id: 1,
          name: "To-Do",
          tasks: [
            {
              id: 1,
              title: "task 1",
              priority: "Low",
              columnId: 1,
              complated: false,
            },
            {
              id: 2,
              title: "task 2",
              priority: "Medium",
              columnId: 1,
              complated: false,
            },
          ],
        },
        {
          id: 2,
          name: "In Progress",
          tasks: [
            {
              id: 3,
              title: "task 3",
              priority: "Low",
              columnId: 2,
              complated: false,
            },
            {
              id: 4,
              title: "task 4",
              priority: "Low",
              columnId: 2,
              complated: false,
            },
          ],
        },
        {
          id: 3,
          name: "Done",
          tasks: [
            {
              id: 5,
              title: "task 5",
              priority: "High",
              columnId: 3,
              complated: true,
            },
          ],
        },
      ],
    },
  ]);

  const getBoard = () => {
    return boards.value.find((board) => board.id === Number(route.query.board));
  };

  const createBoard = (title: string) => {
    const randomId = Math.floor(Math.random() * 1000);
    boards.value.push({
      id: randomId,
      title: title,
      columns: [],
    });

    router.push({ path: "/", query: { board: randomId } });
  };

  const createColumn = (name: string): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      currentBoard.columns.push({
        id: Math.floor(Math.random() * 1000),
        name: name,
        tasks: [],
      });
    }
  };

  const editColumn = (columnId: number, name: string): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      let currentColumn = currentBoard.columns.find(
        (column) => column.id === columnId
      );

      if (currentColumn) {
        currentColumn.name = name;
      }
    }
  };

  const deleteColumn = (columnId: number): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      currentBoard.columns = currentBoard.columns.filter(
        (column) => column.id !== columnId
      );
    }
  };

  const createTask = (columnId: number, data: Task): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      let currentColumn = currentBoard.columns.find(
        (column) => column.id === columnId
      );

      if (currentColumn) {
        currentColumn.tasks.push({
          ...data,
          id: Math.floor(Math.random() * 1000),
        } as Task);
      }
    }
  };

  const editTask = (columnId: number, data: Task): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      let currentColumn = currentBoard.columns.find(
        (column) => column.id === columnId
      );

      if (currentColumn) {
        let currentTask = currentColumn.tasks.find(
          (task) => task.id === data.id
        );

        if (currentTask) {
          currentTask.title = data.title;
          currentTask.priority = data.priority;
        }
      }
    }
  };

  const deleteTask = (columnId: number, taskId: number): void => {
    let currentBoard = getBoard();

    if (currentBoard) {
      let currentColumn = currentBoard.columns.find(
        (column) => column.id === columnId
      );

      if (currentColumn) {
        currentColumn.tasks = currentColumn.tasks.filter(
          (task) => task.id !== taskId
        );
      }
    }
  };

  let draggedTaskId: number | null = null;
  let taskColumnId: number | null = null;

  const onDragStart = (event: DragEvent, taskId: number, columnId: number) => {
    draggedTaskId = taskId;
    taskColumnId = columnId;

    event.dataTransfer?.setData("taskId", taskId.toString());
  };

  const onDrop = (event: DragEvent, targetColumnId: number) => {
    event.preventDefault();

    if (!draggedTaskId) return;

    let currentBoard = getBoard();

    if (currentBoard) {
      const column = currentBoard.columns.find(
        (column) => column.id === taskColumnId
      );
      const task = column?.tasks.find((task) => task.id === draggedTaskId);
      const taskColumn = currentBoard.columns.find(
        (column) => column.id === task?.columnId
      );

      if (targetColumnId == taskColumn?.id) return;

      if (column && task && taskColumn) {
        const targetColumn = currentBoard.columns.find(
          (column) => column.id === targetColumnId
        );

        targetColumn?.tasks.push({
          ...task,
          columnId: targetColumnId,
        });

        taskColumn.tasks = taskColumn.tasks.filter(
          (task) => task.id !== draggedTaskId
        );

        draggedTaskId = null;
        taskColumnId = null;
      }
    }
  };

  return {
    boards,
    createBoard,
    createColumn,
    editColumn,
    deleteColumn,
    createTask,
    editTask,
    deleteTask,
    onDragStart,
    onDrop,
  };
});
