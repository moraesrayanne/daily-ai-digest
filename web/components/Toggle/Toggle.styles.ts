'use client';

import styled from 'styled-components';

export const Track = styled.div<{ $checked: boolean }>`
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: ${(p) => (p.$checked ? 'var(--accent)' : 'var(--border-strong)')};
  position: relative;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
`;

export const Thumb = styled.div<{ $checked: boolean }>`
  position: absolute;
  top: 2px;
  left: ${(p) => (p.$checked ? '18px' : '2px')};
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  transition: left 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
`;
