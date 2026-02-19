import SingleOrder from "@/components/pages/SingleOrder";

export default async function Page({params}) {
  const paramRes = await params 
  return (
    <>
      <SingleOrder orderId={paramRes.id} />
    </>
  );
}
