'use client';

import Link from 'next/link';
import { Wrapper, Inner, Left, BackBtn, LogoIcon, LogoText, StatusDot, StatusRow, StatusText } from './Header.styles';

interface HeaderProps {
  showBack?: boolean;
  lastUpdated?: string;
}

export function Header({ showBack, lastUpdated }: HeaderProps) {
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
            <LogoText>Daily <em>AI</em> Digest</LogoText>
          </Link>
        </Left>

        <StatusRow>
          <StatusDot />
          <StatusText>Atualizado {lastUpdated ?? '--:--'}</StatusText>
        </StatusRow>
      </Inner>
    </Wrapper>
  );
}
