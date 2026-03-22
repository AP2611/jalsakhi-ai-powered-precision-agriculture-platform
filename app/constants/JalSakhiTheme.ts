/**
 * JalSakhi Color Palette
 * Focused on shades of green for a premium, farm-centric UI.
 */

export const JalSakhiColors = {
    // Primary Greens (Premium Mac-like Gradient Palette)
    forest: '#064e3b',   // Darker for depth
    emerald: '#065f46',
    moss: '#059669',
    sage: '#10b981',
    mint: '#34d399',
    pale: '#6ee7b7',
    leaf: '#a7f3d0',
    dew: '#ecfdf5',      // Very light green/white for backgrounds

    // Core Colors
    primary: '#059669',
    secondary: '#10b981',
    accent: '#34d399',
    background: '#ffffff', // Pure white for that minimalistic look
    bg: '#ffffff',          // Alias for background (backward compat)
    bgAlt: '#f0fdf4',
    card: '#ffffff',

    // Text
    text: '#064e3b',      // Dark forest for readability
    textSecondary: '#065f46',
    textMuted: '#6b7280',
    white: '#ffffff',

    // Shadows & UI
    border: 'rgba(5, 150, 105, 0.1)',
    shadow: 'rgba(0, 0, 0, 0.04)',
    glass: 'rgba(255, 255, 255, 0.7)',
    blur: 10,

    // Status
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
};

export const Theme = {
    colors: JalSakhiColors,
    spacing: {
        xs: 4,
        sm: 8,
        md: 16,
        lg: 24,
        xl: 32,
        xxl: 40,
    },
    roundness: {
        sm: 12,
        md: 20,
        lg: 32,      // More rounded for "liquid" feel
        xl: 40,
        full: 9999,
    },
    shadows: {
        soft: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
        },
        medium: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.08,
            shadowRadius: 20,
            elevation: 4,
        }
    }
};
