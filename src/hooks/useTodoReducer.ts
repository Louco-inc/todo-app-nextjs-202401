import { TodoType } from "@/pages/naoya";

type Action = {
  type: "init" | "create" | "update" | "delete";
  targetList?: TodoType[];
  target?: TodoType;
	targetId?: number;
};

export const useTodoReducer = (
  state: TodoType[],
  action: Action
): TodoType[] => {
  switch (action.type) {
    case "init": {
			if (!action.targetList) return state;
      return action.targetList;
    }
    case "create": {
			if (!action.target) return state;
      return [action.target, ...state];
    }
    case "update": {
      const { target } = action;
			if (!target) return state;
      const index = state.findIndex((todo) => todo.id === target.id);
      const convertedTodoList = state.toSpliced(index, 1, target);
      return convertedTodoList;
    }
    case "delete": {
      const { targetId } = action;
			if (!targetId) return state;
      return state.filter((todo) => todo.id !== targetId);
    }
    default:
      return state;
  }
};
