import { clsx } from 'clsx';

import * as styles from './feedback-skill-badge.css';
import { graphql, useFragment } from '../../../../../.graphql';
import { Badge } from '../../../elements/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../../elements/tooltip';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const FeedbackSkillBadgeFragment = graphql(/* GraphQL */ `
  fragment FeedbackSkillBadge on FeedbackAssignedSkill {
    skill {
      id
      level
      name
      deprecated
    }
    skillElements {
      id
      order
      name
      deprecated
    }
  }
`);

export type FeedbackSkillBadgeProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof FeedbackSkillBadgeFragment>;
};

export const FeedbackSkillBadge: FC<FeedbackSkillBadgeProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(FeedbackSkillBadgeFragment, fragment);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Badge className={clsx(styles.skill, data.skill.deprecated && styles.deprecated, className)} asChild>
          <button>
            Lv.{data.skill.level} {data.skill.name}{data.skill.deprecated && ' (廃止)'}
          </button>
        </Badge>
      </TooltipTrigger>
      <TooltipContent className={styles.elements}>
        {data.skillElements.map((skillElement) => (
          <div
            key={skillElement.id}
            className={clsx(skillElement.deprecated && styles.deprecated)}
          >
            {skillElement.order}. {skillElement.name}{skillElement.deprecated && ' (廃止)'}
          </div>
        ))}
      </TooltipContent>
    </Tooltip>
  );
};
