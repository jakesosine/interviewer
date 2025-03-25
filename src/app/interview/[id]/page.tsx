'use client'
import { use } from 'react';

export default function InterviewPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    return <div>InterviewPage {resolvedParams.id}</div>;
}