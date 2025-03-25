'use client'
import { use } from 'react';
import InterviewStartButton from './interview-start-button';
export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return <div className="dark:bg-gray-900 h-screen">
        <InterviewStartButton id={resolvedParams.id} />
    </div>;
}