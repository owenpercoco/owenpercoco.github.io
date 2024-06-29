
const fetchWords = async (): Promise<string[]> => {
    const response = await fetch('/constants/words.txt');
    const text = await response.text();
    return text.split('\n').map(word => word.trim().toUpperCase());
};


// Function to check if a word is in the list
export const isWordInGame = async (word: string):Promise<boolean> => {
  const words = await fetchWords();
  const result = words.includes(word.toUpperCase());
  return result;
};


export function getRandomChar() {
    const consanants = "BCDFGHJKLMNPQRSTVWXYZ";
    const vowels = "AEIOU";
    return Math.round(Math.random()) ? getRandomCharacter(vowels) : getRandomCharacter(consanants)
  }

  function getRandomCharacter(chars: string) {
    const result = chars.charAt(Math.floor(Math.random() * (chars.length - 1)));
    return result;
  }
