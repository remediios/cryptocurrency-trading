// Define the columns for the table
export const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Price (GBP)",
    dataIndex: "price",
    sorter: (a, b) => a.price - b.price,
    key: "price",
  },
  {
    title: "Market Cap (GBP)",
    dataIndex: "marketCap",
    key: "marketCap",
  },
  {
    title: "Total Volume",
    dataIndex: "totalVolume",
    key: "totalVolume",
  },
  {
    title: "% 24hr Change",
    dataIndex: "change24h",
    key: "change24h",
  },
  {
    title: "% 7d Change",
    dataIndex: "change7d",
    key: "change7d",
  },
  {
    title: "Class",
    dataIndex: "label",
    key: "label",
  },
];
