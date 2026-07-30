import { useEffect, useMemo, useRef, useState } from "react";
import { CircleAlert } from "lucide-react";
import { DashboardFrame } from "@/components/dashboard-frame";
import { DateRangePickerPanel } from "@/components/ui/date-range-picker-panel";
import { FilterDropdown, FilterDropdownOption } from "@/components/ui/filter-dropdown";
import { StatCard } from "@/components/ui/stat-card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type FilterValue = "All Clients" | "SB" | "MFD" | "Direct";
type DateValue =
  | "Current Month"
  | "Previous Month"
  | "Last 3 Months"
  | "Half Yearly"
  | "Current FY"
  | "Custom";
type HomeChartPoint = { name: string; value: number };
type LoansMetricKey =
  | "total-loans"
  | "active-loans"
  | "new-loans"
  | "new-loans-count"
  | "top-up-loans"
  | "top-up-count";
type OutstandingMetricKey =
  | "loan-outstanding"
  | "part-payments"
  | "pre-closures"
  | "disbursal";

const advisorOptions: FilterValue[] = ["All Clients", "SB", "MFD", "Direct"];
const dateOptions: DateValue[] = [
  "Current Month",
  "Previous Month",
  "Last 3 Months",
  "Half Yearly",
  "Current FY",
  "Custom",
];
const DEFAULT_FROM_DATE = new Date(2026, 3, 1);
const DEFAULT_TO_DATE = new Date(2026, 4, 15);
const TODAY = new Date(2026, 5, 10);
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

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(date);

const formatRangeLabel = (fromDate: Date, toDate: Date) => {
  if (fromDate.getMonth() === toDate.getMonth() && fromDate.getFullYear() === toDate.getFullYear()) {
    const monthYear = new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(toDate);
    return `${String(fromDate.getDate()).padStart(2, "0")} - ${String(toDate.getDate()).padStart(2, "0")} ${monthYear}`;
  }

  return `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`;
};

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

const aumSplit = [
  { name: "SB", value: 6, amount: "₹ 6 Cr", fill: "#dbeafe" },
  { name: "Direct", value: 112, amount: "₹ 112 Cr", fill: "#93c5fd" },
  { name: "MFD", value: 0.21, amount: "₹ 0.21 Cr", fill: "#1757e3" },
];

