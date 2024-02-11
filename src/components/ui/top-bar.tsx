import { Settings, User } from "lucide-react";
import Logo from "@/components/icon/logo";


function TopBar() {
  return (
    <div className="flex justify-between items-center bg-sky-200 w-full md:hidden sticky top-0 z-50 topBar">
      <Logo className="w-10" />
      <div className="flex gap-x-2 items-center">
        <User />
        <Settings />
      </div>
    </div>
  );
}

export default TopBar;