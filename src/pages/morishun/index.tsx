import Header from "@/components/header";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";

import {
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

// ステータス横に表示するバッチのアイコンのコンポーネントを作成
// 参考：https://chakra-ui.com/docs/components/icon/usage#using-the-icon-component
const CircleIcon = (props: IconPropsType): JSX.Element => (
  <Icon viewBox='0 0 200 200' {...props}>
    <path
      fill='currentColor'
      d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0'
    />
  </Icon>
)

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

  const convertedStatusBadge = (status: string): JSX.Element => {
    switch(status) {
      case "todo":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="gray.400"/>
            <Text className="uppercase">{status}</Text>
          </HStack>
        );
      case "inProgress":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="red.400"/>
            <Text className="uppercase">{status}</Text>
          </HStack>
        );
      case "done":
        return (
          <HStack>
            <CircleIcon boxSize="3" color="green.400"/>
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
