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
import { useEffect } from "react";

type TodoType = {
  id: number;
  title: string;
  description?: string;
  completionDate: string;
  status: string;
  createdAt?: string;
  updatedAt: string;
};

export default function TodoListPage(): JSX.Element {

  useEffect(() => {}, []);
  
  const fetchToDoList = async (): Promise<void> => {
    const lists: TodoType[] = await fetch("/api/todo_lists").then(
      async (r) => await r.json()
    );
    console.log(lists);
  };

  return (
    <>
      <Header />
      <Flex className="justify-between">
        <div className="px-8 bg-main-bg-color pt-8 border-r border-solid border-r-border-gray">
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
            onClick={fetchToDoList}
            className="m-8"
            bg="mainColor"
            color="white"
          >
            登録
          </Button>
        </div>
        <div className="w-full px-8 bg-main-bg-color pt-8">
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
                <Tr>
                  <Td>
                    <Text>タスク１</Text>
                  </Td>
                  <Td>
                    <Text>TODO</Text>
                  </Td>
                  <Td>
                    <Text>2999/12/31</Text>
                  </Td>
                  <Td>
                    <Text>2999/12/31</Text>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Search database"
                      icon={<EditIcon />}
                    />
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Search database"
                      icon={<DeleteIcon />}
                    />
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </div>
      </Flex>
    </>
  );
}
