/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                'mac-bg': '#f5f5f7',
                'mac-window': 'rgba(255, 255, 255, 0.85)',
                'mac-dock': 'rgba(255, 255, 255, 0.2)',
            },
            backdropBlur: {
                'xs': '2px',
            }
        },
    },
    plugins: [],
}
