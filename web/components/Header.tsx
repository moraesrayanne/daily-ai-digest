'use client';

import Link from 'next/link';
import styled from 'styled-components';

const Wrapper = styled.header`
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

const Inner = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 0 24px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const BackBtn = styled.button`
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

  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
`;

const LogoIcon = styled.div`
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const LogoText = styled.span`
  font-family: var(--font-serif);
  font-size: 17px;
  color: var(--text-primary);
  font-weight: 400;
`;

const Subtitle = styled.span`
  font-size: 13px;
  color: var(--text-muted);
  font-weight: 400;
`;

const StatusDot = styled.div`
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow: 0 0 0 2px #dcfce7;
  animation: pulse 2.5s infinite;
  flex-shrink: 0;
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const StatusText = styled.span`
  font-size: 12px;
  color: var(--text-muted);
  font-weight: 500;
`;

interface HeaderProps {
  showBack?: boolean;
  subtitle?: string;
  lastUpdated?: string;
}

export function Header({ showBack, subtitle, lastUpdated }: HeaderProps) {
  return (
    <Wrapper>
      <Inner>
        <Left>
          {showBack && (
            <Link href="/" style={{ textDecoration: 'none' }}>
              <BackBtn>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Feed
              </BackBtn>
            </Link>
          )}
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <LogoIcon>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M7 1L9 5.5H13.5L10 8.5L11.5 13L7 10.5L2.5 13L4 8.5L0.5 5.5H5L7 1Z" fill="white" />
              </svg>
            </LogoIcon>
            <LogoText>
              Daily <em>AI</em> Digest
            </LogoText>
          </Link>
        </Left>

        {subtitle && <Subtitle>{subtitle}</Subtitle>}

        <StatusRow>
          <StatusDot />
          <StatusText>Atualizado {lastUpdated ?? '--:--'}</StatusText>
        </StatusRow>
      </Inner>
    </Wrapper>
  );
}
