type RowObj = {
  name: [string, boolean];
  progress: string;
  quantity: number;
  date: string;
  info: boolean;
};

const tableDataCheck: RowObj[] = [
  {
    name: ["Weekly Update", true],
    quantity: 1024,
    progress: "21.3%",
    date: "13 Mar 2021",
    info: true,
  },
  {
    name: ["Venus 3D Asset", true],
    quantity: 858,
    progress: "31.5%",
    date: "24 Jan 2021",
    info: true,
  },
  {
    name: ["Marketplace", true],
    quantity: 258,
    progress: "12.2%",
    date: "24 Oct 2022",
    info: false,
  },
  {
    name: ["Weekly Update", true],
    quantity: 1024,
    progress: "21.3%",
    date: "13 Mar 2021",
    info: true,
  },
  {
    name: ["Venus 3D Asset", true],
    quantity: 858,
    progress: "31.5%",
    date: "24 Jan 2021",
    info: true,
  },
  {
    name: ["Weekly Update", true],
    quantity: 1024,
    progress: "21.3%",
    date: "13 Mar 2021",
    info: true,
  },
  {
    name: ["Venus 3D Asset", true],
    quantity: 858,
    progress: "31.5%",
    date: "24 Jan 2021",
    info: true,
  },
];

export default tableDataCheck;
