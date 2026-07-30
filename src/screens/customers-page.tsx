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
import {
  FilterDropdown,
  FilterDropdownOption,
} from "@/components/ui/filter-dropdown";
import { StatCard } from "@/components/ui/stat-card";

type DateValue =
  | "Current Month"
  | "Previous Month"
  | "Last 3 Months"
  | "Half Yearly"
  | "Current FY"
  | "Custom";

type CustomerRow = {
  clientType: string;
  clientId: string;
  userId: string;
  customerName: string;
  processStatus: string;
  eventDate: string;
  eventTime: string;
  collateralValue: string;
  eligibleDp: string;
  lender: string;
  collateralClass: string;
  emailId: string;
  phoneNumber: string;
  signupDate: string;
  source: string;
};

type CustomerColumn = {
  key: keyof CustomerRow;
  label: string;
  renderCell?: (row: CustomerRow) => React.ReactNode;
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

const customerRows: CustomerRow[] = [
  {
    clientType: "SB",
    clientId: "AADF",
    userId: "4321",
    customerName: "Aarav Sharma",
    processStatus: "Disbursement Sent",
    eventDate: "13-05-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Infinia",
    collateralClass: "Hybrid",
    emailId: "aaravsharma@gmail.com",
    phoneNumber: "9876543210",
    signupDate: "02-04-2026",
    source: "iOS",
  },
  {
    clientType: "MFD",
    clientId: "A112A5",
    userId: "4321",
    customerName: "Isha Patel",
    processStatus: "Disbursement Sent",
    eventDate: "25-04-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: " Finserv",
    collateralClass: "Hybrid",
    emailId: "ishapatel@gmail.com",
    phoneNumber: "8765432109",
    signupDate: "25-04-2026",
    source: "Android",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Agreement Signed",
    eventDate: "18-04-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Jio Financial Service",
    collateralClass: "Hybrid",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "7654321098",
    signupDate: "18-04-2026",
    source: "Third Party",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Disbursement Sent",
    eventDate: "05-05-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Infinia",
    collateralClass: "Hybrid",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "6543210987",
    signupDate: "05-05-2026",
    source: "Partner Website",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Agreement Signed",
    eventDate: "27-03-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Bajaj Finserv",
    collateralClass: "Debt",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "9123456789",
    signupDate: "27-03-2026",
    source: "iOS",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Loan Approved",
    eventDate: "10-05-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Jio Financial Service",
    collateralClass: "Equity",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "8234567890",
    signupDate: "10-05-2026",
    source: "Android",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "KYC Approved",
    eventDate: "14-04-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Infinia",
    collateralClass: "Equity",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "7345678901",
    signupDate: "14-04-2026",
    source: "Third Party",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Disbursement Sent",
    eventDate: "22-05-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Bajaj Finserv",
    collateralClass: "Equity",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "6456789012",
    signupDate: "22-05-2026",
    source: "Partner Website",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Portfolio Fetched",
    processStatus: "Portfolio Fetched",
    eventDate: "08-03-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "-",
    collateralClass: "Debt",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "9988776655",
    signupDate: "08-03-2026",
    source: "iOS",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4321",
    customerName: "Vihaan Gupta",
    processStatus: "Disbursement Completed",
    eventDate: "30-05-2026",
    eventTime: "11:30 AM",
    collateralValue: "₹ 1,00,000",
    eligibleDp: "₹ 50,000",
    lender: "Infinia",
    collateralClass: "Equity",
    emailId: "vihaangupta@gmail.com",
    phoneNumber: "8877665544",
    signupDate: "30-05-2026",
    source: "Android",
  },
  {
    clientType: "SB",
    clientId: "SB27D",
    userId: "5412",
    customerName: "Nisha Verma",
    processStatus: "Loan Requested",
    eventDate: "02-06-2026",
    eventTime: "09:15 AM",
    collateralValue: "₹ 2,40,000",
    eligibleDp: "₹ 1,20,000",
    lender: "Infinia",
    collateralClass: "Equity",
    emailId: "nisha.verma@gmail.com",
    phoneNumber: "9012345678",
    signupDate: "28-05-2026",
    source: "Partner Website",
  },
  {
    clientType: "MFD",
    clientId: "MF41K",
    userId: "5188",
    customerName: "Rohit Menon",
    processStatus: "KYC Partially Approved",
    eventDate: "04-06-2026",
    eventTime: "02:10 PM",
    collateralValue: "₹ 1,75,000",
    eligibleDp: "₹ 92,000",
    lender: "Bajaj Finserv",
    collateralClass: "Debt",
    emailId: "rohit.menon@gmail.com",
    phoneNumber: "9345678123",
    signupDate: "26-05-2026",
    source: "Android",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "5531",
    customerName: "Karan Kapoor",
    processStatus: "Loan Created",
    eventDate: "06-06-2026",
    eventTime: "10:05 AM",
    collateralValue: "₹ 2,10,000",
    eligibleDp: "₹ 1,05,000",
    lender: "Jio Financial Service",
    collateralClass: "Hybrid",
    emailId: "karan.kapoor@gmail.com",
    phoneNumber: "9456781234",
    signupDate: "01-06-2026",
    source: "iOS",
  },
  {
    clientType: "SB",
    clientId: "SB81P",
    userId: "5660",
    customerName: "Meera Joshi",
    processStatus: "Agreement Sent",
    eventDate: "07-06-2026",
    eventTime: "04:20 PM",
    collateralValue: "₹ 95,000",
    eligibleDp: "₹ 48,000",
    lender: "Infinia",
    collateralClass: "Debt",
    emailId: "meera.joshi@gmail.com",
    phoneNumber: "9567812345",
    signupDate: "03-06-2026",
    source: "Third Party",
  },
  {
    clientType: "MFD",
    clientId: "MF78T",
    userId: "5704",
    customerName: "Ananya Rao",
    processStatus: "Agreement Signed",
    eventDate: "09-06-2026",
    eventTime: "12:40 PM",
    collateralValue: "₹ 3,10,000",
    eligibleDp: "₹ 1,76,000",
    lender: "Bajaj Finserv",
    collateralClass: "Equity",
    emailId: "ananya.rao@gmail.com",
    phoneNumber: "9678123456",
    signupDate: "04-06-2026",
    source: "Partner Website",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "6204",
    customerName: "Karthik Iyer",
    processStatus: "Loan Approved",
    eventDate: "10-06-2026",
    eventTime: "01:25 PM",
    collateralValue: "₹ 2,75,000",
    eligibleDp: "₹ 1,44,000",
    lender: "Jio Financial Service",
    collateralClass: "Hybrid",
    emailId: "karthik.iyer@gmail.com",
    phoneNumber: "9781234567",
    signupDate: "05-06-2026",
    source: "Android",
  },
  {
    clientType: "MFD",
    clientId: "MFD3L",
    userId: "4880",
    customerName: "Sneha Kulkarni",
    processStatus: "KYC Rejected",
    eventDate: "11-06-2026",
    eventTime: "11:05 AM",
    collateralValue: "₹ 1,35,000",
    eligibleDp: "₹ 80,000",
    lender: "Infinia",
    collateralClass: "Debt",
    emailId: "sneha.kulkarni@gmail.com",
    phoneNumber: "9892345671",
    signupDate: "06-06-2026",
    source: "iOS",
  },
  {
    clientType: "Direct",
    clientId: "-",
    userId: "4012",
    customerName: "Madhav Rao",
    processStatus: "Disbursement Completed",
    eventDate: "11-06-2026",
    eventTime: "05:45 PM",
    collateralValue: "₹ 88,000",
    eligibleDp: "₹ 61,000",
    lender: "Bajaj Finserv",
    collateralClass: "Equity",
    emailId: "madhav.rao@gmail.com",
    phoneNumber: "9901234567",
    signupDate: "07-06-2026",
    source: "Third Party",
  },
  {
    clientType: "SB",
    clientId: "SB40N",
    userId: "5330",
    customerName: "Pooja Nair",
    processStatus: "Disbursement Sent",
    eventDate: "12-06-2026",
    eventTime: "09:50 AM",
    collateralValue: "₹ 1,92,000",
    eligibleDp: "₹ 1,10,000",
    lender: "Infinia",
    collateralClass: "Hybrid",
    emailId: "pooja.nair@gmail.com",
    phoneNumber: "9811122233",
    signupDate: "08-06-2026",
    source: "Partner Website",
  },
];

const customerColumns: CustomerColumn[] = [
  { key: "clientType", label: "Client Type" },
  { key: "clientId", label: "Client ID" },
  { key: "userId", label: "User ID" },
  { key: "customerName", label: "Customer Name" },
  { key: "processStatus", label: "Process Status" },
  {
    key: "eventDate",
    label: "Event Date",
    sortable: true,
    renderCell: (row) => (
      <div className="customers-date-time">
        <span>{row.eventDate}</span>
        <span className="customers-muted">{row.eventTime}</span>
      </div>
    ),
  },
  { key: "collateralValue", label: "Collateral Value", sortable: true },
  { key: "eligibleDp", label: "Eligible DP" },
  { key: "lender", label: "Lender", sortable: true },
  { key: "collateralClass", label: "Collateral Class" },
  { key: "emailId", label: "Email ID" },
  { key: "phoneNumber", label: "Phone Number" },
  {
    key: "signupDate",
    label: "Signup Date",
    sortable: true,
    renderCell: (row) => (
      <div className="customers-date-time">
        <span>{row.signupDate}</span>
        <span className="customers-muted">{row.eventTime}</span>
      </div>
    ),
  },
  { key: "source", label: "Source", sortable: true },
];

const clientTypeOptions = ["SB", "MFD", "Direct"] as const;
const lenderOptions = ["Bajaj Finance", "Infinia", "JIO"] as const;
const processStatusOptions = [
  "Loan Requested",
  "Loan Approved",
  "KYC Approved",
  "KYC Partially Approved",
  "KYC Rejected",
  "Loan Created",
  "Agreement Sent",
  "Agreement Signed",
  "Mandate Sent",
  "Mandate Signed",
  "vKYC Requested",
  "vKYC Rejected",
  "vKYC Completed",
  "Disbursement Approved",
  "Disbursement Pending",
  "Disbursement Sent",
  "Disbursement Completed",
] as const;

const monthLabels = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const aprilDays: Array<number | ""> = [
  "",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  "",
  "",
  "",
  "",
];
const mayDays: Array<number | ""> = [
  "",
  "",
  "",
  1,
  2,
  3,
  4,
  5,
  6,
  7,
  8,
  9,
  10,
  11,
  12,
  13,
  14,
  15,
  16,
  17,
  18,
  19,
  20,
  21,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  29,
  30,
  31,
  "",
];

const exportColumns = [
  "Client Type",
  "Client ID",
  "User ID",
  "Customer Name",
  "Process Status",
  "Event Date",
  "Event Time",
  "Collateral Value",
  "Eligible DP",
  "Lender",
  "Collateral Class",
  "Email ID",
  "Phone Number",
  "Signup Date",
  "Source",
] as const;

const DEFAULT_FROM_DATE = new Date(2026, 3, 1);
const DEFAULT_TO_DATE = new Date(2026, 3, 15);
const TODAY = new Date(2026, 5, 10);

const formatDisplayDate = (date: Date) =>
  new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);

