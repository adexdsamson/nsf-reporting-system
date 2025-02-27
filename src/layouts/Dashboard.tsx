import Container from "@/components/layouts/Container";
import { Outlet } from "react-router-dom";
import { SideBar } from "./Sidebar";
// import { Header } from "./Header";
import { SidebarProvider } from "@/components/ui/sidebar";
// import { useEffect, useState } from "react";

export const Dashboard = () => {
  // const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  // const [show, setShow] = useState<boolean>(false);
  // const [showSideBarOnSM, setShowSideBarOnSM] = useState<boolean>(false); // Corrected variable name

  return (
    <Container
      noGutter
      fullWidth
      fullHeight
      display="flex"
      defaultOpen={false}
      className="overflow-x-hidden overflow-y-auto dark:bg-slate-950 bg-[#F7F9FE] relative"
      as={SidebarProvider}
    >
        <SideBar />
        <main className="w-full">
          <Outlet />
        </main>
    </Container>
  );
};
