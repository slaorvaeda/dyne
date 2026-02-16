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
  const filterControlSx = {
    minWidth: 180,
    width: 180,
    "& .MuiOutlinedInput-root": {
      borderRadius: "10px",
      bgcolor: "background.paper",
      "& .MuiSelect-select": { py: 1.25 },
    },
  };

  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 4 }}>
      <DatePicker
        label="Start Date"
        value={startDate ? dayjs(startDate) : null}
        onChange={(d) => onStartDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", sx: { minWidth: 160, width: 160 } } }}
      />
      <DatePicker
        label="End Date"
        value={endDate ? dayjs(endDate) : null}
        onChange={(d) => onEndDateChange(d ? d.format("YYYY-MM-DD") : null)}
        slotProps={{ textField: { size: "small", sx: { minWidth: 160, width: 160 } } }}
      />
      <FormControl size="small" sx={filterControlSx}>
        <InputLabel id="filter-category-label">Category</InputLabel>
        <Select
          labelId="filter-category-label"
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
      <FormControl size="small" sx={filterControlSx}>
        <InputLabel id="filter-region-label">Region</InputLabel>
        <Select
          labelId="filter-region-label"
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
