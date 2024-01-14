import Header from "@/components/header";
import { EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Button, ButtonGroup, Input, Textarea, Select, Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from '@chakra-ui/react'

export default function TodoListPage(): JSX.Element {
  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color pt-8">
        <div className="flex">
          <div className="flex-1">
            <FormControl>
              <FormLabel>タスク名</FormLabel>
              <Input type='text' />
            </FormControl>
            <FormControl>
              <FormLabel>説明</FormLabel>
              <Textarea />
            </FormControl>
            <FormControl>
              <FormLabel>期日</FormLabel>
              <Input type='date' />
            </FormControl>
            <FormControl>
              <FormLabel>ステータス</FormLabel>
              <Select>
                <option>todo</option>
                <option>inProgress</option>
                <option>done</option>
              </Select>
            </FormControl>
            <Button colorScheme='blue'>登録</Button>
          </div>
          <div className="flex-1">
            <TableContainer>
              <Table variant='simple'>
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
                    <Td>inches</Td>
                    <Td>millimetres (mm)</Td>
                    <Td>millimetres</Td>
                    <Td>millimetres</Td>
                    <Td><Button colorScheme='blue'>編集</Button></Td>
                    <Td><Button colorScheme='blue'>削除</Button></Td>
                  </Tr>
                </Tbody>
              </Table>
            </TableContainer>
          </div>
        </div>

      </div>
    </>
  );
}
