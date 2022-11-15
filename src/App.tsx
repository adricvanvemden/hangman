import { useCallback, useEffect, useState } from 'react';
import { HangmanDrawing } from './HangmanDrawing';
import { HangmanWord } from './HangmanWord';
import { Keyboard } from './Keyboard';
import englishWords from './words/English.json';

const App = () => {
  const [wordToGuess, setWordToGuess] = useState(() => {
    return englishWords[Math.floor(Math.random() * englishWords.length)];
  });
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);

  const incorrectLetters = guessedLetters.filter((letter) => !wordToGuess.includes(letter));

  const isLoser = incorrectLetters.length >= 10;
  const isWinner = wordToGuess.split('').every((letter) => guessedLetters.includes(letter));

  const addGuesssedLetter = useCallback(
    (letter: string) => {
      if (guessedLetters.includes(letter) || isLoser || isWinner) {
        return;
      } else {
        setGuessedLetters((currentLetters) => [...currentLetters, letter]);
      }
    },
    [guessedLetters, isLoser, isWinner]
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const key = e.key;

      if (!key.match(/^[a-z]$/)) {
        return;
      } else {
        e.preventDefault();
        addGuesssedLetter(key);
      }
    };

    document.addEventListener('keypress', handler);

    return () => {
      document.removeEventListener('keypress', handler);
    };
  }, [guessedLetters]);

  return (
    <div
      style={{
        maxWidth: '800px',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem',
        margin: '0 auto',
        alignItems: 'center'
      }}
    >
      <div style={{ fontSize: '2rem', textAlign: 'center' }}>
        {isLoser && (
          <>
            You lost!{' '}
            <span
              onClick={() => window.location.reload()}
              style={{ color: 'lightblue', cursor: 'pointer' }}
            >
              Play again?
            </span>
          </>
        )}
        {isWinner && (
          <>
            🎉 You won! 🎉{' '}
            <span
              onClick={() => window.location.reload()}
              style={{ color: 'lightblue', cursor: 'pointer' }}
            >
              Play again?
            </span>
          </>
        )}
      </div>
      <HangmanDrawing numberOfGuesses={incorrectLetters.length} />
      <HangmanWord guessedLetters={guessedLetters} wordToGuess={wordToGuess} revealWord={isLoser} />
      <Keyboard
        activeLetters={guessedLetters.filter((letter) => wordToGuess.includes(letter))}
        inactiveLetters={incorrectLetters}
        addGuessedLetter={addGuesssedLetter}
        disabled={isLoser || isWinner}
      />
    </div>
  );
};

export default App;
