import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Alert } from 'react-native';
import { Colors } from '../constants/Colors';
import { useRouter } from 'expo-router';

const items = [
  require('../../assets/wastes/plastic_bottle.jpg'),
  require('../../assets/wastes/soda_can.jpg'),
  require('../../assets/wastes/glass_jar.jpg'),
  require('../../assets/wastes/newspaper.jpg'),
  require('../../assets/wastes/banana_peel.jpg'),
];

const GRID_SIZE = 6;

const generateGrid = () => {
  return Array.from({ length: GRID_SIZE }, () =>
    Array.from({ length: GRID_SIZE }, () => Math.floor(Math.random() * items.length))
  );
};

const RecycleMatch = () => {
  const [grid, setGrid] = useState<number[][]>(generateGrid());
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(150); // 2:30 minutes
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Timer logic
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      endGame();
    }
  }, [timeLeft]);

  const handleSelect = (row: number, col: number) => {
    if (selected) {
      // Swap items
      const newGrid = [...grid];
      const temp = newGrid[row][col];
      newGrid[row][col] = newGrid[selected.row][selected.col];
      newGrid[selected.row][selected.col] = temp;

      setGrid(newGrid);
      setSelected(null);

      // Check for matches
      if (!checkMatches(newGrid)) {
        // No match, revert the swap and deduct points
        setTimeout(() => {
          const revertedGrid = [...grid];
          revertedGrid[selected.row][selected.col] = newGrid[row][col];
          revertedGrid[row][col] = temp;
          setGrid(revertedGrid);
        }, 500);
        setScore(score - 10);
      } else {
        // Match found, add points
        setScore(score + 20);
      }
    } else {
      setSelected({ row, col });
    }
  };

  const checkMatches = (grid: number[][]) => {
    const matches: { row: number; col: number }[] = [];

    // Check rows
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE - 2; col++) {
        if (
          grid[row][col] === grid[row][col + 1] &&
          grid[row][col] === grid[row][col + 2]
        ) {
          matches.push({ row, col });
          matches.push({ row, col: col + 1 });
          matches.push({ row, col: col + 2 });
        }
      }
    }

    // Check columns
    for (let col = 0; col < GRID_SIZE; col++) {
      for (let row = 0; row < GRID_SIZE - 2; row++) {
        if (
          grid[row][col] === grid[row + 1][col] &&
          grid[row][col] === grid[row + 2][col]
        ) {
          matches.push({ row, col });
          matches.push({ row: row + 1, col });
          matches.push({ row: row + 2, col });
        }
      }
    }

    // Remove matches
    if (matches.length > 0) {
      const newGrid = [...grid];
      matches.forEach(({ row, col }) => {
        newGrid[row][col] = Math.floor(Math.random() * items.length);
      });
      setGrid(newGrid);
      return true;
    }

    return false;
  };

  const endGame = () => {
    router.push({
      pathname: '/games/endingScreen',
      params: { score },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.scoreText}>Score: {score}</Text>
        <Text style={styles.timerText}>
          Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10 ? '0' : ''}
          {timeLeft % 60}
        </Text>
      </View>

      <View style={styles.grid}>
        {grid.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map((item, colIndex) => (
              <TouchableOpacity
                key={colIndex}
                style={[
                  styles.cell,
                  selected?.row === rowIndex && selected?.col === colIndex
                    ? styles.selectedCell
                    : null,
                ]}
                onPress={() => handleSelect(rowIndex, colIndex)}
              >
                <Image source={items[item]} style={styles.itemImage} />
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

export default RecycleMatch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.main,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scoreText: {
    fontSize: 18,
    color: Colors.primary.green,
    fontWeight: 'bold',
  },
  timerText: {
    fontSize: 18,
    color: Colors.primary.red,
    fontWeight: 'bold',
  },
  grid: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    width: 50,
    height: 50,
    margin: 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary.cream,
    borderRadius: 5,
  },
  selectedCell: {
    borderWidth: 2,
    borderColor: Colors.primary.blue,
  },
  itemImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
});
