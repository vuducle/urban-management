import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo and Branding Section */}
          <View style={styles.brandingSection}>
            <View style={styles.logoBox}>
              <Ionicons name="book" size={56} color={theme.primary} />
            </View>
            <View style={styles.textCenter}>
              <Text style={styles.title}>Urban Management</Text>
              <Text style={styles.subtitle}>
                Sign in to report issues & view GIS data
              </Text>
            </View>
          </View>

          {/* Login Form Container */}
          <View style={styles.formContainer}>
            {/* Email/Username Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Email or Username</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email or username"
                  placeholderTextColor="#d1d5db"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
            </View>

            {/* Password Field */}
            <View style={styles.fieldWrapper}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#9ca3af"
                />
                <TextInput
                  style={styles.input}
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
            <View style={styles.forgotWrapper}>
              <Pressable onPress={handleForgotPassword}>
                <Text style={styles.forgotText}>
                  Forgot Password?
                </Text>
              </Pressable>
            </View>

            {/* Login Button */}
            <Pressable
              onPress={handleLogin}
              style={({ pressed }) => [
                styles.loginButton,
                pressed && styles.loginButtonPressed,
              ]}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </Pressable>

            {/* Divider */}
            <View style={styles.dividerSection}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Biometric & QR Code Login */}
            <View style={styles.alternativeButtonsRow}>
              <Pressable
                onPress={handleBiometric}
                style={({ pressed }) => [
                  styles.alternativeButton,
                  pressed && styles.alternativeButtonPressed,
                ]}
              >
                <Ionicons
                  name="finger-print-outline"
                  size={20}
                  color="#475569"
                />
                <Text style={styles.alternativeButtonText}>
                  Biometric
                </Text>
              </Pressable>
              <Pressable
                onPress={handleScanCode}
                style={({ pressed }) => [
                  styles.alternativeButton,
                  pressed && styles.alternativeButtonPressed,
                ]}
              >
                <Ionicons
                  name="qr-code-outline"
                  size={20}
                  color="#475569"
                />
                <Text style={styles.alternativeButtonText}>
                  Scan Code
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Footer Copyright */}
          <Text style={styles.footer}>
            © 2024 Urban Management GIS Platform
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  brandingSection: {
    alignItems: 'center',
    gap: 16,
    marginBottom: 48,
  },
  logoBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  textCenter: {
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111827',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#9ca3af',
    marginTop: 12,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    paddingHorizontal: 24,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
  forgotWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2563eb',
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#2563eb',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonPressed: {
    backgroundColor: '#1d4ed8',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
  },
  dividerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 32,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
  dividerText: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '500',
    marginHorizontal: 12,
  },
  alternativeButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  alternativeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  alternativeButtonPressed: {
    backgroundColor: '#f9fafb',
  },
  alternativeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  footer: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default LoginScreen;
