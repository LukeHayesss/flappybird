import React, { useEffect, useState } from "react";
import "./App.css";
import styled from 'styled-components';
import img2 from './flappybird-pipe-bigger.png';
import bird from './flappy-bird.png';
import background from './fb-game-background.png';
import ground from './bottom-background.png';

const BIRD_SIZE = 60;
const GAME_WIDTH = 500;
const GAME_HEIGHT = 500;
const GRAVITY = 6;
const JUMP_HEIGHT = 60;
const OBSTACLE_WIDTH = 60;
const OBSTACLE_GAP = 125;

const App = () => {
  const [birdPosition, setBirdPosition] = useState(250);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [obstacleHeight, setObstacleHeight] = useState(200);
  const [obstacleLeft, setObstacleLeft] = useState(GAME_WIDTH - OBSTACLE_WIDTH);
  const [score, setScore] = useState(0);

  const bottomObstacleHeight = GAME_HEIGHT - OBSTACLE_GAP - obstacleHeight;

  useEffect(() => {
    let timeId;
    if (gameHasStarted && birdPosition < GAME_HEIGHT - BIRD_SIZE) {
    timeId = setInterval(() => {
    setBirdPosition(birdPosition => birdPosition + GRAVITY)
    }, 24)
    }
    return () => {
    clearInterval(timeId)}
}, [birdPosition, gameHasStarted]);

//obstacle movements//
useEffect(() => {
  let obstacleId;
  if (gameHasStarted && obstacleLeft >= - OBSTACLE_WIDTH) {
  obstacleId = setInterval(() => {
  setObstacleLeft((obstacleLeft) => obstacleLeft - 8);
  }, 24);
  return () => {
  clearInterval(obstacleId);
  };
  }
  else {
    setObstacleLeft(GAME_WIDTH - OBSTACLE_WIDTH);
    setObstacleHeight(
    Math.floor(Math.random() * (GAME_HEIGHT - OBSTACLE_GAP)));
    setScore((score) => score + 1);
    }
}, [gameHasStarted, obstacleLeft]);


//collision detection//
useEffect(() => {
  const hasCollidedWithTopObstacle = 
  birdPosition >= 0 && birdPosition < obstacleHeight;
  const hasCollidedWithBottomObstacle = 
  birdPosition <= 500 && birdPosition >= 500 - bottomObstacleHeight;


//horizontal positioning for detection//    
  if (
  obstacleLeft >= 0 && 
  obstacleLeft <= OBSTACLE_WIDTH && 
  (hasCollidedWithTopObstacle || hasCollidedWithBottomObstacle)
  ) {
  setGameHasStarted(false);
  }
}, [birdPosition, obstacleHeight, bottomObstacleHeight, obstacleLeft]);


//set state for game//
const handleClick = () => {
  let newBirdPosition = birdPosition - JUMP_HEIGHT;
  if (!gameHasStarted) {
    setGameHasStarted(true);
    setScore(0);
    setBirdPosition(250);
  } else if (newBirdPosition < 0) {
    setBirdPosition(0);
  } else {
  setBirdPosition(newBirdPosition);
}
};

  return (
    <Div onClick={handleClick}>
      <BorderLeft/>
      <GameBox height={GAME_HEIGHT} width={GAME_WIDTH}>
        
        <Obstacle 
        top={0}
        width={OBSTACLE_WIDTH}
        height={obstacleHeight}
        left={obstacleLeft}/>

        <ObstacleTwo 
        top={GAME_HEIGHT - (obstacleHeight + bottomObstacleHeight)}
        width={OBSTACLE_WIDTH}
        height={bottomObstacleHeight}
        left={obstacleLeft}/>

        <Bird size={BIRD_SIZE} top={birdPosition}/>
       <Ground />
      </GameBox>
      <ScoreDiv>
      <span>{score}</span>
      </ScoreDiv>
      <BorderRight/>
      <BorderBottom/>
      <TitleBottom>
        FLAPPY BIRB
      </TitleBottom>
    </Div>
  )
};

const Bird = styled.div`
position: absolute;
background-image: url(${bird});
background-repeat: no-repeat;
height: ${(props) => props.size}px;
width: ${(props) => props.size}px;
top: ${(props) => props.top}px;
z-index: 20;
animation: MoveUpDown 1s linear infinite;
@keyframes MoveUpDown {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-25px);
  }
}
`
const BorderLeft = styled.div`
width: 50px;
height: 565px;
background-color: #f0f0f0;
z-index: 100;
`
const BorderRight = styled.div`
width: 50px;
height: 565px;
background-color: #f0f0f0;
z-index: 100;
`
const BorderBottom = styled.div`
width: 500px;
height: 50px;
background-color: #f0f0f0;
z-index: 100;
position: absolute;
margin-top: 515px;
`

const TitleBottom = styled.div`
display: flex;
justify-content: center;
align-items: center;
position: absolute;
font-size: 25px;
font-family: 'Press Start 2P';
color: black;
margin-top: 527px;
z-index: 101;
`

const Div = styled.div`
display: flex;
width: 100%;
justify-content: center;
& span {
  color: white;
  font-size: 20px;
  font-family: 'Press Start 2P';
  align-items: center;
  position: absolute;
  z-index: 50;
}
`

const ScoreDiv = styled.div`
display: flex;
align-items: center;
position: absolute;
justify-content: center;
width: 50px;
height: 50px;
background-color: black;
z-index: 50;
box-shadow: 0 1px 4px #000;
`

const GameBox = styled.div`
height: ${(props) => props.height}px;
width: ${(props) => props.width}px;
background-image: url(${background});
background-repeat: no-repeat;
overflow: hidden;
`

const Ground = styled.div`
background-image: url(${ground});
background-repeat: no-repeat;
width: 500px;
height: 25px;
position: absolute;
top: 490px;
z-index: 16;
`

//top  obstacle//
const Obstacle = styled.div`
position: relative;
top: ${(props) => props.top}px;
background-image: url(${img2});
background-repeat: no-repeat;
transform: rotate(180deg);
width: ${(props) => props.width}px;
height: ${(props) => props.height}px;
left: ${(props) => props.left}px;
z-index: 15;
`

//bottom obstacle//
const ObstacleTwo = styled.div`
position: relative;
top: ${(props) => props.top}px;
background-image: url(${img2});
background-repeat: no-repeat;
width: ${(props) => props.width}px;
height: ${(props) => props.height}px;
left: ${(props) => props.left}px;
z-index: 15;
`

export default App;
