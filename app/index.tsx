import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LoginPageStyles } from '@/assets/styles';

// Enable className on third-party icons

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setPasswordVisible] = useState(false);

  const handleLogin = () => {
    if (email && password) {
      console.log('Login attempt:', { email, password });
      router.replace('/(tabs)/');
    }
  };

  const handleBiometric = () => {
    console.log('Biometric login');
    router.replace('/(tabs)/');
  };

  const handleScanCode = () => {
    console.log('Scan code login');
    router.replace('/(tabs)/');
  };

  const handleForgotPassword = () => {
    console.log('Forgot password');
  };

  // Constants for values not easily handled by pure Tailwind classes
  const theme = {
    primary: '#137fec',
    placeholder: '#9CA3AF',
    borderColor: '#dbe0e6',
  };

  return (
    <SafeAreaView style={LoginPageStyles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={LoginPageStyles.flex}
      >
        <ScrollView
          contentContainerStyle={LoginPageStyles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Branding Section */}
          <View style={LoginPageStyles.brandingSection}>
            <View style={LoginPageStyles.logoBox}>
              <Ionicons name="book" size={56} color={theme.primary} />
            </View>
            <View style={LoginPageStyles.textCenter}>
              <Text style={LoginPageStyles.title}>
                Urban Management
              </Text>
              <Text style={LoginPageStyles.subtitle}>
                Sign in to report issues & view GIS data
              </Text>
            </View>
          </View>

          {/* Login Form Container */}
          <View style={LoginPageStyles.formContainer}>
            {/* Email/Username Field */}
            <View style={LoginPageStyles.fieldWrapper}>
              <Text style={LoginPageStyles.label}>
                Email or Username
              </Text>
              <View style={LoginPageStyles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  style={LoginPageStyles.input}
                  placeholder="Enter your email or username"
                  placeholderTextColor="#d1d5db"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={LoginPageStyles.fieldWrapper}>
              <Text style={LoginPageStyles.label}>Password</Text>
              <View style={LoginPageStyles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  style={LoginPageStyles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#d1d5db"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                />
                <Pressable
                  onPress={() =>
                    setPasswordVisible(!isPasswordVisible)
                  }
                >
                  <Ionicons
                    name={
                      isPasswordVisible
                        ? 'eye-off-outline'
                        : 'eye-outline'
                    }
                    size={20}
                    color="#9ca3af"
                  />
                </Pressable>
              </View>
            </View>

            {/* Forgot Password Link */}
            <View style={LoginPageStyles.forgotWrapper}>
              <Pressable onPress={handleForgotPassword}>
                <Text style={LoginPageStyles.forgotText}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                LoginPageStyles.loginButton,
                pressed && LoginPageStyles.loginButtonPressed,
              ]}
            >
              <Text style={LoginPageStyles.loginButtonText}>
                Log In
              </Text>
            </Pressable>

            {/* Divider */}
            <View style={LoginPageStyles.dividerSection}>
              <View style={LoginPageStyles.dividerLine} />
              <Text style={LoginPageStyles.dividerText}>
                Or continue with
              </Text>
              <View style={LoginPageStyles.dividerLine} />
            </View>

            {/* Biometric & QR Code Login */}
            <View style={LoginPageStyles.alternativeButtonsRow}>
              <Pressable
                onPress={handleBiometric}
                style={({ pressed }) => [
                  LoginPageStyles.alternativeButton,
                  pressed && LoginPageStyles.alternativeButtonPressed,
                ]}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#475569"
                />
                <Text style={LoginPageStyles.alternativeButtonText}>
                  Biometric
                </Text>
              </Pressable>
              <Pressable
                onPress={handleScanCode}
                style={({ pressed }) => [
                  LoginPageStyles.alternativeButton,
                  pressed && LoginPageStyles.alternativeButtonPressed,
                ]}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={20}
                  color="#475569"
                />
                <Text style={LoginPageStyles.alternativeButtonText}>
                  Scan Code
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Copyright */}
          <Text style={LoginPageStyles.footer}>
            © 2024 Urban Management GIS Platform
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;
