import FormCreateQuestion from "@/components/form/form-create-question";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import GoBackButton from "@/components/utils/go-back-button";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function CreateQuestionPage() {
	const session = await getServerAuthSession();
	if (!session) redirect("/login");

	return (
		<Card className="mt-16 w-full md:mt-0">
			<CardHeader>
				<div className="flex flex-row">
					<GoBackButton />
					<h1 className="w-full text-center text-2xl font-bold">
						Posez votre question
					</h1>
				</div>
			</CardHeader>
			<CardContent>
				<FormCreateQuestion userId={session?.user.id} />
			</CardContent>
		</Card>
	);
}
