import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Button } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { SplashScreen } from 'expo';

import { colors } from '../lib/constants';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
    selectHaptics,
    selectTheme,
} from '../redux/settings/settings.selectors';
import { ThemeMode } from '../types/Theme';
import { StackNavigationProp } from '@react-navigation/stack';

interface Props {
    theme: ThemeMode;
    hapticsEnabled: boolean;
    navigation: StackNavigationProp<any, 'Select Mode'>; // TODO change to Route based naming.
}

const SelectMode: React.FC<Props> = ({ navigation, hapticsEnabled, theme }) => {
    useEffect(() => {
        SplashScreen.hide();
    }, []);

    const styles = getStyleSheet(theme);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Select Mode:</Text>
            <View>
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        navigation.navigate('Multiplayer');
                        if (Platform.OS === 'ios' && hapticsEnabled)
                            Haptics.selectionAsync();
                    }}
                    contentStyle={{ margin: 10 }}
                >
                    Multiplayer
                </Button>
                <Button
                    mode="contained"
                    style={styles.button}
                    labelStyle={{ color: 'white' }}
                    onPress={() => {
                        navigation.navigate('Online Multiplayer');
                        if (Platform.OS === 'ios' && hapticsEnabled)
                            Haptics.selectionAsync();
                    }}
                    contentStyle={{ margin: 10 }}
                >
                    Online Multiplayer
                </Button>
            </View>
        </View>
    );
};

const mapStateToProps = createStructuredSelector<any, any>({
    theme: selectTheme,
    hapticsEnabled: selectHaptics,
});

const getStyleSheet = (theme: ThemeMode) => {
    return StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors[theme].bg,
        },
        buttonContainer: {
            width: 250,
            alignItems: 'center',
            justifyContent: 'center',
        },
        button: {
            margin: 10,
            backgroundColor: colors[theme].main,
        },
        text: {
            color: colors[theme].text,
            margin: 20,
            fontSize: 20,
            textAlign: 'center',
            fontWeight: '500',
        },
        image: {
            flex: 1,
            height: 60,
            width: 200,
            margin: 10,
        },
    });
};

export default connect(mapStateToProps)(SelectMode);
