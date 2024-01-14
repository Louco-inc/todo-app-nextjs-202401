import Header from "@/components/header";
import {
  Flex,
  Input,
  Textarea,
  VStack,
  Select,
  Button,
} from "@chakra-ui/react";

export default function TodoListPage(): JSX.Element {
  return (
    <div>
      <Header />
      <Flex className="bg-main-bg-color">
        <div>
          <div className="pt-10">
            <p className="text-base font-bold">タスク名</p>
            <div className="bg-white">
              <Input></Input>
            </div>
          </div>
          <div className="pt-8">
            <p className="text-base font-bold">説明</p>
            <div className="bg-white">
              <Textarea></Textarea>
            </div>
          </div>
          <div className="pt-3">
            <p className="text-base font-bold">期日</p>
            <div className="bg-white">
              <input type="date" />
            </div>
          </div>
          <div className="pt-12">
            <p className="text-base font-bold">ステータス</p>
            <div className="bg-white">
              <Select></Select>
            </div>
          </div>
          <div className="pt-16 pb-52 flex justify-center">
            <Button colorScheme="blue" className="Flex">
              登録
            </Button>
          </div>
        </div>
        <div>
          <VStack>
            <Flex className="pt-10">
              <p className="text-base">タスク名</p>
              <p className="text-base">ステータス</p>
              <p className="text-base">期日</p>
              <p className="text-base">更新日</p>
            </Flex>
            <div>aaa</div>
            <div>aaa</div>
            <div>aaa</div>
            <div>aaa</div>
            <div>aaa</div>
          </VStack>
        </div>
      </Flex>
    </div>
  );
}
