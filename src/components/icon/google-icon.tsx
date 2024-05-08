function GoogleIcon({ ...props }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 39 25"
            data-cy="googleIcon"
            {...props}
            role="img"
            aria-label="Google icon"
        >
            <g fill="none" strokeWidth="2">
                <path
                    stroke="#ee7d1d"
                    d="M13.03 10.13L9.32 7.1"
                    vectorEffect="non-scaling-stroke"
                ></path>
                <path
                    stroke="#95ad2c"
                    d="M13.06 14.99l-3.84 2.83"
                    vectorEffect="non-scaling-stroke"
                ></path>
                <path
                    stroke="#3b92a1"
                    d="M27.71 21.37l-3.77-2.85"
                    vectorEffect="non-scaling-stroke"
                ></path>
            </g>
            <path
                fill="#e54335"
                d="M13.03 10.13L9.32 7.1C12.75.17 21.6-1.24 27.42 3.52a.27.26-48.5 01.02.39l-2.8 2.93q-.16.17-.36.05-7.26-4.25-11.25 3.24z"
            ></path>
            <path
                fill="#f6b704"
                d="M9.32 7.1l3.71 3.03q-.58 2.48.03 4.86l-3.84 2.83q-2.59-5.58.1-10.72z"
            ></path>
            <path
                fill="#4280ef"
                d="M27.71 21.37l-3.77-2.85q1.33-1.05 2.04-2.83a.58.58 0 00-.54-.79l-5.41.02q-.26 0-.26-.25l-.03-3.96a.31.3 90 01.3-.31l10.21.03q.55 0 .63.54.92 5.95-3.17 10.4z"
            ></path>
            <path
                fill="#34a353"
                d="M13.06 14.99q3.73 7.03 10.88 3.53l3.77 2.85c-5.9 4.97-14.95 3.5-18.49-3.55l3.84-2.83z"
            ></path>
        </svg>
    );
}

export default GoogleIcon;
