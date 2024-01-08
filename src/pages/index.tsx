import { useRouter } from "next/router";
import Header from "@/components/header";

export default function Home() {
  const router = useRouter();
  return (
    <div>
      <Header />
    </div>
  );
}