const formatRangeLabel = (fromDate: Date, toDate: Date) => {
  if (
    fromDate.getMonth() === toDate.getMonth() &&
    fromDate.getFullYear() === toDate.getFullYear()
  ) {
    const monthYear = new Intl.DateTimeFormat("en-GB", {
      month: "short",
      year: "numeric",
    }).format(toDate);
    return `${String(fromDate.getDate()).padStart(2, "0")} - ${String(toDate.getDate()).padStart(2, "0")} ${monthYear}`;
  }

  return `${formatDisplayDate(fromDate)} - ${formatDisplayDate(toDate)}`;
};

const getPresetRange = (value: DateValue) => {
  const today = new Date(TODAY);

  switch (value) {
    case "Current Month":
      return {
        from: new Date(today.getFullYear(), today.getMonth(), 1),
        to: today,
      };
    case "Previous Month":
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 1, 1),
        to: new Date(today.getFullYear(), today.getMonth(), 0),
      };
    case "Last 3 Months":
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 2, 1),
        to: today,
      };
    case "Half Yearly":
      return {
        from: new Date(today.getFullYear(), today.getMonth() - 5, 1),
        to: today,
      };
    case "Current FY":
      return {
        from: new Date(
          today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1,
          3,
          1,
        ),
        to: today,
      };
    case "Custom":
    default:
      return { from: DEFAULT_FROM_DATE, to: DEFAULT_TO_DATE };
  }
};

