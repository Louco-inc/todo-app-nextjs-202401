import Header from "@/components/header";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  Input,
  Textarea,
  Select,
  Button,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Text,
  FormControl,
  useDisclosure,
  useToast,
  FormErrorMessage,
  IconButton,
  ModalFooter,
  ModalBody,
  ModalContent,
  Modal,
  AlertDialogOverlay,
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  Box,
  ModalCloseButton,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

// Todo statusもtypesで管理

type InputType = {
  id?: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
};

//Todo: idがInputとTodoTypeで2重になっている箇所を修正したい
type TodoType = InputType & {
  id: number;
  createdAt: string;
  updatedAt: string;
};

const formattedDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const defaultFormValue = {
  title: "",
  description: "",
  completionDate: formattedDate(new Date()),
  status: "todo",
};

export default function TodoListPage(): JSX.Element {
  const [todoList, setTodoList] = useState<TodoType[]>([]);
  const [todoForm, setTodoForm] = useState<InputType>(defaultFormValue);
  const [todoDetail, setTodoDetail] = useState<TodoType>();
  const [targetTodoId, setTargetTodoId] = useState<number | undefined>(
    undefined
  );
  const [isRegister, setIsRegister] = useState<boolean>(true);

  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure();
  const createdToast = useToast();

  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const init = async (): Promise<void> => {
      await fetchTodoList();
    };
    init();
  }, []);

  const fetchTodoList = async (): Promise<void> => {
    const list: TodoType[] = await fetch("/api/todo_lists/").then(
      async (res) => await res.json()
    );
    setTodoList(list);
  };

  const fetchTargetTodo = async (todoId: number): Promise<TodoType> => {
    const targetTodo = await fetch(`/api/todo_lists/${todoId}`).then(
      async (r) => await r.json()
    );
    return targetTodo;
  };

  const validateTodo = (): boolean => {
    // nullチェック
    if (!todoForm.title || !todoForm.status || !todoForm.completionDate) {
      createdToast({
        title: "未入力の項目があります",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    if (todoForm.title.length > 20) {
      createdToast({
        title: "入力文字数の上限を超えています。",
        description: "上限は20文字です。",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return false;
    }
    return true;
  };

  const registerTodo = async (): Promise<void> => {
    if (!validateTodo()) {
      return;
    }
    const params = {
      title: todoForm.title,
      description: todoForm.description,
      completionDate: new Date(todoForm.completionDate),
      status: todoForm.status,
    };
    await fetch("/api/todo_lists", {
      method: "POST",
      body: JSON.stringify(params),
    })
      .then(async (r) => {
        const newTodo: TodoType = await r.json();
        setTodoList((prev) => [newTodo, ...prev]);
        setTodoForm(defaultFormValue);
        createdToast({
          title: "タスクが登録されました。",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
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
        });
      });
  };

  const updateTodo = async (): Promise<void> => {
    if (!validateTodo()) {
      return;
    }
    const params = {
      title: todoForm.title,
      description: todoForm.description,
      completionDate: new Date(todoForm.completionDate),
      status: todoForm.status,
    };

    await fetch(`/api/todo_lists/${todoForm.id}`, {
      method: "PUT",
      body: JSON.stringify(params),
    })
      .then(async (r) => {
        const targetTodo: TodoType = await r.json();
        setTodoList((prev) => {
          const index = prev.findIndex((todo) => todo.id === targetTodo.id);
          const convertedTodoList = prev.toSpliced(index, 1, targetTodo);
          return convertedTodoList;
        });
        setTodoForm(defaultFormValue);
        setIsRegister(true);
        createdToast({
          title: "タスクが更新されました。",
          description: "",
          status: "success",
          duration: 3000,
          isClosable: true,
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
        });
      });
  };

  const deleteTodo = async (todoId: number | undefined): Promise<void> => {
    if (!todoId) {
      console.log(todoId + ":idが指定されていません");
      return;
    }
    const res = await fetch(`/api/todo_lists/${todoId}`, {
      method: "DELETE",
      body: JSON.stringify({ id: todoId }),
    });
    if (res.status === 200) {
      setTodoList((prev) => prev.filter((todo) => todo.id !== todoId));
      createdToast({
        title: "タスクが削除されました",
        description: "",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } else {
      console.log("タスクの削除に失敗しました。");
      createdToast({
        title: "タスクの削除に失敗しました。",
        description: "",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    onCloseDeleteDialog();
  };

  const convertedStatusBadge = (status: string): JSX.Element => {
    switch (status) {
      case "todo":
        return <Text className="uppercase">{status}</Text>;
      case "inProgress":
        return (
          <Text colorScheme="purple" className="uppercase">
            {status}
          </Text>
        );
      case "done":
        return (
          <Text colorScheme="green" className="uppercase">
            {status}
          </Text>
        );
      default:
        return <></>;
    }
  };

  const openTodoDetail = async (todoId: number): Promise<void> => {
    const targetTodo = await fetchTargetTodo(todoId);
    setTodoDetail(targetTodo);
    onOpenDetailModal();
  };

  const editTodo = async (todoId: number): Promise<void> => {
    const targetTodo = await fetchTargetTodo(todoId);
    setTodoForm({
      id: targetTodo.id,
      title: targetTodo.title,
      description: targetTodo.description,
      completionDate: formattedDate(new Date(targetTodo.completionDate)),
      status: targetTodo.status,
    });
    setIsRegister(false);
  };

  return (
    <>
      <div>
        <Header />
        <Flex className="px-8 bg-main-bg-color">
          <div className="w-96 pt-8 pr-20 border-r border-solid border-r-border-gray">
            <FormControl className="mb-4">
              <label className="font-bold">タスク名</label>
              <Input
                className="mt-2 !bg-white"
                type="text"
                isRequired
                value={todoForm.title}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
              />
              <FormErrorMessage>
                タスク名が入力されていません。
              </FormErrorMessage>
            </FormControl>
            <FormControl className="mb-4">
              <label className="font-bold">説明</label>
              <Textarea
                className="mt-2 !bg-white"
                value={todoForm.description}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl className="mb-4">
              <label className="font-bold">期日</label>
              <Input
                className="mt-2 !bg-white"
                type="date"
                isRequired
                value={todoForm.completionDate}
                onChange={(e) =>
                  setTodoForm((prev) => ({
                    ...prev,
                    completionDate: e.target.value,
                  }))
                }
              />
            </FormControl>
            <FormControl className="mb-4">
              <label className="font-bold">ステータス</label>
              <Select
                className="mt-2 !bg-white"
                value={todoForm.status}
                isRequired
                onChange={(e) =>
                  setTodoForm(
                    (prev): InputType => ({
                      ...prev,
                      status: e.target.value,
                    })
                  )
                }
              >
                <option value="todo">todo</option>
                <option value="inProgress">inProgress</option>
                <option value="done">done</option>
              </Select>
            </FormControl>
            <Button
              className="mb-4 mt-8 w-80"
              bg="mainColor"
              color="white"
              _hover={{ color: "", borderColor: "" }}
              onClick={async () =>
                isRegister ? await registerTodo() : await updateTodo()
              }
            >
              {isRegister ? "登録" : "更新"}
            </Button>
          </div>
          <TableContainer className="pt-8 pl-10">
            <Table>
              <Thead>
                <Tr>
                  <Th>タスク名</Th>
                  <Th>ステータス</Th>
                  <Th>期日</Th>
                  <Th>更新日</Th>
                </Tr>
              </Thead>
              <Tbody>
                {todoList.map((todo) => (
                  <Tr key={"todo-item-" + todo.id} className="bg-white">
                    <Th className="!py-2">
                      <span
                        className="hover:cursor-pointer !normal-case"
                        onClick={async () => await openTodoDetail(todo.id)}
                      >
                        {todo.title}
                      </span>
                    </Th>
                    <Th className="!py-2">
                      {convertedStatusBadge(todo.status)}
                    </Th>
                    <Th className="!py-2">
                      {formattedDate(new Date(todo.completionDate))}
                    </Th>
                    <Th className="!py-2">
                      {formattedDate(new Date(todo.updatedAt))}
                    </Th>
                    <Th className="!py-2">
                      <IconButton
                        variant="unstyled"
                        className="!min-w-0 !min-h-0"
                        aria-label="Search database"
                        icon={<EditIcon />}
                        onClick={async () => await editTodo(todo.id)}
                      />
                    </Th>
                    <Th className="!py-2">
                      <IconButton
                        variant="unstyled"
                        className="!min-w-0 !min-h-0"
                        aria-label="Search database"
                        icon={<DeleteIcon />}
                        onClick={() => {
                          setTargetTodoId(todo.id);
                          onOpenDeleteDialog();
                        }}
                      />
                    </Th>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
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
              削除するともとに戻せません。よろしいですか？
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCloseDeleteDialog}>
                キャンセル
              </Button>
              <Button
                colorScheme="red"
                onClick={async () => await deleteTodo(targetTodoId)}
                ml={3}
              >
                削除
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Modal isOpen={isOpenDetailModal} onClose={onCloseDetailModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{todoDetail?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <div>{convertedStatusBadge(todoDetail?.status ?? "")}</div>
              <div>{todoDetail?.description}</div>
              <div>
                完了予定日：
                {formattedDate(new Date(todoDetail?.completionDate ?? ""))}
              </div>
              <div>
                登録日：
                {formattedDate(new Date(todoDetail?.createdAt ?? ""))}
              </div>
              <div>
                更新日：
                {formattedDate(new Date(todoDetail?.updatedAt ?? ""))}
              </div>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="teal"
              mr={3}
              onClick={() => {
                setTodoForm({
                  id: todoDetail?.id,
                  title: todoDetail?.title ?? "",
                  description: todoDetail?.description,
                  completionDate: formattedDate(
                    new Date(todoDetail?.completionDate ?? "")
                  ),
                  status: todoDetail?.status ?? "todo",
                });
                setIsRegister(false);
                onCloseDetailModal();
              }}
            >
              編集
            </Button>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                setTargetTodoId(todoDetail?.id);
                onCloseDetailModal();
                onOpenDeleteDialog();
              }}
            >
              削除
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
