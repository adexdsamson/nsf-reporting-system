import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Ban,
  Check,
  Clock,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import { Fragment } from "react/jsx-runtime";

interface TransactionTrackerProps {
  steps: TransactionStepProps[];
}

export const TransactionTracker = ({ steps }: TransactionTrackerProps) => {
  return (
    <div className="space-y-1">
      {steps.map((step, index) => (
        <Fragment key={step.id}>
          <TransactionStep
            {...step}
            isLastStep={index === steps.length - 1}
            // onActionComplete={handleActionComplete}
          />

          {/* {index < [].length - 1 &&
            index % 2 === 0 && ( // Show bank transfer after every other step
              <BankTransfer
                sourceBankName={step.bankName}
                destinationBankName={step}
                transferAmount={Math.abs(step.amount)}
                currency={step.currency}
                // timestamp={filteredSteps[index + 1].timestamp}
                status={step.status}
                // isInterbank={
                //   step.bankName !== filteredSteps[index + 1].bankName
                // }
              />
            )} */}
        </Fragment>
      ))}
    </div>
  );
};

export interface TransactionStepProps {
  id: string;
  stepNumber: string;
  title: string;
  description: string;
  status: "pending" | "completed" | "action-required" | "warning";
  actionLabel?: string;
  bankName: string;
  accountNumber: string;
  amount: number;
  currency: string;
  timestamp: string;
  isLastStep?: boolean;
  remaining_balance: number;
  onActionComplete?: (id: string, action: string) => void;
}

const TransactionStep = ({
  accountNumber,
  amount,
  bankName,
  currency,
  description,
  id,
  status,
  stepNumber,
  timestamp,
  title,
  actionLabel,
  remaining_balance,
  onActionComplete,
}: TransactionStepProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusIcon = () => {
    switch (status) {
      case "completed":
        return <Check className="h-5 w-5 text-apple-green" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-apple-orange" />;
      case "action-required":
        return <Ban className="h-5 w-5 text-apple-red" />;
      case "pending":
      default:
        return <Clock className="h-5 w-5 text-apple-gray" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "completed":
        return "border-green-900/30 bg-green-900/10";
      case "warning":
        return "border-orange-900/30 bg-orange-900/10";
      case "action-required":
        return "border-red-900/30 bg-red-900/10";
      case "pending":
      default:
        return "border-gray-900/30 bg-gray-900/10";
    }
  };

  const formatAccountNumber = (acc: string) => {
    if (!acc) return "";
    // const last4 = acc.slice(-4);
    return acc  ///`****${last4}`;
  };

  console.log(getStatusColor())

  return (
    <div className="relative group">
      <div className="flex items-start gap-4 mb-1 space-y-3">
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border transition-all",
            getStatusColor()
          )}
        >
          {getStatusIcon()}
        </div>

        <Card
          className={cn(
            "w-full p-4 border transition-all cursor-pointer apple-card",
            isExpanded ? "shadow-md" : "shadow-sm",
            getStatusColor()
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xs text-apple-gray font-sf-text mb-1">
                  {stepNumber}
                </div>
                <h3 className="font-sf text-lg font-medium capitalize">{title}</h3>
              </div>
              <div className="flex items-center text-xs text-apple-gray space-x-1">
                <Clock className="h-3 w-3" />
                <span>{format(timestamp, "do MMMM yyyy hh:mm aaa")}</span>
              </div>
            </div>

            <p className="text-sm text-muted">{description}</p>

            {isExpanded && (
              <div className={cn("mt-3 space-y-3 animate-slide-down")}>
                <div className="bg-secondary/30 rounded-lg p-3 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Bank:</span>
                    <span className="text-sm font-medium">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Account Number:</span>
                    <span className="text-sm font-medium">
                      {formatAccountNumber(accountNumber)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted">Amount:</span>
                    <span
                      className={cn(
                        "text-sm font-medium",
                        amount < 0 ? "text-apple-red" : "text-apple-green"
                      )}
                    >
                      {amount < 0 ? "-" : "+"}
                      {currency} {Math.abs(amount).toLocaleString()}
                    </span>
                  </div>
                  {remaining_balance && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted">
                        Current Balance:
                      </span>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          amount < 0 ? "text-apple-red" : "text-apple-green"
                        )}
                      >
                        {currency} {Math.abs(remaining_balance).toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                {actionLabel && status === "action-required" && (
                  <div className="flex justify-end">
                    <Button
                      variant={
                        actionLabel.includes("PND") ? "destructive" : "default"
                      }
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onActionComplete?.(id, "pnd-placed");
                      }}
                      className={cn("animate-pulse-soft")}
                    >
                      {"Has PND Placed?"}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* {!isLastStep && (
        <div className="ml-4 pl-0 relative">
          <div className="transaction-connector left-4 -translate-x-1/2 top-8 h-12"></div>
          <div className="flex items-center ml-3 my-1 text-apple-gray text-xs">
            <ArrowRight className="h-3.5 w-3.5 mr-1" />
            <span>Transfer</span>
          </div>
        </div>
      )} */}
    </div>
  );
};

interface BankTransferProps {
  sourceBankName: string;
  destinationBankName: string;
  transferAmount: number;
  currency: string;
  timestamp: string;
  status: "pending" | "completed" | "failed" | "action-required";
  isInterbank: boolean;
}

export const BankTransfer: React.FC<BankTransferProps> = ({
  sourceBankName,
  destinationBankName,
  transferAmount,
  currency,
  timestamp,
  status = "completed",
  isInterbank = true,
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case "pending":
        return <RefreshCw className="h-4 w-4 text-apple-orange animate-spin" />;
      case "failed":
        return <AlertCircle className="h-4 w-4 text-apple-red" />;
      case "completed":
      default:
        return <ArrowRight className="h-4 w-4 text-apple-blue" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "border-apple-orange/30 bg-apple-orange/5";
      case "failed":
        return "border-apple-red/30 bg-apple-red/5";
      case "completed":
      default:
        return "border-apple-blue/30 bg-apple-blue/5";
    }
  };

  return (
    <Card
      className={cn(
        "p-3 my-2 mx-6 w-auto border transition-all cursor-default",
        getStatusColor(),
        "apple-card"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-1.5 rounded shadow-sm">
            <div className="font-sf-text text-xs font-semibold text-apple-gray">
              {sourceBankName}
            </div>
          </div>

          <div className="flex flex-col items-center">
            {getStatusIcon()}
            {isInterbank && (
              <ExternalLink className="h-3 w-3 text-apple-gray mt-1" />
            )}
          </div>

          <div className="bg-white p-1.5 rounded shadow-sm">
            <div className="font-sf-text text-xs font-semibold text-apple-gray">
              {destinationBankName}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end">
          <div className="font-sf-mono text-sm font-medium">
            {currency} {transferAmount.toLocaleString()}
          </div>
          <div className="text-xs text-apple-gray">{timestamp}</div>
        </div>
      </div>
    </Card>
  );
};
