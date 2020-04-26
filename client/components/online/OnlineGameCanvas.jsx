import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';

import { colors } from '../../lib/Settings';
import Column from '../Column';
import { firestore } from '../../lib/firebaseUtils';
import { createStructuredSelector } from 'reselect';
import {
  selectLobbyId,
  selectFieldTypes,
  selectPlayerId,
  selectGame,
} from '../../redux/game/game.selectors';
import { selectHaptics } from '../../redux/settings/settings.selectors';
import { connect, useDispatch } from 'react-redux';
import { getFieldType, checkGame, getPlayerName } from '../../lib/gameCanvasUtils';
import { quitGame } from '../../redux/game/game.actions';
import { showToast } from '../../lib/toast';
const initialState = {
  winner: null,
  tied: false,
  winnerColumns: [],
};

const OnlineGameCanvas = ({ size, gameState, lobbyId, hapticsEnabled }) => {
  const dispatch = useDispatch();
  const [timers, setTimers] = useState([]);
  const [winnerDetails, setWinnerDetails] = useState(initialState);
  const { winner, winnerColumns, tied } = winnerDetails;
  const { fieldTypes, playerId, xIsNext, gameStarted } = gameState;

  const canvasFrozen = playerId !== xIsNext;

  const handleFieldPress = async (num) => {
    if (canvasFrozen) return;
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    const newFieldTypes = [...fieldTypes];

    newFieldTypes[num] = getFieldType(playerId);

    await docRef.set(
      { gameStarted: true, xIsNext: xIsNext === 0 ? 1 : 0, fieldTypes: newFieldTypes },
      { merge: true }
    );
  };

  const resetLobby = async () => {
    const docRef = firestore.collection('lobbies').doc(lobbyId);

    await docRef.set({ fieldTypes: Array(size * size).fill(null), xIsNext: 0 }, { merge: true });
  };

  const handleNewGame = () => {
    if (Platform.OS === 'ios' && hapticsEnabled) Haptics.selectionAsync();
    resetLobby();
  };

  useEffect(() => {
    const result = checkGame(fieldTypes);
    if (result.winner && result.winnerColumns.length) {
      setWinnerDetails({ winner: result.winner, winnerColumns: result.winnerColumns });
    } else if (winner) {
      setWinnerDetails(initialState);
      if (Platform.OS === 'ios' && hapticsEnabled) Haptics.notificationAsync('success');
    } else if (result.tied) {
      setWinnerDetails({ ...initialState, tied: true });
    }

    timers.forEach((timer) => {
      clearTimeout(timer);
      timers.shift();
    });

    const playerOnlineTimer = setTimeout(() => {
      if (gameStarted && (!winner || !result.tied)) {
        dispatch(quitGame());
        showToast('Lobby dispanded due to inactivity', 3500);
      }
    }, 60000);

    setTimers([...timers, playerOnlineTimer]);

    return () => {
      timers.forEach((timer) => {
        clearTimeout(timer);
        timers.shift();
      });
    };
  }, [fieldTypes]);
  console.log('Tied -> ', tied);
  return (
    <View style={styles.container}>
      <Text style={styles.text}> Turn: Player {getPlayerName(xIsNext)}</Text>
      {Boolean(winner) || tied ? (
        <View>
          <Text style={styles.gameOverText}>
            {Boolean(winner)
              ? winner === getFieldType(playerId)
                ? 'You won'
                : 'You lost'
              : `It's a tie`}
          </Text>
          <Button
            type="contained"
            style={styles.button}
            labelStyle={{ color: 'white' }}
            onPress={handleNewGame}
          >
            New Game
          </Button>
        </View>
      ) : null}
      <RenderGrid
        {...{ fieldTypes, size, handlePress: handleFieldPress, tied, winnerColumns, canvasFrozen }}
      />
    </View>
  );
};

const RenderGrid = ({ fieldTypes, size, handlePress, tied, winnerColumns, canvasFrozen }) => {
  const sizeArray = [...Array(size).keys()];

  let num = 0;
  let initial = true;
  const getNum = () => {
    if (initial) {
      initial = false;
      return num;
    }
    num++;
    return num;
  };

  return (
    <View>
      {sizeArray.map((x) => (
        <View style={{ flexDirection: 'row' }} key={x}>
          {sizeArray.map((y) => (
            <Column
              key={y}
              action={handlePress}
              num={getNum()}
              fieldType={fieldTypes}
              winnerColumns={winnerColumns}
              disableFields={canvasFrozen || Boolean(winnerColumns.length) || tied}
            />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gameOverText: {
    color: 'white',
    margin: 20,
    fontSize: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  winnerText: {
    color: 'white',
    margin: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  text: {
    color: 'white',
    marginTop: 20,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '500',
    marginBottom: 20,
  },
  button: {
    marginBottom: 40,
    backgroundColor: colors.main,
  },
});

const mapStateToProps = createStructuredSelector({
  lobbyId: selectLobbyId,
  playerId: selectPlayerId,
  fieldTypes: selectFieldTypes,
  gameState: selectGame,
  hapticsEnabled: selectHaptics,
});

export default connect(mapStateToProps)(OnlineGameCanvas);
