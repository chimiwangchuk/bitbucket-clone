import React from 'react';

import { Line, LineType } from '@atlassian/bitkit-diff/types';

import * as styles from '../styles';

export type LineGroup = {
  type: LineType;
  count: number;
};

type ScrollBarProps = {
  lines: Line[];
};

const increment = (group: LineGroup) => {
  group.count++;
  return group;
};

const parseType = (line: Line) =>
  line.conflictType ? ('conflict' as const) : line.type;

const groupByType = (prev: LineGroup[], current: Line) => {
  const top = prev.pop();
  const currentType = parseType(current);
  if (!top) {
    return [{ type: currentType, count: 1 }];
  }

  return top.type === currentType
    ? [...prev, increment(top)]
    : [
        ...prev,
        top,
        {
          type: currentType,
          count: 1,
        },
      ];
};

export const ScrollBar: React.FC<ScrollBarProps> = ({ lines }) => {
  const lineGroups = lines.reduce(groupByType, []);

  return (
    <styles.ScrollBar>
      {/* This is to add space for the chunk header at the top of the diff */}
      <styles.LineGroup
        percentHeight={(1 / (lines.length + 1)) * 100}
        type="normal"
      />
      {lineGroups.map((group, index) => (
        <styles.LineGroup
          key={index}
          percentHeight={(group.count / (lines.length + 1)) * 100}
          type={group.type}
        >
          <styles.FloatingLineGroup type={group.type} />
        </styles.LineGroup>
      ))}
    </styles.ScrollBar>
  );
};
