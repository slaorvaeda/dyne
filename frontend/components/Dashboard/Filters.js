"use client";

import { Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

export default function Filters({
  startDate,
  endDate,
  category,
  region,
  categories = [],
  regions = [],
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onRegionChange,
}) {
  return (
    <Box className="flex flex-wrap gap-4 items-center mb-4">
      <DatePicker
        label="Start Date"
        value={startDate ? dayjs(startDate) : null}
        onChange={(d) => onStartDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", className: "min-w-[160px]" } }}
      />
      <DatePicker
        label="End Date"
        value={endDate ? dayjs(endDate) : null}
        onChange={(d) => onEndDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", className: "min-w-[160px]" } }}
      />
      <FormControl size="small" className="min-w-[180px]">
        <InputLabel>Category</InputLabel>
        <Select
          value={category || ""}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl size="small" className="min-w-[180px]">
        <InputLabel>Region</InputLabel>
        <Select
          value={region || ""}
          label="Region"
          onChange={(e) => onRegionChange(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {regions.map((r) => (
            <MenuItem key={r} value={r}>
              {r}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
