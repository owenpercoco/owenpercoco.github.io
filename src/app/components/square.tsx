import React, { Dispatch } from 'react';

interface SquareProps {
    value?: string;
    onTouchStart: () => void;
    onTouchEnd: () => void;
    isSelecting: boolean;
    isSelected: boolean;
    cellIndex: number;
    errorDisplay: (message: string, ...args: any[]) => void;
}


const Square = ({ value, onTouchStart, onTouchEnd, isSelecting, isSelected, cellIndex, errorDisplay }: SquareProps) => {

    return (
        <div key={cellIndex} className={`cell ${isSelected ? 'selected' : '' } ${isSelecting ? 'selecting' : '' }`}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent text selection
                onTouchStart();
            }}
            onMouseUp={(e) => {
                e.preventDefault()
                onTouchEnd();
            }}
            onTouchStart={(e) => {
                e.preventDefault()
                onTouchStart();
            }} // Handle touch start
            onTouchEnd={(e) => {
                e.preventDefault()
                onTouchEnd();
            }} // Handle touch end
        >
            <span className="cell-input">{value}</span>
         </div>
         );
};

export default Square;
