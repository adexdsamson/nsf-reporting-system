/* eslint-disable @typescript-eslint/no-explicit-any */
import { MdDashboard } from "react-icons/md";
// import { RxHamburgerMenu } from "react-icons/rx";
// import Img from "../assets/react.svg";
// import { MdLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

// import { ComponentClass, ComponentProps, FunctionComponent } from "react";
// import { ConfirmAlert } from "@/components/layouts/ConfirmAlert";
import { IconType } from "react-icons/lib";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,  } from "@/components/ui/dropdown-menu";
import { ChevronUp, User2 } from "lucide-react";

type sideBarProps = {
  // isSidebarCollapsed: boolean;
  // showSidebarSm?: boolean;
};

type NavigationItem = {
  icon: IconType;
  title: string;
  to: string;
  active: boolean;
  isImage?: boolean;
};

export const SideBar = ({}: sideBarProps) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigation: NavigationItem[] = [
    {
      icon: MdDashboard,
      title: "Dashboard",
      to: "/dashboard/home",
      active: location.pathname === "/dashboard/home",
    },
    // {
    //   icon: MdDashboard,
    //   title: "",
    //   to: "",
    //   active: location.pathname === "/dashboard/home",
    // },
  ];

  return (
    <Sidebar collapsible="icon"  >
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.to}>
                      <item.icon />
                      {/* <span>{item.title}</span> */}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup />
        <SidebarGroup />
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> Username
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem onClick={() => navigate(-1)}>
                  <span>Back</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
