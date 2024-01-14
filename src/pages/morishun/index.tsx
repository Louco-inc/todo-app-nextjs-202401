import Header from "@/components/header";

import {
  Button,
  Card,
  CardBody,
  FormControl,
  FormLabel,
  Input,
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

export default function TodoListPage(): JSX.Element {
  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color pt-8">
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
        <Button className="m-8" colorScheme="blue">
          登録
        </Button>
        <TableContainer>
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
              <Tr>
                <Td>
                  <Card className="size-full">
                    <CardBody>
                      <Text>タスク１</Text>
                    </CardBody>
                  </Card>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}
