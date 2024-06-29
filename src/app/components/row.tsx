import React, { useState, useEffect, Dispatch } from 'react';
import Square from './square';

interface RowProps {
    row: string[];
    rowIndex: number;
    selectionRef: any;
    setValue: any;
}


const Row = ({ row, rowIndex, selectionRef, setValue }: RowProps) => {
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleMouseDown = (x: number, y: number) => {
        setIsDragging(true);
        selectionRef.current = board[x][y] || '';
        selectionCoordRef.current =[{x, y}]
        setSelectionString(selectionRef.current)
    };

    const handleMouseEnter = (x: number, y: number) => {
        if (isDragging) {
            const useX = selectionCoordRef.current![0].x
            selectionRef.current += board[useX][y] || '';
            selectionCoordRef.current.push({x: useX, y})
            setSelectionString(selectionRef.current)
        }
    };

    const handleMouseUp = async () => {
        setIsDragging(false);
        console.log('selectionRef', selectionRef.current);
        const result = await isWordInGame(selectionRef.current)
        console.log('is it a word?', result)
        console.log('selection corrcs', selectionCoordRef.current)
        if (result) {
            setDeleteZone(selectionCoordRef.current);
        }
    };
    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);
    return (
        <div key={rowIndex} className="row">
        {row.map((cell, cellIndex) => (
            <Square 
                value={cell}
                setValue={getSetPieceValue(rowIndex, cellIndex)}
                onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
            />
        ))}
    </div>
         );
};

export default Row;
