import {
  CalendarDays,
  ChevronDown,
  Download,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { DashboardFrame } from "@/components/dashboard-frame";
import { DataTable } from "@/components/ui/data-table";
import { DateRangePickerPanel } from "@/components/ui/date-range-picker-panel";
import { DropdownMenuButton } from "@/components/ui/dropdown-menu-button";
import { FilterDropdown, FilterDropdownOption } from "@/components/ui/filter-dropdown";
import { StatCard } from "@/components/ui/stat-card";

type DateValue =
  | "Current Month"
  | "Previous Month"
  | "Last 3 Months"
  | "Half Yearly"
  | "Current FY"
  | "Custom";

type LoanRow = {
  availableToDraw: string;
  clientId: string;
  clientType: string;
  customerName: string;
  loanAmount: string;
  endDate: string;
  loanPf: string;
  loanAccountStatus: "Active" | "Closed";
  loanDisbursed: string;
  loanId: string;
  loanOutstanding: string;
  loanProcessStatus: string;
  loanRoi: string;
  loanType: "New Loan" | "Top-Up";
  otherCharges: string;
  partPayments: string;
  sanctionedAmount: string;
  startDate: string;
  daysUtilised: string;
  transactionDate: string;
  userId: string;
};

type LoanColumn = {
  key: keyof LoanRow;
  label: string;
  renderCell?: (row: LoanRow) => React.ReactNode;
  sortable?: boolean;
};

const dateOptions: DateValue[] = [
  "Current Month",
  "Previous Month",
  "Last 3 Months",
  "Half Yearly",
  "Current FY",
  "Custom",
];

const loanProcessStatusOptions = [
  "Loan Requested",
  "Loan Approved",
  "Agreement Signed",
  "Disbursement Sent",
  "Disbursement Completed",
  "KYC Approved",
  "Portfolio Fetched",
] as const;

const loanRows: LoanRow[] = [
  {
    availableToDraw: "₹ 18,000",
    clientId: "AADF",
    clientType: "SB",
    customerName: "Aarav Sharma",
    loanAmount: "₹ 1,00,000",
    endDate: "19-05-2027",
    loanPf: "₹ 999",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 90,000",
    loanId: "A1567",
    loanOutstanding: "₹ 90,000",
    loanProcessStatus: "Disbursement Sent",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "0",
    partPayments: "-",
    sanctionedAmount: "₹ 1,30,000",
    startDate: "19-05-2026",
    daysUtilised: "10",
    transactionDate: "19-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 24,000",
    clientId: "A112A",
    clientType: "MFD",
    customerName: "Isha Patel",
    loanAmount: "₹ 1,80,000",
    endDate: "19-06-2027",
    loanPf: "₹ 999",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 1,05,000",
    loanId: "A1844",
    loanOutstanding: "₹ 1,05,000",
    loanProcessStatus: "Disbursement Sent",
    loanRoi: "10%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-",
    sanctionedAmount: "₹ 3,00,000",
    startDate: "14-05-2026",
    daysUtilised: "1",
    transactionDate: "19-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 18,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-05-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 50,000",
    loanId: "A1542",
    loanOutstanding: "₹ 70,000",
    loanProcessStatus: "Disbursement Completed",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "0",
    partPayments: "-₹ 18,000",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "13-05-2026",
    daysUtilised: "1",
    transactionDate: "13-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 18,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-05-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 1,00,000",
    loanId: "A1097",
    loanOutstanding: "₹ 1,00,000",
    loanProcessStatus: "Disbursement Sent",
    loanRoi: "10%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "13-05-2026",
    daysUtilised: "1",
    transactionDate: "13-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 18,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-05-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 1,00,000",
    loanId: "A1543",
    loanOutstanding: "₹ 1,00,000",
    loanProcessStatus: "Loan Approved",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "0",
    partPayments: "-",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "13-05-2026",
    daysUtilised: "1",
    transactionDate: "13-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 13,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-04-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 1,40,000",
    loanId: "A1708",
    loanOutstanding: "₹ 1,50,000",
    loanProcessStatus: "KYC Approved",
    loanRoi: "10%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-₹ 15,000",
    sanctionedAmount: "₹ 2,15,000",
    startDate: "13-04-2026",
    daysUtilised: "1",
    transactionDate: "13-04-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 19,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-04-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 1,60,000",
    loanId: "A1245",
    loanOutstanding: "₹ 1,60,000",
    loanProcessStatus: "Agreement Signed",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "0",
    partPayments: "-₹ 10,000",
    sanctionedAmount: "₹ 3,15,000",
    startDate: "13-04-2026",
    daysUtilised: "1",
    transactionDate: "13-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 19,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-05-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 1,02,000",
    loanId: "A1876",
    loanOutstanding: "₹ 1,05,000",
    loanProcessStatus: "Disbursement Sent",
    loanRoi: "10%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-₹ 10,000",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "13-05-2026",
    daysUtilised: "1",
    transactionDate: "13-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 22,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "13-05-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 98,000",
    loanId: "A1348",
    loanOutstanding: "₹ 1,00,000",
    loanProcessStatus: "Loan Requested",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "0",
    partPayments: "-",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "13-05-2026",
    daysUtilised: "1",
    transactionDate: "19-05-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 16,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    loanAmount: "₹ 1,10,000",
    endDate: "11-03-2029",
    loanPf: "₹ 999",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 85,000",
    loanId: "A1721",
    loanOutstanding: "₹ 1,40,000",
    loanProcessStatus: "Disbursement Completed",
    loanRoi: "10%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-₹ 14,000",
    sanctionedAmount: "₹ 3,25,000",
    startDate: "11-03-2026",
    daysUtilised: "1",
    transactionDate: "19-03-2026",
    userId: "4321",
  },
  {
    availableToDraw: "₹ 28,000",
    clientId: "SB92K",
    clientType: "SB",
    customerName: "Nisha Verma",
    loanAmount: "₹ 1,20,000",
    endDate: "07-06-2027",
    loanPf: "₹ 1,005",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 1,20,000",
    loanId: "A1932",
    loanOutstanding: "₹ 1,18,000",
    loanProcessStatus: "Loan Approved",
    loanRoi: "11%",
    loanType: "New Loan",
    otherCharges: "250",
    partPayments: "-",
    sanctionedAmount: "₹ 1,55,000",
    startDate: "07-06-2026",
    daysUtilised: "4",
    transactionDate: "07-06-2026",
    userId: "5401",
  },
  {
    availableToDraw: "₹ 9,000",
    clientId: "MF77Q",
    clientType: "MFD",
    customerName: "Rohit Menon",
    loanAmount: "₹ 72,000",
    endDate: "22-02-2028",
    loanPf: "₹ 992",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 72,000",
    loanId: "A1450",
    loanOutstanding: "₹ 68,000",
    loanProcessStatus: "Portfolio Fetched",
    loanRoi: "9%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-₹ 8,000",
    sanctionedAmount: "₹ 88,000",
    startDate: "22-02-2026",
    daysUtilised: "7",
    transactionDate: "22-02-2026",
    userId: "5188",
  },
  {
    availableToDraw: "₹ 31,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Karthik Iyer",
    loanAmount: "₹ 1,44,000",
    endDate: "03-06-2028",
    loanPf: "₹ 1,012",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 1,44,000",
    loanId: "A2018",
    loanOutstanding: "₹ 1,38,000",
    loanProcessStatus: "Agreement Signed",
    loanRoi: "11%",
    loanType: "Top-Up",
    otherCharges: "500",
    partPayments: "-₹ 6,000",
    sanctionedAmount: "₹ 1,75,000",
    startDate: "03-06-2026",
    daysUtilised: "3",
    transactionDate: "03-06-2026",
    userId: "6204",
  },
  {
    availableToDraw: "₹ 12,500",
    clientId: "MFD3L",
    clientType: "MFD",
    customerName: "Sneha Kulkarni",
    loanAmount: "₹ 80,000",
    endDate: "28-04-2028",
    loanPf: "₹ 989",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 80,000",
    loanId: "A1673",
    loanOutstanding: "₹ 82,000",
    loanProcessStatus: "KYC Approved",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "150",
    partPayments: "-",
    sanctionedAmount: "₹ 96,000",
    startDate: "28-04-2026",
    daysUtilised: "5",
    transactionDate: "28-04-2026",
    userId: "4880",
  },
  {
    availableToDraw: "₹ 6,000",
    clientId: "DR51Z",
    clientType: "Direct",
    customerName: "Madhav Rao",
    loanAmount: "₹ 61,000",
    endDate: "16-01-2028",
    loanPf: "₹ 978",
    loanAccountStatus: "Closed",
    loanDisbursed: "₹ 61,000",
    loanId: "A1322",
    loanOutstanding: "₹ 58,000",
    loanProcessStatus: "Disbursement Completed",
    loanRoi: "9%",
    loanType: "Top-Up",
    otherCharges: "0",
    partPayments: "-₹ 5,000",
    sanctionedAmount: "₹ 74,000",
    startDate: "16-01-2026",
    daysUtilised: "12",
    transactionDate: "16-01-2026",
    userId: "4012",
  },
  {
    availableToDraw: "₹ 21,000",
    clientId: "SB40N",
    clientType: "SB",
    customerName: "Pooja Nair",
    loanAmount: "₹ 1,10,000",
    endDate: "11-06-2027",
    loanPf: "₹ 1,001",
    loanAccountStatus: "Active",
    loanDisbursed: "₹ 1,10,000",
    loanId: "A2084",
    loanOutstanding: "₹ 1,07,000",
    loanProcessStatus: "Disbursement Sent",
    loanRoi: "10%",
    loanType: "New Loan",
    otherCharges: "200",
    partPayments: "-",
    sanctionedAmount: "₹ 1,28,000",
    startDate: "11-06-2026",
    daysUtilised: "2",
    transactionDate: "11-06-2026",
    userId: "5330",
  },
];

const loanColumns: LoanColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "loanId", label: "Loan ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "loanProcessStatus", label: "Loan Process Status" },
  { key: "transactionDate", label: "Transaction Date", sortable: true },
  { key: "startDate", label: "Start Date", sortable: true },
  { key: "endDate", label: "End Date", sortable: true },
  { key: "daysUtilised", label: "Days Utilised", sortable: true },
  { key: "sanctionedAmount", label: "Sanctioned Amount", sortable: true },
  { key: "loanAmount", label: "Loan Amount", sortable: true },
  { key: "loanRoi", label: "Loan ROI", sortable: true },
  { key: "loanPf", label: "Loan PF", sortable: true },
  { key: "otherCharges", label: "Other Charges", sortable: true },
  { key: "loanDisbursed", label: "Loan Disbursed", sortable: true },
  { key: "partPayments", label: "Part Payments", sortable: true },
  { key: "loanOutstanding", label: "Loan Outstanding", sortable: true },
  { key: "availableToDraw", label: "Available to Draw", sortable: true },
  {
    key: "loanAccountStatus",
    label: "Loan Account Status",
    sortable: true,
    renderCell: (row) => (
      <span className={`loan-pill loan-pill-account-${row.loanAccountStatus.toLowerCase()}`}>{row.loanAccountStatus}</span>
    ),
  },
  {
    key: "loanType",
    label: "Loan Type",
    sortable: true,
    renderCell: (row) => (
      <span className={`loan-pill loan-pill-type-${row.loanType === "New Loan" ? "new" : "topup"}`}>{row.loanType}</span>
    ),
  },
];

