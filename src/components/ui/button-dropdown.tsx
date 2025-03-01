"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";


export default function ButtonDropDown({
  options,
  children
}: {
  options: { label: string; description: string; onClick?: () => void }[];
  children: React.ReactNode;
}) {
  const [selectedIndex, setSelectedIndex] = useState("0");

  return (
    <div className="divide-primary-foreground/30 inline-flex divide-x rounded-md shadow-xs rtl:space-x-reverse">
      <Button className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10">
        {children}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="rounded-none shadow-none first:rounded-s-md last:rounded-e-md focus-visible:z-10"
            size="icon"
            aria-label="Options"
          >
            <ChevronDownIcon  aria-hidden="true" className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="max-w-64 md:max-w-xs"
          side="bottom"
          sideOffset={4}
          align="end"
        >
          {options.map((option, index) => (
              <DropdownMenuRadioItem
                key={option.label}
                value={String(index)}
                className="items-start [&>span]:pt-1.5"
                onClick={option.onClick}
              >
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="text-slate-500 text-xs dark:text-slate-400">
                    {option.description}
                  </span>
                </div>
              </DropdownMenuRadioItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
