import React, { useState } from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const BUTTONS: string[][] = [
  ['C', '÷', '%', '⌫'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '-'],
  ['1', '2', '3', '+'],
  ['0', '.', '='],
];

const Calculator: React.FC = () => { // Corrected: Added React.FC
  const [currentInput, setCurrentInput] = useState<string>('');
  const [history, setHistory] = useState<string>('');

  const handlePress = (value: string): void => {
    if (value === 'C') {
      setCurrentInput('');
      setHistory('');
      return;
    }

    if (value === '⌫') {
      setCurrentInput((prev) => prev.slice(0, -1));
      return;
    }

    if (value === '=') {
      try {
        const formatted = currentInput.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        const result = eval(formatted); // ❗ In production, use a safe math parser
        setHistory(`${currentInput} = ${result}`);
        setCurrentInput(result.toString());
      } catch (e) {
        setHistory('Error');
        setCurrentInput('');
      }
      return;
    }

    setCurrentInput((prev) => prev + value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.historyText}>{history}</Text>
        <Text style={styles.resultText}>{currentInput || '0'}</Text>
      </View>

      {BUTTONS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.buttonRow}>
          {row.map((button, index) => {
            const isOperator = ['+', '-', '×', '÷', '=', '%'].includes(button);
            const isClear = button === 'C';
            const isDelete = button === '⌫';

            const buttonStyle = [
              styles.button,
              isOperator || isClear || isDelete
                ? styles.orangeButton
                : styles.grayButton,
              rowIndex === 4 && index === 0 ? styles.zeroButton : null,
            ];

            return (
              <TouchableOpacity
                key={index}
                style={buttonStyle}
                onPress={() => handlePress(button)}
              >
                <Text style={styles.buttonText}>{button}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

export default Calculator;

const screenWidth = Dimensions.get('window').width;
const buttonBaseWidth = (screenWidth - 50) / 4;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
  },
  display: {
    paddingHorizontal: 20,
    paddingBottom: 10,
    alignItems: 'flex-end',
  },
  resultText: {
    fontSize: 60,
    fontWeight: 'bold',
    color: '#000',
  },
  historyText: {
    fontSize: 22,
    color: '#666',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginVertical: 5,
  },
  button: {
    width: buttonBaseWidth,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zeroButton: {
    flex: 2,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingLeft: 35,
    width: buttonBaseWidth * 2 + 10,
    backgroundColor: '#333333',
  },
  buttonText: {
    fontSize: 28,
    color: '#fff',
  },
  orangeButton: {
    backgroundColor: '#f1a33c',
  },
  grayButton: {
    backgroundColor: '#333333',
  },
});
