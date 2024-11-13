module.exports = {
    content: [
        "./src/renderer/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/line-clamp'), // For text truncation
    ],
}