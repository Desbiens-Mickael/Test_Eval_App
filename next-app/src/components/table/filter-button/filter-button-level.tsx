"use client";

import LevelLayout from "../../level-layout";
import { levelData } from "@/app/(protected)/admin/card-game/data";

import { Column } from "@tanstack/react-table";
import DataTAbleBUttonFilter from "../data-table-button-filter";

interface FilterBUttonLevelProps<TData, TValue> {
  column: Column<TData, TValue> | undefined;
}

export default function FilterBUttonLevel<TData, TValue>({ column }: FilterBUttonLevelProps<TData, TValue>) {
  return <DataTAbleBUttonFilter column={column} title="Niveau" templateComponent={LevelLayout} data={levelData} />;
}
