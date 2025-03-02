import { Button } from "@/components/ui/button";
import ButtonDropDown from "@/components/ui/button-dropdown";
import {
  GET_TRANSACTION,
  GET_BACKWARD_TRACING,
  GET_FORWARD_TRACING,
} from "@/lib/graphql/schema";
import {
  transformSingleTransaction,
  transformTransactionData,
} from "@/lib/transforms/documentTransform";
import {
  cn,
  convertGraphQLResponseToForceGraph,
  convertGremlinPathToD3Tree,
  convertToGremlinPath,
  getFormatCurrency,
  parseGremlinOutput,
  transformTransactions,
} from "@/lib/utils";
import { ApiResponseError, TransactionData } from "@/types";
import { useQuery } from "@apollo/client";
import { format } from "date-fns";
import {
  Receipt,
  User,
  Building,
  Wallet,
  CreditCard,
  Gift,
  Smartphone,
  ChevronLeft,
  MapPin,
} from "lucide-react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ForceGraph } from "@/components/layouts/ForceGraph";
import { TidyTree } from "@/components/layouts/TidyTree";
import { ScoreCard } from "@/components/ui/score-card";
import { useMutation } from "@tanstack/react-query";
import { postRequest } from "@/lib/axiosInstance";
import { useToastHandlers } from "@/hooks/useToaster";
import { GraphqlTransactionData } from "@/demo";

export const TransactionDetail = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState<
    "backwardTrace" | "forwardTrace" | "details"
  >("details");
  const location = useLocation();
  const handler = useToastHandlers();

  const options = [
    {
      label: "Backward",
      description:
        "Uncover hidden connections and suspicious patterns, which are critical for maintaining transparency and strengthening risk management.",
      onClick: () => {
        setPage("backwardTrace");
      },
    },
    {
      label: "Forward",
      description:
        "Uncover complex money trails, detect suspicious activities, supports anti-money laundering (AML) efforts",
      onClick: () => {
        setPage("forwardTrace");
      },
    },
  ];

  const pndMutation = useMutation({
    mutationFn: async (payload: { bank_id: string; transaction_id: string }) =>
      await postRequest("", payload, {
        baseURL: "https://blockuseraccount-rxoxcx73la-uc.a.run.app",
      }),
    onSuccess: (data) => {
      console.log(data);
      handler.success("Account PND", "PND has been placed successfully");
    },
    onError: (error) => {
      console.log(error);
      handler.error(
        "Account PND",
        (error as ApiResponseError) ?? "PND has failed to be placed"
      );
    },
  });

  // Keep the initial query to fetch first data
  const { loading: initialLoading, data } = useQuery(GET_TRANSACTION, {
    variables: { id: location.state?.id },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
  });

  const transformedData = transformSingleTransaction(data) as TransactionData;

  const backwardTracingQuery = useQuery(GET_BACKWARD_TRACING, {
    variables: {
      depth: 3,
      timestamp: transformedData?.timestamp,
      accountNumber: transformedData?.receiver_account_number?.toString?.(),
    },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    skip: !transformedData?.transaction_id,
  });

  const forwardTracingQuery = useQuery(GET_FORWARD_TRACING, {
    variables: {
      depth: 3,
      timestamp: transformedData?.timestamp,
      accountNumber: transformedData?.sender_account_number?.toString?.(),
    },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first", // Used for subsequent executions
    skip: !transformedData?.transaction_id,
  });

  type BackwardTraceTransactionProps = {
    traceTransactionBackward: TransactionData[];
  };
  type ForwardTraceTransactionProps = {
    traceTransactionForward: TransactionData[];
  };

  const defaultForward: ForwardTraceTransactionProps = {
    traceTransactionForward: [],
  };
  const defaultBackward: BackwardTraceTransactionProps = {
    traceTransactionBackward: [],
  };

  return (
    <div className="p-8 h-full w-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-2">
          <Button variant={"ghost"} size={"icon"} onClick={() => navigate(-1)}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Transaction Detail</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={"destructive"}
            isLoading={pndMutation.isPending}
            onClick={() =>
              pndMutation.mutate({
                bank_id: transformedData?.bank_id,
                transaction_id: transformedData?.transaction_id,
              })
            }
          >
            Place PND
          </Button>
          <ButtonDropDown options={options}>Tracing</ButtonDropDown>
        </div>
      </div>

      {initialLoading ? (
        <Placeholder />
      ) : page === "details" ? (
        <TransactionContent {...{ transaction: transformedData }} />
      ) : page === "backwardTrace" ? (
        <BackwardTraceContent
          {...{
            // transactions:
            //   transformTransactionData(
            //     backwardTracingQuery.data ?? defaultBackward,
            //     "traceTransactionBackward"
            //   ) as TransactionData[],
            transactions: GraphqlTransactionData,
            goBack: () => setPage("details"),
          }}
        />
      ) : page === "forwardTrace" ? (
        <ForwardTraceContent
          {...{
            transactions: transformTransactionData(
              forwardTracingQuery.data ?? defaultForward,
              "traceTransactionForward"
            ),
            goBack: () => setPage("details"),
          }}
        />
      ) : null}
    </div>
  );
};

