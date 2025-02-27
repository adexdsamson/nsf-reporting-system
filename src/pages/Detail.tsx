import ButtonDropDown from "@/components/ui/button-dropdown";
import { Receipt } from "lucide-react";

const options = [
  {
    label: "Backward",
    description:
      "The 6 commits from this branch will be combined into one commit in the base branch.",
  },
  {
    label: "Forward",
    description:
      "The 6 commits from this branch will be rebased and added to the base branch.",
  },
  {
    label: "deep investigation",
    description:
      "The 6 commits from this branch will be rebased and added to the base branch.",
  },
];

export const TransactionDetail = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Transaction Detail</h1>
        <div className="flex gap-2">
          <ButtonDropDown options={options}>Tracing</ButtonDropDown>
        </div>
      </div>

      <div className="mt-10">
        <div className="border rounded-xl p-5 bg-white shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 bg-gray-300 rounded-full grid place-items-center">
                <Receipt className="w-5 h-5" />
            </div>

            <h5>Basic Information</h5>
          </div>


        </div>
      </div>
    </div>
  );
};
