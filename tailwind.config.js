const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: ["./website/templates/*.html", "./website/templates/**/*.html"],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter var', ...defaultTheme.fontFamily.sans],
            },
        },
    }, plugins: [
        require('@tailwindcss/typography'),
    ],
}
