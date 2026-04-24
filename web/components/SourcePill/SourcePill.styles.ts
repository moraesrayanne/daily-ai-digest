'use client';

import styled from 'styled-components';

export const Pill = styled.span<{ $bg: string; $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  border-radius: 100px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  background: ${(p) => p.$bg};
  color: ${(p) => p.$color};
`;

export const Dot = styled.span<{ $color: string }>`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: ${(p) => p.$color};
  display: inline-block;
  flex-shrink: 0;
`;
