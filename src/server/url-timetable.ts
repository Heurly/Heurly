import type { User, UserTimetableURL } from "@prisma/client";
import { UserModel } from "prisma/zod";
import { db } from "./db";

/**
 *  This function gets all the URLs
 * @param userId The id of the user to get URLs for
 * @returns {Promise<Docs[]>} A promise that resolves to an array of URLs
 */
export async function getURLsByUser(
	userId: User["id"],
): Promise<UserTimetableURL[]> {
	// zod verification for user id
	const resCheckUserId = UserModel.shape.id.safeParse(userId);

	if (!resCheckUserId.success) throw new Error("Error: Invalid user id.");

	try {
		const resDBUserURLs = await db.userTimetableURL.findMany({
			where: {
				userId: userId,
			},
		});
		return resDBUserURLs;
	} catch (e) {
		throw new Error("Error: Could not get URLs by user.");
	}
}
