import { createTheme } from '@mui/material';

declare module '@mui/material/styles' {
    interface Palette {
        emphases: Palette['primary'];
    }

    interface PaletteOptions {
        emphases?: PaletteOptions['primary'];
    }

    interface Theme {
        boxShadow: string;
    }

    interface ThemeOptions {
        boxShadow?: string;
    }
}

export const saTheme = createTheme({
    boxShadow: `0 8px 16px rgba(0 0 0 / 24%)`,
    palette: {
        mode: 'dark',
        emphases: {
            main: '#ffeb3b',
        },
        primary: {
            main: '#b3e5fc',
        },
        secondary: {
            main: '#03a9f4',
        },
        text: {
            primary: '#e1f5fe',
            secondary: 'rgba(225, 245, 254, 0.75)',
        },
        background: {
            default: 'rgba(30 136 224 / 25%)',
            paper: 'rgb(30 136 224)',
        },
    },
    typography: {
        fontSize: 16,
        fontFamily: `MFShangHei, Open Sans, Helvetica, Arial, sans-serif`,
    },
    components: {
        MuiBackdrop: {
            styleOverrides: {
                root: { backgroundColor: 'rgba(0, 0, 0, 0.2)' },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: 'rgba(33 150 243 / 45%)',
                    backdropFilter: 'blur(4px)',
                },
            },
        },
    },
});
