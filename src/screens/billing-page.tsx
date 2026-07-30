import {
  CalendarDays,
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

type BillingTab = "trail" | "processing";

type TrailRow = {
  baseRate: string;
  clientId: string;
  clientType: string;
  daysUtilised: string;
  differential: string;
  loanId: string;
  loanOutstanding: string;
  loanRoi: string;
  reportDate: string;
  sharing: string;
  trailAmount: string;
  trailRate: string;
  userId: string;
};

type ProcessingRow = {
  basePf: string;
  clientId: string;
  clientType: string;
  loanAmount: string;
  loanId: string;
  pfShare: string;
  processingFees: string;
  reportDate: string;
  sharing: string;
  transactionDate: string;
  transactionTime: string;
  userId: string;
};

type TrailColumn = {
  key: keyof TrailRow;
  label: string;
  renderCell?: (row: TrailRow) => React.ReactNode;
  sortable?: boolean;
};

type ProcessingColumn = {
  key: keyof ProcessingRow;
  label: string;
  renderCell?: (row: ProcessingRow) => React.ReactNode;
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

const clientTypeOptions = ["SB", "MFD", "Direct"] as const;
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

const trailRows: TrailRow[] = [
  {
    baseRate: "9.5%",
    clientId: "AADF",
    clientType: "SB",
    daysUtilised: "10",
    differential: "0.75%",
    loanId: "4321",
    loanOutstanding: "₹ 90,000",
    loanRoi: "10%",
    reportDate: "13-05-2026",
    sharing: "90%",
    trailAmount: "₹ 49.94",
    trailRate: "0.675%",
    userId: "4321",
  },
  {
    baseRate: "9.5%",
    clientId: "A112AS",
    clientType: "MFD",
    daysUtilised: "1",
    differential: "0.75%",
    loanId: "4321",
    loanOutstanding: "₹ 1,50,000",
    loanRoi: "10%",
    reportDate: "13-05-2026",
    sharing: "90%",
    trailAmount: "₹ 83.22",
    trailRate: "0.675%",
    userId: "4321",
  },
  {
    baseRate: "9.5%",
    clientId: "-",
    clientType: "Direct",
    daysUtilised: "1",
    differential: "0.75%",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    reportDate: "13-05-2026",
    sharing: "90%",
    trailAmount: "₹ 55.48",
    trailRate: "0.675%",
    userId: "4321",
  },
  {
    baseRate: "9.5%",
    clientId: "-",
    clientType: "Direct",
    daysUtilised: "1",
    differential: "0.75%",
    loanId: "5182",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    reportDate: "14-05-2026",
    sharing: "90%",
    trailAmount: "₹ 55.48",
    trailRate: "0.675%",
    userId: "4321",
  },
  {
    baseRate: "9.5%",
    clientId: "-",
    clientType: "Direct",
    daysUtilised: "1",
    differential: "0.75%",
    loanId: "5224",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    reportDate: "15-05-2026",
    sharing: "90%",
    trailAmount: "₹ 55.48",
    trailRate: "0.675%",
    userId: "4321",
  },
  {
    baseRate: "9.5%",
    clientId: "SB27D",
    clientType: "SB",
    daysUtilised: "4",
    differential: "0.65%",
    loanId: "5412",
    loanOutstanding: "₹ 95,000",
    loanRoi: "10.2%",
    reportDate: "09-06-2026",
    sharing: "85%",
    trailAmount: "₹ 44.10",
    trailRate: "0.552%",
    userId: "5412",
  },
  {
    baseRate: "9.2%",
    clientId: "MF41K",
    clientType: "MFD",
    daysUtilised: "3",
    differential: "0.60%",
    loanId: "5188",
    loanOutstanding: "₹ 88,000",
    loanRoi: "9.8%",
    reportDate: "04-06-2026",
    sharing: "80%",
    trailAmount: "₹ 31.20",
    trailRate: "0.48%",
    userId: "5188",
  },
];

const processingRows: ProcessingRow[] = [
  {
    basePf: "₹ 999",
    clientId: "AADF",
    clientType: "SB",
    loanAmount: "₹ 1,00,000",
    loanId: "4321",
    pfShare: "₹ 100.5",
    processingFees: "₹ 1,200",
    reportDate: "13-05-2026",
    sharing: "50%",
    transactionDate: "13-05-2026",
    transactionTime: "11:30 AM",
    userId: "4321",
  },
  {
    basePf: "₹ 999",
    clientId: "A112AS",
    clientType: "MFD",
    loanAmount: "₹ 1,80,000",
    loanId: "4321",
    pfShare: "₹ 100.5",
    processingFees: "₹ 1,200",
    reportDate: "13-05-2026",
    sharing: "50%",
    transactionDate: "13-05-2026",
    transactionTime: "11:30 AM",
    userId: "4321",
  },
  {
    basePf: "₹ 999",
    clientId: "-",
    clientType: "Direct",
    loanAmount: "₹ 1,10,000",
    loanId: "4321",
    pfShare: "₹ 55.48",
    processingFees: "₹ 1,200",
    reportDate: "13-05-2026",
    sharing: "50%",
    transactionDate: "13-05-2026",
    transactionTime: "11:30 AM",
    userId: "4321",
  },
  {
    basePf: "₹ 999",
    clientId: "-",
    clientType: "Direct",
    loanAmount: "₹ 1,10,000",
    loanId: "5182",
    pfShare: "₹ 55.48",
    processingFees: "₹ 1,200",
    reportDate: "14-05-2026",
    sharing: "50%",
    transactionDate: "14-05-2026",
    transactionTime: "11:30 AM",
    userId: "4321",
  },
  {
    basePf: "₹ 999",
    clientId: "-",
    clientType: "Direct",
    loanAmount: "₹ 1,10,000",
    loanId: "5224",
    pfShare: "₹ 100.5",
    processingFees: "₹ 1,200",
    reportDate: "15-05-2026",
    sharing: "50%",
    transactionDate: "15-05-2026",
    transactionTime: "11:30 AM",
    userId: "4321",
  },
  {
    basePf: "₹ 1,099",
    clientId: "SB27D",
    clientType: "SB",
    loanAmount: "₹ 1,20,000",
    loanId: "5412",
    pfShare: "₹ 122.0",
    processingFees: "₹ 1,450",
    reportDate: "09-06-2026",
    sharing: "55%",
    transactionDate: "09-06-2026",
    transactionTime: "10:15 AM",
    userId: "5412",
  },
  {
    basePf: "₹ 899",
    clientId: "MF41K",
    clientType: "MFD",
    loanAmount: "₹ 88,000",
    loanId: "5188",
    pfShare: "₹ 76.5",
    processingFees: "₹ 1,050",
    reportDate: "04-06-2026",
    sharing: "45%",
    transactionDate: "04-06-2026",
    transactionTime: "02:05 PM",
    userId: "5188",
  },
];

const trailColumns: TrailColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "loanId", label: "Loan ID" },
  { key: "daysUtilised", label: "Days Utilised" },
  { key: "loanOutstanding", label: "Loan Outstanding" },
  { key: "loanRoi", label: "Loan ROI" },
  { key: "baseRate", label: "Base Rate" },
  { key: "differential", label: "Differential" },
  { key: "sharing", label: "Sharing" },
  { key: "trailRate", label: "Trail Rate", sortable: true },
  { key: "trailAmount", label: "Trail Amount", sortable: true },
];

