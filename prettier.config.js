/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
    plugins: ["prettier-plugin-tailwindcss"],

    tabWidth: 4,
    overrides: [
        {
            files: "*.md",
            options: {
                tabWidth: 1,
            },
        },
    ],
};

export default config;
