import { database, schema } from '@feedbackun/package-database';
import { asc, eq } from 'drizzle-orm';
import { ResultAsync } from 'neverthrow';

import type { SlackChannel, SlackMessage, SlackUser } from '@feedbackun/package-domain';
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
  channel: SlackChannel,
  messageUser: SlackUser,
  reactionUser: SlackUser,
  message: SlackMessage,
) => {
  const link = await client.chat.getPermalink({
    channel: channel.id.value,
    message_ts: message.ts,
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
          .where(eq(schema.slackUsers.id, messageUser.id.value)),
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
    channel: channel.id.value,
    user: reactionUser.id.value,
    text: '良かったところをフィードバックして欲しいにゃ！',
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `<@${reactionUser.id.value}>\n<${link.permalink}|このメッセージ>へのフィードバックをお願いするにゃん！`,
        },
      },
      {
        type: 'input',
        block_id: 'content',
        label: {
          type: 'plain_text',
          text: 'どういう所が良かったのかにゃ？',
        },
        element: {
          type: 'plain_text_input',
          action_id: 'input',
          multiline: true,
        },
      },
      {
        type: 'input',
        block_id: 'skills',
        label: {
          type: 'plain_text',
          text: 'どのスキルに該当しそうかにゃ？',
        },
        element: {
          type: 'multi_static_select',
          action_id: 'input',
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
          action_id: 'submit_question',
          value: JSON.stringify({
            slackMessageId: message.id.value,
            sendSlackUserId: reactionUser.id.value,
            receiveSlackUserId: messageUser.id.value,
          }),
          text: {
            type: 'plain_text',
            text: '送信するにゃ！',
          },
        },
      },
    ],
  });
});
