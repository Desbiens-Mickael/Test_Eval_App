import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Details du groupe",
};

// export async function generateMetadata({
//   params,
// }: {
//   params: { groupId: string };
// }): Promise<Metadata> {
//   const groupId = params.groupId;

//   return {
//     title:  `Groupe - ${groupId}`,
//   };
// }

export default async function GroupDetailsPage({
  params,
}: {
  params: Promise<{ groupId: string }>;
}) {
  const groupId = (await params).groupId;

  return <div>Groupe: {groupId}</div>;
}
