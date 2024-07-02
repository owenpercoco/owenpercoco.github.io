

"use client"

import React, { useState } from 'react';

import GameBoard from "./components/gameboard";
export default function Home() {
  const [debugMessage, setDebugMessage] = useState<string[]>([]);
  console.log(process.env)

  return (
   <div className="app-container">
      <h1>BIG WORDLE TETRIS version 1.03 </h1>
      <button type="button" onClick={() => setDebugMessage([])}>Clear Error</button>
      <div className="board-container">
        <GameBoard setDebugMessage={setDebugMessage}/>
      </div>
      <ul>
        {debugMessage.map((e, index) => <li key={index}>{e}</li>)}
        </ul>
      
   </div>
  );
}
