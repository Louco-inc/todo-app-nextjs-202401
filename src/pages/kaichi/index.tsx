import Header from "@/components/header";
import React, { useEffect, useState } from "react";
import { EditIcon, DeleteIcon, AddIcon } from "@chakra-ui/icons";

import {
  FormControl,
  FormLabel,
  // FormErrorMessage,
  // FormHelperText,
  Button,
  // ButtonGroup,
  Input,
  // useToast,
  Textarea,
  Select,
  Table,
  Thead,
  Tbody,
  // Tfoot,
  IconButton,
  Tr,
  Box,
  Th,
  Flex,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  // Td,
  // TableCaption,
  TableContainer,
  useDisclosure,
  GridItem,
} from "@chakra-ui/react";
import { todo } from "node:test";

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
  const [todoDetail, setTodoDetail] = useState<TodoFormType>(
    defaultFormValue
  );

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

  const openTodoDetail = async (todoId: number): Promise<void> => {
    const targetTodo = await fetchTargetTodo(todoId);
    console.log(targetTodo);
    setTodoDetail(targetTodo);
    onOpenDetailModal();
  };

  const {
    isOpen: isOpenDetailModal,
    onOpen: onOpenDetailModal,
    onClose: onCloseDetailModal,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteDialog,
    onOpen: onOpenDeleteDialog,
    onClose: onCloseDeleteDialog,
  } = useDisclosure();


  const registerTodo = async (): Promise<void> => {
    const params = {
      title: todoForm.title,
      description: todoForm.description,
      completionDate: new Date(todoForm.completionDate),
      status: todoForm.status,
    };
    console.log(todoForm);
    await fetch("/api/todo_lists", {
      method: "POST",
      body: JSON.stringify(params),
    }).then(async (r) => {
      const newTodo: TodoType = await r.json();
      setTodoList((prev) => [newTodo, ...prev]);
      setTodoForm(defaultFormValue);
      console.log(newTodo);
    });
  };

  return (
    <>
      <Header />
      <div className="px-8 bg-main-bg-color pt-8">
        <IconButton
          variant="unstyled"
          className="!min-w-0 !min-h-0"
          aria-label="Search database"
          icon={<AddIcon />}
          onClick={onOpenDeleteDialog}
        />
        <Modal blockScrollOnMount={false} isOpen={isOpenDeleteDialog} onClose={onCloseDeleteDialog}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>新規</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <FormLabel>タスク名</FormLabel>
                <Input
                  type="text"
                  value={todoForm.title}
                  onChange={(e) =>
                    setTodoForm((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>説明</FormLabel>
                <Textarea
                  value={todoForm.description}
                  onChange={(e) =>
                    setTodoForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>期日</FormLabel>
                <Input
                  type="date"
                  value={todoForm.completionDate}
                  onChange={(e) =>
                    setTodoForm((prev) => ({
                      ...prev,
                      completionDate: e.target.value,
                    }))
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>ステータス</FormLabel>
                <Select
                  value={todoForm.status}
                  onChange={(e) =>
                    setTodoForm((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                >
                  <option>todo</option>
                  <option>inProgress</option>
                  <option>done</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onCloseDeleteDialog}>
                Close
              </Button>
              <Button
                colorScheme="blue"
                onClick={async () => await registerTodo()}
              >
                登録
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Grid templateColumns='repeat(3, 1fr)' gap={6}>
          <GridItem w='100%'>
            <p>todo</p>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>タスク名</Th>
                    <Th>ステータス</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((item) => {
                    if (item.status == "todo") {
                      return (
                        <Tr key={item.id}>
                          <Th onClick={async () => await openTodoDetail(item.id)}>{item.title}</Th>
                          <Th>{item.status}</Th>
                        </Tr>
                      );
                    }
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
          <GridItem w='100%'>
            <p>InProggress</p>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>タスク名</Th>
                    <Th>ステータス</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((item) => {
                    if (item.status == "inProgress") {
                      return (
                        <Tr key={item.id}>
                          <Th onClick={async () => await openTodoDetail(item.id)}>{item.title}</Th>
                          <Th>{item.status}</Th>
                        </Tr>
                      );
                    }
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
          <GridItem w='100%'>
            <p>Done</p>
            <TableContainer>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>タスク名</Th>
                    <Th>ステータス</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {todoList.map((item) => {
                    if (item.status == "done") {
                      return (
                        <Tr key={item.id}>
                          <Th onClick={async () => await openTodoDetail(item.id)}>{item.title}</Th>
                          <Th>{item.status}</Th>
                        </Tr>
                      );
                    }
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </GridItem>
        </Grid>
      </div>
      <Modal isOpen={isOpenDetailModal} onClose={onCloseDetailModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{todoDetail?.title}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          {todoDetail?.status}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onCloseDetailModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
