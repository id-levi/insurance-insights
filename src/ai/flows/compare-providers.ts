'use server';
/**
 * @fileOverview Compares two insurance providers on a specific aspect.
 *
 * - compareProviders - A function that compares two insurance providers on a specific aspect.
 * - CompareProvidersInput - The input type for the compareProviders function.
 * - CompareProvidersOutput - The return type for the compareProviders function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

interface PolicyDetails {
  provider: string;
  coverage_limits: string;
  hospitalization: string;
  deductible: string;
  exclusions: string;
}

const providers: PolicyDetails[] = [
  {
    provider: 'AXA',
    coverage_limits: '$500,000',
    hospitalization: 'Yes',
    deductible: '$1,000',
    exclusions: 'Cosmetic surgery',
  },
  {
    provider: 'Bupa',
    coverage_limits: '$750,000',
    hospitalization: 'Yes',
    deductible: '$750',
    exclusions: 'Pre-existing conditions',
  },
  {
    provider: 'Allianz',
    coverage_limits: '$600,000',
    hospitalization: 'Yes',
    deductible: '$900',
    exclusions: 'Experimental treatments',
  },
  {
    provider: 'Cigna',
    coverage_limits: '$800,000',
    hospitalization: 'Yes',
    deductible: '$800',
    exclusions: 'Dental care',
  },
];

const CompareProvidersInputSchema = z.object({
  providerA: z.string().describe('The name of the first insurance provider.'),
  providerB: z.string().describe('The name of the second insurance provider.'),
  aspect: z.string().describe('The aspect to compare between the two providers (e.g., hospitalization coverage).'),
});
export type CompareProvidersInput = z.infer<typeof CompareProvidersInputSchema>;

const CompareProvidersOutputSchema = z.object({
  comparison: z.string().describe('A concise, objective comparison of the two providers on the specified aspect.'),
});
export type CompareProvidersOutput = z.infer<typeof CompareProvidersOutputSchema>;

export async function compareProviders(input: CompareProvidersInput): Promise<CompareProvidersOutput> {
  return compareProvidersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'compareProvidersPrompt',
  input: {
    schema: z.object({
      providerA: z.string().describe('The name of the first insurance provider.'),
      providerB: z.string().describe('The name of the second insurance provider.'),
      aspect: z.string().describe('The aspect to compare between the two providers (e.g., hospitalization coverage).'),
      valueA: z.string().describe('The value of the aspect for provider A.'),
      valueB: z.string().describe('The value of the aspect for provider B.'),
    }),
  },
  output: {
    schema: z.object({
      comparison: z.string().describe('A concise, objective comparison of the two providers on the specified aspect.'),
    }),
  },
  prompt: `You are a financial assistant helping a user compare insurance policies. 
Compare the following two providers based on the aspect: {{aspect}}.

Provider A: {{providerA}}
- {{aspect}}: "{{valueA}}"

Provider B: {{providerB}}
- {{aspect}}: "{{valueB}}"

Explain which provider offers better value for this aspect, and mention any important distinctions. Be concise and neutral.`,
});

const compareProvidersFlow = ai.defineFlow<
  typeof CompareProvidersInputSchema,
  typeof CompareProvidersOutputSchema
>(
  {
    name: 'compareProvidersFlow',
    inputSchema: CompareProvidersInputSchema,
    outputSchema: CompareProvidersOutputSchema,
  },
  async input => {
    const policyDetailsA = providers.find(p => p.provider === input.providerA)!;
    const policyDetailsB = providers.find(p => p.provider === input.providerB)!;

    const valueA = policyDetailsA[input.aspect] || 'Not specified';
    const valueB = policyDetailsB[input.aspect] || 'Not specified';

    const {output} = await prompt({
      ...input,
      valueA,
      valueB,
    });
    return output!;
  }
);
