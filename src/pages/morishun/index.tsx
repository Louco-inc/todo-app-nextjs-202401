import Header from "@/components/header";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Flex,
  Input,
  Icon,
  IconButton,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
  Textarea,
  Select,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";

type TodoStatusType = "todo" | "inProgress" | "done";

type TodoFormType = {
  id?: number;
  title: string;
  description?: string;
  completionDate: string;
  status: TodoStatusType;
};

type TodoType = TodoFormType & {
  id: number;
  createdAt?: string;
  updatedAt: string;
};

// ステータス横に表示するバッチのアイコンのPropsの型を指定する
// 参考：https://chakra-ui.com/docs/components/icon/props#icon-props
type IconPropsType = {
  viewBox?: string;
  boxSize?: string;
  color?: string;
  focusable?: boolean;
  role?: "presentation" | "img";
  children?: React.ReactNode;
};

// 日付を「yyyy-mm-dd」にフォーマット
// 参考：https://ribbit.konomi.app/blog/javascript-date-format/
const getFormattedDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

const defaultTodoFormValue: TodoFormType = {
  title: "",
  description: "",
  completionDate: getFormattedDate(new Date()),
  status: "todo",
};

// ステータス横に表示するバッチのアイコンのコンポーネントを作成
// 参考：https://chakra-ui.com/docs/components/icon/usage#using-the-icon-component
const CircleIcon = (props: IconPropsType): JSX.Element => (
  <Icon viewBox="0 0 200 200" {...props}>
    <path
      fill="currentColor"
      d="M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0"
    />
  </Icon>
);

