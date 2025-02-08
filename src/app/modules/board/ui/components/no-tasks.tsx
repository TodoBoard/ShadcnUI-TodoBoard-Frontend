import Image from "next/image";

export function NoTasks() {
  return (
    <div>
      <div className="flex justify-center">
        <Image src="/no-tasks.png" alt="No tasks" width={300} height={300} />
      </div>
      <p className="text-center text-lg">Good news! You have nothing to do.</p>
      <p className="text-center text-lg">Enjoy your free time!</p>
    </div>
  );
}
