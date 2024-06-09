"use client";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Mic } from "lucide-react";
import { TLog, log } from "@/logger/logger";
import { Socket, io } from "socket.io-client";

interface Props {}

type StateType = {
    isStreaming: boolean;
    stream: MediaStream | null;
};

interface TranscriptData {
    transcript: string;
}

type ActionType =
    | { type: "START_STREAMING"; stream: MediaStream }
    | { type: "STOP_STREAMING" };

const initialState: StateType = { isStreaming: false, stream: null };

function reducer(state: StateType, action: ActionType): StateType {
    switch (action.type) {
        case "START_STREAMING":
            return { ...state, isStreaming: true, stream: action.stream };
        case "STOP_STREAMING":
            return { ...state, isStreaming: false, stream: null };
        default:
            return state;
    }
}

const Transcript: React.FC<Props> = () => {
    const socket = useRef<Socket | null>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const [state, dispatch] = useReducer(reducer, initialState);
    const [transcript, setTranscript] = useState("");
    const audioChunks: BlobPart[] | undefined = [];

    useEffect(() => {
        if (socket.current) return;

        socket.current = io("http://localhost:3001", {
            transports: ["websocket"],
        });

        socket.current.on("connect_error", (error: Error) => {
            console.error("Connection Error:", error);
        });

        socket.current.on("connect", () => {
            console.log("connected");
        });

        socket.current.emit("test", "teeee");

        return () => {
            socket.current?.off("connect");
            socket.current?.off("connect_error");
        };
    }, []);

    useEffect(() => {
        socket?.current?.on("transcriptResult", (data: TranscriptData) => {
            console.log("Received transcription:", data.transcript);
            if (data.transcript !== transcript) {
                setTranscript(data.transcript); // This ensures state changes if data is different
            }
        });

        return () => {
            socket?.current?.off("transcriptResult");
        };
    }, [transcript]);

    useEffect(() => {
        const startRecording = async () => {
            if (
                mediaRecorder.current &&
                mediaRecorder.current.state === "recording"
            ) {
                return;
            }

            try {
                const audioStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                dispatch({ type: "START_STREAMING", stream: audioStream });

                const recorder = (mediaRecorder.current = new MediaRecorder(
                    audioStream,
                ));

                recorder.ondataavailable = async (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                        const audioBlob = new Blob(audioChunks, {
                            type: "audio/wav",
                        });
                        socket?.current?.emit("audioBlob", audioBlob);
                    }
                };

                recorder.start(3000);

                mediaRecorder.current = recorder;
            } catch (e) {
                log({ type: TLog.error, text: (e as Error).toString() });
            }
        };

        const stopRecording = () => {
            if (state.stream) {
                state.stream.getTracks().forEach((track) => track.stop());
            }
            if (mediaRecorder.current) {
                mediaRecorder.current.stop();
                mediaRecorder.current = null;
            }
            dispatch({ type: "STOP_STREAMING" });
        };

        if (state.isStreaming) {
            void startRecording();
        } else {
            stopRecording();
        }
    }, [state.isStreaming, state.stream]);

    return (
        <Card className="flex flex-col justify-center gap-1 p-6">
            <div className="mb-4 flex w-full items-start rounded-xl border p-3">
                <Button
                    variant={state.isStreaming ? "destructive" : "ghost"}
                    onClick={() =>
                        dispatch({
                            type: state.isStreaming
                                ? "STOP_STREAMING"
                                : "START_STREAMING",
                        } as ActionType)
                    }
                >
                    <Mic size={20} />
                </Button>
            </div>
            <CardContent className="align-center">
                {transcript || "No transcript available"}
            </CardContent>
        </Card>
    );
};

export default Transcript;