export default function TodoListPage(): JSX.Element {
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [todoForm, setTodoForm] = useState<TodoFormType>(defaultTodoFormValue);
  const [targetTodoId, setTargetTodoId] = useState<number | undefined>(
    undefined
  );
  const [targetTodoTitle, setTargetTodoTitle] = useState<string | undefined>(
    undefined
  );
  const [isRegister, setIsRegister] = useState<boolean>(true);
  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const createdToast = useToast();

  useEffect(() => {
    const init = async (): Promise<void> => {
      await fetchTodoList();
    };
    init();
  }, []);

  const fetchTodoList = async (): Promise<void> => {
    const lists: TodoType[] = await fetch("/api/todo_lists").then(
      async (r) => await r.json()
    );
    setTodoList(lists);
  };

  const fetchTargetTodo = async (todoId: number): Promise<TodoType> => {
    const targetTodo: TodoType = await fetch(`/api/todo_lists/${todoId}`).then(
      async (r) => await r.json()
    );
    return targetTodo;
  };

  // Todoを登録するメソッド
  const registerTodo = async (): Promise<void> => {
    // ToDo登録APIに渡すパラメータに入力した値を設定
    const params = {
      title: todoForm.title,
      description: todoForm.description,
      completionDate: new Date(todoForm.completionDate),
      status: todoForm.status,
    };
    // ToDo登録APIを呼び出す
    await fetch("/api/todo_lists", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then(async (r) => {
        console.log(r);
        const newTodo: TodoType = await r.json();
        setTodoList((prev) => [newTodo, ...prev]);
        setTodoForm(defaultTodoFormValue);
        createdToast({
          title: "タスクが登録されました。",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      })
      .catch((e) => {
        console.log(e);
        createdToast({
          title: "タスクの登録に失敗しました。",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      });
  };

  // ToDoを更新するメソッド
  const updateTodo = async (): Promise<void> => {
    // ToDo更新APIに渡すパラメータに入力した値を設定
    const params = {
      title: todoForm.title,
      description: todoForm.description,
      completionDate: new Date(todoForm.completionDate),
      status: todoForm.status,
    };
    // ToDo更新APIを呼び出す
    await fetch(`/api/todo_lists/${todoForm.id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    })
      .then(async (r) => {
        console.log(r);
        const targetTodo: TodoType = await r.json();
        setTodoList((prev) => {
          const index = prev.findIndex((todo) => todo.id === targetTodo.id);
          const convertedTodoList = prev.toSpliced(index, 1, targetTodo);
          return convertedTodoList;
        });
        setTodoForm(defaultTodoFormValue);
        setIsRegister(true);
        createdToast({
          title: "タスクが更新されました。",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      })
      .catch((e) => {
        console.log(e);
        createdToast({
          title: "タスクの更新に失敗しました。",
          description: "",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom-right",
        });
      });
  };

  // Todoを削除するメソッド
  const deleteTodo = async (todoId: number | undefined): Promise<void> => {};

  // 更新対象のToDoを入力欄に表示させる
  const editTodo = async (todoId: number): Promise<void> => {
    const targetTodo = await fetchTargetTodo(todoId);
    setTodoForm({
      id: targetTodo.id,
      title: targetTodo.title,
      description: targetTodo.description,
      completionDate: getFormattedDate(new Date(targetTodo.completionDate)),
      status: targetTodo.status,
    });
    setIsRegister(false);
  };

  const convertedStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "todo":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="gray.400" />
            <Text className="uppercase">{status}</Text>
          </HStack>
        );
      case "inProgress":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="red.400" />
            <Text className="uppercase">{status}</Text>
          </HStack>
        );
      case "done":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="green.400" />
            <Text className="uppercase">{status}</Text>
          </HStack>
        );
      default:
        return <></>;
    }
  };

  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color">
        <Flex>
          <div className="w-1/3 pt-8 pr-8 border-r border-solid border-r-border-gray">
            <FormControl>
              <FormLabel className="font-bold">タスク名</FormLabel>
              <Input
                className="!bg-white"
                type="text"
                isRequired
                value={todoForm.title}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">説明</FormLabel>
              <Textarea
                className="!bg-white"
                value={todoForm.description}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              ></Textarea>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">期日</FormLabel>
              <Input
                className="!bg-white"
                type="date"
                isRequired
                value={todoForm.completionDate}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    completionDate: e.target.value,
                  }))
                }
              ></Input>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">ステータス</FormLabel>
              <Select
                className="!bg-white"
                value={todoForm.status}
                isRequired
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    status: e.target.value as TodoStatusType,
                  }))
                }
              >
                <option value="todo">TODO</option>
                <option value="inProgress">INPROGRESS</option>
                <option value="done">DONE</option>
              </Select>
            </FormControl>
            <Button
              onClick={async () => {
                isRegister ? await registerTodo() : await updateTodo();
              }}
              className="mb-4 mt-8 w-full"
              bg="mainColor"
              color="white"
            >
              {isRegister ? "登録" : "更新"}
            </Button>
          </div>
          <div className="w-2/3 px-8 pt-8 flex justify-center">
            <TableContainer>
              <Table
                variant="simple"
                className="table-fixed !border-separate	border-spacing-x-0 border-spacing-y-2"
              >
                <Thead>
                  <Tr>
                    <Th className="w-4/12 !normal-case">タスク名</Th>
                    <Th className="!normal-case">ステータス</Th>
                    <Th className="!normal-case">期日</Th>
                    <Th className="!normal-case">更新日</Th>
                    <Th className="w-1/12"></Th>
                    <Th className="w-1/12"></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((todo) => (
                    <Tr key={"todo-item-" + todo.id} className="bg-white">
                      <Td className="!py-2">
                        <Text>{todo.title}</Text>
                      </Td>
                      <Td className="!py-2">
                        {convertedStatusBadge(todo.status)}
                      </Td>
                      <Td className="!py-2">
                        <Text>
                          {getFormattedDate(new Date(todo.completionDate))}
                        </Text>
                      </Td>
                      <Td className="!py-2">
                        <Text>
                          {getFormattedDate(new Date(todo.updatedAt))}
                        </Text>
                      </Td>
                      <Td className="!py-2">
                        <IconButton
                          variant="unstyled"
                          aria-label="Search database"
                          icon={<EditIcon />}
                          onClick={async () => await editTodo(todo.id)}
                        />
                      </Td>
                      <Td className="!py-2">
                        <IconButton
                          variant="unstyled"
                          aria-label="Search database"
                          icon={<DeleteIcon />}
                          onClick={() => {
                            setTargetTodoId(todo.id);
                            setTargetTodoTitle(todo.title);
                            onOpenDeleteDialog();
                          }}
                        />
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </Flex>
      </div>
      <AlertDialog
        isOpen={isOpenDeleteDialog}
        leastDestructiveRef={cancelRef}
        onClose={onCloseDeleteDialog}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              タスクの削除
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text>以下のタスクを削除します。</Text>
              <Text>削除すると元に戻りません。よろしいですか？</Text>
              <Text className="mt-5">タスク名：{targetTodoTitle}</Text>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => {
                  await deleteTodo(targetTodoId);
                  onCloseDeleteDialog();
                }}
                ml={3}
              >
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}
