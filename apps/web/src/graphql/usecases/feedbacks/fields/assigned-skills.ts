import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { asc, eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { FeedbackAssignedSkill } from '../types';

const symbol = Symbol('FeedbackAssignedSkills');

export type FeedbackAssignedSkillsInput = {
  feedbackId: string;
};

export class FeedbackAssignedSkillsUnexpectedError extends CustomError({
  name: 'FeedbackAssignedSkillsUnexpectedError',
  message: 'Failed to find assigned feedback skills.',
}) {}

export type FeedbackAssignedSkillsError = (
  | FeedbackAssignedSkillsUnexpectedError
);

export type FeedbackAssignedSkills = (
  input: FeedbackAssignedSkillsInput,
) => ResultAsync<FeedbackAssignedSkill[], FeedbackAssignedSkillsError>;

export const feedbackAssignedSkills: FeedbackAssignedSkills = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, FeedbackAssignedSkill[]>(async (feedbackIds) => {
    const rows = await database()
      .select()
      .from(schema.skills)
      .innerJoin(schema.skillElements, eq(schema.skillElements.skillId, schema.skills.id))
      .innerJoin(schema.feedbackSkills, eq(schema.feedbackSkills.skillElementId, schema.skillElements.id))
      .where(inArray(schema.feedbackSkills.feedbackId, [...feedbackIds]))
      .orderBy(asc(schema.skills.level), asc(schema.skillElements.order));

    return feedbackIds.map((feedbackId) => {
      return rows
        .filter((row) => row.feedback_skills.feedbackId === feedbackId)
        .reduce<FeedbackAssignedSkill[]>((previous, current) => {
          const skill = previous.find((skill) => skill.skill.id === current.skills.id);
          if (!skill) {
            previous.push({
              skill: {
                id: current.skills.id,
                level: current.skills.level,
                name: current.skills.name,
              },
              skillElements: [{
                id: current.skill_elements.id,
                order: current.skill_elements.order,
                name: current.skill_elements.name,
              }],
            });
            return previous;
          }

          skill.skillElements.push({
            id: current.skill_elements.id,
            order: current.skill_elements.order,
            name: current.skill_elements.name,
          });
          return previous;
        }, []);
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.feedbackId),
    (error) => match(error)
      .otherwise(() => new FeedbackAssignedSkillsUnexpectedError({ cause: error })),
  )();
};