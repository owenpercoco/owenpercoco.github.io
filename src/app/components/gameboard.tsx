
"use client"

import React, { useState, useEffect, useRef, Dispatch, SetStateAction } from 'react';
import Square from './square';

import { getRandomChar, isWordInGame } from './functions/utils';

interface Coordinate {
    x: number,
    y: number,
}
const GameBoard = ({ setDebugMessage } : {setDebugMessage: Dispatch<SetStateAction<string[]>>}) => {
    const errorDisplay = (message: string, ...args: any[]) => {
        console.log(message, ...args);
        setDebugMessage((prev: string[]) => {
            return[...prev, `${message}${args.join(',')}`]
        })
    }
    const rows = 10;
    const columns = 10;
    // the main game board where play is done
    const [board, setBoard] = useState<string[][]>([]);
    // are we currently selecting a square?  if so, this is its coordinates. We also need a ref for this, sorry.
    const currentlySelectingSquare = useRef<boolean>(false);
    const [selectingSquare, setSelectingSquare] = useState<Coordinate | null>(null);
    // is a square selected? if so, this is its coordinates
    const [selectedSquare, setSelectedSquare] = useState<Coordinate | null>(null);
    // when you set this it deletes these letters
    const [deleteZone, setDeleteZone] = useState<Coordinate[]>([]);
    // the selection string displayed at the bottom
    const [selectionString, setSelectionString] = useState<string>()
    const selectionRef = useRef<string>('');
    const selectionCoordRef = useRef<Coordinate[]>([])


    // this is for phone control stuff
    const lastTouchCoord = useRef<Coordinate | null>(null);

    const createRow = () : string[] => {
        return Array(columns).fill(null).map((_e)=> getRandomChar());
    }


    const onTouchEnd = async () => {
        errorDisplay('in on touch end')
        setSelectingSquare(null);
        currentlySelectingSquare.current = false;
        for (let i = 1; i < selectionCoordRef.current.length; i++) {
            const incremental = selectionCoordRef.current[i - 1].y === selectionCoordRef.current[i].y - 1;
            if (!incremental) return false;
        }
        if (selectionRef.current.length > 2) {
            console.log('selectionRef', selectionRef.current);
            const result = await isWordInGame(selectionRef.current);
            errorDisplay(`is it a word? ${result}`);
            if (result) {
                setDeleteZone(selectionCoordRef.current);
                selectionRef.current = '';
                setSelectionString('');
                selectionCoordRef.current = []
            }
        }
    };
    
    const onTouchStart = (x: number, y: number) => {
        errorDisplay(`in on touch start with, ${x}, ${y}`);
        lastTouchCoord.current = { x, y };
        if (selectedSquare) {
            // Swap the letters
                const { x: startX, y: startY } = selectedSquare;
                const { x: endX, y: endY } = lastTouchCoord.current;
                if (startX != endX) {
                    setSelectedSquare(null);
                    return;
                }
                setBoard(prevBoard => {
                    const newBoard = prevBoard.map(row => [...row]);
                    const temp = newBoard[startX][startY];
                    newBoard[startX][startY] = newBoard[endX][endY];
                    newBoard[endX][endY] = temp;
                    return newBoard;
                });
            setSelectedSquare(null);
            setSelectingSquare(null);
            setSelectionString('')
            selectionCoordRef.current = []
            return
        }
        setSelectingSquare({ x, y })
        const isInRow = selectionCoordRef.current.some(coord => (
            (coord.x === x)
        ))
        const isInSelection = selectionCoordRef.current.some(coord => (
            (coord.x === x && coord.y === y)
        ));
    
        if (isInRow && !isInSelection) {
            selectionCoordRef.current.push({ x, y });
            selectionCoordRef.current.sort((a, b) => a.y - b.y)
            selectionRef.current = selectionCoordRef.current.map((coord) => board[coord.x][coord.y]).join('')
            setSelectionString(selectionRef.current);
        } else {
            // Start a new selection if the touched square is not adjacent
            selectionRef.current = board[x][y] || '';
            selectionCoordRef.current = [{ x, y }];
            setSelectionString(selectionRef.current);
        }
        currentlySelectingSquare.current = true;
        const timer = setTimeout(() => {
            if (currentlySelectingSquare.current) {
                errorDisplay('we have been long pressed');
                setSelectedSquare({ x, y });
                setSelectingSquare(null);
            }
        }, 1000);
    
        const clearLongPress = () => {
            clearTimeout(timer);
        };
    
        window.addEventListener('touchend', clearLongPress, { once: true });
        window.addEventListener('mouseup', clearLongPress, { once: true });
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
        }, 500);
    
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        window.addEventListener('mouseup', onTouchEnd);
        return () => {
            window.removeEventListener('mouseup', onTouchEnd);
        };
    }, []);

    useEffect(() => {
        if (!deleteZone || deleteZone.length < 2) return;
    
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

    const shouldBeGrey = (x: number, y: number) => {
        if (selectedSquare && selectedSquare.x != x) return true;
        if (selectedSquare === null) {
            return selectionCoordRef.current.some(coord => {
                return coord.x === x && coord.y === y
            })
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
                            onTouchStart={() => onTouchStart(rowIndex, cellIndex)}
                            onTouchEnd={onTouchEnd}
                            isSelecting={selectingSquare && selectingSquare.x === rowIndex && selectingSquare.y === cellIndex || false}
                            isSelected={selectedSquare && selectedSquare.x === rowIndex && selectedSquare.y === cellIndex || false}
                            isGrey={shouldBeGrey(rowIndex, cellIndex) || false }
                            cellIndex={cellIndex}   
                            errorDisplay={errorDisplay}                     
                        />
                    ))}
                </div>
            ))}
        </div>
    );
};

export default GameBoard;
