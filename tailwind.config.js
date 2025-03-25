module.exports = {
    // ... other config
    theme: {
        extend: {
            keyframes: {
                'pulse-ring': {
                    '0%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0.7)' },
                    '70%': { transform: 'scale(1)', boxShadow: '0 0 0 15px rgba(239, 68, 68, 0)' },
                    '100%': { transform: 'scale(0.95)', boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' },
                },
            },
            animation: {
                'pulse-ring': 'pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
} 