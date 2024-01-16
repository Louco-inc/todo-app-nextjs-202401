import Header from "@/components/header";
import React, { useEffect, useState } from "react";
// import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  // FormErrorMessage,
  // FormHelperText,
  Button,
  // ButtonGroup,
  Input,
  Textarea,
  Select,
  Table,
  Thead,
  Tbody,
  // Tfoot,
  Tr,
  Th,
  // Td,
  // TableCaption,
  TableContainer,
} from "@chakra-ui/react";

type TodoType = {
  id: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
  createdAt?: string;
  updatedAt: string;
};

type TodoFormType = {
  id?: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
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
  const [todoForm, setTodoForm] = useState<TodoFormType>(defaultFormValue);

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

  const registerTodo = async (): Promise<void> => {
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
  };

  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color pt-8">
        <div className="flex">
          <div className="flex-1">
            <FormControl>
              <FormLabel>タスク名</FormLabel>
              <Input type="text" />
            </FormControl>
            <FormControl>
              <FormLabel>説明</FormLabel>
              <Textarea />
            </FormControl>
            <FormControl>
              <FormLabel>期日</FormLabel>
              <Input type="date" />
            </FormControl>
            <FormControl>
              <FormLabel>ステータス</FormLabel>
              <Select>
                <option>todo</option>
                <option>inProgress</option>
                <option>done</option>
              </Select>
            </FormControl>
            <Button
              colorScheme='blue'
              onClick={async () =>
                registerTodo()}
            >登録
            </Button>
          </div>
          <div className="flex-1">
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>タスク名</Th>
                    <Th>ステータス</Th>
                    <Th>期日</Th>
                    <Th>更新日</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((item) => {
                    return (
                      <Tr key={item.id}>
                        <Th>{item.title}</Th>
                        <Th>{item.status}</Th>
                        <Th>{item.completionDate}</Th>
                        <Th>{item.updatedAt}</Th>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>
    </>
  );
}
