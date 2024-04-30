"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { TLog, log } from "@/logger/logger";
import { Socket, io } from "socket.io-client";

interface Props {}

const Transcript: React.FunctionComponent<Props> = () => {
    const socket = useRef<Socket | undefined>(undefined);
    const mediaRecorder = useRef<MediaRecorder | undefined>(undefined);
    const [isStreaming, setIsStreaming] = useState(false);
    const [stream, setStream] = useState<MediaStream | undefined>(undefined);

    useEffect(() => {
        if (socket.current !== undefined) return;

        socket.current = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        console.log(socket.current);

        socket.current.on("connect_error", (error) => {
            console.error("Connection Error:", error);
        });

        socket.current.on("connect", () => {
            console.log("connected");
        });

        socket.current.emit("test", "teeee");
        return () => {
            socket.current?.off("connect");
        };
    }, []);

    useEffect(() => {
        const startRecording = async () => {
            if (mediaRecorder?.current !== undefined) {
                if (mediaRecorder.current.state !== "recording")
                    mediaRecorder.current.start(1000);
                return;
            }

            try {
                if ("MediaRecorder" in window) {
                    const audioStream =
                        await navigator.mediaDevices.getUserMedia({
                            audio: true,
                            video: false,
                        });
                    setIsStreaming(true);

                    const audioContext: AudioContext =
                        new window.AudioContext();
                    const micSource =
                        audioContext.createMediaStreamSource(audioStream);
                    const destination =
                        audioContext.createMediaStreamDestination();

                    micSource.connect(destination);
                    setStream(destination.stream);

                    const mimeTypes = ["audio/mp4", "audio/webm"].filter(
                        (type) => MediaRecorder.isTypeSupported(type),
                    );

                    if (mimeTypes.length === 0) {
                        return alert("Browser not supported");
                    }

                    const recorder = new MediaRecorder(destination.stream, {
                        mimeType: mimeTypes[0],
                    });

                    recorder.addEventListener("dataavailable", (event) => {
                        if (event.data.size > 0) {
                            console.log(event.data);
                            socket.current?.send(event.data);
                        }
                    });

                    recorder.start(1000);
                    mediaRecorder.current = recorder;
                } else {
                    alert(
                        "The MediaRecorder API is not supported in your browser.",
                    );
                }
            } catch (e) {
                log({ type: TLog.error, text: e as string });
            }
        };

        const stopRecording = () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            if (mediaRecorder?.current === undefined) {
                return;
            } else {
                mediaRecorder.current.stop();
                mediaRecorder.current = undefined;
            }
            setIsStreaming(false);
        };

        if (isStreaming) {
            void startRecording();
        } else {
            stopRecording();
        }
    }, [isStreaming, stream]);

    return (
        <Card className="flex flex-col justify-center gap-1 p-6">
            <div className="mb-4 flex w-full items-start rounded-xl border p-3">
                <Button
                    variant={isStreaming ? "destructive" : "ghost"}
                    onClick={() => setIsStreaming(!isStreaming)}
                >
                    <Mic size={20} />
                </Button>
            </div>
            <CardContent className="align-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                fugiat in aut sit impedit vel libero architecto reprehenderit
                quibusdam possimus nesciunt dolorum magnam, maiores nemo
                inventore illo, adipisci repellat sunt. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Alias fugiat in aut sit
                impedit vel libero architecto reprehenderit quibusdam possimus
                nesciunt dolorum magnam, maiores nemo inventore illo, adipisci
                repellat sunt. Lorem ipsum dolor sit amet consectetur
                adipisicing elit. Alias fugiat in aut sit impedit vel libero
                architecto reprehenderit quibusdam possimus nesciunt dolorum
                magnam, maiores nemo inventore illo, adipisci repellat sunt.
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias
                fugiat in aut sit impedit vel libero architecto reprehenderit
                quibusdam possimus nesciunt dolorum magnam, maiores nemo
                inventore illo, adipisci repellat sunt.
            </CardContent>
        </Card>
    );
};

export default Transcript;
