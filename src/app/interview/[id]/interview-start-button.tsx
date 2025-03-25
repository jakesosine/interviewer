'use client'
import { useState } from 'react';
import { FaMicrophone } from 'react-icons/fa';

export default function InterviewStartButton({ id }: { id: string }) {
    const [isRecording, setIsRecording] = useState(false);

    const handleClick = async () => {
        setIsRecording(!isRecording);
        console.log('clicked');
        const response = await fetch('/api/v1/interview', {
            method: 'POST',
            body: JSON.stringify({ id: id }),
        });
        const data = await response.json();
        console.log(data);
    }

    return (
        <div className="flex justify-center items-center min-h-[80vh] dark:bg-gray-900">
            <button
                className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 w-20 h-20 rounded-full flex justify-center items-center cursor-pointer animate-pulse shadow-lg transition-colors duration-200"
                onClick={() => {
                    const response = handleClick();
                    console.log(response);
                }}
            >
                <FaMicrophone className="text-white text-3xl" />
            </button>
        </div>
    );
}