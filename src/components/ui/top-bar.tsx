import Logo from "@/components/icon/Logo";
import { Settings, User } from "lucide-react";

function TopBar({ className }: { className?: string }) {
    return (
        <div className={className}>
            <Logo className="w-10" />
            <div className="flex items-center gap-x-2">
                <User />
                <Settings />
            </div>
        </div>
    );
}

export default TopBar;
