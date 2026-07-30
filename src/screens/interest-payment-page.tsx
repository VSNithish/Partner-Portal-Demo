import {
  AlertTriangle,
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

type InterestStatus = "Due" | "Overdue";

type InterestRow = {
  clientId: string;
  clientType: string;
  customerName: string;
  endDate: string;
  interestDue: string;
  interestDueDate: string;
  interestStatus: InterestStatus;
  loanId: string;
  loanOutstanding: string;
  loanRoi: string;
  overdueAmount: string;
  penaltyDue: string;
  startDate: string;
  userId: string;
};

type InterestColumn = {
  key: keyof InterestRow;
  label: string;
  renderCell?: (row: InterestRow) => React.ReactNode;
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

const interestRows: InterestRow[] = [
  {
    clientId: "AADF",
    clientType: "SB",
    customerName: "Aarav Sharma",
    endDate: "13-05-2029",
    interestDue: "₹ 1,874.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 90,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "A112AS",
    clientType: "MFD",
    customerName: "Isha Patel",
    endDate: "13-05-2029",
    interestDue: "₹ 4,852.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,50,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "₹ 500.00",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "-",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "₹ 6,382.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "₹ 7,492.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "₹ 2,957.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Overdue",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "₹ 2,957.00",
    penaltyDue: "₹ 500.00",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "-",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "₹ 1,473.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "-",
    interestDue: "-",
    interestDueDate: "-",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    endDate: "13-05-2029",
    interestDue: "₹ 3,759.00",
    interestDueDate: "07-06-2026",
    interestStatus: "Due",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    loanRoi: "10%",
    overdueAmount: "-",
    penaltyDue: "₹ 500.00",
    startDate: "13-05-2026",
    userId: "4321",
  },
  {
    clientId: "SB27D",
    clientType: "SB",
    customerName: "Nisha Verma",
    endDate: "28-06-2029",
    interestDue: "₹ 5,114.00",
    interestDueDate: "09-06-2026",
    interestStatus: "Overdue",
    loanId: "5412",
    loanOutstanding: "₹ 1,75,000",
    loanRoi: "11%",
    overdueAmount: "₹ 5,114.00",
    penaltyDue: "₹ 750.00",
    startDate: "28-06-2026",
    userId: "5412",
  },
  {
    clientId: "MF41K",
    clientType: "MFD",
    customerName: "Rohit Menon",
    endDate: "22-04-2029",
    interestDue: "₹ 2,180.00",
    interestDueDate: "05-06-2026",
    interestStatus: "Due",
    loanId: "5188",
    loanOutstanding: "₹ 88,000",
    loanRoi: "9%",
    overdueAmount: "-",
    penaltyDue: "-",
    startDate: "22-04-2026",
    userId: "5188",
  },
];

const interestColumns: InterestColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "loanId", label: "Loan ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "startDate", label: "Start Date" },
  { key: "endDate", label: "End Date" },
  { key: "loanRoi", label: "Loan ROI" },
  {
    key: "interestStatus",
    label: "Interest Status",
    sortable: true,
    renderCell: (row) => (
      <span className={`interest-pill interest-pill-${row.interestStatus.toLowerCase()}`}>{row.interestStatus}</span>
    ),
  },
  { key: "loanOutstanding", label: "Loan Outstanding", sortable: true },
  { key: "interestDue", label: "Interest Due", sortable: true },
  { key: "overdueAmount", label: "Overdue Amount", sortable: true },
  { key: "interestDueDate", label: "Interest Due Date", sortable: true },
  { key: "penaltyDue", label: "Penalty Due", sortable: true },
];

const clientTypeOptions = ["SB", "MFD", "Direct"] as const;
const overdueStatusOptions: InterestStatus[] = ["Overdue", "Due"];
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
  "Start Date",
  "End Date",
  "Loan ROI",
  "Interest Status",
  "Loan Outstanding",
  "Interest Due",
  "Overdue Amount",
  "Interest Due Date",
  "Penalty Due",
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
  if (value === "-") return new Date(0);
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const parseCurrencyValue = (value: string) => {
  if (value === "-") return 0;
  return Number(value.replace(/[^\d.]/g, "").replace(/,/g, ""));
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

export const InterestPaymentPage = () => {
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof InterestRow | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<string | null>(null);
  const [selectedOverdueStatus, setSelectedOverdueStatus] = useState<InterestStatus | null>(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [appliedClientType, setAppliedClientType] = useState<string | null>(null);
  const [appliedOverdueStatus, setAppliedOverdueStatus] = useState<InterestStatus | null>(null);
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

    const rows = interestRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        [row.clientType, row.clientId, row.userId, row.loanId, row.customerName, row.interestStatus].some((value) =>
          value.toLowerCase().includes(query),
        );

      const matchesClientType = !appliedClientType || row.clientType === appliedClientType;
      const matchesOverdueStatus = !appliedOverdueStatus || row.interestStatus === appliedOverdueStatus;

      const interestDate = parseTableDate(row.interestDueDate);
      const matchesDateRange =
        (!tableAppliedFromDate || interestDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || interestDate <= tableAppliedToDate);

      return matchesSearch && matchesClientType && matchesOverdueStatus && matchesDateRange;
    });

    if (!sortKey) {
      return [...rows].sort(
        (left, right) => parseTableDate(right.interestDueDate).getTime() - parseTableDate(left.interestDueDate).getTime(),
      );
    }

    return [...rows].sort((left, right) => {
      if (sortKey === "interestDueDate") {
        return parseTableDate(right[sortKey]).getTime() - parseTableDate(left[sortKey]).getTime();
      }

      if (sortKey === "loanOutstanding" || sortKey === "interestDue" || sortKey === "overdueAmount" || sortKey === "penaltyDue") {
        return parseCurrencyValue(right[sortKey]) - parseCurrencyValue(left[sortKey]);
      }

      if (sortKey === "loanRoi") {
        return parsePercentValue(right.loanRoi) - parsePercentValue(left.loanRoi);
      }

      return String(right[sortKey]).localeCompare(String(left[sortKey]));
    });
  }, [appliedClientType, appliedOverdueStatus, searchQuery, sortKey, tableAppliedFromDate, tableAppliedToDate]);

  const statsRows = useMemo(
    () =>
      interestRows.filter((row) => {
        const interestDate = parseTableDate(row.interestDueDate);
        return (!appliedFromDate || interestDate >= appliedFromDate) && (!appliedToDate || interestDate <= appliedToDate);
      }),
    [appliedFromDate, appliedToDate],
  );

  const totals = useMemo(() => {
    const totalInterestDue = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.interestDue), 0);
    const totalPenaltyDue = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.penaltyDue), 0);
    const overdueCount = statsRows.filter((row) => row.interestStatus === "Overdue").length;

    return {
      overdueCount,
      totalInterestDue,
      totalPenaltyDue,
    };
  }, [statsRows]);

  const hasAppliedFilters =
    Boolean(appliedClientType) || Boolean(appliedOverdueStatus) || Boolean(tableAppliedFromDate) || Boolean(tableAppliedToDate);
  const dateFilterLabel =
    dateFilter === "Custom" ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate) : dateFilter;

  const clearFilters = () => {
    setSelectedClientType(null);
    setSelectedOverdueStatus(null);
    setAppliedClientType(null);
    setAppliedOverdueStatus(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setTableAppliedFromDate(null);
    setTableAppliedToDate(null);
    setShowDateRangePicker(false);
    setShowDateMenu(false);
    setShowFilters(false);
  };

  return (
    <DashboardFrame activeNav="interest-payment">
          <div className="home-heading-row">
            <h1 className="home-heading">Interest Payments</h1>
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

          <section className="interest-stats-grid">
            <StatCard
              label="Total Interest Due"
              value={`₹ ${totals.totalInterestDue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            />
            <StatCard
              label="Total Penalty Due"
              value={`₹ ${totals.totalPenaltyDue.toLocaleString("en-IN", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
            />
            <div className="interest-overdue-card">
              <div>
                <p className="home-stat-label">No.of Overdue</p>
                <p className="interest-overdue-value">{totals.overdueCount}</p>
              </div>
              <div className="interest-warning-icon">
                <AlertTriangle size={18} strokeWidth={2} />
              </div>
            </div>
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
                        label="Overdue Status"
                        onSelect={(value) => setSelectedOverdueStatus(value as InterestStatus)}
                        options={overdueStatusOptions}
                        selected={selectedOverdueStatus}
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
                          setAppliedOverdueStatus(selectedOverdueStatus);
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
              columns={interestColumns}
              emptyMessage="No interest records found for the selected filters."
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

const getExportRows = (rows: InterestRow[]) =>
  rows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.loanId,
    row.customerName,
    row.startDate,
    row.endDate,
    row.loanRoi,
    row.interestStatus,
    row.loanOutstanding,
    row.interestDue,
    row.overdueAmount,
    row.interestDueDate,
    row.penaltyDue,
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

const downloadCsvFile = (rows: InterestRow[]) => {
  const csvLines = [exportColumns.join(","), ...getExportRows(rows).map((row) => row.map(escapeCsvValue).join(","))];
  triggerDownload(`\ufeff${csvLines.join("\n")}`, "interest-payment-export.csv", "text/csv;charset=utf-8;");
};

const downloadExcelFile = (rows: InterestRow[]) => {
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

  triggerDownload(excelContent, "interest-payment-export.xls", "application/vnd.ms-excel");
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
