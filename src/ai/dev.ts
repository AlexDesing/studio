import { config } from 'dotenv';
config();

import '@/ai/flows/gemini-ai-assistant.ts';
import '@/ai/flows/affirmation-generator.ts';
import '@/ai/flows/daily-recommendation-flow.ts'; // Added new flow
