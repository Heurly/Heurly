import type ApiFilter from "@/types/apiFilter";
import { format } from "date-fns";

export const PLANIF_ENDPOINT = (
    dateFilter: ApiFilter<number>,
    modules: number[],
) => {
    if (dateFilter.equals !== undefined) {
        return `https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${modules.join(
            ",",
        )}&projectId=11&calType=ical&nbWeeks=52`;
    }
    if (dateFilter.greater !== undefined && dateFilter.lower !== undefined) {
        return `https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?resources=${modules.join(
            ",",
        )}&projectId=11&calType=ical&firstDate=${format(
            dateFilter.greater,
            "yyyy-MM-dd",
        )}&lastDate=${format(dateFilter.lower, "yyyy-MM-dd")}`;
    }
    return "https://planif.esiee.fr/jsp/custom/modules/plannings/anonymous_cal.jsp?projectId=11&calType=ical&nbWeeks=52";
};
