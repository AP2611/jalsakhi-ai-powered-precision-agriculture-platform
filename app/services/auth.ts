import { Logger } from '../utils/Logger';
import api, { TOKEN_KEY, USER_ID_KEY } from '../utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserRole = 'farmer' | 'admin';

export interface UserProfile {
    id: string;
    email: string;
    name?: string;
    role: UserRole;
    mobile?: string;
    aadhar?: string;
    gender?: string;
    state?: string;
    district?: string;
    taluka?: string;
    village?: string;
    farmSize?: string;
    isAccountVerified?: boolean;
}

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    mobile?: string;
    aadhar?: string;
    gender?: string;
    state?: string;
    district?: string;
    taluka?: string;
    village?: string;
    farmSize?: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export const AuthService = {
    /**
     * Register a new user. Server auto-sends verification OTP email.
     */
    register: async (data: RegisterData): Promise<{ success: boolean; message: string; token?: string; userId?: string }> => {
        Logger.info('AuthService', `Registering ${data.email}`);
        try {
            const response = await api.post('/api/auth/register', data);
            const result = response.data;
            if (result.success && result.token) {
                await AsyncStorage.setItem(TOKEN_KEY, result.token);
                await AsyncStorage.setItem(USER_ID_KEY, result.userId);
            }
            return result;
        } catch (error: any) {
            Logger.error('AuthService', 'Register error', error);
            const msg = error.response?.data?.message || 'Registration failed';
            return { success: false, message: msg };
        }
    },

    /**
     * Login with email and password.
     */
    login: async (data: LoginData): Promise<{ success: boolean; message: string; token?: string; userId?: string }> => {
        Logger.info('AuthService', `Logging in ${data.email}`);
        try {
            const response = await api.post('/api/auth/login', data);
            const result = response.data;
            if (result.success && result.token) {
                await AsyncStorage.setItem(TOKEN_KEY, result.token);
                await AsyncStorage.setItem(USER_ID_KEY, result.userId);
            }
            return result;
        } catch (error: any) {
            Logger.error('AuthService', 'Login error', error);
            const msg = error.response?.data?.message || 'Login failed';
            return { success: false, message: msg };
        }
    },

    /**
     * Send verification OTP to the logged-in user's email.
     */
    sendVerifyOtp: async (): Promise<{ success: boolean; message: string }> => {
        Logger.info('AuthService', 'Sending verify OTP');
        try {
            const response = await api.post('/api/auth/send-verify-otp', {});
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Send verify OTP error', error);
            return { success: false, message: error.response?.data?.message || 'Failed to send OTP' };
        }
    },

    /**
     * Verify account with the OTP.
     */
    verifyAccount: async (otp: string): Promise<{ success: boolean; message: string }> => {
        Logger.info('AuthService', `Verifying account with OTP`);
        try {
            const response = await api.post('/api/auth/verify-account', { otp });
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Verify account error', error);
            return { success: false, message: error.response?.data?.message || 'Verification failed' };
        }
    },

    /**
     * Send password reset OTP.
     */
    sendResetOtp: async (email: string): Promise<{ success: boolean; message: string }> => {
        Logger.info('AuthService', `Sending reset OTP to ${email}`);
        try {
            const response = await api.post('/api/auth/send-reset-otp', { email });
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Send reset OTP error', error);
            return { success: false, message: error.response?.data?.message || 'Failed to send reset OTP' };
        }
    },

    /**
     * Reset password with OTP and new password.
     */
    resetPassword: async (email: string, otp: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
        Logger.info('AuthService', `Resetting password for ${email}`);
        try {
            const response = await api.post('/api/auth/reset-password', { email, otp, newPassword });
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Reset password error', error);
            return { success: false, message: error.response?.data?.message || 'Password reset failed' };
        }
    },

    /**
     * Check if the user is authenticated.
     */
    isAuthenticated: async (): Promise<{ success: boolean }> => {
        try {
            const response = await api.get('/api/auth/is-auth');
            return response.data;
        } catch (error: any) {
            return { success: false };
        }
    },

    /**
     * Get user profile data.
     */
    getUserData: async (): Promise<{ success: boolean; userData?: UserProfile }> => {
        try {
            const response = await api.get('/api/user/data');
            return response.data;
        } catch (error: any) {
            Logger.error('AuthService', 'Get user data error', error);
            return { success: false };
        }
    },

    /**
     * Logout — clear stored token and call server logout.
     */
    logout: async (): Promise<void> => {
        Logger.info('AuthService', 'Logging out');
        try {
            await api.post('/api/auth/logout');
        } catch (e) {
            // Ignore server errors on logout
        }
        await AsyncStorage.removeItem(TOKEN_KEY);
        await AsyncStorage.removeItem(USER_ID_KEY);
    },
};