const clientTypeOptions = ["SB", "MFD", "Direct"] as const;
const loanAccountStatusOptions = ["Active", "Closed"] as const;
const loanTypeOptions = ["New Loan", "Top-Up"] as const;
const monthLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const aprilDays: Array<number | ""> = [
  "", 1, 2, 3, 4, 5, 6,
  7, 8, 9, 10, 11, 12, 13,
  14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27,
  28, 29, 30, "", "", "", "",
];
const mayDays: Array<number | ""> = [
  "", "", "", 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18,
  19, 20, 21, 22, 23, 24, 25,
  26, 27, 28, 29, 30, 31, "",
];
const juneDays: Array<number | ""> = [
  "", "", "", "", "", "", 1,
  2, 3, 4, 5, 6, 7, 8,
  9, 10, 11, 12, 13, 14, 15,
  16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29,
  30, "", "", "", "", "", "",
];

const exportColumns = [
  "Client Type",
  "Client ID",
  "User ID",
  "Loan ID",
  "Customer Name",
  "Loan Process Status",
  "Transaction Date",
  "Start Date",
  "End Date",
  "Days Utilised",
  "Sanctioned Amount",
  "Loan Amount",
  "Loan ROI",
  "Loan PF",
  "Other Charges",
  "Loan Disbursed",
  "Part Payments",
  "Loan Outstanding",
  "Available to Draw",
  "Loan Account Status",
  "Loan Type",
] as const;

