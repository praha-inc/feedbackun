import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { SkillElement } from '../../skill-elements/types';

const symbol = Symbol('FeedbackSkillElements');

export type FeedbackSkillElementsInput = {
  feedbackId: string;
};

export class FeedbackSkillElementsUnexpectedError extends CustomError({
  name: 'FeedbackSkillElementsUnexpectedError',
  message: 'Failed to find feedback skill elements.',
}) {}

export type FeedbackSkillElementsError = (
  | FeedbackSkillElementsUnexpectedError
);

export type FeedbackSkillElements = (
  input: FeedbackSkillElementsInput,
) => ResultAsync<SkillElement[], FeedbackSkillElementsError>;

export const feedbackSkillElements: FeedbackSkillElements = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, SkillElement[]>(async (feedbackIds) => {
    const rows = await database()
      .select()
      .from(schema.skillElements)
      .innerJoin(schema.feedbackSkills, eq(schema.feedbackSkills.skillElementId, schema.skillElements.id))
      .where(inArray(schema.feedbackSkills.feedbackId, [...feedbackIds]));

    return feedbackIds.map((feedbackId) => {
      return rows
        .filter((row) => row.feedback_skills.feedbackId === feedbackId)
        .map((row) => ({
          id: row.skill_elements.id,
          order: row.skill_elements.order,
          name: row.skill_elements.name,
        }));
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.feedbackId),
    (error) => match(error)
      .otherwise(() => new FeedbackSkillElementsUnexpectedError({ cause: error })),
  )();
};
