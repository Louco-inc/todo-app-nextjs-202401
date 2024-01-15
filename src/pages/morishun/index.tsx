import Header from "@/components/header";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
  Button,
  FormControl,
  FormLabel,
  Flex,
  Input,
  IconButton,
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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

type TodoType = {
  id: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
  createdAt?: string;
  updatedAt: string;
};

// 日付を「yyyy-mm-dd」にフォーマット
// 参考：https://ribbit.konomi.app/blog/javascript-date-format/
const getFormattedDate = (date: Date): string => {
  return date.toISOString().split("T")[0];
};

export default function TodoListPage(): JSX.Element {
  const [todoList, setTodoList] = useState<TodoType[]>([]);

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

  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color">
        <Flex>
          <div className="w-96 pt-8 pr-8 border-r border-solid border-r-border-gray">
            <FormControl>
              <FormLabel className="font-bold">タスク名</FormLabel>
              <Input className="!bg-white" type="text"></Input>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">説明</FormLabel>
              <Textarea className="!bg-white"></Textarea>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">期日</FormLabel>
              <Input className="!bg-white" type="date"></Input>
            </FormControl>
            <FormControl>
              <FormLabel className="font-bold">ステータス</FormLabel>
              <Select className="!bg-white">
                <option value="todo">TODO</option>
                <option value="inProgress">INPROGRESS</option>
                <option value="done">DONE</option>
              </Select>
            </FormControl>
            <Button
              onClick={() => {}}
              className="mb-4 mt-8 w-80"
              bg="mainColor"
              color="white"
            >
              登録
            </Button>
          </div>
          <div className="w-full px-8 pt-8 flex justify-center">
            <TableContainer>
              <Table>
                <Thead>
                  <Tr>
                    <Th>タスク名</Th>
                    <Th>ステータス</Th>
                    <Th>期日</Th>
                    <Th>更新日</Th>
                    <Th></Th>
                    <Th></Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((todo) => (
                    <Tr key={"todo-item-" + todo.id}>
                      <Td className="!py-2">
                        <Text>{todo.title}</Text>
                      </Td>
                      <Td className="!py-2">
                        <Text>{todo.status}</Text>
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
                          aria-label="Search database"
                          icon={<EditIcon />}
                        />
                      </Td>
                      <Td className="!py-2">
                        <IconButton
                          aria-label="Search database"
                          icon={<DeleteIcon />}
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
    </>
  );
}
