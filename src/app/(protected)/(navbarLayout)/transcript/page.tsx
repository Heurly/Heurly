// "use client";
// import React, { useEffect, useRef, useState } from 'react';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent } from '@/components/ui/card';
// import { Mic } from 'lucide-react';

// interface Props {}

// const Transcript: React.FunctionComponent<Props> = () => {
//     const mediaRecorder = useRef<MediaRecorder | null>(null);
//     const [isStreaming, setIsStreaming] = useState(false);
//     const [stream, setStream] = useState<MediaStream | null>(null);

//     const startRecording = async () => {
//         if (!stream) return;

//         setIsStreaming(true);

//         const media = new MediaRecorder(stream, { mimeType: "audio/webm" });

//         mediaRecorder.current = media;
//         mediaRecorder.current.start();

//         mediaRecorder.current.ondataavailable = (event) => {
//            if (typeof event.data === "undefined") return;
//            if (event.data.size === 0) return;
//         };
//       };

//         const stopRecording = () => {
//             setIsStreaming(false);

//             mediaRecorder.current.stop();
//             mediaRecorder.current.onstop = () => {
//             //creates a blob file from the audiochunks data
//             const audioBlob = new Blob(audioChunks, { type: mimeType });
//         };
//         };

//         useEffect(() => {
//             const getPermission = async () => {
//                 if ("MediaRecorder" in window) {
//                     try {
//                         const streamData = await navigator.mediaDevices.getUserMedia({
//                             audio: true,
//                             video: false,
//                         });

//                         setStream(streamData);
//                     } catch (err) {
//                         console.error(err);
//                     }
//                 } else {
//                     alert("The MediaRecorder API is not supported in your browser.");
//                 }
//             }

//             void getPermission();
//         }, []);

//     return (
//         <Card className='flex flex-col justify-center gap-1 p-6'>
//             <div className='w-full flex items-start border p-3 mb-4 rounded-xl'>
//                 <Button variant={isStreaming ? 'destructive' : 'ghost'} onClick={() => setIsStreaming(!isStreaming)}>
//                     <Mic size={20} />
//                 </Button>
//             </div>
//             <CardContent className='align-center'>
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat in aut sit impedit vel libero architecto reprehenderit quibusdam possimus nesciunt dolorum magnam, maiores nemo inventore illo, adipisci repellat sunt.
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat in aut sit impedit vel libero architecto reprehenderit quibusdam possimus nesciunt dolorum magnam, maiores nemo inventore illo, adipisci repellat sunt.
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat in aut sit impedit vel libero architecto reprehenderit quibusdam possimus nesciunt dolorum magnam, maiores nemo inventore illo, adipisci repellat sunt.
//                 Lorem ipsum dolor sit amet consectetur adipisicing elit. Alias fugiat in aut sit impedit vel libero architecto reprehenderit quibusdam possimus nesciunt dolorum magnam, maiores nemo inventore illo, adipisci repellat sunt.
//             </CardContent>
//         </Card>
//     );
// };

// export default Transcript;
