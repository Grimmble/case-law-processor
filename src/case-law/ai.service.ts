import Anthropic from '@anthropic-ai/sdk';
import { getEnvOrFail } from 'src/utils';
import { z } from 'zod';

// JSON Schema for Claude tool (not Zod)
const toolSchema = {
    type: "object",
    properties: {
        title: {
            type: "string",
            description: "The original title of the case law (keep in original language)"
        },
        decisionType: {
            type: "string",
            description: "The decision type of the case law in English (e.g., 'Decision', 'Ruling', 'Judgment')"
        },
        date: {
            type: "string",
            description: "The date of the case law in YYYY-MM-DD format"
        },
        caseNumber: {
            type: "string",
            description: "The case number of the case law"
        },
        office: {
            type: "string",
            description: "The office name of the case law in English"
        },
        court: {
            type: "string",
            description: "The court name of the case law in English"
        },
        summary: {
            type: "string",
            description: "The summary of the case law (keep in original language)"
        }
    },
    required: ["title", "decisionType", "date", "caseNumber", "office", "court", "summary"]
};

// Zod schema for parsing the response
const parsingSchema = z.object({
    title: z.string(),
    decisionType: z.string(),
    date: z.string().transform((str) => new Date(str)),
    caseNumber: z.string(),
    office: z.string(),
    court: z.string(),
    summary: z.string()
});

export class AIService {
    anthropic: Anthropic;
    caseLawTool: any;

    constructor() {
        this.anthropic = new Anthropic({
            apiKey: getEnvOrFail('ANTHROPIC_API_KEY')
        });
        this.caseLawTool = {
            name: 'extract_case_law',
            description: 'Extract the case law data from the file contents',
            input_schema: toolSchema
        };
    };

    async extractCaseLawData(fileContent: string) {
        try {
            const finalMessage = await this.anthropic.messages.create({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{ role: 'user', content: 'Extract the case law data from the given file contents: ' + fileContent }],
                tools: [this.caseLawTool],
                tool_choice: { name: this.caseLawTool.name, type: 'tool' },
            });
            const toolUse = finalMessage.content[0];
            if (toolUse.type === 'tool_use') {
                return parsingSchema.parse(toolUse.input);
            }
            throw new Error('Invalid response from Claude');
        } catch (error) {
            console.error('Claude API error:', error.message);
            throw error;
        }
    }
}