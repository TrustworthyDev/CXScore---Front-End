import html2canvas from "html2canvas";
import jsPDF from "jspdf";
//import "jspdf-autotable";
import autoTable, {
  ShowHeadType,
  HAlignType,
  VAlignType,
  CellInput,
  ThemeType,
  UserOptions,
} from "jspdf-autotable";
import { getTruncatedText } from "./stringUtils";

export type ExportCellConfig = {
  header: CellInput;
  dataKey: string;
  columnWidth?: number;
};

const getData = (obj: any, keys: string[]) =>
  keys.reduce((res: any, key: string) => (res ? res[key] : res), obj);

export const exportTableAsPdfWithHtml = async (
  appName: string,
  title: string,
  data: any[],
  rowConfig: ExportCellConfig[],
  htmlEle: HTMLElement | null,
  backImg?: string
) => {
  const unit = "pt";
  const orientation = "l";

  const doc = new jsPDF(orientation, unit, "a4");
  doc.deletePage(1);
  doc.addPage("a4", "l");
  const a4Size = [
    doc.internal.pageSize.getWidth(),
    doc.internal.pageSize.getHeight(),
  ];
  if (backImg) {
    const imgProps = doc.getImageProperties(backImg);
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    doc.addImage(backImg, "PNG", 0, 0, imgWidth, imgHeight);
    doc.setFontSize(60);
    doc.setTextColor("#233B93");
    doc.text(
      getTruncatedText(appName, 20),
      a4Size[0] * 0.07,
      a4Size[1] * 0.36,
      {
        align: "left",
        baseline: "middle",
      }
    );
    doc.setFontSize(20);
    doc.setTextColor("#233B93");
    doc.text(title, a4Size[0] * 0.07, a4Size[1] * 0.55, {
      align: "left",
      baseline: "middle",
    });
    doc.setFontSize(14);
    doc.setTextColor("#545454");
    doc.text(new Date().toDateString(), a4Size[0] * 0.07, a4Size[1] * 0.58, {
      align: "left",
      baseline: "middle",
    });
  }
  if (htmlEle) {
    doc.addPage("a4", "l");
    const canvas = await html2canvas(htmlEle);
    const eleImg = canvas.toDataURL("image/png");
    const imgProps = doc.getImageProperties(eleImg);
    const imgWidth = doc.internal.pageSize.getWidth();
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
    doc.addImage(eleImg, "PNG", 0, 0, imgWidth, imgHeight);
  }

  doc.setFontSize(15);

  const tableData = data.map((row) =>
    rowConfig.reduce((res: any[], conf) => {
      // return [...res, getData(row, conf.dataKey.split("."))];
      return [...res, getData(row, [conf.dataKey])];
    }, [])
  );
  const columnStyles = Object.fromEntries(
    rowConfig.reduce((res: any[], conf, ind) => {
      conf.columnWidth
        ? res.push([ind, { cellWidth: conf.columnWidth, minCellWidth: 70 }])
        : res.push([ind, { minCellWidth: 70 }]);
      return res;
    }, [])
  );

  let tableContent: UserOptions = {
    startY: 50,
    head: [rowConfig.map((conf) => conf.header)],
    body: tableData,
    showHead: "everyPage" as ShowHeadType,
    styles: {
      fontSize: 12,
      textColor: "#000",
      halign: "center" as HAlignType,
      valign: "middle" as VAlignType,
    },
    headStyles: {
      fillColor: "#D9D9D9",
      lineColor: "#FFF",
      lineWidth: 2,
    },
    columnStyles,
    theme: "grid" as ThemeType,
  };
  doc.addPage("a4", "l");
  autoTable(doc, tableContent);
  doc.save("report.pdf");
};

export const exportTableAsPdf = (
  data: any[],
  title: string,
  rowConfig: ExportCellConfig[]
) => {
  const size = [rowConfig.length * 200, 700];
  const unit = "pt";
  const orientation = "l";

  const marginLeft = 40;
  const doc = new jsPDF(orientation, unit, size);
  doc.setFontSize(15);

  const tableData = data.map((row) =>
    rowConfig.reduce((res: any[], conf) => {
      // return [...res, getData(row, conf.dataKey.split("."))];
      return [...res, getData(row, [conf.dataKey])];
    }, [])
  );

  let tableContent: UserOptions = {
    startY: 50,
    head: [rowConfig.map((conf) => conf.header)],
    body: tableData,
    showHead: "everyPage" as ShowHeadType,
    styles: {
      fontSize: 14,
      textColor: "#000",
      halign: "center" as HAlignType,
      valign: "middle" as VAlignType,
    },
    headStyles: {
      fillColor: "#D9D9D9",
      lineColor: "#FFF",
      lineWidth: 2,
    },
    theme: "grid" as ThemeType,
  };

  doc.text(title, marginLeft, 40);
  autoTable(doc, tableContent);
  doc.save("report.pdf");
};
