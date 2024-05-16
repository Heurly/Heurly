export const getColor = (courseName: string) => {
    if (!courseName) return;

    const courseString = courseName;

    // Simple hash function to get a consistent number for the course code
    const hashCode = (str: string) => {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    };

    const hash = hashCode(courseString);

    // Use the hash to generate HSL values
    const h = hash % 360; // Hue between 0 and 360
    const s = 25 + (hash % 70); // Saturation between 25% and 95%
    const l = 85 + (hash % 13); // Lightness between 85% and 95%

    return `hsl(${h},${s}%,${l}%)`;
};
