"use client";
import Logo from "@/components/icon/Logo";
import { Button } from "@/components/ui/button";
import GoogleIcon from "@/components/icon/google-icon";
import cn from "classnames";
import Underline from "@/components/underline";
import { SessionProvider, signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <SessionProvider>
            <main
                className={cn(
                    "flex h-[100svh] w-full flex-col  items-center justify-between",
                    "md:flex-row",
                )}
            >
                <div className="flex h-full w-full flex-col items-center justify-center gap-y-5">
                    <div className="flex flex-col items-center">
                        <Logo className={cn("w-1/2", " md:11/12")} />
                        <p className="text-3xl font-black text-sky-300">
                            Heurly{" "}
                            <span className="italic text-black">.fr</span>
                        </p>
                    </div>
                    <p
                        className={cn(
                            "text-center font-bold leading-5 ",
                            "md:hidden",
                        )}
                    >
                        Pour les étudiants
                        <br /> Par les étudiants
                    </p>
                </div>
                <div
                    className={cn(
                        "flex w-full items-center justify-center  gap-10 rounded-t-xl bg-white py-10",
                        "md:h-full md:flex-col md:rounded-none",
                    )}
                >
                    <div>
                        <p
                            className={cn(
                                "mb-3 hidden text-center text-3xl font-extrabold",
                                " md:block",
                            )}
                        >
                            Pour les{" "}
                            <span className="relative italic">
                                étudiants
                                <Underline className="absolute -bottom-4 left-0 w-32" />
                            </span>
                        </p>
                        <p
                            className={cn(
                                "hidden text-center text-3xl font-extrabold",
                                "md:block",
                            )}
                        >
                            Par les{" "}
                            <span className="relative italic">
                                étudiants
                                <Underline className="absolute -bottom-4 left-0 w-32" />
                            </span>
                        </p>
                    </div>
                    <Button
                        className={cn("bg-black", "text-white")}
                        onClick={() =>
                            signIn("google", { callbackUrl: "/timetable" })
                        }
                    >
                        <GoogleIcon className="w-7" />
                        Se connecter
                    </Button>
                </div>
            </main>
        </SessionProvider>
    );
}
