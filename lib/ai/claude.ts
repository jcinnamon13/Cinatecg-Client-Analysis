import Anthropic from '@anthropic-ai/sdk';
import { SYSTEM_PROMPT, SUMMARY_PROMPT } from './prompts';

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function analyseDocument(textStructure: string) {
    try {
        const response = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 4096,
            temperature: 0.2, // Low temperature for consistent JSON structure
            system: SYSTEM_PROMPT,
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Analyze the following client onboarding document text and return the structured JSON array as instructed:\n\n<document>\n${textStructure}\n</document>`
                        }
                    ]
                }
            ]
        });

        const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

        // Sometimes Claude adds markdown JSON block despite instructions, so we clean it.
        const cleanJson = responseText.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();

        let structuredResult;
        try {
            structuredResult = JSON.parse(cleanJson);
        } catch {
            console.error('Failed to parse Claude JSON output:', cleanJson);
            throw new Error('Claude returned invalid JSON format');
        }

        // Secondary call for the Executive Summary
        const summaryResponse = await anthropic.messages.create({
            model: 'claude-sonnet-4-6',
            max_tokens: 1024,
            temperature: 0.5,
            system: "You are an elite senior business consultant writing a summary for an agency.",
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: `Here is the structured analysis of a new client. ${SUMMARY_PROMPT}\n\n<analysis>\n${JSON.stringify(structuredResult, null, 2)}\n</analysis>`
                        }
                    ]
                }
            ]
        });

        const summary = summaryResponse.content[0].type === 'text' ? summaryResponse.content[0].text : '';

        return {
            structuredResult,
            summary
        };

    } catch (error) {
        console.error('Claude API Error:', error);
        throw error;
    }
}
