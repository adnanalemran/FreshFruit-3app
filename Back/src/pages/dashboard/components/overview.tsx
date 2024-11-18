import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import http from '@/utils/http';

// Function to process payment data into monthly totals
interface PaymentData {
  amount: number;
  booking_date: string;
}

const processMonthlyData = (data: PaymentData[]) => {
  const monthlyTotals: { name: string; total: number }[] = Array(12).fill(0).map((_, index) => ({
    name: new Date(0, index).toLocaleString('default', { month: 'short' }),
    total: 0,
  }));

  data.forEach((item: { amount: number; booking_date: string }) => {
    const date = new Date(item.booking_date);
    const month = date.getMonth(); // Get month index (0-11)
    monthlyTotals[month].total += item.amount; // Add amount to the corresponding month
  });

  return monthlyTotals;
};

export function Overview() {
  const { data: payments = [], isLoading, isError, error } = useQuery({
    queryKey: ["payments"],
    queryFn: async () => {
      const res = await http.get("/tour/payments");
      return res.data.data; // Assuming the structure is similar to your example data
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  // Prepare the data for the chart
  const data = processMonthlyData(payments);

  return (
    <ResponsiveContainer width='100%' height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey='name'
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke='#888888'
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Bar
          dataKey='total'
          fill='currentColor'
          radius={[4, 4, 0, 0]}
          className='fill-primary'
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
