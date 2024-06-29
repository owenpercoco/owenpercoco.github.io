import React, { Dispatch } from 'react';

interface SquareProps {
    value?: string;
    setValue: any;
    onMouseDown: () => void;
    onMouseEnter: () => void;
    isLongPressed: boolean | null;
}


const Square = ({ value, setValue, onMouseDown, onMouseEnter, isLongPressed }: SquareProps) => {

    return (
        <div className={`cell ${isLongPressed ? 'selected' : '' }`}
            onMouseDown={(e) => {
                e.preventDefault(); // Prevent text selection
                onMouseDown();
            }}
            onMouseEnter={(e) => {
                e.preventDefault(); // Prevent text selection
                onMouseEnter();
            }}
        >
            <input type="text" className="cell-input" value={value} onChange={(e) => setValue(e.target.value)}/>
         </div>
         );
};

export default Square;