const parseTableDate = (value: string) => {
  const [day, month, year] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

const normalizeLender = (value: string) => {
  const normalized = value.trim().toLowerCase();
  if (normalized === "jio financial service") {
    return "jio";
  }
  if (normalized === "bajaj finserv") {
    return "bajaj finance";
  }
  return normalized;
};

const parseCurrencyValue = (value: string) =>
  Number(value.replace(/[^\d.]/g, "").replace(/,/g, ""));

export const CustomersPage = () => {
  const [dateFilter, setDateFilter] = useState<DateValue>("Current Month");
  const [showDateMenu, setShowDateMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClientType, setSelectedClientType] = useState<string | null>(
    null,
  );
  const [selectedLender, setSelectedLender] = useState<string | null>(null);
  const [selectedProcessStatus, setSelectedProcessStatus] = useState<
    string | null
  >(null);
  const [filterFromDate, setFilterFromDate] = useState<Date | null>(null);
  const [filterToDate, setFilterToDate] = useState<Date | null>(null);
  const [appliedClientType, setAppliedClientType] = useState<string | null>(
    null,
  );
  const [appliedLender, setAppliedLender] = useState<string | null>(null);
  const [appliedProcessStatus, setAppliedProcessStatus] = useState<
    string | null
  >(null);
  const [tableAppliedFromDate, setTableAppliedFromDate] = useState<Date | null>(
    null,
  );
  const [tableAppliedToDate, setTableAppliedToDate] = useState<Date | null>(
    null,
  );
  const [showProcessStatusMenu, setShowProcessStatusMenu] = useState(false);
  const [showDateRangePicker, setShowDateRangePicker] = useState(false);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const initialPresetRange = getPresetRange("Current Month");
  const [fromDate, setFromDate] = useState(initialPresetRange.from);
  const [toDate, setToDate] = useState(initialPresetRange.to);
  const [appliedFromDate, setAppliedFromDate] = useState<Date | null>(
    initialPresetRange.from,
  );
  const [appliedToDate, setAppliedToDate] = useState<Date | null>(
    initialPresetRange.to,
  );
  const [sortKey, setSortKey] = useState<keyof CustomerRow | null>(null);
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
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const rows = customerRows.filter((row) => {
      const matchesSearch =
        normalizedQuery.length === 0 ||
        [
          row.customerName,
          row.clientId,
          row.userId,
          row.emailId,
          row.phoneNumber,
          row.processStatus,
          row.lender,
          row.source,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      const matchesClientType =
        !appliedClientType || row.clientType === appliedClientType;
      const matchesLender =
        !appliedLender ||
        normalizeLender(row.lender) === normalizeLender(appliedLender);
      const matchesProcessStatus =
        !appliedProcessStatus || row.processStatus === appliedProcessStatus;

      const eventDate = parseTableDate(row.eventDate);
      const matchesDateRange =
        (!tableAppliedFromDate || eventDate >= tableAppliedFromDate) &&
        (!tableAppliedToDate || eventDate <= tableAppliedToDate);

      return (
        matchesSearch &&
        matchesClientType &&
        matchesLender &&
        matchesProcessStatus &&
        matchesDateRange
      );
    });

    if (!sortKey) {
      return [...rows].sort(
        (left, right) =>
          parseTableDate(right.eventDate).getTime() -
          parseTableDate(left.eventDate).getTime(),
      );
    }

    return [...rows].sort((left, right) => {
      if (sortKey === "eventDate" || sortKey === "signupDate") {
        return (
          parseTableDate(right[sortKey]).getTime() -
          parseTableDate(left[sortKey]).getTime()
        );
      }

      if (sortKey === "collateralValue" || sortKey === "eligibleDp") {
        return (
          parseCurrencyValue(right[sortKey]) - parseCurrencyValue(left[sortKey])
        );
      }

      return String(right[sortKey]).localeCompare(String(left[sortKey]));
    });
  }, [
    appliedClientType,
    appliedLender,
    appliedProcessStatus,
    searchQuery,
    sortKey,
    tableAppliedFromDate,
    tableAppliedToDate,
  ]);

  const statsRows = useMemo(
    () =>
      customerRows.filter((row) => {
        const eventDate = parseTableDate(row.eventDate);
        return (
          (!appliedFromDate || eventDate >= appliedFromDate) &&
          (!appliedToDate || eventDate <= appliedToDate)
        );
      }),
    [appliedFromDate, appliedToDate],
  );

  const filteredTotals = useMemo(() => {
    const totalUsers = statsRows.length;
    const totalEligibleUsers = statsRows.filter(
      (row) => parseCurrencyValue(row.eligibleDp) > 0,
    ).length;
    const totalCollateralValue = statsRows.reduce(
      (sum, row) => sum + parseCurrencyValue(row.collateralValue),
      0,
    );
    const totalDp = statsRows.reduce(
      (sum, row) => sum + parseCurrencyValue(row.eligibleDp),
      0,
    );

    return {
      totalUsers,
      totalEligibleUsers,
      totalCollateralValue,
      totalDp,
    };
  }, [statsRows]);

  const hasAppliedFilters =
    Boolean(appliedClientType) ||
    Boolean(appliedLender) ||
    Boolean(appliedProcessStatus) ||
    Boolean(tableAppliedFromDate) ||
    Boolean(tableAppliedToDate);
  const dateFilterLabel =
    dateFilter === "Custom"
      ? formatRangeLabel(appliedFromDate ?? fromDate, appliedToDate ?? toDate)
      : dateFilter;

  const clearFilters = () => {
    setSelectedClientType(null);
    setSelectedLender(null);
    setSelectedProcessStatus(null);
    setAppliedClientType(null);
    setAppliedLender(null);
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
    <DashboardFrame activeNav="customers">
      <div className="home-heading-row">
        <h1 className="home-heading">Customers</h1>

        <div className="home-filter-wrap" ref={dateFilterRef}>
          <FilterDropdown
            active={dateFilter === "Custom"}
            label={dateFilterLabel}
            open={showDateMenu}
            width={dateFilter === "Custom" ? 188 : 120}
            onToggle={() => setShowDateMenu((value) => !value)}
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
        <StatCard
          label="Total Customers"
          value={filteredTotals.totalUsers.toLocaleString("en-IN")}
        />
        <StatCard
          label="Total Eligible Customers"
          value={filteredTotals.totalEligibleUsers.toLocaleString("en-IN")}
        />
        <StatCard
          label="Total Collateral Value"
          value={`₹ ${filteredTotals.totalCollateralValue.toLocaleString(
            "en-IN",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
          )}`}
        />
        <StatCard
          label="Total DP"
          value={`₹ ${filteredTotals.totalDp.toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}`}
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
                    <button
                      className="customers-filter-reset"
                      onClick={clearFilters}
                      type="button"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="customers-filter-group">
                    <p className="customers-filter-label">Client Type</p>
                    <div className="customers-filter-chip-row">
                      {clientTypeOptions.map((option) => (
                        <button
                          key={option}
                          className={`customers-filter-chip${selectedClientType === option ? " is-active" : ""}`}
                          onClick={() =>
                            setSelectedClientType((value) =>
                              value === option ? null : option,
                            )
                          }
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="customers-filter-group">
                    <p className="customers-filter-label">Lender</p>
                    <div className="customers-filter-chip-row">
                      {lenderOptions.map((option) => (
                        <button
                          key={option}
                          className={`customers-filter-chip${selectedLender === option ? " is-active" : ""}`}
                          onClick={() =>
                            setSelectedLender((value) =>
                              value === option ? null : option,
                            )
                          }
                          type="button"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="customers-filter-group">
                    <p className="customers-filter-label">
                      Loan Process Status
                    </p>
                    <div className="customers-filter-select-wrap">
                      <button
                        className={`customers-filter-select${showProcessStatusMenu ? " is-open" : ""}`}
                        onClick={() => {
                          setShowProcessStatusMenu((value) => !value);
                          setShowDateRangePicker(false);
                        }}
                        type="button"
                      >
                        <span
                          className={
                            !selectedProcessStatus ? "is-placeholder" : ""
                          }
                        >
                          {selectedProcessStatus ?? "Select Process Status"}
                        </span>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.9}
                          className={
                            showProcessStatusMenu
                              ? "customers-chevron-open"
                              : undefined
                          }
                        />
                      </button>

                      {showProcessStatusMenu ? (
                        <div className="customers-process-menu">
                          {processStatusOptions.map((option) => (
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
                          <span
                            className={!filterFromDate ? "is-placeholder" : ""}
                          >
                            {filterFromDate
                              ? formatDisplayDate(filterFromDate)
                              : "Start Date"}
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
                          <span
                            className={!filterToDate ? "is-placeholder" : ""}
                          >
                            {filterToDate
                              ? formatDisplayDate(filterToDate)
                              : "End Date"}
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
                      setAppliedLender(selectedLender);
                      setAppliedProcessStatus(selectedProcessStatus);
                      setTableAppliedFromDate(
                        filterFromDate && filterToDate ? filterFromDate : null,
                      );
                      setTableAppliedToDate(
                        filterFromDate && filterToDate ? filterToDate : null,
                      );
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
              <button
                className="customers-clear-filters"
                onClick={clearFilters}
                type="button"
              >
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
          columns={customerColumns}
          emptyMessage="No customers found for the selected filters."
          onSort={(key) =>
            setSortKey((current) => (current === key ? null : key))
          }
          rows={filteredRows}
          sortKey={sortKey}
        />
      </section>
    </DashboardFrame>
  );
};

const escapeCsvValue = (value: string) => `"${value.replace(/"/g, '""')}"`;

const getExportRows = (rows: CustomerRow[]) =>
  rows.map((row) => [
    row.clientType,
    row.clientId,
    row.userId,
    row.customerName,
    row.processStatus,
    row.eventDate,
    row.eventTime,
    row.collateralValue,
    row.eligibleDp,
    row.lender,
    row.collateralClass,
    row.emailId,
    row.phoneNumber,
    row.signupDate,
    row.source,
  ]);

const triggerDownload = (
  content: BlobPart,
  fileName: string,
  mimeType: string,
) => {
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

const downloadCsvFile = (rows: CustomerRow[]) => {
  const csvLines = [
    exportColumns.join(","),
    ...getExportRows(rows).map((row) => row.map(escapeCsvValue).join(",")),
  ];

  triggerDownload(
    `\ufeff${csvLines.join("\n")}`,
    "customers-export.csv",
    "text/csv;charset=utf-8;",
  );
};

const downloadExcelFile = (rows: CustomerRow[]) => {
  const tableRows = getExportRows(rows)
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${cell.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</td>`).join("")}</tr>`,
    )
    .join("");

  const excelContent = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
      <head>
        <meta charset="UTF-8" />
      </head>
      <body>
        <table>
          <thead>
            <tr>${exportColumns.map((column) => `<th>${column}</th>`).join("")}</tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      </body>
    </html>
  `;

  triggerDownload(
    excelContent,
    "customers-export.xls",
    "application/vnd.ms-excel",
  );
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
          return (
            <span
              key={`empty-${index}`}
              className="customers-mini-calendar-cell is-empty"
            />
          );
        }

        const inRange = day >= rangeStart && day <= rangeEnd;
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
