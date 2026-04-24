'use client';

import styled from 'styled-components';

export const Wrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(249, 248, 245, 0.88);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);

  [data-dark='1'] & {
    background: rgba(26, 25, 23, 0.88);
  }
`;

export const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const BackBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-secondary);
  padding: 6px 8px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  font-family: var(--font-sans);
  transition: all 0.15s;
  white-space: nowrap;

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
`;

export const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

export const LogoText = styled.span`
  font-family: var(--font-serif);
  font-size: 17px;
  color: var(--text-primary);
  font-weight: 400;
  white-space: nowrap;
`;

export const StatusDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px #dcfce7;
  animation: pulse 2.5s infinite;
  flex-shrink: 0;
`;

export const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 480px) {
    display: none;
  }
`;

export const StatusText = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
`;
