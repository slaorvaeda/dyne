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
  filtersLoading = false,
  onStartDateChange,
  onEndDateChange,
  onCategoryChange,
  onRegionChange,
}) {
  const filterControlSx = {
    minWidth: 180,
    width: 180,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "background.paper",
      "& .MuiSelect-select": { py: 1.25 },
    },
  };

  const startDay = startDate ? dayjs(startDate) : null;
  const endDay = endDate ? dayjs(endDate) : null;

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 4 }}>
      <DatePicker
        label="Start Date"
        value={startDay}
        maxDate={endDay ?? undefined}
        onChange={(d) => onStartDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", sx: { minWidth: 160, width: 160 } } }}
      />
      <DatePicker
        label="End Date"
        value={endDay}
        minDate={startDay ?? undefined}
        onChange={(d) => onEndDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", sx: { minWidth: 160, width: 160 } } }}
      />
      <FormControl size="small" sx={filterControlSx} disabled={filtersLoading}>
        <InputLabel id="filter-category-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
          value={category || ""}
          label="Category"
          onChange={(e) => onCategoryChange(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {categories.filter((c) => c != null && String(c).trim()).map((c) => {
            const v = String(c).trim();
            return (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
      <FormControl size="small" sx={filterControlSx} disabled={filtersLoading}>
        <InputLabel id="filter-region-label">Region</InputLabel>
        <Select
          labelId="filter-region-label"
          value={region || ""}
          label="Region"
          onChange={(e) => onRegionChange(e.target.value || null)}
        >
          <MenuItem value="">All</MenuItem>
          {regions.filter((r) => r != null && String(r).trim()).map((r) => {
            const v = String(r).trim();
            return (
              <MenuItem key={v} value={v}>
                {v}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  );
}