const loanChartOptions: Array<{
  key: LoansMetricKey;
  label: string;
  value: string;
  tooltipLabel: string;
  valueType: "currency" | "count";
  data: HomeChartPoint[];
}> = [
  {
    key: "total-loans",
    label: "Total Loans",
    value: "₹ 10.01 Cr",
    tooltipLabel: "Total Loans",
    valueType: "currency",
    data: [
      { name: "Jan", value: 58 }, { name: "Feb", value: 60 }, { name: "Mar", value: 54 }, { name: "Apr", value: 61 },
      { name: "May", value: 68 }, { name: "Jun", value: 78 }, { name: "Jul", value: 58 }, { name: "Aug", value: 81 },
      { name: "Sep", value: 95 }, { name: "Oct", value: 82 }, { name: "Nov", value: 89 }, { name: "Dec", value: 81 },
    ],
  },
  {
    key: "active-loans",
    label: "No.of Active Loans",
    value: "124",
    tooltipLabel: "Active Loans",
    valueType: "count",
    data: [
      { name: "Jan", value: 72 }, { name: "Feb", value: 70 }, { name: "Mar", value: 73 }, { name: "Apr", value: 79 },
      { name: "May", value: 82 }, { name: "Jun", value: 88 }, { name: "Jul", value: 86 }, { name: "Aug", value: 93 },
      { name: "Sep", value: 98 }, { name: "Oct", value: 104 }, { name: "Nov", value: 111 }, { name: "Dec", value: 124 },
    ],
  },
  {
    key: "new-loans",
    label: "New Loans",
    value: "₹ 6.00 Cr",
    tooltipLabel: "New Loans",
    valueType: "currency",
    data: [
      { name: "Jan", value: 22 }, { name: "Feb", value: 28 }, { name: "Mar", value: 25 }, { name: "Apr", value: 33 },
      { name: "May", value: 36 }, { name: "Jun", value: 42 }, { name: "Jul", value: 39 }, { name: "Aug", value: 48 },
      { name: "Sep", value: 56 }, { name: "Oct", value: 53 }, { name: "Nov", value: 61 }, { name: "Dec", value: 66 },
    ],
  },
  {
    key: "new-loans-count",
    label: "No.of New Loans",
    value: "104",
    tooltipLabel: "New Loan Count",
    valueType: "count",
    data: [
      { name: "Jan", value: 11 }, { name: "Feb", value: 16 }, { name: "Mar", value: 14 }, { name: "Apr", value: 21 },
      { name: "May", value: 25 }, { name: "Jun", value: 29 }, { name: "Jul", value: 31 }, { name: "Aug", value: 36 },
      { name: "Sep", value: 42 }, { name: "Oct", value: 47 }, { name: "Nov", value: 53 }, { name: "Dec", value: 59 },
    ],
  },
  {
    key: "top-up-loans",
    label: "Top Up Loans",
    value: "₹ 4.06 Cr",
    tooltipLabel: "Top-Up Loans",
    valueType: "currency",
    data: [
      { name: "Jan", value: 16 }, { name: "Feb", value: 18 }, { name: "Mar", value: 15 }, { name: "Apr", value: 21 },
      { name: "May", value: 24 }, { name: "Jun", value: 28 }, { name: "Jul", value: 19 }, { name: "Aug", value: 26 },
      { name: "Sep", value: 31 }, { name: "Oct", value: 27 }, { name: "Nov", value: 29 }, { name: "Dec", value: 34 },
    ],
  },
  {
    key: "top-up-count",
    label: "No.of Top-Up",
    value: "24",
    tooltipLabel: "Top-Up Count",
    valueType: "count",
    data: [
      { name: "Jan", value: 4 }, { name: "Feb", value: 6 }, { name: "Mar", value: 5 }, { name: "Apr", value: 8 },
      { name: "May", value: 9 }, { name: "Jun", value: 11 }, { name: "Jul", value: 8 }, { name: "Aug", value: 13 },
      { name: "Sep", value: 15 }, { name: "Oct", value: 14 }, { name: "Nov", value: 18 }, { name: "Dec", value: 24 },
    ],
  },
];

const outstandingChartOptions: Array<{
  key: OutstandingMetricKey;
  label: string;
  value: string;
  tooltipLabel: string;
  valueType: "currency" | "count";
  danger?: boolean;
  data: HomeChartPoint[];
}> = [
  {
    key: "loan-outstanding",
    label: "Loan Outstanding",
    value: "₹ 12.02 Cr",
    tooltipLabel: "Loan Outstanding",
    valueType: "currency",
    data: [
      { name: "Jan", value: 60 }, { name: "Feb", value: 62 }, { name: "Mar", value: 55 }, { name: "Apr", value: 63 },
      { name: "May", value: 70 }, { name: "Jun", value: 79 }, { name: "Jul", value: 60 }, { name: "Aug", value: 83 },
      { name: "Sep", value: 96 }, { name: "Oct", value: 83 }, { name: "Nov", value: 90 }, { name: "Dec", value: 84 },
    ],
  },
  {
    key: "part-payments",
    label: "Part Payments",
    value: "₹ -1.00 Cr",
    tooltipLabel: "Part Payments",
    valueType: "currency",
    danger: true,
    data: [
      { name: "Jan", value: 5 }, { name: "Feb", value: 7 }, { name: "Mar", value: 6 }, { name: "Apr", value: 9 },
      { name: "May", value: 10 }, { name: "Jun", value: 13 }, { name: "Jul", value: 11 }, { name: "Aug", value: 15 },
      { name: "Sep", value: 17 }, { name: "Oct", value: 14 }, { name: "Nov", value: 18 }, { name: "Dec", value: 20 },
    ],
  },
  {
    key: "pre-closures",
    label: "Pre-Closures",
    value: "₹ -1.03 Cr",
    tooltipLabel: "Pre-Closures",
    valueType: "currency",
    danger: true,
    data: [
      { name: "Jan", value: 4 }, { name: "Feb", value: 5 }, { name: "Mar", value: 3 }, { name: "Apr", value: 7 },
      { name: "May", value: 8 }, { name: "Jun", value: 10 }, { name: "Jul", value: 7 }, { name: "Aug", value: 11 },
      { name: "Sep", value: 12 }, { name: "Oct", value: 10 }, { name: "Nov", value: 13 }, { name: "Dec", value: 15 },
    ],
  },
  {
    key: "disbursal",
    label: "Disbursal",
    value: "₹ 14.03 Cr",
    tooltipLabel: "Disbursal",
    valueType: "currency",
    data: [
      { name: "Jan", value: 36 }, { name: "Feb", value: 39 }, { name: "Mar", value: 35 }, { name: "Apr", value: 43 },
      { name: "May", value: 48 }, { name: "Jun", value: 55 }, { name: "Jul", value: 44 }, { name: "Aug", value: 59 },
      { name: "Sep", value: 66 }, { name: "Oct", value: 58 }, { name: "Nov", value: 62 }, { name: "Dec", value: 70 },
    ],
  },
];

