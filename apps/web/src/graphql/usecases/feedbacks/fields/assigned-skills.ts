import { database, schema } from '@feedbackun/package-database';
import { R } from '@praha/byethrow';
import { UnexpectedError } from '@praha/error-factory/presets';
import DataLoader from 'dataloader';
import { asc, eq, inArray } from 'drizzle-orm';

import { serialize } from '../../../helpers/serialize';
import { dataLoader } from '../../../plugins/dataloader';

import type { FeedbackAssignedSkill } from '../types/feedback-assigned-skill';

const symbol = Symbol('FeedbackAssignedSkills');

export type FeedbackAssignedSkillsInput = {
  feedbackId: string;
};

export type FeedbackAssignedSkillsError = (
  | UnexpectedError
);

export type FeedbackAssignedSkills = (
  input: FeedbackAssignedSkillsInput,
) => R.ResultAsync<FeedbackAssignedSkill[], FeedbackAssignedSkillsError>;

export const feedbackAssignedSkills: FeedbackAssignedSkills = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<FeedbackAssignedSkillsInput, FeedbackAssignedSkill[], string>(async (inputs) => {
    const feedbackIds = inputs.map((input) => input.feedbackId);

    const rows = await database()
      .select()
      .from(schema.skills)
      .innerJoin(schema.skillElements, eq(schema.skillElements.skillId, schema.skills.id))
      .innerJoin(schema.feedbackSkills, eq(schema.feedbackSkills.skillElementId, schema.skillElements.id))
      .where(inArray(schema.feedbackSkills.feedbackId, [...feedbackIds]))
      .orderBy(asc(schema.skills.level), asc(schema.skillElements.order));

    return inputs.map((input) => {
      return rows
        .filter((row) => row.feedback_skills.feedbackId === input.feedbackId)
        .reduce<FeedbackAssignedSkill[]>((previous, current) => {
          const skill = previous.find((skill) => skill.skill.id === current.skills.id);
          if (!skill) {
            previous.push({
              skill: {
                id: current.skills.id,
                level: current.skills.level,
                name: current.skills.name,
                deprecated: current.skills.deprecatedAt !== null,
              },
              skillElements: [{
                id: current.skill_elements.id,
                order: current.skill_elements.order,
                name: current.skill_elements.name,
                deprecated: current.skill_elements.deprecatedAt !== null,
              }],
            });
            return previous;
          }

          skill.skillElements.push({
            id: current.skill_elements.id,
            order: current.skill_elements.order,
            name: current.skill_elements.name,
            deprecated: current.skill_elements.deprecatedAt !== null,
          });
          return previous;
        }, []);
    });
  }, { cacheKeyFn: serialize }));

  return R.try({
    try: () => loader.load(input),
    catch: (error) => new UnexpectedError({ cause: error }),
  });
};
