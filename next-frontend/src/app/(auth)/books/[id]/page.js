import SingleBook from "@/components/pages/SingleBook";

export default async function Page({params}) {
  const res = await params
  return (
    <>
      <SingleBook id={res.id}/>
    </>
  );
}
