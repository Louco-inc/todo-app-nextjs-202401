import Header from "@/components/header";
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
  Td,
  FormControl,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Todo statusもtypesで管理

type InputType = {
  id: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
};

type TodoType = InputType & {
  createdAt: string;
  updatedAt: string;
};

// const defaultFormValue = {
//   title: "",
//   description: "",
//   completionDate: "",
//   status: "todo",
// };

export default function TodoListPage(): JSX.Element {
  const [todoList, setTodoList] = useState<TodoType[]>([]);

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

  return (
    <div>
      <Header />
      <Flex className="bg-main-bg-color">
        <div>
          <FormControl className="pt-10">
            <label className="text-base font-bold">タスク名</label>
            <div className="bg-white">
              <Input></Input>
            </div>
          </FormControl>
          <FormControl className="pt-8">
            <label className="text-base font-bold">説明</label>
            <div className="bg-white">
              <Textarea></Textarea>
            </div>
          </FormControl>
          <FormControl className="pt-3">
            <label className="text-base font-bold">期日</label>
            <div className="bg-white">
              <input type="date" />
            </div>
          </FormControl>
          <FormControl className="pt-12">
            <label className="text-base font-bold">ステータス</label>
            <div className="bg-white">
              <Select>
                <option>todo</option>
                <option>inProgress</option>
                <option>done</option>
              </Select>
            </div>
          </FormControl>
          <div className="pt-16 pb-52 flex justify-center">
            <Button colorScheme="blue" className="Flex">
              登録
            </Button>
          </div>
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
              {todoList.map((todo) => {
                return (
                  <Tr key={"todo-" + todo.id} className="bg-white">
                    <Td className="text-base font-bold">{todo.title}</Td>
                    <Td className="text-base font-bold">{todo.status}</Td>
                    <Td className="text-base">{todo.completionDate}</Td>
                    <Td className="text-base">{todo.updatedAt}</Td>
                    <Td>
                      <Button>編集</Button>
                    </Td>
                    <Td>
                      <Button>削除</Button>
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </Flex>
    </div>
  );
}