const tooltipStyle = {
  backgroundColor: "#fdfdfd",
  border: "1px solid #e1e1e1",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
  fontSize: "12px",
};

const chartAxisTick = { fill: "#b3b3b3", fontSize: 12 };

const baseHomeStats = [
  { label: "Total AUM", value: 118.21, kind: "currency" as const },
  { label: "Total Outstanding", value: 12.02, kind: "currency" as const },
  { label: "Available DP", value: 6.21, kind: "currency" as const },
  { label: "Total Disbursal", value: 14.03, kind: "currency" as const },
  { label: "Margin Shortfall", value: 0.12, kind: "currency" as const, danger: true },
];

const baseRiskStats = [
  { label: "Shortfall Cases", value: 43, kind: "count" as const, warning: true },
  { label: "Overdue Interest", value: 0.08, kind: "currency" as const },
  { label: "Penalty Due", value: 0.02, kind: "currency" as const },
];

const formatCrValue = (value: number) => `₹ ${value.toFixed(2)} Cr`;
const formatCountValue = (value: number) => `${Math.round(value)}`;
const formatTooltipMetricValue = (value: number, valueType: "currency" | "count") =>
  valueType === "currency" ? formatCrValue(value) : formatCountValue(value);

const getDateScale = (dateFilter: DateValue, fromDate: Date | null, toDate: Date | null) => {
  if (dateFilter === "Previous Month") return 0.86;
  if (dateFilter === "Last 3 Months") return 1.14;
  if (dateFilter === "Half Yearly") return 1.28;
  if (dateFilter === "Current FY") return 1.36;
  if (dateFilter === "Custom" && fromDate && toDate) {
    const diffDays = Math.max(1, Math.round((toDate.getTime() - fromDate.getTime()) / 86400000) + 1);
    return Math.min(1.4, Math.max(0.35, diffDays / 30));
  }
  return 1;
};

