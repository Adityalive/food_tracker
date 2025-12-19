import React from 'react';
import styled from 'styled-components';

const Card = () => {
  return (
    <StyledWrapper>
      <div className="card">
        {/* Updated SVG: A Healthy Food / Apple Icon to match Nutrition theme */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M20.59 13.41c-1.61 0-3.07-.63-4.18-1.64 1.12-1.89 1.13-4.13.06-6.03-.54-.95-1.34-1.69-2.28-2.14.77-1.35 2.4-2.13 3.73-2.6.43-.15 1.05.08 1.25.5 1.77 3.73 1.07 8.57 1.42 11.91zM12 22c-4.97 0-9-4.03-9-9 0-4.48 3.28-8.19 7.57-8.9.1.53.25 1.07.45 1.6 1.48 3.82 4.9 6.27 8.93 6.3.06.67.1 1.35.05 2-.51 4.62-4.38 8-8 8z" />
        </svg>
        <div className="card__content">
          <p className="card__title">AI Nutrition Scan</p>
          <p className="card__description">
            Instantly analyze your meals with our advanced AI. Get detailed breakdowns of calories, proteins, and macros just by uploading a photo.
          </p>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 300px;
    height: 200px;
    /* CHANGED: Dark theme background to match your app */
    background-color: #1a1a1a; 
    border: 1px solid #333;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    perspective: 1000px;
    box-shadow: 0 0 0 5px rgba(0, 0, 0, 0.2);
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card svg {
    width: 48px;
    /* CHANGED: Cyan color to match your buttons */
    fill: #22d3ee; 
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }

  .card:hover {
    transform: scale(1.05);
    /* CHANGED: Cyan glow on hover */
    box-shadow: 0 8px 16px rgba(34, 211, 238, 0.15);
    border-color: #22d3ee;
  }

  .card__content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    box-sizing: border-box;
    /* CHANGED: Match card background */
    background-color: #1a1a1a; 
    transform: rotateX(-90deg);
    transform-origin: bottom;
    transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  .card:hover .card__content {
    transform: rotateX(0deg);
  }

  .card__title {
    margin: 0;
    font-size: 22px;
    /* CHANGED: White text for dark mode */
    color: #fff; 
    font-weight: 700;
    margin-bottom: 8px;
  }

  .card:hover svg {
    scale: 0;
  }

  .card__description {
    margin: 0;
    font-size: 14px;
    /* CHANGED: Lighter gray for readability */
    color: #a3a3a3; 
    line-height: 1.5;
  }
`;

export default Card;