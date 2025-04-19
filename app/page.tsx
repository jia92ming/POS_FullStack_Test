import Hero from "@/components/hero";
import {Button} from "@/components/ui/button";
import {ShopNowButtonAction,OrderlistButtonAction,EditShopButtonAction,SaleTrendButtonAction} from "./shared-actions"

export default async function Home() {
  return (
    <>
      <main className="flex-1 flex flex-col gap-6 px-4">
        <h1 className="text-2xl font-bold mb-4"> Hi, welcome to the shop!</h1>
        <Button onClick={ShopNowButtonAction}>
          Customer: Shop now!
        </Button>
        <Button onClick={OrderlistButtonAction}>
          Owner: See Order List!
        </Button>
        <Button onClick={EditShopButtonAction}>
          Owner: Edit Shop!
        </Button>
        <Button onClick={SaleTrendButtonAction}>
          Owner: See Sales Trends!
        </Button>
      </main>
    </>
  );
}
