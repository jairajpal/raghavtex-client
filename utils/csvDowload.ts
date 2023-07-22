import { Challans } from "@/pages/api/types";
import Papa from "papaparse";

const exportToCSV = (data: any[], filename: string) => {
  const csv = Papa.unparse(data, { header: true });
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export default exportToCSV;
