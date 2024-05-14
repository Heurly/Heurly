import Logo from "@/components/icon/Logo";

export default function Loading() {
    return (
        <div className="flex items-center justify-center h-svh">
            <Logo className="animate-ping size-32" />
        </div>
    );
}
