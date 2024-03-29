"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import { addProfileUnitByUrl, deleteProfileUnitUrl } from "@/server/user";

type MultipleUrlFormProps = {
    initialUrls: string[];
};
export default function MultipleUrlForm({ initialUrls }: MultipleUrlFormProps) {
    const { data: session } = useSession();
    const [urls, setUrls] = useState([{ id: Date.now(), url: "" }]);
    useEffect(() => {
        // Transformer les URLs initiales en un format adapté à votre composant
        const formattedUrls = initialUrls.map((url) => ({
            id: Date.now() + Math.random(), // Générer un ID unique. À ajuster selon vos besoins.
            url: url,
        }));
        setUrls(formattedUrls);
    }, [initialUrls]);

    const addUrl = () =>
        setUrls((prevUrls) => [...prevUrls, { id: Date.now(), url: "" }]);

    const removeUrl = async (id: number) => {
        setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
        const urlToRemove = urls.find((url) => url.id === id);

        if (!urlToRemove) {
            console.error("URL not found");
            return;
        }
        try {
            const success =
                session?.user?.id !== undefined
                    ? await deleteProfileUnitUrl(
                          session?.user?.id,
                          urlToRemove.url,
                      )
                    : false;
            if (success) {
                setUrls((prevUrls) => prevUrls.filter((url) => url.id !== id));
            } else {
                console.error("Failed to delete the URL");
            }
        } catch (error) {
            console.error("Error deleting URL:", error);
        }
    };

    const updateUrl = (id: number, newUrl: string) => {
        setUrls((prevUrls) =>
            prevUrls.map((url) =>
                url.id === id ? { ...url, url: newUrl } : url,
            ),
        );
    };

    const submitAll = async () => {
        for (const { url } of urls) {
            if (url) {
                try {
                    const success = session?.user?.id
                        ? await addProfileUnitByUrl(session?.user?.id, url)
                        : false;
                    if (!success) {
                        console.error("Failed to add URL:", url);
                    }
                } catch (error) {
                    console.error("Error adding URL:", url, error);
                }
            }
        }
    };

    return (
        <div className="max-h-[500px] overflow-y-auto">
            {" "}
            {/* Utilisation de Tailwind ici */}
            {urls.map((urlObj) => (
                <div key={urlObj.id} className="mb-4 flex items-center">
                    <Input
                        value={urlObj.url}
                        onChange={(e) => updateUrl(urlObj.id, e.target.value)}
                        className=""
                    />
                    <Button
                        onClick={() => removeUrl(urlObj.id)}
                        className="ml-2"
                    >
                        Delete
                    </Button>
                </div>
            ))}
            <Button onClick={addUrl}>Ajouter une URL</Button>
            <Button onClick={submitAll}>Soumettre toutes les URLs</Button>
        </div>
    );
}
