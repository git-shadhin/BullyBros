import { useState } from 'react';
import { router } from 'expo-router';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Switch
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useUser } from '@/context/UserContext';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const { login } = useUser();

  const handleLogin = () => {
    if (!username || !password) {
      Alert.alert(
        'Missing Fields',
        "Don't be dumber than you already are. Fill in the fields."
      );
      return;
    }

    // Simulate login (dummy authentication)
    login(username, rememberMe);
    
    Alert.alert(
      'Logged In',
      'Logged in? Now stop being a useless nobody.',
      [{ text: 'OK', onPress: () => router.push('/onboarding') }]
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Animated.View entering={FadeIn.duration(300)} style={styles.content}>
        <Text style={styles.title}>BullyBros</Text>
        <Text style={styles.subtitle}>
          You're wasting time logging in, you miserable failure.
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter your pathetic email"
            placeholderTextColor="#999999"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Your weak password"
            placeholderTextColor="#999999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.rememberContainer}>
          <Switch
            value={rememberMe}
            onValueChange={setRememberMe}
            ios_backgroundColor="#333333"
            trackColor={{ false: "#333333", true: "#666666" }}
            thumbColor={rememberMe ? "#FFFFFF" : "#999999"}
          />
          <Text style={styles.rememberText}>Remember me</Text>
          
          <TouchableOpacity style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin} activeOpacity={0.7}>
          <Text style={styles.buttonText}>Get Roasted, Loser</Text>
        </TouchableOpacity>
      </Animated.View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#666666',
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000000',
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#333333',
    marginLeft: 8,
  },
  forgotPasswordContainer: {
    marginLeft: 'auto',
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  button: {
    backgroundColor: '#000000',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});