const TODAY = new Date(2026, 5, 10);
const DEFAULT_FROM_DATE = new Date(2026, 3, 1);
const DEFAULT_TO_DATE = new Date(2026, 3, 15);

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);

const formatRangeLabel = (fromDate: Date, toDate: Date) => {
  if (fromDate.getMonth() === toDate.getMonth() && fromDate.getFullYear() === toDate.getFullYear()) {
    const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(toDate);
    return `${String(fromDate.getDate()).padStart(2, "0")} - ${String(toDate.getDate()).padStart(2, "0")} ${monthYear}`;
  }

  return `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`;
};

const parseTableDate = (value: string) => {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const parseCurrencyValue = (value: string) => {
  if (value === "-") return 0;
  return Number(value.replace(/[^\d.-]/g, "").replace(/,/g, ""));
};

const parsePercentValue = (value: string) => Number(value.replace(/[^\d.]/g, "")) || 0;

const getPresetRange = (value: DateValue) => {
  const today = new Date(TODAY);

  switch (value) {
    case "Current Month":
      return { from: new Date(today.getFullYear(), today.getMonth(), 1), to: today };
    case "Previous Month":
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case "Last 3 Months":
      return { from: new Date(today.getFullYear(), today.getMonth() - 2, 1), to: today };
    case "Half Yearly":
      return { from: new Date(today.getFullYear(), today.getMonth() - 5, 1), to: today };
    case "Current FY":
      return { from: new Date(today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1, 3, 1), to: today };
    case "Custom":
    default:
      return { from: DEFAULT_FROM_DATE, to: DEFAULT_TO_DATE };
  }
};

export const LoanPage = () => {
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showProcessStatusMenu, setShowProcessStatusMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof LoanRow | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<string | null>(null);
  const [selectedLoanAccountStatus, setSelectedLoanAccountStatus] = useState<string | null>(null);
  const [selectedLoanType, setSelectedLoanType] = useState<string | null>(null);
  const [selectedProcessStatus, setSelectedProcessStatus] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [appliedClientType, setAppliedClientType] = useState<string | null>(null);
  const [appliedLoanAccountStatus, setAppliedLoanAccountStatus] = useState<string | null>(null);
  const [appliedLoanType, setAppliedLoanType] = useState<string | null>(null);
  const [appliedProcessStatus, setAppliedProcessStatus] = useState<string | null>(null);
  const [tableAppliedFromDate, setTableAppliedFromDate] = useState<Date | null>(null);
  const [tableAppliedToDate, setTableAppliedToDate] = useState<Date | null>(null);
  const initialPresetRange = getPresetRange("Current Month");
  const [fromDate, setFromDate] = useState(initialPresetRange.from);
  const [toDate, setToDate] = useState(initialPresetRange.to);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(initialPresetRange.from);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(initialPresetRange.to);
  const dateFilterRef = useRef<HTMLDivElement | null>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);
  const downloadRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!dateFilterRef.current?.contains(event.target as Node)) {
        setShowDateMenu(false);
        if (!filtersRef.current?.contains(event.target as Node)) {
          setShowDateRangePicker(false);
        }
      }
      if (!filtersRef.current?.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (!downloadRef.current?.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const rows = loanRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        [
          row.clientType,
          row.clientId,
          row.userId,
          row.loanId,
          row.customerName,
          row.loanProcessStatus,
          row.loanAccountStatus,
          row.loanType,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesClientType = !appliedClientType || row.clientType === appliedClientType;
      const matchesLoanAccountStatus = !appliedLoanAccountStatus || row.loanAccountStatus === appliedLoanAccountStatus;
      const matchesLoanType = !appliedLoanType || row.loanType === appliedLoanType;
      const matchesProcessStatus = !appliedProcessStatus || row.loanProcessStatus === appliedProcessStatus;

      const transactionDate = parseTableDate(row.transactionDate);
      const matchesDateRange =
        (!tableAppliedFromDate || transactionDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || transactionDate <= tableAppliedToDate);

      return (
        matchesSearch &&
        matchesClientType &&
        matchesLoanAccountStatus &&
        matchesLoanType &&
        matchesProcessStatus &&
        matchesDateRange
      );
    });

    if (!sortKey) {
      return [...rows].sort(
        (left, right) => parseTableDate(right.transactionDate).getTime() - parseTableDate(left.transactionDate).getTime(),
      );
    }

    return [...rows].sort((left, right) => {
      if (sortKey === "transactionDate" || sortKey === "startDate" || sortKey === "endDate") {
        return parseTableDate(right[sortKey]).getTime() - parseTableDate(left[sortKey]).getTime();
      }

      if (
        sortKey === "sanctionedAmount" ||
        sortKey === "loanAmount" ||
        sortKey === "loanPf" ||
        sortKey === "loanDisbursed" ||
        sortKey === "partPayments" ||
        sortKey === "loanOutstanding" ||
        sortKey === "availableToDraw"
      ) {
        return parseCurrencyValue(right[sortKey]) - parseCurrencyValue(left[sortKey]);
      }

      if (sortKey === "loanRoi") {
        return parsePercentValue(right.loanRoi) - parsePercentValue(left.loanRoi);
      }

      if (sortKey === "daysUtilised" || sortKey === "otherCharges") {
        return Number(right[sortKey]) - Number(left[sortKey]);
      }

      return String(right[sortKey]).localeCompare(String(left[sortKey]));
    });
  }, [
    appliedClientType,
    appliedLoanAccountStatus,
    appliedLoanType,
    appliedProcessStatus,
    searchQuery,
    sortKey,
    tableAppliedFromDate,
    tableAppliedToDate,
  ]);

  const statsRows = useMemo(
    () =>
      loanRows.filter((row) => {
        const transactionDate = parseTableDate(row.transactionDate);
        return (!appliedFromDate || transactionDate >= appliedFromDate) && (!appliedToDate || transactionDate <= appliedToDate);
      }),
    [appliedFromDate, appliedToDate],
  );

  const totals = useMemo(() => {
    const activeLoans = statsRows.filter((row) => row.loanAccountStatus === "Active").length;
    const totalOutstanding = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.loanOutstanding), 0);
    const availableForDisbursal = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.availableToDraw), 0);
    const totalDisbursal = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.loanDisbursed), 0);

    return {
      activeLoans,
      availableForDisbursal,
      totalDisbursal,
      totalOutstanding,
    };
  }, [statsRows]);

  const hasAppliedFilters =
    Boolean(appliedClientType) ||
    Boolean(appliedLoanAccountStatus) ||
    Boolean(appliedLoanType) ||
    Boolean(appliedProcessStatus) ||
    Boolean(tableAppliedFromDate) ||
    Boolean(tableAppliedToDate);
  const dateFilterLabel =
    dateFilter === "Custom" ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate) : dateFilter;

  const clearFilters = () => {
    setSelectedClientType(null);
    setSelectedLoanAccountStatus(null);
    setSelectedLoanType(null);
    setSelectedProcessStatus(null);
    setAppliedClientType(null);
    setAppliedLoanAccountStatus(null);
    setAppliedLoanType(null);
    setAppliedProcessStatus(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setTableAppliedFromDate(null);
    setTableAppliedToDate(null);
    setShowProcessStatusMenu(false);
    setShowDateRangePicker(false);
    setShowDateMenu(false);
    setShowFilters(false);
  };

  return (
    <DashboardFrame activeNav="loan">
          <div className="home-heading-row">
            <h1 className="home-heading">Loans</h1>
            <div className="home-filter-wrap" ref={dateFilterRef}>
              <FilterDropdown
                active={dateFilter === "Custom"}
                label={dateFilterLabel}
                onToggle={() => setShowDateMenu((value) => !value)}
                open={showDateMenu}
                width={dateFilter === "Custom" ? 188 : 120}
              >
                {dateOptions.map((option) => (
                  <FilterDropdownOption
                    key={option}
                    label={option}
                    onClick={() => {
                      setDateFilter(option);
                      setShowDateMenu(false);

                      if (option === "Custom") {
                        setShowDateRangePicker(true);
                        return;
                      }

                      const range = getPresetRange(option);
                      setFromDate(range.from);
                      setToDate(range.to);
                      setAppliedFromDate(range.from);
                      setAppliedToDate(range.to);
                      setShowDateRangePicker(false);
                    }}
                  />
                ))}
              </FilterDropdown>
              {showDateRangePicker && !showFilters ? (
                <div className="home-date-filter-panel">
                  <DateRangePickerPanel
                    anchorDate={toDate ?? fromDate ?? TODAY}
                    endDate={toDate}
                    onApply={() => {
                      if (!fromDate || !toDate) return;
                      setDateFilter("Custom");
                      setAppliedFromDate(fromDate);
                      setAppliedToDate(toDate);
                      setShowDateRangePicker(false);
                    }}
                    onChange={(startDate, endDate) => {
                      setFromDate(startDate ?? DEFAULT_FROM_DATE);
                      setToDate(endDate ?? startDate ?? DEFAULT_TO_DATE);
                    }}
                    startDate={fromDate}
                  />
                </div>
              ) : null}
            </div>
          </div>

          <section className="customers-stats-grid">
            <StatCard label="Active Loans" value={totals.activeLoans.toLocaleString("en-IN")} />
            <StatCard
              label="Total Outstanding"
              value={`₹ ${totals.totalOutstanding.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            />
            <StatCard
              label="Available for Disbursal"
              value={`₹ ${totals.availableForDisbursal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            />
            <StatCard
              label="Total Disbursal"
              value={`₹ ${totals.totalDisbursal.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            />
          </section>

          <section className="customers-panel">
            <div className="customers-panel-header">
              <div className="customers-panel-actions">
                <label className="customers-search">
                  <Search size={16} strokeWidth={1.9} />
                  <input
                    className="customers-search-input"
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search anything..."
                    type="text"
                    value={searchQuery}
                  />
                </label>

                <div className="customers-filter-wrap" ref={filtersRef}>
                  <button
                    className={`customers-filter-button${showFilters ? " is-open" : ""}${hasAppliedFilters ? " is-active" : ""}`}
                    onClick={() => setShowFilters((value) => !value)}
                    type="button"
                  >
                    <Filter size={16} strokeWidth={1.8} />
                    <span>Filters</span>
                  </button>

                  {showFilters ? (
                    <div className="customers-filter-overlay">
                      <div className="customers-filter-overlay-header">
                        <h3>Filters</h3>
                        <button className="customers-filter-reset" onClick={clearFilters} type="button">
                          Reset
                        </button>
                      </div>

                      <FilterChipGroup
                        label="Client Type"
                        onSelect={setSelectedClientType}
                        options={clientTypeOptions}
                        selected={selectedClientType}
                      />

                      <FilterChipGroup
                        label="Loan Account Status"
                        onSelect={setSelectedLoanAccountStatus}
                        options={loanAccountStatusOptions}
                        selected={selectedLoanAccountStatus}
                      />

                      <FilterChipGroup
                        label="Loan Type"
                        onSelect={setSelectedLoanType}
                        options={loanTypeOptions}
                        selected={selectedLoanType}
                      />

                      <div className="customers-filter-group">
                        <p className="customers-filter-label">Loan Process Status</p>
                        <div className="customers-filter-select-wrap">
                          <button
                            className={`customers-filter-select${showProcessStatusMenu ? " is-open" : ""}`}
                            onClick={() => {
                              setShowProcessStatusMenu((value) => !value);
                              setShowDateRangePicker(false);
                            }}
                            type="button"
                          >
                            <span className={!selectedProcessStatus ? "is-placeholder" : ""}>
                              {selectedProcessStatus ?? "Select Process Status"}
                            </span>
                            <ChevronDown
                              className={showProcessStatusMenu ? "customers-chevron-open" : undefined}
                              size={14}
                              strokeWidth={1.9}
                            />
                          </button>

                          {showProcessStatusMenu ? (
                            <div className="customers-process-menu">
                              {loanProcessStatusOptions.map((option) => (
                                <button
                                  key={option}
                                  className="customers-process-option"
                                  onClick={() => {
                                    setSelectedProcessStatus(option);
                                    setShowProcessStatusMenu(false);
                                  }}
                                  type="button"
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="customers-filter-group">
                        <p className="customers-filter-label">Date Range</p>
                        <div className="customers-filter-date-wrap">
                          <div className="customers-filter-date-row">
                            <button
                              className="customers-filter-date-input"
                              onClick={() => {
                                setShowDateRangePicker((value) => !value);
                                setShowProcessStatusMenu(false);
                              }}
                              type="button"
                            >
                              <span className={!filterFromDate ? "is-placeholder" : ""}>
                                {filterFromDate ? formatDisplayDate(filterFromDate) : "Start Date"}
                              </span>
                              <CalendarDays size={16} strokeWidth={1.8} />
                            </button>
                            <button
                              className="customers-filter-date-input"
                              onClick={() => {
                                setShowDateRangePicker((value) => !value);
                                setShowProcessStatusMenu(false);
                              }}
                              type="button"
                            >
                              <span className={!filterToDate ? "is-placeholder" : ""}>
                                {filterToDate ? formatDisplayDate(filterToDate) : "End Date"}
                              </span>
                              <CalendarDays size={16} strokeWidth={1.8} />
                            </button>
                          </div>

                          {showDateRangePicker ? (
                            <DateRangePickerPanel
                              anchorDate={filterToDate ?? filterFromDate ?? TODAY}
                              endDate={filterToDate}
                              onApply={() => setShowDateRangePicker(false)}
                              onChange={(startDate, endDate) => {
                                setFilterFromDate(startDate);
                                setFilterToDate(endDate);
                              }}
                              startDate={filterFromDate}
                            />
                          ) : null}
                        </div>
                      </div>

                      <button
                        className="customers-filter-apply"
                        onClick={() => {
                          setAppliedClientType(selectedClientType);
                          setAppliedLoanAccountStatus(selectedLoanAccountStatus);
                          setAppliedLoanType(selectedLoanType);
                          setAppliedProcessStatus(selectedProcessStatus);
                          setTableAppliedFromDate(filterFromDate && filterToDate ? filterFromDate : null);
                          setTableAppliedToDate(filterFromDate && filterToDate ? filterToDate : null);
                          setShowDateRangePicker(false);
                          setShowFilters(false);
                        }}
                        type="button"
                      >
                        Apply Filters
                      </button>
                    </div>
                  ) : null}
                </div>
                {hasAppliedFilters ? (
                  <button className="customers-clear-filters" onClick={clearFilters} type="button">
                    <span>Clear Filters</span>
                    <X size={14} strokeWidth={1.9} />
                  </button>
                ) : null}
              </div>

              <DropdownMenuButton
                buttonClassName="customers-download-button"
                buttonContent={
                  <>
                    <span>Download</span>
                    <Download size={16} strokeWidth={2} />
                  </>
                }
                menuClassName="customers-download-menu"
                menuRef={downloadRef}
                onToggle={() => setShowDownloadMenu((value) => !value)}
                open={showDownloadMenu}
                wrapperClassName="customers-download-wrap"
              >
                <button
                  className="customers-download-option"
                  onClick={() => {
                    downloadCsvFile(filteredRows);
                    setShowDownloadMenu(false);
                  }}
                  type="button"
                >
                  Download as CSV
                </button>
                <button
                  className="customers-download-option"
                  onClick={() => {
                    downloadExcelFile(filteredRows);
                    setShowDownloadMenu(false);
                  }}
                  type="button"
                >
                  Download as Excel
                </button>
              </DropdownMenuButton>
            </div>

            <DataTable
              columns={loanColumns}
              emptyMessage="No loans found for the selected filters."
              onSort={(key) => setSortKey((current) => (current === key ? null : key))}
              rows={filteredRows}
              sortKey={sortKey}
            />
          </section>
    </DashboardFrame>
  );
};

const FilterChipGroup = ({
  label,
  onSelect,
  options,
  selected,
}: {
  label: string;
  onSelect: (value: string | null) => void;
  options: readonly string[];
  selected: string | null;
}) => (
  <div className="customers-filter-group">
    <p className="customers-filter-label">{label}</p>
    <div className="customers-filter-chip-row">
      {options.map((option) => (
        <button
          key={option}
          className={`customers-filter-chip${selected === option ? " is-active" : ""}`}
          onClick={() => onSelect(selected === option ? null : option)}
          type="button"
        >
          {option}
        </button>
      ))}
    </div>
  </div>
);

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;

const getExportRows = (rows: LoanRow[]) =>
  rows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.loanId,
    row.customerName,
    row.loanProcessStatus,
    row.transactionDate,
    row.startDate,
    row.endDate,
    row.daysUtilised,
    row.sanctionedAmount,
    row.loanAmount,
    row.loanRoi,
    row.loanPf,
    row.otherCharges,
    row.loanDisbursed,
    row.partPayments,
    row.loanOutstanding,
    row.availableToDraw,
    row.loanAccountStatus,
    row.loanType,
  ]);

const triggerDownload = (content: BlobPart, fileName: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const downloadCsvFile = (rows: LoanRow[]) => {
  const csvLines = [exportColumns.join(","), ...getExportRows(rows).map((row) => row.map(escapeCsvValue).join(","))];
  triggerDownload(`\ufeff${csvLines.join("\n")}`, "loan-export.csv", "text/csv;charset=utf-8;");
};

const downloadExcelFile = (rows: LoanRow[]) => {
  const tableRows = getExportRows(rows)
    .map(
      (row) =>
        `<tr>${row
          .map((cell) => `<td>${cell.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`)
          .join("")}</tr>`,
    )
    .join("");

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head><meta charset="UTF-8" /></head>
      <body>
        <table>
          <thead><tr>${exportColumns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  triggerDownload(excelContent, "loan-export.xls", "application/vnd.ms-excel");
};

const MiniCalendar = ({
  month,
  days,
  selectedDay,
  rangeStart,
  rangeEnd,
  onSelect,
}: {
  month: string;
  days: Array<number | "">;
  selectedDay: number;
  rangeStart: number;
  rangeEnd: number;
  onSelect: (day: number) => void;
}) => (
  <div className="customers-mini-calendar">
    <div className="customers-mini-calendar-header">
      <span>{month}</span>
    </div>
    <div className="customers-mini-calendar-grid is-weekdays">
      {monthLabels.map((day) => (
        <span key={day} className="customers-mini-calendar-weekday">
          {day}
        </span>
      ))}
    </div>
    <div className="customers-mini-calendar-grid">
      {days.map((day, index) => {
        if (day === "") {
          return <span key={`empty-${month}-${index}`} className="customers-mini-calendar-cell is-empty" />;
        }

        const inRange = rangeStart > 0 && rangeEnd > 0 && day >= rangeStart && day <= rangeEnd;
        const isSelected = day === selectedDay;

        return (
          <button
            key={`${month}-${day}`}
            className={`customers-mini-calendar-cell${inRange ? " is-in-range" : ""}${isSelected ? " is-selected" : ""}`}
            onClick={() => onSelect(day)}
            type="button"
          >
            {day}
          </button>
        );
      })}
    </div>
  </div>
);
