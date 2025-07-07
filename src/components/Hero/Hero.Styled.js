// src/components/Hero/Hero.Styled.js
import styled from "styled-components";

export const Container = styled.div`
  margin: 1rem;

  @media (min-width: 992px) {
    max-width: 1200px;
    margin: 3rem auto;
  }
`;

export const HeroSection = styled.section`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 2rem;

  @media (min-width: 992px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-align: left;
    margin: 0 1rem;
  }
`;

export const HeroLeft = styled.div`
  margin-bottom: 1rem;
  flex-basis: 50%;
`;

export const HeroRight = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  flex-basis: 50%;

  @media (min-width: 992px) {
    justify-content: flex-end;
    margin-top: 0;
  }
`;

export const Title = styled.h2`
  color: #0F172A;
  margin-bottom: 1rem;
  font-size: 2.75rem;
  font-weight: 700;
  letter-spacing: 1px;
`;

export const Genre = styled.h3`
  color: #b5179e;
  margin-bottom: 1rem;
  font-size: 1.59rem;
`;

export const Description = styled.p`
  color: #64748b;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 1rem;
`;

export const Image = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 1rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

export const LoadingText = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 1.25rem;
`;
