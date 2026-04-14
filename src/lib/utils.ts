import { WatchStatus } from "@/types";

export function getStatusColor(status: WatchStatus): string {
  switch (status) {
    case "watching":
      return "bg-watching text-black";
    case "completed":
      return "bg-completed text-black";
    case "plan_to_watch":
      return "bg-plan text-black";
    case "dropped":
      return "bg-dropped text-white";
  }
}

export function getInitials(title: string): string {
  return title
    .split(" ")
    .filter((w) => w.length > 0)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

export function getPosterGradient(id: string): string {
  const gradients = [
    "from-indigo-500 to-purple-600",
    "from-cyan-500 to-blue-600",
    "from-emerald-500 to-teal-600",
    "from-orange-500 to-red-600",
    "from-pink-500 to-rose-600",
    "from-violet-500 to-fuchsia-600",
    "from-amber-500 to-yellow-600",
    "from-lime-500 to-green-600",
  ];
  const index = parseInt(id, 10) % gradients.length || 0;
  return gradients[index];
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
