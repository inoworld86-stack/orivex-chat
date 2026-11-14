import { google } from '@ai-sdk/google';
import { streamText } from 'ai';

// Отключаем буферизацию и даем больше времени на ответ
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const { prompt } = await req.json();
    
    // AI SDK сам делает все запросы к Gemini и стримит их
    const result = await streamText({
      model: google('gemini-1.5-flash'), // Используем надежную модель
      prompt: prompt,
    });

    // Возвращаем поток, который понимает наш фронтенд
    return result.toDataStreamResponse();
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
