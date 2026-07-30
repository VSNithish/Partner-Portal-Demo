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

type RiskRow = {
  assetValue: string;
  clientId: string;
  clientType: string;
  customerName: string;
  dpValue: string;
  loanId: string;
  loanOutstanding: string;
  reportDate: string;
  sanctionedAmount: string;
  shortfallAmount: string;
  shortfallDays: string;
  userId: string;
};

type RiskColumn = {
  key: keyof RiskRow;
  label: string;
  renderCell?: (row: RiskRow) => React.ReactNode;
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

const riskRows: RiskRow[] = [
  {
    assetValue: "₹ 90,000",
    clientId: "AADF",
    clientType: "SB",
    customerName: "Aarav Sharma",
    dpValue: "₹ 1,00,000",
    loanId: "4321",
    loanOutstanding: "₹ 90,000",
    reportDate: "07-06-2026",
    sanctionedAmount: "₹ 1,50,000",
    shortfallAmount: "₹ 10,000",
    shortfallDays: "7",
    userId: "4321",
  },
  {
    assetValue: "₹ 1,50,000",
    clientId: "A112AS",
    clientType: "MFD",
    customerName: "Isha Patel",
    dpValue: "₹ 1,80,000",
    loanId: "4321",
    loanOutstanding: "₹ 1,50,000",
    reportDate: "07-06-2026",
    sanctionedAmount: "₹ 2,00,000",
    shortfallAmount: "₹ 30,000",
    shortfallDays: "7",
    userId: "4321",
  },
  {
    assetValue: "₹ 1,00,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    dpValue: "₹ 1,10,000",
    loanId: "4321",
    loanOutstanding: "₹ 1,00,000",
    reportDate: "02-06-2026",
    sanctionedAmount: "₹ 1,25,000",
    shortfallAmount: "₹ 10,000",
    shortfallDays: "2",
    userId: "4321",
  },
  {
    assetValue: "₹ 1,00,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    dpValue: "₹ 1,10,000",
    loanId: "5182",
    loanOutstanding: "₹ 1,00,000",
    reportDate: "05-06-2026",
    sanctionedAmount: "₹ 1,25,000",
    shortfallAmount: "₹ 10,000",
    shortfallDays: "5",
    userId: "4321",
  },
  {
    assetValue: "₹ 1,00,000",
    clientId: "-",
    clientType: "Direct",
    customerName: "Vihaan Gupta",
    dpValue: "₹ 1,10,000",
    loanId: "5224",
    loanOutstanding: "₹ 1,00,000",
    reportDate: "06-06-2026",
    sanctionedAmount: "₹ 1,25,000",
    shortfallAmount: "₹ 10,000",
    shortfallDays: "6",
    userId: "4321",
  },
  {
    assetValue: "₹ 1,25,000",
    clientId: "SB27D",
    clientType: "SB",
    customerName: "Nisha Verma",
    dpValue: "₹ 1,42,000",
    loanId: "5412",
    loanOutstanding: "₹ 95,000",
    reportDate: "09-06-2026",
    sanctionedAmount: "₹ 1,70,000",
    shortfallAmount: "₹ 12,000",
    shortfallDays: "4",
    userId: "5412",
  },
  {
    assetValue: "₹ 85,000",
    clientId: "MF41K",
    clientType: "MFD",
    customerName: "Rohit Menon",
    dpValue: "₹ 92,000",
    loanId: "5188",
    loanOutstanding: "₹ 88,000",
    reportDate: "04-06-2026",
    sanctionedAmount: "₹ 1,10,000",
    shortfallAmount: "₹ 6,000",
    shortfallDays: "3",
    userId: "5188",
  },
  {
    assetValue: "₹ 1,32,000",
    clientId: "DR55Q",
    clientType: "Direct",
    customerName: "Karan Kapoor",
    dpValue: "₹ 1,45,000",
    loanId: "5531",
    loanOutstanding: "₹ 1,20,000",
    reportDate: "08-06-2026",
    sanctionedAmount: "₹ 1,60,000",
    shortfallAmount: "₹ 20,000",
    shortfallDays: "7",
    userId: "5531",
  },
  {
    assetValue: "₹ 78,000",
    clientId: "SB81P",
    clientType: "SB",
    customerName: "Meera Joshi",
    dpValue: "₹ 88,000",
    loanId: "5660",
    loanOutstanding: "₹ 70,000",
    reportDate: "03-06-2026",
    sanctionedAmount: "₹ 1,05,000",
    shortfallAmount: "₹ 5,000",
    shortfallDays: "2",
    userId: "5660",
  },
  {
    assetValue: "₹ 1,60,000",
    clientId: "MF78T",
    clientType: "MFD",
    customerName: "Ananya Rao",
    dpValue: "₹ 1,76,000",
    loanId: "5704",
    loanOutstanding: "₹ 1,32,000",
    reportDate: "10-06-2026",
    sanctionedAmount: "₹ 2,10,000",
    shortfallAmount: "₹ 27,000",
    shortfallDays: "6",
    userId: "5704",
  },
];

const riskColumns: RiskColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "loanId", label: "Loan ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "assetValue", label: "Asset value" },
  { key: "sanctionedAmount", label: "Sanctioned Amount" },
  { key: "dpValue", label: "DP value" },
  { key: "loanOutstanding", label: "Loan Outstanding", sortable: true },
  { key: "shortfallAmount", label: "Shortfall Amount", sortable: true },
  { key: "shortfallDays", label: "Shortfall Days", sortable: true },
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

const exportColumns = [
  "Client Type",
  "Client ID",
  "User ID",
  "Loan ID",
  "Customer Name",
  "Asset Value",
  "Sanctioned Amount",
  "DP Value",
  "Loan Outstanding",
  "Shortfall Amount",
  "Shortfall Days",
  "Report Date",
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

const formatCurrencyInput = (value: string) => {
  if (!value.trim()) return "";
  const numeric = Number(value.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return "";
  return `₹ ${numeric.toLocaleString("en-IN")}`;
};

const getNumericFilterValue = (value: string) => Number(value.replace(/[^\d.]/g, "")) || 0;

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

export const RiskReportsPage = () => {
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey] = useState<keyof RiskRow | null>(null);
  const [selectedClientType, setSelectedClientType] = useState<string | null>(null);
  const [selectedMarginMin, setSelectedMarginMin] = useState("");
  const [selectedMarginMax, setSelectedMarginMax] = useState("");
  const [selectedOutstandingMin, setSelectedOutstandingMin] = useState("");
  const [selectedOutstandingMax, setSelectedOutstandingMax] = useState("");
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [appliedClientType, setAppliedClientType] = useState<string | null>(null);
  const [appliedMarginMin, setAppliedMarginMin] = useState<number | null>(null);
  const [appliedMarginMax, setAppliedMarginMax] = useState<number | null>(null);
  const [appliedOutstandingMin, setAppliedOutstandingMin] = useState<number | null>(null);
  const [appliedOutstandingMax, setAppliedOutstandingMax] = useState<number | null>(null);
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

    const rows = riskRows.filter((row) => {
      const matchesSearch =
        query.length === 0 ||
        [
          row.clientType,
          row.clientId,
          row.userId,
          row.loanId,
          row.customerName,
          row.assetValue,
          row.loanOutstanding,
          row.shortfallAmount,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesClientType = !appliedClientType || row.clientType === appliedClientType;
      const shortfallAmount = parseCurrencyValue(row.shortfallAmount);
      const loanOutstanding = parseCurrencyValue(row.loanOutstanding);
      const matchesMarginMin = appliedMarginMin === null || shortfallAmount >= appliedMarginMin;
      const matchesMarginMax = appliedMarginMax === null || shortfallAmount <= appliedMarginMax;
      const matchesOutstandingMin = appliedOutstandingMin === null || loanOutstanding >= appliedOutstandingMin;
      const matchesOutstandingMax = appliedOutstandingMax === null || loanOutstanding <= appliedOutstandingMax;
      const reportDate = parseTableDate(row.reportDate);
      const matchesDateRange =
        (!tableAppliedFromDate || reportDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || reportDate <= tableAppliedToDate);

      return (
        matchesSearch &&
        matchesClientType &&
        matchesMarginMin &&
        matchesMarginMax &&
        matchesOutstandingMin &&
        matchesOutstandingMax &&
        matchesDateRange
      );
    });

    if (!sortKey) {
      return [...rows].sort((left, right) => parseTableDate(right.reportDate).getTime() - parseTableDate(left.reportDate).getTime());
    }

    return [...rows].sort((left, right) => {
      if (sortKey === "loanOutstanding" || sortKey === "shortfallAmount") {
        return parseCurrencyValue(right[sortKey]) - parseCurrencyValue(left[sortKey]);
      }

      if (sortKey === "shortfallDays") {
        return Number(right.shortfallDays) - Number(left.shortfallDays);
      }

      return String(right[sortKey]).localeCompare(String(left[sortKey]));
    });
  }, [
    appliedClientType,
    appliedMarginMax,
    appliedMarginMin,
    appliedOutstandingMax,
    appliedOutstandingMin,
    searchQuery,
    sortKey,
    tableAppliedFromDate,
    tableAppliedToDate,
  ]);

  const statsRows = useMemo(
    () =>
      riskRows.filter((row) => {
        const reportDate = parseTableDate(row.reportDate);
        return (!appliedFromDate || reportDate >= appliedFromDate) && (!appliedToDate || reportDate <= appliedToDate);
      }),
    [appliedFromDate, appliedToDate],
  );

  const totals = useMemo(() => {
    const totalLoanOutstanding = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.loanOutstanding), 0);
    const totalShortfallAmount = statsRows.reduce((sum, row) => sum + parseCurrencyValue(row.shortfallAmount), 0);

    return {
      activeShortfallCases: statsRows.length,
      totalLoanOutstanding,
      totalShortfallAmount,
    };
  }, [statsRows]);

  const hasAppliedFilters =
    Boolean(appliedClientType) ||
    appliedMarginMin !== null ||
    appliedMarginMax !== null ||
    appliedOutstandingMin !== null ||
    appliedOutstandingMax !== null ||
    Boolean(tableAppliedFromDate) ||
    Boolean(tableAppliedToDate);
  const dateFilterLabel =
    dateFilter === "Custom" ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate) : dateFilter;

  const clearFilters = () => {
    setSelectedClientType(null);
    setSelectedMarginMin("");
    setSelectedMarginMax("");
    setSelectedOutstandingMin("");
    setSelectedOutstandingMax("");
    setAppliedClientType(null);
    setAppliedMarginMin(null);
    setAppliedMarginMax(null);
    setAppliedOutstandingMin(null);
    setAppliedOutstandingMax(null);
    setFilterFromDate(null);
    setFilterToDate(null);
    setTableAppliedFromDate(null);
    setTableAppliedToDate(null);
    setShowDateRangePicker(false);
    setShowDateMenu(false);
    setShowFilters(false);
  };

  return (
    <DashboardFrame activeNav="risk-reports">
          <div className="home-heading-row">
            <h1 className="home-heading">Risk Reports</h1>
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
              label="Total Loan Outstanding"
              value={`₹ ${totals.totalLoanOutstanding.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`}
            />
            <div className="risk-stat-card">
              <p className="home-stat-label">Active Shortfall Cases</p>
              <p className="risk-stat-card-value">{totals.activeShortfallCases}</p>
            </div>
            <div className="interest-overdue-card">
              <div>
                <p className="home-stat-label">Active Shortfall Amount</p>
                <p className="interest-overdue-value">
                  ₹ {totals.totalShortfallAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </p>
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
                    <div className="customers-filter-overlay risk-filter-overlay">
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

                      <RangeInputGroup
                        label="Margin Shortfall"
                        maxValue={selectedMarginMax}
                        minValue={selectedMarginMin}
                        onMaxChange={setSelectedMarginMax}
                        onMinChange={setSelectedMarginMin}
                      />

                      <RangeInputGroup
                        label="Loan Outstanding"
                        maxValue={selectedOutstandingMax}
                        minValue={selectedOutstandingMin}
                        onMaxChange={setSelectedOutstandingMax}
                        onMinChange={setSelectedOutstandingMin}
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
                          setAppliedMarginMin(getNumericFilterValue(selectedMarginMin));
                          setAppliedMarginMax(getNumericFilterValue(selectedMarginMax));
                          setAppliedOutstandingMin(getNumericFilterValue(selectedOutstandingMin));
                          setAppliedOutstandingMax(getNumericFilterValue(selectedOutstandingMax));
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
              columns={riskColumns}
              emptyMessage="No risk report records found for the selected filters."
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

const RangeInputGroup = ({
  label,
  maxValue,
  minValue,
  onMaxChange,
  onMinChange,
}: {
  label: string;
  maxValue: string;
  minValue: string;
  onMaxChange: (value: string) => void;
  onMinChange: (value: string) => void;
}) => (
  <div className="customers-filter-group">
    <p className="customers-filter-label">{label}</p>
    <div className="customers-filter-date-row">
      <input
        className="customers-filter-date-input risk-filter-input"
        onBlur={(event) => onMinChange(formatCurrencyInput(event.target.value))}
        onChange={(event) => onMinChange(event.target.value)}
        type="text"
        value={minValue}
      />
      <input
        className="customers-filter-date-input risk-filter-input"
        onBlur={(event) => onMaxChange(formatCurrencyInput(event.target.value))}
        onChange={(event) => onMaxChange(event.target.value)}
        type="text"
        value={maxValue}
      />
    </div>
  </div>
);

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, "\"\"")}"`;

const getExportRows = (rows: RiskRow[]) =>
  rows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.loanId,
    row.customerName,
    row.assetValue,
    row.sanctionedAmount,
    row.dpValue,
    row.loanOutstanding,
    row.shortfallAmount,
    row.shortfallDays,
    row.reportDate,
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

const downloadCsvFile = (rows: RiskRow[]) => {
  const csvLines = [exportColumns.join(","), ...getExportRows(rows).map((row) => row.map(escapeCsvValue).join(","))];
  triggerDownload(`\ufeff${csvLines.join("\n")}`, "risk-reports-export.csv", "text/csv;charset=utf-8;");
};

const downloadExcelFile = (rows: RiskRow[]) => {
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

  triggerDownload(excelContent, "risk-reports-export.xls", "application/vnd.ms-excel");
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
