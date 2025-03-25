'use client'
import { useState, useRef, useEffect } from 'react';
import { FaMicrophone, FaStop, FaPlay, FaDownload, FaCloudUploadAlt } from 'react-icons/fa';

export default function RecordingAudio() {
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const audioBlobRef = useRef<Blob | null>(null);

    useEffect(() => {
        // Initialize speech recognition
        if (typeof window !== 'undefined') {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;

            recognitionRef.current.onresult = (event) => {
                let currentTranscript = '';
                for (let i = 0; i < event.results.length; i++) {
                    currentTranscript += event.results[i][0].transcript;
                }
                setTranscript(currentTranscript);
            };
        }

        // Cleanup
        return () => {
            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = []; // Reset audio chunks

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    audioChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                audioBlobRef.current = audioBlob; // Store the blob for API upload
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
            };

            mediaRecorderRef.current.start();

            // Start speech recognition
            if (recognitionRef.current) {
                recognitionRef.current.start();
            }

            setIsRecording(true);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }

        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }

        setIsRecording(false);
    };

    const downloadAudio = () => {
        if (audioUrl) {
            const a = document.createElement('a');
            a.href = audioUrl;
            a.download = 'recording.wav';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    };

    const uploadToAPI = async () => {
        if (!audioBlobRef.current) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('audio', audioBlobRef.current, 'recording.wav');
            formData.append('transcript', transcript);

            const response = await fetch('/api/upload-recording', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            console.log('Upload successful:', data);
            // You can add success notification here
        } catch (error) {
            console.error('Upload error:', error);
            // You can add error notification here
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="flex flex-col items-center space-y-8 p-8">
            <div className="flex space-x-4">
                {!isRecording ? (
                    <button
                        onClick={startRecording}
                        className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 w-16 h-16 rounded-full flex justify-center items-center cursor-pointer shadow-lg transition-colors duration-200"
                    >
                        <FaMicrophone className="text-white text-2xl" />
                    </button>
                ) : (
                    <button
                        onClick={stopRecording}
                        className="bg-gray-600 dark:bg-gray-700 hover:bg-gray-700 dark:hover:bg-gray-800 w-16 h-16 rounded-full flex justify-center items-center cursor-pointer shadow-lg transition-colors duration-200"
                    >
                        <FaStop className="text-white text-2xl" />
                    </button>
                )}
            </div>

            {audioUrl && (
                <div className="flex flex-col items-center space-y-4">
                    <audio controls src={audioUrl} className="rounded-lg" />
                    <div className="flex space-x-4">
                        <button
                            onClick={downloadAudio}
                            className="bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 text-white"
                        >
                            <FaDownload />
                            <span>Download</span>
                        </button>
                        <button
                            onClick={uploadToAPI}
                            disabled={isUploading}
                            className={`${isUploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-500 dark:bg-green-600 hover:bg-green-600 dark:hover:bg-green-700'
                                } px-4 py-2 rounded-lg flex items-center space-x-2 text-white transition-colors duration-200`}
                        >
                            <FaCloudUploadAlt />
                            <span>{isUploading ? 'Uploading...' : 'Send to API'}</span>
                        </button>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl min-h-[200px] p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
                    Transcript
                </h3>
                <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                    {transcript || 'Start speaking to see the transcript...'}
                </p>
            </div>
        </div>
    );
}