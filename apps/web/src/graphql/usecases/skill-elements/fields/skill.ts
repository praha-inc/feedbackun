import { CustomError } from '@feedbackun/package-custom-error';
import { database, schema } from '@feedbackun/package-database';
import DataLoader from 'dataloader';
import { eq, inArray } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';
import { match, P } from 'ts-pattern';

import { dataLoader } from '../../../plugins/dataloader';

import type { Skill } from '../../skills/types';

const symbol = Symbol('SkillElementSkill');

export type SkillElementSkillInput = {
  skillElementId: string;
};

export class SkillElementSkillNotFoundError extends CustomError({
  name: 'SkillElementSkillNotFoundError',
  message: 'Does not exist skill for skill element.',
}) {}

export class SkillElementSkillUnexpectedError extends CustomError({
  name: 'SkillElementSkillUnexpectedError',
  message: 'Failed to find skill for skill element.',
}) {}

export type SkillElementSkillError = (
  | SkillElementSkillNotFoundError
  | SkillElementSkillUnexpectedError
);

export type SkillElementSkill = (
  input: SkillElementSkillInput,
) => ResultAsync<Skill, SkillElementSkillError>;

export const skillElementSkill: SkillElementSkill = (input) => {
  const loader = dataLoader(symbol, () => new DataLoader<string, Skill>(async (skillElementIds) => {
    const rows = await database()
      .select()
      .from(schema.skills)
      .innerJoin(schema.skillElements, eq(schema.skillElements.skillId, schema.skills.id))
      .where(inArray(schema.skillElements.id, [...skillElementIds]));

    return skillElementIds.map((skillElementId) => {
      const row = rows.find((row) => row.skill_elements.id === skillElementId);
      if (!row) throw new SkillElementSkillNotFoundError();
      return {
        id: row.skills.id,
        level: row.skills.level,
        name: row.skills.name,
      };
    });
  }));

  return ResultAsync.fromThrowable(
    () => loader.load(input.skillElementId),
    (error) => match(error)
      .with(P.instanceOf(SkillElementSkillNotFoundError), (error) => error)
      .otherwise(() => new SkillElementSkillUnexpectedError({ cause: error })),
  )();
};
