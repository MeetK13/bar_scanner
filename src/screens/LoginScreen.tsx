import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, ScrollView, Platform, Dimensions, TextInput, Pressable, KeyboardAvoidingView, ActivityIndicator, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Fontisto';
import AntIcon from 'react-native-vector-icons/AntDesign';
import { login as apiLogin, setToken } from '../services/Users';
import { useAuth } from '../Context/AuthContext';
import { loggedInUserContext } from '../Context/LoggedInUserContext';
import { RootStackParamList } from '../Navigator/StackNavigator';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


// Define types for the context values
type AuthContextType = [boolean, React.Dispatch<React.SetStateAction<boolean>>];
type LoggedInUserContextType = [object | null, React.Dispatch<React.SetStateAction<object | null>>];

export default function Login() {
  const [email, setEmail] = useState<string>(''); // Set type for email state
  const [password, setPassword] = useState<string>(''); // Set type for password state
  const focused = useIsFocused();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const {login} = useAuth();
  const [loggedInUser, setLoggedInUser] = React.useContext<LoggedInUserContextType>(loggedInUserContext);
  const [loading, setLoading] = useState<boolean>(false); // Set type for loading state

  const isPortrait = (): boolean => {
    const dim = Dimensions.get('screen');
    return dim.height >= dim.width;
  };

  const [orientation, setOrientation] = useState<string>(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE');

  useEffect(() => {
    const callback = Dimensions.addEventListener('change', () => 
        setOrientation(isPortrait() ? 'PORTRAIT' : 'LANDSCAPE')
      );
    return () => {
      // Cleanup the event listener on component unmount
      callback.remove()
    };
  }, []);

  const handleLogin = async (): Promise<void> => {
    try {
      setLoading(true);
      let obj = {
        email,
        password,
      };
console.log("before login", obj);
      let { data: res } = await apiLogin(obj);
      if (res.success) {
        console.log(res.message, "Success login");
        setLoading(false);
        await setToken(res.token);
        setLoggedInUser(res.userObj);
        login();

        // navigation.navigate('MainTabs',{screen:'Home', params: { user: res.userObj }});
      }
    } catch (err: any) {
      setLoading(false);
     console.log(JSON.stringify(err, null, 2));
      if (err.response?.data?.message) {
        console.log(err.response?.data?.message, "error message");
        // Alert.alert(err.response.data.message);
      } else {
        console.log(err, "error message 22");
        // Alert.alert(err);
      }
    }
  };

  if (loading) {
    return <ActivityIndicator size={'large'} color="#3F3F95" />;
  }

  return (
    <ScrollView
      contentContainerStyle={{
        backgroundColor: 'rgba(63,63,149,0.6)',
        paddingBottom: hp(20),
      }}>
      <ImageBackground resizeMethod={'resize'} resizeMode={'center'} source={require('../../assets/signin.png')}>
        <KeyboardAvoidingView>
          <View style={[styles.LoginPortraitContainer]}>
            <Text style={styles.PortraitHeading}>Welcome</Text>
            <View style={styles.PortraitTextInput}>
              <Icon name="email" size={30} color="rgba(0,0,0,0.4)" />
              <TextInput
                onChangeText={setEmail}
                value={email}
                style={{ paddingLeft: 17, flex: 1 }}
                placeholder="E-Mail"
              />
            </View>
            <View style={styles.PortraitTextInput}>
              <AntIcon name="key" size={30} color="rgba(0,0,0,0.4)" />
              <TextInput
                onChangeText={setPassword}
                value={password}
                secureTextEntry={true}
                style={{ paddingLeft: 15, flex: 1 }}
                placeholder="Password"
              />
            </View>
            <Pressable onPress={handleLogin} style={styles.Bluebutton}>
              <Text style={{ color: 'white', fontSize: 19 }}>Sign In</Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  LoginPortraitContainer: {
    minHeight: hp(55),
    backgroundColor: 'white',
    width: '70%',
    marginTop: hp(65),
    borderRadius: 10,
    display: 'flex',
    alignSelf: 'center',
    padding: 35,
  },
  LoginLandScapeContainer: {
    minHeight: hp(70),
    backgroundColor: 'white',
    width: '40%',
    borderRadius: 10,
    marginTop: hp(35),
    display: 'flex',
    alignSelf: 'center',
    padding: 35,
  },
  Bluebutton: {
    marginTop: hp(5),
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#3F3F95',
    borderRadius: 40,
    justifyContent: 'center',
  },
  PortraitTextInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    marginTop: 10,
    flexDirection: 'row',
    borderRadius: 10,
  },
  LandscapeTextInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    borderRadius: 10,
  },
  PortraitHeading: {
    fontSize: 40,
    color: '#3F3F95',
    fontWeight: '600',
    textAlign: 'center',
    paddingBottom: 30,
  },
});
