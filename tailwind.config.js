module.exports = {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
        './resources/css/**/*.{scss,css}',
    ],
    theme: {
        extend: {
            colors: {
                // Prefixats amb pf- per evitar conflictes amb shadcn
                // Ús: bg-pf-primary, text-pf-text-2, border-pf-border, etc.
                'pf-primary': {
                    DEFAULT: '#1A5FA8',
                    h: '#0C4880',
                    l: '#DCE9F7',
                    dark: '#4A96E0',
                    hdark: '#5EAAEE',
                    ldark: '#0E2240',
                },
                'pf-accent': {
                    DEFAULT: '#E87D2C',
                    h: '#C45E10',
                    l: '#FDE9D4',
                    dark: '#F09040',
                    ldark: '#2A1A08',
                },
                'pf-amber': {
                    DEFAULT: '#D4920E',
                    l: '#FDF0D0',
                    dark: '#E8A830',
                    ldark: '#2E2008',
                },
                'pf-bg': {
                    DEFAULT: '#F4F7FB',
                    2: '#E8F0F9',
                    dark: '#080F1A',
                    '2dark': '#0D1826',
                },
                'pf-surface': {
                    DEFAULT: '#FFFFFF',
                    2: '#EDF3FA',
                    dark: '#111E30',
                    '2dark': '#162538',
                },
                'pf-border': {
                    DEFAULT: '#C8DAEE',
                    2: '#A8C4E0',
                    dark: '#1E3450',
                    '2dark': '#2A4668',
                },
                'pf-text': {
                    DEFAULT: '#0D1F35',
                    2: '#2E5070',
                    3: '#4E7099',
                    dark: '#D6E5F4',
                    '2dark': '#8AB4D8',
                    '3dark': '#5E8AB4',
                },
                'pf-tag': {
                    bg: '#DCE9F7',
                    text: '#0C3D70',
                    bgdark: '#122040',
                    textdark: '#8EC4F5',
                },
                'pf-avatar': {
                    mc: '#D4EDF8',
                    mctxt: '#0C5F8A',
                },
            },
        },
    },
    plugins: [],
};
