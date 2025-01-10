import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './screens/HomeScreen';
import ScannerScreen from './screens/ScannerScreen';
import DetailsScreen from './screens/DetailsScreen';
import MachineScreen from './screens/MachineScreen';
import RawMaterialScreen from './screens/RawMaterialScreen';
import Icon from 'react-native-vector-icons/Ionicons'; 

export type RootStackParamList = {
  MainTabs: undefined;
  Home: undefined;
  Scanner: { scannerType: 'QR' | 'Barcode' };
  Details: { 
    scannedData: string;
    codeType: string;
    timestamp: string;
  };
  Machine: undefined;
  "Raw Material": undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName: string | undefined;

          if (route.name === 'Home') {
            iconName = 'home-outline';  // Home icon
          } else if (route.name === 'Machine') {
            iconName = 'cog-outline';   // Machine icon
          } else if (route.name === 'Raw Material') {
            iconName = 'cube-outline';  // Raw Material icon
          }

          if (!iconName) {
            return null;
          }

          
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 16,
          fontWeight: '600',
          paddingBottom: 5,
        },
        tabBarStyle: {
          height: 60,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Machine" 
        component={MachineScreen} 
        options={{
          tabBarLabel: 'Machine',
        }}
      />
      <Tab.Screen 
        name="Raw Material" 
        component={RawMaterialScreen} 
        options={{
          tabBarLabel: 'Raw Material',
        }}
      />
    </Tab.Navigator>
  );
}

function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MainTabs">
        <Stack.Screen 
          name="MainTabs" 
          component={MainTabs} 
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Scanner" component={ScannerScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
