import { sendData} from "@/server/b2";
import { buttonVariants } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export async function FormUploadDocs() {
  async function handleSubmit(e: FormData) {
    "use server"
    
    await sendData()
  }

  return (
    <form action={handleSubmit} className="space-y-5">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Label htmlFor="file">Picture</Label>
        <Input id="file" type="file" name="file" />
      </div>
      <input type="submit" className={buttonVariants({ variant: "default" })} />
    </form>
  );
}
