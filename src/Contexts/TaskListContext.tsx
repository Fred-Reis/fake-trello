import React from "react";
import TaskList from "../models/List";
import Task from "../models/Task";
import shortid from "shortid";

interface TaskListActions {
  deleteTask: (taskIndex: number, listIndex: number) => void;
  addNewTask: (title: string, listIndex: number) => void;
  deleteList: (listIndex: number) => void;
  addList: (title: string) => void;
  editListTitle: (title: string, listIndex: number) => void;
  editTaskTitle: (title: string, taskIndex: number, listIndex: number) => void;
  editTaskDate: (data: string, taskIndex: number, listIndex: number) => void;
  editCompleteState: (
    state: boolean,
    taskIndex: number,
    listIndex: number
  ) => void;
  editLabel: (labelid: string, taskIndex: number, listIndex: number) => void;
  deleteEveryLabel: (labelid: string) => void;
}

interface TaskContextType {
  allLists: {
    list: TaskList[];
  };
  setAllLists: React.Dispatch<
    React.SetStateAction<{
      list: TaskList[];
    }>
  >;
  taskListActions: TaskListActions;
}

export const TaskListContext = React.createContext<TaskContextType>({
  allLists: {
    list: [],
  },
  setAllLists: () => {},
  taskListActions: {
    deleteTask: (taskIndex: number, listIndex: number) => {},
    addNewTask: (title: string, listIndex: number) => {},
    deleteList: (listIndex: number) => {},
    addList: (title: string) => {},
    editListTitle: (title: string, listIndex: number) => {},
    editTaskTitle: (title: string, taskIndex: number, listIndex: number) => {},
    editTaskDate: (data: string, taskIndex: number, listIndex: number) => {},
    editCompleteState: (
      state: boolean,
      taskIndex: number,
      listIndex: number
    ) => {},
    editLabel: (labelid: string, taskIndex: number, listIndex: number) => {},
    deleteEveryLabel: (labelid: string) => {},
  },
});

interface Props {
  children: JSX.Element;
}

export const TaskListProvider = ({ children }: Props) => {
  const [allLists, setAllLists] = React.useState<{ list: TaskList[] }>({
    list: [],
  });
  const deleteTask = React.useCallback(
    (taskIndex: number, listIndex: number) => {
      const newList = { ...allLists };

      newList.list[listIndex].tasks.splice(taskIndex, 1);

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const addNewTask = React.useCallback(
    (title: string, listIndex: number) => {
      const newList = { ...allLists };
      const newTask: Task = {
        labels: [],
        title,
        id: shortid.generate(),
        date: "",
        complete: false,
      };
      newList.list[listIndex].tasks.push(newTask);
      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const deleteList = React.useCallback(
    (listIndex: number) => {
      const newList = { ...allLists };

      newList.list.splice(listIndex, 1);

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const addList = React.useCallback(
    (title: string) => {
      const newList = { ...allLists };

      const list = {
        id: shortid.generate(),
        tasks: [],
        title,
      };

      newList.list.push(list);

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const editListTitle = React.useCallback(
    (title: string, listIndex: number) => {
      const newList = { ...allLists };
      newList.list[listIndex].title = title;
      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const editTaskTitle = React.useCallback(
    (title: string, taskIndex: number, listIndex: number) => {
      const newList = { ...allLists };
      newList.list[listIndex].tasks[taskIndex].title = title;
      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const editTaskDate = React.useCallback(
    (date: string, taskIndex: number, listIndex: number) => {
      const newList = { ...allLists };
      newList.list[listIndex].tasks[taskIndex].date = date;
      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const editCompleteState = React.useCallback(
    (state: boolean, taskIndex: number, listIndex: number) => {
      const newList = { ...allLists };
      newList.list[listIndex].tasks[taskIndex].complete = state;
      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const editLabel = React.useCallback(
    (labelid: string, taskIndex: number, listIndex: number) => {
      const newList = { ...allLists };
      const hasLabel = newList.list[listIndex].tasks[
        taskIndex
      ].labels.findIndex((label) => label === labelid);

      if (hasLabel >= 0)
        newList.list[listIndex].tasks[taskIndex].labels = newList.list[
          listIndex
        ].tasks[taskIndex].labels.filter((label) => label !== labelid);
      else
        newList.list[listIndex].tasks[taskIndex].labels = [
          ...newList.list[listIndex].tasks[taskIndex].labels,
          labelid,
        ];

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const deleteEveryLabel = React.useCallback(
    (labelid: string) => {
      const newList = { ...allLists };

      newList.list = allLists.list.map((list) => ({
        ...list,
        tasks: list.tasks.map((task) => ({
          ...task,
          labels: task.labels.filter((label) => label !== labelid),
        })),
      }));

      setAllLists(newList);
    },
    [allLists, setAllLists]
  );

  const taskListActions = React.useMemo<TaskListActions>(
    () => ({
      deleteTask,
      addNewTask,
      deleteList,
      addList,
      editListTitle,
      editTaskTitle,
      editTaskDate,
      editLabel,
      deleteEveryLabel,
      editCompleteState,
    }),
    [
      deleteTask,
      addNewTask,
      deleteList,
      addList,
      editListTitle,
      editTaskTitle,
      editTaskDate,
      editLabel,
      deleteEveryLabel,
      editCompleteState,
    ]
  );

  return (
    <TaskListContext.Provider
      value={{ allLists, setAllLists, taskListActions }}
    >
      {children}
    </TaskListContext.Provider>
  );
};
