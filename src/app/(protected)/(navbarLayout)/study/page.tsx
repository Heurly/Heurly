import React from "react";
import { Card } from "@/components/ui/card";
import Logo from "@/components/icon/Logo";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Study: React.FunctionComponent = () => {
    return (
        <Card className="flex h-full w-full flex-col items-center justify-center">
            <div className="flex items-center justify-center">
                <Logo className="w-16" />
                <div className="ml-4 flex flex-col">
                    <h1 className="text-2xl font-bold">{"Salut !"}</h1>
                    <h2 className="text-xl">
                        {"Qu'allons nous réviser aujourd'hui ?"}
                    </h2>
                </div>
            </div>
            <div className="mt-6">
                <div className="m-4">
                    <Tabs defaultValue="heurly">
                        <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger value="heurly">
                                {"Fichier Heurly"}
                            </TabsTrigger>
                            <TabsTrigger value="local">
                                {"Fichier Local"}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="heurly"></TabsContent>
                        <TabsContent
                            value="local"
                            className="rounded-xl border p-4"
                        >
                            <Input type="file" multiple={false} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </Card>
    );
};

export default Study;
