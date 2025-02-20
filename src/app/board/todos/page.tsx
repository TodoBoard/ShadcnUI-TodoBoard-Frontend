import { TodosClient } from "@/app/modules/board/ui/components/todos/todos-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TodoBoard | Todos",
  description: "Todos page",
};

export default function TodosPage() {
  return <TodosClient />;
}
