import React, { Dispatch } from 'react';

interface SquareProps {
    value?: string;
    setValue: any;
    onMouseDown: () => void;
    onMouseEnter: () => void;
    onMouseUp: () => void;
    isLongPressed: boolean | null;
    cellIndex: number;
}


const Square = ({ value, setValue, onMouseDown, onMouseEnter, onMouseUp, isLongPressed, cellIndex }: SquareProps) => {

    return (
        <div key={cellIndex} className={`cell ${isLongPressed ? 'selected' : '' }`}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent text selection
                onMouseDown();
            }}
            onMouseEnter={(e) => {
                e.preventDefault(); // Prevent text selection
                onMouseEnter();
            }}
            onTouchStart={(e) => {
                e.preventDefault()
                onMouseDown();
            }} // Handle touch start
            onTouchEnd={(e) => {
                e.preventDefault()
                onMouseUp();
            }} // Handle touch end
            onTouchMove={(e) => {
                e.preventDefault()
                onMouseEnter();
            }} // Handle touch move
        >
            <input type="text" className="cell-input" value={value} onChange={(e) => setValue(e.target.value)}/>
         </div>
         );
};

export default Square;