type ContainerDetailProps = {
  shouldExpand?: boolean;
  title: string;
  children?: React.ReactNode;
  disableIcon?: boolean;
  icon?: React.ReactNode;
};

const ContainerDetail = ({
  shouldExpand,
  title,
  children,
  disableIcon,
  icon,
}: ContainerDetailProps) => {
  return (
    <div
      className={cn(
        "border rounded-xl p-5 bg-white shadow-sm aspect-square lg:aspect-auto",
        { "lg:col-span-2": shouldExpand }
      )}
    >
      <div className="flex items-center gap-3">
        {!disableIcon && (
          <div className="h-12 w-12 bg-gray-300 rounded-full grid place-items-center">
            {icon}
          </div>
        )}

        <h5 className="font-semibold ">{title}</h5>
      </div>

      <div className="mt-5">{children}</div>
    </div>
  );
};

const Placeholder = () => {
  return (
    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 animate-pulse">
      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div>
        <div className="w-full h-6 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 bg-gray-200 rounded mb-1 w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
};

type ContentItemProps = {
  value: string;
  title: string;
  shouldExpand?: boolean;
};

const ContentItem = ({ value, title, shouldExpand }: ContentItemProps) => {
  return (
    <div className={cn("flex flex-col gap-1", { "col-span-2": shouldExpand })}>
      <p className="text-wrap break-words">{value}</p>
      <p className="text-muted-foreground text-sm">{title}</p>
    </div>
  );
};

type TransactionContentProps = {
  transaction: TransactionData;
};

const TransactionContent = ({ transaction }: TransactionContentProps) => {
  const formatted = getFormatCurrency(transaction?.transaction_amount ?? 0);

  return (
    <div className="my-10 pb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <ContainerDetail
        shouldExpand
        title="Basic Information"
        icon={<Receipt className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10 px-4">
          <ContentItem
            title="Transaction ID"
            value={transaction?.transaction_id}
          />
          <ContentItem
            title="Transaction Currency"
            value={transaction?.transaction_currency}
          />
          <ContentItem title="Transaction Amount" value={formatted} />

          <ContentItem
            title="Transaction Timestamp"
            value={format(
              transaction?.transaction_time_stamp ?? "12/05/1994",
              "do MMMM yyyy"
            )}
          />
          <ContentItem
            title="Transfer Session ID"
            value={transaction?.transfer_session_id ?? ""}
          />
          <ContentItem
            title="Transfer Type"
            value={transaction?.transfer_type ?? ""}
          />
          <ContentItem
            title="Transaction Description"
            value={transaction?.transaction_description}
          />
          {/* <ContentItem title="Transaction Type" value={transaction.tran} /> */}
        </div>
      </ContainerDetail>
      <ContainerDetail
        title="Bank Information"
        icon={<Building className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-10 px-4">
          <ContentItem
            title="Bank Name"
            shouldExpand
            value={transaction?.bank_name}
          />

          <ContentItem title="Bank ID" value={transaction?.bank_id ?? ""} />
          <ContentItem title="Bank Code" value={transaction?.bank_code ?? ""} />
          <ContentItem
            title="Destination Sort Code"
            value={transaction?.destination_sortcode ?? ""}
          />
          <ContentItem
            title="Sender Sort Code"
            value={transaction?.sortcode_bank_location ?? ""}
          />
        </div>
      </ContainerDetail>

      <ScoreCard
        title="Rules Score"
        score={transaction?.rule_score}
        description="A risk assessment score based on predefined security rules and transaction patterns. Ranges from 0-100, where higher scores indicate lower risk levels and better compliance with security policies."
      />
      <ScoreCard
        title="AI Score"
        score={transaction?.ai_score}
        description="An advanced machine learning-based risk evaluation that analyzes transaction patterns, user behavior, and historical data. Scores range from 0-100, with higher scores suggesting legitimate transaction patterns."
      />
      <ScoreCard
        title="Overall Score"
        score={transaction?.overall_score}
        description="A comprehensive risk assessment combining both rule-based and AI analysis. Scores above 70 indicate normal transactions, 40-70 suggest moderate risk requiring review, and below 40 may indicate potential fraud."
      />

      <ContainerDetail
        title="Sender Address"
        icon={<MapPin className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-10 px-4">
          <ContentItem
            title="Address"
            shouldExpand
            value={transaction?.address}
          />
          <ContentItem title="City" value={transaction?.city} />
          <ContentItem title="zip_code" value={transaction?.zip_code} />

          <ContentItem title="Country" value={transaction?.country} />
        </div>
      </ContainerDetail>
      <ContainerDetail
        shouldExpand
        title="Sender Information"
        icon={<User className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10 px-4">
          <ContentItem
            title="First Name"
            value={transaction?.first_name ?? "--"}
          />

          <ContentItem
            title="Last Name"
            value={transaction?.last_name ?? "--"}
          />
          <ContentItem
            title="Middle Name"
            value={transaction?.middle_name ?? "--"}
          />
          <ContentItem title="Username" value={transaction?.username ?? "--"} />
          <ContentItem
            title="Email Address"
            value={transaction?.email ?? "--"}
          />
          <ContentItem
            title="Phone Number"
            value={transaction?.phone_number ?? "--"}
          />
          <ContentItem
            title="Account Number"
            value={transaction?.sender_account_number?.toString?.() ?? "--"}
          />
          <ContentItem
            title="Account Balance"
            value={
              getFormatCurrency(transaction?.sender_account_balance) ?? "--"
            }
          />
          <ContentItem
            title="Nationality"
            value={transaction?.nationality ?? "--"}
          />
          <ContentItem
            title="Biometric Verification Number"
            value={transaction?.bvn_number ?? ""}
          />
        </div>
      </ContainerDetail>

      <ContainerDetail
        shouldExpand
        title="Receiver Information"
        icon={<User className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10 px-4">
          <ContentItem
            title="Receiver Name"
            value={transaction?.receiver_account_name ?? "--"}
          />

          <ContentItem
            title="Receiver Bank Name"
            value={transaction?.receiver_bank_name ?? "--"}
          />
          <ContentItem
            title="Receiver Account"
            value={transaction?.receiver_account_number?.toString?.() ?? "--"}
          />
          <ContentItem
            title="Receiver coordinate (Latitude)"
            value={
              transaction?.receiver_location?.latitude?.toString?.() ?? "--"
            }
          />
          <ContentItem
            title="Receiver coordinate (Longitude)"
            value={
              transaction?.receiver_location?.longitude?.toString?.() ?? "--"
            }
          />
          <ContentItem
            title="Receiver Bank Code"
            value={transaction?.receiver_bank_code ?? "--"}
          />
        </div>
      </ContainerDetail>
      <ContainerDetail
        title="Wallet Information"
        icon={<Wallet className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-10 px-4">
          <ContentItem
            title="Wallet ID"
            shouldExpand
            value={transaction?.wallet_id ?? "--"}
          />
          <ContentItem
            title="Wallet Currency"
            value={transaction?.wallet_currency ?? "--"}
          />
          <ContentItem
            title="Wallet Transaction ID"
            value={transaction?.wallet_transaction_id ?? "--"}
          />

          <ContentItem
            title="Wallet Balance Before"
            value={transaction?.wallet_balance_before ?? "--"}
          />

          <ContentItem
            title="Wallet Balance After"
            value={transaction?.wallet_balance_after ?? "--"}
          />
        </div>
      </ContainerDetail>

      <ContainerDetail
        title="Gift Card Information"
        icon={<Gift className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-1 items-start lg:grid-cols-2 gap-10 px-4">
          <ContentItem
            title="Gift Card ID"
            value={transaction?.gift_card_id ?? "--"}
          />
          <ContentItem
            title="Gift Card Provider"
            value={transaction?.gift_card_provider ?? "--"}
          />
          <ContentItem
            title="Gift Card Currency"
            value={transaction?.gift_card_currency ?? "--"}
          />
          <ContentItem
            title="Gift Card Transaction ID"
            value={transaction?.gift_card_transaction_id ?? "--"}
          />

          <ContentItem
            title="Gift Card Balance Before"
            value={transaction?.gift_card_balance_before ?? "--"}
          />

          <ContentItem
            title="Gift Card Balance After"
            value={transaction?.gift_card_balance_after ?? "--"}
          />
        </div>
      </ContainerDetail>
      <ContainerDetail
        shouldExpand
        title="Card Information"
        icon={<CreditCard className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10 px-4">
          <ContentItem
            title="Full Name"
            value={transaction?.card_fullname ?? "--"}
          />

          <ContentItem title="Last 4" value={transaction?.card_last4 ?? "--"} />
          <ContentItem title="Bin" value={transaction?.card_bin ?? "--"} />
          <ContentItem title="Type" value={transaction?.card_type ?? "--"} />
          <ContentItem title="Hash" value={transaction?.card_hash ?? "--"} />
          <ContentItem
            title="CVV Result"
            value={transaction?.cvv_result ?? "--"}
          />
          <ContentItem
            title="Country"
            shouldExpand
            value={transaction?.card_country ?? "--"}
          />
        </div>
      </ContainerDetail>

      <ContainerDetail
        shouldExpand
        title="Device Information"
        icon={<Smartphone className="w-5 h-5 text-gray-500" />}
      >
        <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10 px-4">
          <ContentItem
            title="IP Address"
            value={transaction?.ip_address ?? "--"}
          />

          <ContentItem
            title="Device ID"
            value={transaction?.device_os ?? "--"}
          />

          <ContentItem
            title="Browser Name"
            value={transaction?.browser_name ?? "--"}
          />
          <ContentItem title="Brand ID" value={transaction?.brand_id ?? "--"} />
          <ContentItem
            title="Device ID"
            value={transaction?.device_id ?? "--"}
          />
          <ContentItem
            title="Device Type"
            value={transaction?.device_type ?? "--"}
          />
          <ContentItem
            title="Password Hash"
            value={transaction?.password_hash ?? "--"}
          />
          <ContentItem
            title="Device Hash"
            value={transaction?.device_hash ?? "--"}
          />
          <ContentItem
            title="Cookie Hash"
            value={transaction?.cookie_hash ?? "--"}
          />
          <ContentItem
            title="Browser Hash"
            value={transaction?.browser_hash ?? "--"}
          />
        </div>
      </ContainerDetail>
      <ContainerDetail title="" disableIcon />
    </div>
  );
};

type BackwardTraceContentProps<T> = {
  goBack: () => void;
  transactions: T;
};

const BackwardTraceContent = <T = unknown,>({
  goBack,
  transactions,
}: BackwardTraceContentProps<T>) => {
  const [activeGraph, setActiveGraph] = useState("2D");

  const data = convertGraphQLResponseToForceGraph(transactions as any);

  const gremilinString = convertToGremlinPath(transactions as any);
  const treeData = convertGremlinPathToD3Tree(gremilinString);


  return (
    <>
      <div className="flex items-center justify-between">
        <Button variant={"ghost"} size={"icon"} onClick={goBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <ToggleButton active={activeGraph} onClick={setActiveGraph} />
      </div>

      <div className="bg-slate-900 rounded-lg mt-4 h-[600px] w-full">
        {activeGraph === "2D" ? (
          <TidyTree data={treeData} />
        ) : (
          <ForceGraph data={data} />
        )}
      </div>
    </>
  );
};

type ForwardTraceContentProps = {
  goBack: () => void;
};

const ForwardTraceContent = ({ goBack }: ForwardTraceContentProps) => {
  const [activeGraph, setActiveGraph] = useState("2D");

  const data = {
    nodes: [
      { id: "node1", label: "Project A", group: 1 },
      { id: "node2", label: "Project B", group: 2 },
      { id: "node3", label: "Project C", group: 1 },
      { id: "node4", label: "Project D", group: 2 },
      { id: "node5", label: "Project E", group: 1 },
    ],
    links: [
      { source: "node1", target: "node2" },
      { source: "node2", target: "node3" },
      { source: "node3", target: "node4" },
      { source: "node1", target: "node5" },
      { source: "node5", target: "node3" },
    ],
  };

  const treeData = {
    name: "flare",
    children: [
      {
        name: "analytics",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "animate",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "data",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "display",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "flex",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "physics",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "query",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "scale",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
      {
        name: "util",
        children: [
          { name: "cluster", size: 123 },
          { name: "graph", size: 123 },
          { name: "optimization", size: 123 },
        ],
      },
    ],
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <Button variant={"ghost"} size={"icon"} onClick={goBack}>
          <ChevronLeft className="w-5 h-5" />
        </Button>

        <ToggleButton active={activeGraph} onClick={setActiveGraph} />
      </div>

      <div className="bg-slate-900 rounded-lg mt-4 h-[600px] w-full">
        {activeGraph === "2D" ? (
          <TidyTree data={treeData} />
        ) : (
          <ForceGraph data={data} />
        )}
      </div>
    </>
  );
};

function ToggleButton({
  active,
  onClick,
}: {
  active: string;
  onClick: (value: string) => void;
}) {
  return (
    <div className="inline-flex -space-x-px rounded-lg shadow-sm shadow-black/5 rtl:space-x-reverse">
      <Button
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant={active === "2D" ? "default" : "outline"}
        size="icon"
        aria-label="2D"
        onClick={() => onClick("2D")}
      >
        <span>2D</span>
      </Button>
      <Button
        className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
        variant={active === "3D" ? "default" : "outline"}
        size="icon"
        aria-label="3D"
        onClick={() => onClick("3D")}
      >
        <span>3D</span>
      </Button>
    </div>
  );
}
