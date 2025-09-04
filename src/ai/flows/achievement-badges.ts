'use server';

/**
 * @fileOverview Generates achievement badges for users based on their quiz milestones.
 *
 * - generateAchievementBadge - A function that generates a badge based on the provided milestone.
 * - AchievementBadgeInput - The input type for the generateAchievementBadge function.
 * - AchievementBadgeOutput - The return type for the generateAchievementBadge function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AchievementBadgeInputSchema = z.object({
  milestone: z.enum(['dailyCompletion', 'bronzeMedal', 'silverMedal', 'goldMedal', 'platinumMedal', 'emeraldMedal']).describe('The milestone achieved by the user.'),
  username: z.string().describe('The username of the user.'),
});
export type AchievementBadgeInput = z.infer<typeof AchievementBadgeInputSchema>;

const AchievementBadgeOutputSchema = z.object({
  badgeDataUri: z.string().describe('The data URI of the generated badge image.'),
  badgeDescription: z.string().describe('A description of the badge.'),
});
export type AchievementBadgeOutput = z.infer<typeof AchievementBadgeOutputSchema>;

export async function generateAchievementBadge(input: AchievementBadgeInput): Promise<AchievementBadgeOutput> {
  return achievementBadgeFlow(input);
}

const badgeDesignTool = ai.defineTool({
  name: 'badgeDesignTool',
  description: 'Selects an appropriate badge design based on the achievement milestone.',
  inputSchema: z.object({
    milestone: z.enum(['dailyCompletion', 'bronzeMedal', 'silverMedal', 'goldMedal', 'platinumMedal', 'emeraldMedal']).describe('The milestone achieved by the user.'),
  }),
  outputSchema: z.string().describe('The name of the badge design to use.'),
}, async (input) => {
  // This is a mock implementation.  In a real application, this would use
  // some logic (perhaps even another LLM) to select an appropriate badge design.
  switch (input.milestone) {
    case 'dailyCompletion':
      return 'Daily Streak Badge';
    case 'bronzeMedal':
      return 'Bronze Medal Badge';
    case 'silverMedal':
      return 'Silver Medal Badge';
    case 'goldMedal':
      return 'Gold Medal Badge';
    case 'platinumMedal':
      return 'Platinum Medal Badge';
    case 'emeraldMedal':
      return 'Emerald Medal Badge';
    default:
      return 'Generic Achievement Badge';
  }
});

const achievementBadgePrompt = ai.definePrompt({
  name: 'achievementBadgePrompt',
  input: {schema: AchievementBadgeInputSchema},
  output: {schema: AchievementBadgeOutputSchema},
  tools: [badgeDesignTool],
  prompt: `You are an achievement badge generator.  You generate visually appealing badges for users based on their quiz milestones.

  The user {{username}} has achieved the following milestone: {{milestone}}.

  First, use the badgeDesignTool to select an appropriate badge design for the milestone.

  Then, generate a description for the badge.

  Finally, generate a visually appealing badge image as a data URI, incorporating elements related to the milestone. Ensure the image is vibrant and suitable for sharing on social media.

  Return the badge data URI and the badge description.

  The badge should be high quality and visually appealing.

  For example, a daily completion badge could show the user's streak.

  Output:
  Description: [A description of the badge, be creative]
  Badge Data URI: [The data URI of the generated badge image]`,
});

const achievementBadgeFlow = ai.defineFlow(
  {
    name: 'achievementBadgeFlow',
    inputSchema: AchievementBadgeInputSchema,
    outputSchema: AchievementBadgeOutputSchema,
  },
  async input => {
    const {output} = await ai.generate({
      prompt: achievementBadgePrompt(input),
      model: 'googleai/imagen-4.0-fast-generate-001',
    });
    return {
      badgeDataUri: "",
      badgeDescription: output?.text ?? "",
    };
  }
);
