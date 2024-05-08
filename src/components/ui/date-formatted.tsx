import { format } from "date-fns";

type PropsDateFormatted = { children: Date; format?: string };

export default function DateFormatted({
    children,
    format: userFormat = "dd/MM/yyyy",
}: PropsDateFormatted) {
    return <>{format(children, userFormat)}</>;
}
