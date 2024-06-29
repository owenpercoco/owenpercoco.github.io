
"use client"

import React, { useState, useEffect, useRef } from 'react';
import Square from './square';

import { getRandomChar, isWordInGame } from './functions/utils';
interface Coordinate {
    x: number,
    y: number,
}
const GameBoard = () => {
    const rows = 5;
    const columns = 10;
    const [board, setBoard] = useState<string[][]>([]);
    const longPressTimer = useRef<boolean>(false);
    const currentlyDragging = useRef<boolean>(false);
    const [currentRow, setCurrentRow] = useState<number>(0);
    const [isDragging, setIsDragging] = useState<boolean>(false)
    const [deleteZone, setDeleteZone] = useState<Coordinate[]>([]);
    const [selectionString, setSelectionString] = useState<string>()
    const [longPressedSquare, setLongPressedSquare] = useState<Coordinate | null>(null);
    const selectionRef = useRef<string>('');
    const selectionCoordRef = useRef<Coordinate[]>([])
    const hoverCoordRef = useRef<Coordinate| null>(null)
    const dragStartCoord = useRef<Coordinate | null>(null);
    const lastTouchCoord = useRef<Coordinate | null>(null);

    const createRow = () : string[] => {
        return Array(columns).fill(null).map((_e)=> getRandomChar());
    }

    const handleMouseDown = (x: number, y: number) => {
        setIsDragging(true);
        longPressTimer.current = true;
        currentlyDragging.current = false;
        selectionRef.current = board[x][y] || '';
        selectionCoordRef.current = [{ x, y }];
        dragStartCoord.current = { x, y };
        lastTouchCoord.current = { x, y }; // Initialize last touch coordinate
        setSelectionString(selectionRef.current);
        setLongPressedSquare({ x, y });
        const timer = setTimeout(() => {
            if (selectionRef.current.length === 1 && longPressTimer.current) {
                console.log('we have been long pressed');
                currentlyDragging.current = true;
            }
        }, 2000);

        const clearLongPress = () => {
            clearTimeout(timer);
            setIsDragging(false);
            longPressTimer.current = false;
            setLongPressedSquare(null);
        };

        window.addEventListener('mouseup', clearLongPress, { once: true });
        window.addEventListener('touchend', clearLongPress, { once: true });
    };


    const handleMouseEnter = (x: number, y: number) => {
        hoverCoordRef.current = {x, y};
        if (isDragging) {
            if (lastTouchCoord.current && lastTouchCoord.current.x === x && lastTouchCoord.current.y === y) {
                return;
            }
            lastTouchCoord.current = { x, y }; // Update last touch coordinate
            const useX = selectionCoordRef.current![0].x
            const useY = selectionCoordRef.current![0].y
            if (y < useY) {
                selectionRef.current = board[useX][y] || '' + selectionRef.current;
                selectionCoordRef.current = [{x: useX, y}, ...selectionCoordRef.current]
                setSelectionString(selectionRef.current)
            } else {
                selectionRef.current += board[useX][y] || '';
                selectionCoordRef.current.push({x: useX, y})
                setSelectionString(selectionRef.current)
            }
            if (currentlyDragging.current) {
                setSelectionString(selectionString![0])
            }
        }
    };

    const handleMouseUp = async () => {
        setIsDragging(false);
        longPressTimer.current = false;
        setLongPressedSquare(null);
        if (currentlyDragging.current) {
            // Swap the letters
            if (dragStartCoord.current && hoverCoordRef.current) {
                const { x: startX, y: startY } = dragStartCoord.current;
                const { x: endX, y: endY } = hoverCoordRef.current;
                setBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => [...row]);
                    const temp = newBoard[startX][startY];
                    newBoard[startX][startY] = newBoard[endX][endY];
                    newBoard[endX][endY] = temp;
                    return newBoard;
                });
                dragStartCoord.current = null;
            }
            currentlyDragging.current = false;
        }

        if (selectionRef.current.length > 2) {
            console.log('selectionRef', selectionRef.current);
            const result = await isWordInGame(selectionRef.current)
            console.log('is it a word?', result)
            console.log('selection corrcs', selectionCoordRef.current)
            if (result) {
                setDeleteZone(selectionCoordRef.current);
            }
        }
        
    };

    useEffect(() => {
        setBoard([createRow()])
        const interval = setInterval(() => {
            setBoard(prevBoard => {
                if (prevBoard.length < rows) {
                    const newRow = createRow();
                    return [...prevBoard, newRow];
                } else {
                    clearInterval(interval);
                    return prevBoard;
                }
            });
            setCurrentRow(prevRow => prevRow + 1);
        }, 500);
    
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    useEffect(() => {
        if (!deleteZone || deleteZone.length < 2) return;
    
        console.log('delete zone', deleteZone);
        console.log('board', board);
    
        const newBoard = board.map(row => [...row]);

        deleteZone.forEach(coord => {
            const { x, y } = coord;
            for (let i = x; i < rows - 1; i++) {
                newBoard[i][y] = newBoard[i + 1][y];
            }
            newBoard[rows - 1][y] = '';
        });
    
        setBoard(newBoard);
    }, [deleteZone]);

    function getSetPieceValue(x:number, y:number) {
        return (event: string) => {
            console.log('in the set value', event, x, y)
            setBoard(prev => {
                const newBoard = prev.map((row, rowIndex) => 
                    row.map((cell, cellIndex) => (rowIndex === x && cellIndex === y ? event : cell))
                );
                return newBoard;
            });
        }
    }
    

    return (
        <div className="board">
            {selectionString}
            {board.map((row, rowIndex) => (
                <div key={rowIndex} className="row">
                    {row.map((cell, cellIndex) => (
                        <Square
                            key={cellIndex}
                            value={cell}
                            setValue={getSetPieceValue(rowIndex, cellIndex)}
                            onMouseDown={() => handleMouseDown(rowIndex, cellIndex)}
                            onMouseEnter={() => handleMouseEnter(rowIndex, cellIndex)}
                            onMouseUp={() => handleMouseUp()}
                            isLongPressed={longPressedSquare && longPressedSquare.x === rowIndex && longPressedSquare.y === cellIndex}
                            cellIndex={cellIndex}                        
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
