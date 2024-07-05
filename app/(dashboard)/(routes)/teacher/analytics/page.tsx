import { getAnalytics } from "@/actions/get-analytics";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import DataCard from "./_components/data-card";
import { Chart } from "./_components/chart";

type Props = {};

const Analytics = async (props: Props) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/sign-in");
  }
  const { data, totalRevenue, totalSales } = await getAnalytics(userId);
  return (
    <div className="p-6">
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <DataCard value={totalSales} label="اِجمالي المبيعات" isMoney={true}/>
        <DataCard value={totalRevenue} label="اِجمالي عمليات الشراء" isMoney={false} />
      </div>
      <Chart data={data} />
    </div>
  );
};

export default Analytics;