export const HomePage = () => {
  const [advisorFilter, setAdvisorFilter] = useState<FilterValue>("All Clients");
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showAdvisorMenu, setShowAdvisorMenu] = useState(false);
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const initialPresetRange = getPresetRange("Current Month");
  const [fromDate, setFromDate] = useState<Date>(initialPresetRange.from);
  const [toDate, setToDate] = useState<Date>(initialPresetRange.to);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(initialPresetRange.from);
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(initialPresetRange.to);
  const dateFilterRef = useRef<HTMLDivElement | null>(null);
  const [activeLoansMetric, setActiveLoansMetric] = useState<LoansMetricKey>("total-loans");
  const [activeOutstandingMetric, setActiveOutstandingMetric] = useState<OutstandingMetricKey>("loan-outstanding");

  const advisorScale =
    advisorFilter === "SB" ? 0.28 : advisorFilter === "MFD" ? 0.12 : advisorFilter === "Direct" ? 0.6 : 1;
  const dateScale = getDateScale(dateFilter, appliedFromDate, appliedToDate);
  const overallScale = advisorScale * dateScale;
  const visibleAumSplit = useMemo(() => {
    const rows = advisorFilter === "All Clients" ? aumSplit : aumSplit.filter((item) => item.name === advisorFilter);
    return rows.map((item) => ({
      ...item,
      value: Number((item.value * dateScale).toFixed(2)),
      amount: formatCrValue(item.value * dateScale),
    }));
  }, [advisorFilter, dateScale]);
  const donutTotal = useMemo(
    () => visibleAumSplit.reduce((sum, item) => sum + item.value, 0),
    [visibleAumSplit],
  );
  const visibleLoanChartOptions = useMemo(
    () =>
      loanChartOptions.map((option) => ({
        ...option,
        value: option.value.includes("₹")
          ? formatCrValue(Number(option.value.replace(/[^\d.-]/g, "")) * overallScale)
          : formatCountValue(Number(option.value) * overallScale),
        data: option.data.map((point) => ({ ...point, value: Number((point.value * overallScale).toFixed(1)) })),
      })),
    [overallScale],
  );
  const visibleOutstandingChartOptions = useMemo(
    () =>
      outstandingChartOptions.map((option) => ({
        ...option,
        value: option.value.includes("₹")
          ? `${option.value.includes("-") ? "₹ -" : "₹ "}${Math.abs(Number(option.value.replace(/[^\d.-]/g, "")) * overallScale).toFixed(2)} Cr`
          : formatCountValue(Number(option.value) * overallScale),
        data: option.data.map((point) => ({ ...point, value: Number((point.value * overallScale).toFixed(1)) })),
      })),
    [overallScale],
  );
  const homeStats = useMemo(
    () =>
      baseHomeStats.map((item) => ({
        ...item,
        displayValue: item.kind === "currency" ? formatCrValue(item.value * overallScale) : formatCountValue(item.value * overallScale),
      })),
    [overallScale],
  );
  const riskStats = useMemo(
    () =>
      baseRiskStats.map((item) => ({
        ...item,
        displayValue: item.kind === "currency" ? formatCrValue(item.value * overallScale) : formatCountValue(item.value * overallScale),
      })),
    [overallScale],
  );
  const activeLoanChart = useMemo(
    () => visibleLoanChartOptions.find((option) => option.key === activeLoansMetric) ?? visibleLoanChartOptions[0],
    [activeLoansMetric, visibleLoanChartOptions],
  );
  const activeOutstandingChart = useMemo(
    () =>
      visibleOutstandingChartOptions.find((option) => option.key === activeOutstandingMetric) ?? visibleOutstandingChartOptions[0],
    [activeOutstandingMetric, visibleOutstandingChartOptions],
  );
  const dateFilterLabel =
    dateFilter === "Custom" ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate) : dateFilter;

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (!dateFilterRef.current?.contains(event.target as Node)) {
        setShowDateMenu(false);
        setShowDateRangePicker(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  return (
    <DashboardFrame activeNav="home">
          <div className="home-heading-row">
            <h1 className="home-heading">Home</h1>
            <div className="home-filters">
              <FilterDropdown
                label={advisorFilter}
                open={showAdvisorMenu}
                width={116}
                onToggle={() => {
                  setShowAdvisorMenu((value) => !value);
                  setShowDateMenu(false);
                }}
              >
                {advisorOptions.map((option) => (
                  <FilterDropdownOption
                    key={option}
                    label={option}
                    onClick={() => {
                      setAdvisorFilter(option);
                      setShowAdvisorMenu(false);
                    }}
                  />
                ))}
              </FilterDropdown>

              <div className="home-filter-wrap" ref={dateFilterRef}>
                <FilterDropdown
                  active={dateFilter === "Custom"}
                  label={dateFilterLabel}
                  open={showDateMenu}
                  width={dateFilter === "Custom" ? 188 : 140}
                  onToggle={() => {
                    setShowDateMenu((value) => !value);
                    setShowAdvisorMenu(false);
                    setShowDateRangePicker(false);
                  }}
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
                {showDateRangePicker ? (
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
          </div>

          <section className="home-stats-grid">
            {homeStats.map((item) => (
              <StatCard
                key={item.label}
                danger={item.danger}
                icon={item.danger ? <CircleAlert size={18} /> : undefined}
                label={item.label}
                value={item.displayValue}
              />
            ))}
          </section>

          <section className="home-row">
            <div className="home-card home-donut-card">
              <h2 className="home-card-title">AUM</h2>
              <div className="home-donut-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <defs>
                      <linearGradient id="aumDonutBlue" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#dbeafe" />
                        <stop offset="100%" stopColor="#93c5fd" />
                      </linearGradient>
                    </defs>
                    <Pie
                      data={visibleAumSplit}
                      dataKey="value"
                      innerRadius={62}
                      outerRadius={98}
                      paddingAngle={2}
                      cornerRadius={6}
                      stroke="none"
                    >
                      {visibleAumSplit.map((item) => (
                        <Cell key={item.name} fill={item.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => [`₹ ${value} Cr`, "AUM"]} contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="home-donut-center">₹ {donutTotal.toFixed(2)} Cr</div>
              </div>
              <div className="home-legend-grid">
                {visibleAumSplit.map((item) => (
                  <div key={item.name} className="home-legend-item">
                    <span className="home-legend-value">{item.amount}</span>
                    <div className="home-legend-meta">
                      <span className="home-legend-bar" style={{ background: item.fill }} />
                      <span>{item.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-card home-chart-card">
              <h2 className="home-card-title">Loans</h2>
              <div className="home-tab-row">
                {visibleLoanChartOptions.map((option) => (
                  <ChartTab
                    key={option.key}
                    active={activeLoansMetric === option.key}
                    label={option.label}
                    onClick={() => setActiveLoansMetric(option.key)}
                    value={option.value}
                  />
                ))}
              </div>
              <div className="home-area-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeLoanChart.data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="loansAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity={0.95} />
                        <stop offset="65%" stopColor="#dbeafe" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} />
                    <YAxis
                      domain={[0, 120]}
                      ticks={[30, 60, 90, 120]}
                      axisLine={false}
                      tickLine={false}
                      tick={chartAxisTick}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatTooltipMetricValue(value, activeLoanChart.valueType),
                        activeLoanChart.tooltipLabel,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#93c5fd"
                      fill="url(#loansAreaFill)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          <section className="home-row home-row-bottom">
            <div className="home-card home-chart-card home-chart-large">
              <h2 className="home-card-title">Loan Outstanding</h2>
              <div className="home-tab-row">
                {visibleOutstandingChartOptions.map((option) => (
                  <ChartTab
                    key={option.key}
                    active={activeOutstandingMetric === option.key}
                    danger={option.danger}
                    label={option.label}
                    onClick={() => setActiveOutstandingMetric(option.key)}
                    value={option.value}
                  />
                ))}
              </div>
              <div className="home-area-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeOutstandingChart.data} margin={{ top: 10, right: 6, left: -12, bottom: 0 }}>
                    <defs>
                      <linearGradient id="outstandingAreaFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#bfdbfe" stopOpacity={0.95} />
                        <stop offset="65%" stopColor="#dbeafe" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="#dbeafe" stopOpacity={0.08} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#f0f0f0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={chartAxisTick} />
                    <YAxis
                      domain={[0, 120]}
                      ticks={[30, 60, 90, 120]}
                      axisLine={false}
                      tickLine={false}
                      tick={chartAxisTick}
                    />
                    <Tooltip
                      formatter={(value: number) => [
                        formatTooltipMetricValue(value, activeOutstandingChart.valueType),
                        activeOutstandingChart.tooltipLabel,
                      ]}
                      contentStyle={tooltipStyle}
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#93c5fd"
                      fill="url(#outstandingAreaFill)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4, strokeWidth: 0, fill: "#3b82f6" }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="home-card home-risk-card">
              <h2 className="home-card-title">Risk &amp; Payment</h2>
              {riskStats.map((item) => (
                <RiskCard key={item.label} label={item.label} value={item.displayValue} warning={item.warning} />
              ))}
            </div>
          </section>
    </DashboardFrame>
  );
};

const ChartTab = ({
  label,
  value,
  active,
  danger,
  onClick,
}: {
  label: string;
  value: string;
  active?: boolean;
  danger?: boolean;
  onClick?: () => void;
}) => (
  <button className={`home-chart-tab${active ? " is-active" : ""}`} onClick={onClick} type="button">
    <p>{label}</p>
    <span className={danger ? "is-danger" : ""}>{value}</span>
  </button>
);

const RiskCard = ({
  label,
  value,
  warning,
}: {
  label: string;
  value: string;
  warning?: boolean;
}) => (
  <div className={`home-risk-box${warning ? " is-warning" : ""}`}>
    <p>{label}</p>
    <span>{value}</span>
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
