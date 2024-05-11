import Logo from "@/components/icon/Logo";
import { HeartCrack } from "lucide-react";

export default async function ErrorPage() {
    return (
        <div className="flex h-svh w-svw flex-col items-center justify-center">
            <Logo className="w-72" />
            <div className="flex items-center">
                <HeartCrack />
                <h1 className="text-3xl font-extrabold"> Oh mince !</h1>
            </div>
            <p>Une erreur s&apos;est produite</p>
        </div>
    );
}