const processingColumns: ProcessingColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "loanId", label: "Loan ID" },
  { key: "loanAmount", label: "Loan Amount" },
  {
    key: "transactionDate",
    label: "Transaction Date",
    sortable: true,
    renderCell: (row) => (
      <div className="customers-date-time">
        <span>{row.transactionDate}</span>
        <span className="customers-muted">{row.transactionTime}</span>
      </div>
    ),
  },
  { key: "processingFees", label: "Processing Fees" },
  { key: "basePf", label: "Base PF" },
  { key: "sharing", label: "Sharing" },
  { key: "pfShare", label: "PF Share", sortable: true },
];

const trailExportColumns = [
  "Client Type",
  "Client ID",
  "User ID",
  "Loan ID",
  "Days Utilised",
  "Loan Outstanding",
  "Loan ROI",
  "Base Rate",
  "Differential",
  "Sharing",
  "Trail Rate",
  "Trail Amount",
] as const;

const processingExportColumns = [
  "Client Type",
  "Client ID",
  "User ID",
  "Loan ID",
  "Loan Amount",
  "Transaction Date",
  "Transaction Time",
  "Processing Fees",
  "Base PF",
  "Sharing",
  "PF Share",
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

const parseCurrencyValue = (value: string) => Number(value.replace(/[^\d.]/g, "").replace(/,/g, "")) || 0;
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

export const BillingPage = () => {
  const [activeTab, setActiveTab] = useState<BillingTab>("trail");
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientType, setSelectedClientType] = useState<string | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [appliedClientType, setAppliedClientType] = useState<string | null>(null);
  const [tableAppliedFromDate, setTableAppliedFromDate] = useState<Date | null>(null);
  const [tableAppliedToDate, setTableAppliedToDate] = useState<Date | null>(null);
  const [trailSortKey, setTrailSortKey] = useState<keyof TrailRow | null>(null);
  const [processingSortKey, setProcessingSortKey] = useState<keyof ProcessingRow | null>(null);
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
      if (!filtersRef.current?.contains(event.target as Node)) setShowFilters(false);
      if (!downloadRef.current?.contains(event.target as Node)) setShowDownloadMenu(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  const filteredTrailRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const rows = trailRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        [row.clientType, row.clientId, row.userId, row.loanId, row.loanOutstanding, row.trailAmount, row.trailRate].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesClientType = !appliedClientType || row.clientType === appliedClientType;
      const reportDate = parseTableDate(row.reportDate);
      const matchesDateRange =
        (!tableAppliedFromDate || reportDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || reportDate <= tableAppliedToDate);

      return matchesSearch && matchesClientType && matchesDateRange;
    });

    if (!trailSortKey) {
      return [...rows].sort((left, right) => parseTableDate(right.reportDate).getTime() - parseTableDate(left.reportDate).getTime());
    }

    return [...rows].sort((left, right) => {
      if (trailSortKey === "trailAmount" || trailSortKey === "loanOutstanding") {
        return parseCurrencyValue(right[trailSortKey]) - parseCurrencyValue(left[trailSortKey]);
      }
      if (trailSortKey === "trailRate" || trailSortKey === "loanRoi" || trailSortKey === "baseRate" || trailSortKey === "differential" || trailSortKey === "sharing") {
        return parsePercentValue(right[trailSortKey]) - parsePercentValue(left[trailSortKey]);
      }

      return String(right[trailSortKey]).localeCompare(String(left[trailSortKey]));
    });
  }, [appliedClientType, searchQuery, tableAppliedFromDate, tableAppliedToDate, trailSortKey]);

  const filteredProcessingRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const rows = processingRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        [row.clientType, row.clientId, row.userId, row.loanId, row.loanAmount, row.processingFees, row.pfShare].some((value) =>
          value.toLowerCase().includes(query),
        );
      const matchesClientType = !appliedClientType || row.clientType === appliedClientType;
      const reportDate = parseTableDate(row.reportDate);
      const matchesDateRange =
        (!tableAppliedFromDate || reportDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || reportDate <= tableAppliedToDate);

      return matchesSearch && matchesClientType && matchesDateRange;
    });

    if (!processingSortKey) {
      return [...rows].sort(
        (left, right) => parseTableDate(right.transactionDate).getTime() - parseTableDate(left.transactionDate).getTime(),
      );
    }

    return [...rows].sort((left, right) => {
      if (processingSortKey === "pfShare" || processingSortKey === "processingFees" || processingSortKey === "loanAmount" || processingSortKey === "basePf") {
        return parseCurrencyValue(right[processingSortKey]) - parseCurrencyValue(left[processingSortKey]);
      }
      if (processingSortKey === "transactionDate") {
        return parseTableDate(right.transactionDate).getTime() - parseTableDate(left.transactionDate).getTime();
      }
      if (processingSortKey === "sharing") {
        return parsePercentValue(right.sharing) - parsePercentValue(left.sharing);
      }

      return String(right[processingSortKey]).localeCompare(String(left[processingSortKey]));
    });
  }, [appliedClientType, processingSortKey, searchQuery, tableAppliedFromDate, tableAppliedToDate]);

  const statsTrailRows = useMemo(
    () =>
      trailRows.filter((row) => {
        const reportDate = parseTableDate(row.reportDate);
        return (!appliedFromDate || reportDate >= appliedFromDate) && (!appliedToDate || reportDate <= appliedToDate);
      }),
    [appliedFromDate, appliedToDate],
  );

  const statsProcessingRows = useMemo(
    () =>
      processingRows.filter((row) => {
        const reportDate = parseTableDate(row.reportDate);
        return (!appliedFromDate || reportDate >= appliedFromDate) && (!appliedToDate || reportDate <= appliedToDate);
      }),
    [appliedFromDate, appliedToDate],
  );

  const trailTotals = useMemo(() => {
    const totalTrailAmount = statsTrailRows.reduce((sum, row) => sum + parseCurrencyValue(row.trailAmount), 0);
    const averageTrailRate =
      statsTrailRows.length === 0
        ? 0
        : statsTrailRows.reduce((sum, row) => sum + parsePercentValue(row.trailRate), 0) / statsTrailRows.length;

    return {
      activeLoanAccounts: statsTrailRows.length,
      averageTrailRate,
      totalTrailAmount,
    };
  }, [statsTrailRows]);

  const processingTotals = useMemo(() => {
    const totalPfShare = statsProcessingRows.reduce((sum, row) => sum + parseCurrencyValue(row.pfShare), 0);

    return {
      pfTransactions: statsProcessingRows.length,
      totalPfShare,
    };
  }, [statsProcessingRows]);

  const hasAppliedFilters = Boolean(appliedClientType) || Boolean(tableAppliedFromDate) || Boolean(tableAppliedToDate);
  const dateFilterLabel =
    dateFilter === "Custom" ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate) : dateFilter;

  const clearFilters = () => {
    setSelectedClientType(null);
    setAppliedClientType(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setTableAppliedFromDate(null);
    setTableAppliedToDate(null);
    setShowDateRangePicker(false);
    setShowDateMenu(false);
    setShowFilters(false);
  };

  const trailExportRows = filteredTrailRows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.loanId,
    row.daysUtilised,
    row.loanOutstanding,
    row.loanRoi,
    row.baseRate,
    row.differential,
    row.sharing,
    row.trailRate,
    row.trailAmount,
  ]);

  const processingExportRows = filteredProcessingRows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.loanId,
    row.loanAmount,
    row.transactionDate,
    row.transactionTime,
    row.processingFees,
    row.basePf,
    row.sharing,
    row.pfShare,
  ]);

  return (
    <DashboardFrame activeNav="billing">
          <div className="home-heading-row">
            <h1 className="home-heading">
              Revenue <span className="billing-heading-note">(Provisional)</span>
            </h1>
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

          <div className="billing-tabs">
            <button
              className={`billing-tab${activeTab === "trail" ? " is-active" : ""}`}
              onClick={() => setActiveTab("trail")}
              type="button"
            >
              Trail Commission
            </button>
            <button
              className={`billing-tab${activeTab === "processing" ? " is-active" : ""}`}
              onClick={() => setActiveTab("processing")}
              type="button"
            >
              Processing Fees
            </button>
          </div>

          {activeTab === "trail" ? (
            <section className="billing-stats-grid billing-stats-grid-trail">
              <StatCard
                label="Total Trail Amount"
                value={`₹${trailTotals.totalTrailAmount.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`}
              />
              <StatCard label="Active Loan Accounts" value={String(trailTotals.activeLoanAccounts)} />
              <StatCard label="Average Trail Rate" value={`${trailTotals.averageTrailRate.toFixed(3)}%`} />
            </section>
          ) : (
            <section className="billing-stats-grid billing-stats-grid-processing">
              <StatCard
                label="Total PF Share"
                value={`₹ ${processingTotals.totalPfShare.toLocaleString("en-IN", { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`}
              />
              <StatCard label="PF Transactions" value={String(processingTotals.pfTransactions)} />
            </section>
          )}

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

                      <div className="customers-filter-group">
                        <p className="customers-filter-label">Date Range</p>
                        <div className="customers-filter-date-wrap">
                          <div className="customers-filter-date-row">
                            <button
                              className="customers-filter-date-input"
                              onClick={() => setShowDateRangePicker((value) => !value)}
                              type="button"
                            >
                              <span className={!filterFromDate ? "is-placeholder" : ""}>
                                {filterFromDate ? formatDisplayDate(filterFromDate) : "Start Date"}
                              </span>
                              <CalendarDays size={16} strokeWidth={1.8} />
                            </button>
                            <button
                              className="customers-filter-date-input"
                              onClick={() => setShowDateRangePicker((value) => !value)}
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
                    if (activeTab === "trail") {
                      downloadCsvFile(trailExportColumns, trailExportRows, "billing-trail-commission-export.csv");
                    } else {
                      downloadCsvFile(processingExportColumns, processingExportRows, "billing-processing-fees-export.csv");
                    }
                    setShowDownloadMenu(false);
                  }}
                  type="button"
                >
                  Download as CSV
                </button>
                <button
                  className="customers-download-option"
                  onClick={() => {
                    if (activeTab === "trail") {
                      downloadExcelFile(trailExportColumns, trailExportRows, "billing-trail-commission-export.xls");
                    } else {
                      downloadExcelFile(processingExportColumns, processingExportRows, "billing-processing-fees-export.xls");
                    }
                    setShowDownloadMenu(false);
                  }}
                  type="button"
                >
                  Download as Excel
                </button>
              </DropdownMenuButton>
            </div>

            {activeTab === "trail" ? (
              <DataTable
                columns={trailColumns}
                emptyMessage="No trail commission records found for the selected filters."
                onSort={(key) => setTrailSortKey((current) => (current === key ? null : key))}
                rows={filteredTrailRows}
                sortKey={trailSortKey}
              />
            ) : (
              <DataTable
                columns={processingColumns}
                emptyMessage="No processing fee records found for the selected filters."
                onSort={(key) => setProcessingSortKey((current) => (current === key ? null : key))}
                rows={filteredProcessingRows}
                sortKey={processingSortKey}
              />
            )}
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

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;

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

const downloadCsvFile = (columns: readonly string[], rows: string[][], fileName: string) => {
  const csvLines = [columns.join(","), ...rows.map((row) => row.map(escapeCsvValue).join(","))];
  triggerDownload(`\ufeff${csvLines.join("\n")}`, fileName, "text/csv;charset=utf-8;");
};

const downloadExcelFile = (columns: readonly string[], rows: string[][], fileName: string) => {
  const tableRows = rows
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
          <thead><tr>${columns.map((column) => `<th>${column}</th>`).join("")}</tr></thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  triggerDownload(excelContent, fileName, "application/vnd.ms-excel");
};
