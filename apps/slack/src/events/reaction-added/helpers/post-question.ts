import { database, schema } from '@feedbackun/package-database';
import { asc, eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { SlackChannelId, SlackUserId } from '@feedbackun/package-domain';
import type { SlackAPIClient } from 'slack-edge';

type Option = {
  id: string;
  name: string;
  level: number;
  elements: Array<{
    id: string;
    order: number;
    name: string;
  }>;
};

export const postQuestion = ResultAsync.fromThrowable(async (
  client: SlackAPIClient,
  channelId: SlackChannelId,
  messageUserId: SlackUserId,
  reactionUserId: SlackUserId,
  messageTs: string,
) => {
  const link = await client.chat.getPermalink({
    channel: channelId.value,
    message_ts: messageTs,
  });

  const skills = await database()
    .select()
    .from(schema.workSkills)
    .innerJoin(schema.workSkillElements, eq(schema.workSkills.id, schema.workSkillElements.workSkillId))
    .where(
      eq(
        schema.workSkills.type,
        database()
          .select({ type: schema.users.type })
          .from(schema.users)
          .innerJoin(schema.slackUsers, eq(schema.users.id, schema.slackUsers.userId))
          .where(eq(schema.slackUsers.id, messageUserId.value)),
      ),
    )
    .orderBy(asc(schema.workSkills.level), asc(schema.workSkillElements.order))
    .then((rows) => rows.reduce<Option[]>((previous, current) => {
      const skill = previous.find((option) => option.id === current.work_skills.id);
      if (skill) {
        skill.elements.push({
          id: current.work_skill_elements.id,
          order: current.work_skill_elements.order,
          name: current.work_skill_elements.name,
        });
        return previous;
      }
      previous.push({
        id: current.work_skills.id,
        name: current.work_skills.name,
        level: current.work_skills.level,
        elements: [
          {
            id: current.work_skill_elements.id,
            order: current.work_skill_elements.order,
            name: current.work_skill_elements.name,
          },
        ],
      });
      return previous;
    }, []));

  await client.chat.postEphemeral({
    channel: channelId.value,
    user: reactionUserId.value,
    text: '良いと思ったことをフィードバックして欲しいにゃ！',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<${link.permalink}|メッセージ>へのフィードバックをお願いするにゃん！`,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'どういう所が良かったのかにゃ？',
        },
        element: {
          type: 'plain_text_input',
          multiline: true,
        },
      },
      {
        type: 'input',
        label: {
          type: 'plain_text',
          text: 'どのスキルに該当しそうかにゃ？',
        },
        element: {
          type: 'multi_static_select',
          placeholder: {
            type: 'plain_text',
            text: 'スキルを選択する',
          },
          option_groups: skills.map((skill) => ({
            label: {
              type: 'plain_text',
              text: skill.name,
            },
            options: skill.elements.map((element) => ({
              value: element.id,
              text: {
                type: 'plain_text',
                text: `スキル${skill.level}-${element.order}`,
              },
              description: {
                type: 'plain_text',
                text: element.name,
              },
            })),
          })),
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: ' ',
        },
        accessory: {
          type: 'button',
          style: 'primary',
          text: {
            type: 'plain_text',
            text: '送信するにゃ！',
          },
        },
      },
    ],
  });
});
