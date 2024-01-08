import { Button } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  return (
    <div className="mx-8">
      <div className="my-4 flex justify-between">
        <h2 className="text-2xl mr-4">Todo App</h2>
        <div>
          <Button className="mr-4" onClick={() => router.push("/daichi")}>
            daichi
          </Button>
          <Button className="mr-4" onClick={() => router.push("kaichi")}>
            kaichi
          </Button>
          <Button className="mr-4" onClick={() => router.push("morishun")}>
            morishun
          </Button>
          <Button className="mr-4" onClick={() => router.push("naoya")}>
            naoya
          </Button>
        </div>
      </div>
    </div>
  );
}
