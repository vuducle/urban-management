import { Ionicons } from '@expo/vector-icons';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { ErrorBoundaryStyles } from './styles';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.error('🚨 ERROR BOUNDARY CAUGHT ERROR:');
    console.error('Error:', error);
    console.error('Error Message:', error.message);
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);

    this.setState({
      error,
      errorInfo,
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <View style={ErrorBoundaryStyles.container}>
          <View style={ErrorBoundaryStyles.errorBox}>
            <Ionicons name="warning" size={64} color="#FF3B30" />
            <Text style={ErrorBoundaryStyles.title}>
              Đã xảy ra lỗi
            </Text>
            <Text style={ErrorBoundaryStyles.message}>
              Ứng dụng gặp sự cố không mong muốn.
            </Text>

            {__DEV__ && this.state.error && (
              <ScrollView
                style={ErrorBoundaryStyles.detailsContainer}
              >
                <Text style={ErrorBoundaryStyles.detailsTitle}>
                  Chi tiết lỗi (Dev Mode):
                </Text>
                <Text style={ErrorBoundaryStyles.errorText}>
                  {this.state.error.toString()}
                </Text>
                {this.state.error.stack && (
                  <Text style={ErrorBoundaryStyles.stackText}>
                    {this.state.error.stack}
                  </Text>
                )}
                {this.state.errorInfo && (
                  <Text style={ErrorBoundaryStyles.stackText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </ScrollView>
            )}

            <TouchableOpacity
              style={ErrorBoundaryStyles.button}
              onPress={this.handleReset}
            >
              <Text style={ErrorBoundaryStyles.buttonText}>
                Thử lại
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}
