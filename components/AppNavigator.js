import * as React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import { colors } from '../lib/Settings'
import SelectMode from '../screens/SelectMode'
import Roboplayer from '../screens/Roboplayer'
import Multiplayer from '../screens/Multiplayer'
import OnlineMultiplayer from '../screens/OnlineMultiplayer'

const Stack = createStackNavigator()

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen
                    name="Select Mode"
                    component={SelectMode}
                    options={{
                        title: 'Tic Tac Toe',
                        headerStyle: {
                            backgroundColor: colors.main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTintColor: '#fff',
                    }} />
                <Stack.Screen
                    name="Roboplayer"
                    component={Roboplayer}
                    options={{
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: colors.main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTintColor: '#fff'
                    }} />
                <Stack.Screen
                    name="Multiplayer"
                    component={Multiplayer}
                    options={{
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: colors.main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTintColor: '#fff'
                    }} />
                    <Stack.Screen
                    name="Online Multiplayer"
                    component={OnlineMultiplayer}
                    options={{
                        headerBackTitle: 'Back',
                        headerStyle: {
                            backgroundColor: colors.main,
                            shadowColor: 'transparent',
                            borderBottomWidth: 0,
                        },
                        headerTintColor: '#fff'
                    }} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator