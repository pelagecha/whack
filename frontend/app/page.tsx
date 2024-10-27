"use client";

import { DataProvider } from "@/components/DataContext";
import HomePage from "../components/HomePage";

export default function Page() {
    return (
        <DataProvider>
            <HomePage />
        </DataProvider>
    );
}
