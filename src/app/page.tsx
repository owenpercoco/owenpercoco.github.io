import Image from "next/image";
import GameBoard from "./components/gameboard";
export default function Home() {
  return (
   <div className="app-container">
      <h1>BIG WORDLE TETRIS</h1>
      <div className="board-container">
        <GameBoard/>
      </div>
   </div>
  );
}
