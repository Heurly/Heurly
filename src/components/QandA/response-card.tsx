import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import nameToInitials from "@/utils/nameToInitials";
import type { User } from "next-auth";
import FormAnswer from "../form/form-answer";

export default function ResponseCard({
	user,
	questionId,
}: {
	user: User;
	questionId: string;
}) {
	return (
		<Card className="w-11/12">
			<CardHeader>
				<Avatar>
					<AvatarImage src={user.image ?? ""} alt={user.name ?? ""} />
					<AvatarFallback>
						{nameToInitials(user.name ?? "")}
					</AvatarFallback>
				</Avatar>
			</CardHeader>
			<CardContent>
				<FormAnswer userId={user.id} questionId={questionId} />
			</CardContent>
		</Card>
	);
}
