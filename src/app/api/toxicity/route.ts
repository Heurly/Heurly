import { TLog, log } from "@/logger/logger";
import * as toxicity from "@tensorflow-models/toxicity";
// import tfnode from "@tensorflow/tfjs-node";
// require("@tensorflow/tfjs-node")

// cpp add on don't work
// console.log(tfnode.version);

type RequestBody = {
    text: string;
    getLabels?: boolean;
};

/**
 * This route checks if a given text is toxic or not
 * @param request.text text to be checked for toxicity
 * @param request.getLabels if true, returns the labels of the toxic text
 * @returns if getLabels is true, returns the labels of the toxic text, else returns if the text is toxic or not
 */
export async function POST(request: Request): Promise<Response> {
    log({ type: TLog.info, text: "Handling toxicity POST request" });
    // handle the form data
    const jsonData = (await request.json()) as RequestBody;
    const testText = jsonData.text;
    const res = await isTextToxic(testText);
    return Response.json({
        isToxic: res,
    });
}

enum ToxicityLabels {
    identity_attack = "identity_attack",
    insult = "insult",
    obscene = "obscene",
    severe_toxicity = "severe_toxicity",
    sexual_explicit = "sexual_explicit",
    threat = "threat",
    toxicity = "toxicity",
}

async function isTextToxic(textContent: string, getLabels = false) {
    log({ type: TLog.info, text: "Checking if the text is toxic" });
    const threshold = 0.9;

    const toxicityLabels = [
        ToxicityLabels.identity_attack,
        ToxicityLabels.insult,
        ToxicityLabels.obscene,
        ToxicityLabels.severe_toxicity,
        ToxicityLabels.sexual_explicit,
        ToxicityLabels.threat,
        ToxicityLabels.toxicity,
    ];

    let model;
    try {
        model = await toxicity.load(threshold, toxicityLabels);
    } catch (e) {
        throw new Error(`Error while loading model`);
    }

    let predictions;
    try {
        predictions = await model.classify(textContent);
    } catch (e) {
        throw new Error(`Error while classifying text`);
    }

    if (getLabels) {
        return predictions
            .filter((prediction) => prediction.results[0]?.match === true)
            .map((prediction) => prediction.label);
    }
    const isTextNotToxic = predictions.every(
        (prediction) => prediction.results[0]?.match === false,
    );
    return !isTextNotToxic;
}
