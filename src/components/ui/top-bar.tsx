import { Settings, User } from "lucide-react";
import Logo from "@/components/icon/Logo";

function TopBar() {
    return (
        <div className="fixed top-0 z-50 flex w-full items-center justify-between bg-sky-200 p-3 md:hidden">
            <Logo className="w-10" />
            <div className="flex items-center gap-x-2">
                <User />
                <Settings />
            </div>
        </div>
    );
}

export default TopBar;
