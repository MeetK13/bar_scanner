import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeScreen from '../screens/HomeScreen';
import MachineScreen from '../screens/MachineScreen';
import RawMaterialScreen from '../screens/RawMaterialScreen';
import { useAuth } from '../Context/AuthContext';

const Tab = createBottomTabNavigator();

export function TabNavigator() {
  const { logout } = useAuth(); 
  
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerRight: () => (
          <TouchableOpacity
            onPress={logout}
            style={{ marginRight: 16 }}
          >
            <Icon name="log-out-outline" size={24} color="#007AFF" />
          </TouchableOpacity>
        ),
        tabBarIcon: ({color, size}) => {
          let iconName: string | undefined;

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Machine') {
            iconName = 'cog-outline';
          } else if (route.name === 'Raw Material') {
            iconName = 'cube-outline';
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
        headerStyle: {
          backgroundColor: '#fff',
        },
        headerTintColor: '#007AFF',
      })}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          headerTitle: 'Home',
        }}
      />
      <Tab.Screen
        name="Machine"
        component={MachineScreen}
        options={{
          tabBarLabel: 'Machine',
          headerTitle: 'Machine',
        }}
      />
      <Tab.Screen
        name="Raw Material"
        component={RawMaterialScreen}
        options={{
          tabBarLabel: 'Raw Material',
          headerTitle: 'Raw Material',
        }}
      />
    </Tab.Navigator>
  );
}