export default function Underline({ className }: { className?: string }) {
    return (
        <>
            <svg
                viewBox="0 0 201 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={className}
                role="img"
                aria-label="underline"
            >
                <path
                    d="M1.73438 22.1438C23.6366 16.2368 45.4809 10.5075 67.9495 7.17881C88.691 4.10599 109.64 2.91929 130.591 2.57421C153.203 2.20177 176.469 2.15979 198.581 7.4666"
                    stroke="black"
                    strokeWidth="3"
                    strokeLinecap="round"
                />
            </svg>
        </>
    );
}
