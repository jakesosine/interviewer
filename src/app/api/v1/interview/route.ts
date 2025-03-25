import { WebSocket, WebSocketServer } from 'ws';
import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const url = "wss://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM/stream-input";


export async function POST(request: NextRequest) {
    const { id } = await request.json();
    return NextResponse.json({ message: 'Hello, world! ' + id });
}