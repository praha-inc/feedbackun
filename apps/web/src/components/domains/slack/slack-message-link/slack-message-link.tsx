import { clsx } from 'clsx';
import { ExternalLink } from 'lucide-react';

import * as styles from './slack-message-link.css';
import { graphql, useFragment } from '../../../../../.graphql';

import type { FragmentType } from '../../../../../.graphql';
import type { FC } from 'react';

export const SlackMessageLinkFragment = graphql(/* GraphQL */ `
  fragment SlackMessageLink on SlackMessage {
    id
    url
  }
`);

export type SlackMessageLinkProps = {
  className?: string | undefined;
  fragment: FragmentType<typeof SlackMessageLinkFragment>;
};

export const SlackMessageLink: FC<SlackMessageLinkProps> = ({
  className,
  fragment,
}) => {
  const data = useFragment(SlackMessageLinkFragment, fragment);

  return (
    <a
      className={clsx(styles.wrapper, className)}
      target="_blank"
      rel="noopener noreferrer"
      href={data.url}
    >
      Slackで開く
      <ExternalLink className={styles.icon} size="1em" />
    </a>
  );
};
