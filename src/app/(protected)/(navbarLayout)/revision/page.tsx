import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ID from "@/utils/id";
import { Archive, FileStack, Zap } from "lucide-react";

export default function ChoosePlugInPage() {
  const plugIns = [
    {
      name: "Documents",
      icon: <Archive />,
    },
    {
      name: "Flashcards",
      icon: <Zap />,
    },
  ];

  return (
    <Card className="flex h-full w-full flex-col items-center justify-center gap-5 p-10">
      <h1>Comment vous-voulez réviser ?</h1>

      <Input placeholder="Rechercher un plug-in" />

      <div className="flex flex-wrap gap-5">
        {plugIns.map(({ name, icon }) => (
          <Card
            key={ID()}
            className="flex flex-col items-center justify-center w-36 h-36"
          >
            <div>{icon}</div>
            <div>
              <p>{name}</p>
            </div>
          </Card>
        ))}
      </div>
    </Card>
  );
}
