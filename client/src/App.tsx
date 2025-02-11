import { lazy, Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

import Loading from "@/pages/Loading.tsx";
import NotFound from "@/pages/NotFound";
import SignIn from "@/pages/SignIn.tsx";
import SignUp from "@/pages/SignUp.tsx";

import { useMediaQuery } from "@/hooks/common/useMediaQuery";

import { denamuAscii } from "@/constants/denamuAscii.ts";

import { useMediaStore } from "@/store/useMediaStore";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const Home = lazy(() => import("@/pages/Home"));
const Admin = lazy(() => import("@/pages/Admin"));
const AboutService = lazy(() => import("@/pages/AboutService"));

const queryClient = new QueryClient();

export default function App() {
  const setIsMobile = useMediaStore((state) => state.setIsMobile);
  const isMobile = useMediaQuery("(max-width: 767px)");

  useEffect(() => {
    console.log(denamuAscii);
  }, []);

  useEffect(() => {
    setIsMobile(isMobile);
  }, [isMobile]);

  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route
          path="/"
          element={
            <Suspense fallback={<Loading />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<Loading />}>
              <Admin />
            </Suspense>
          }
        />
        <Route
          path="/about"
          element={
            <Suspense fallback={<Loading />}>
              <AboutService />
            </Suspense>
          }
        />
        <Route
          path="/signin"
          element={
            <Suspense fallback={<Loading />}>
              <SignIn />
            </Suspense>
          }
        />
        <Route
          path="/signup"
          element={
            <Suspense fallback={<Loading />}>
              <SignUp />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense fallback={<Loading />}>
              <NotFound />
            </Suspense>
          }
        />
      </Routes>
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
}
