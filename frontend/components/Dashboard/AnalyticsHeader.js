"use client";

import { Box, Typography, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import AssignmentIcon from "@mui/icons-material/Assignment";

export default function AnalyticsHeader({ title = "Analytics", startDate, endDate, onStartDateChange, onEndDateChange }) {
  const rangeLabel =
    startDate && endDate
      ? `${dayjs(startDate).format("DD")}-${dayjs(endDate).format("DD")} ${dayjs(endDate).format("MMMM")}`
      : "Select range";

  return (
    <Box className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <Typography variant="h4" fontWeight={700} color="text.primary" className="text-2xl sm:text-3xl">
        {title}
      </Typography>
      <Box className="flex items-center gap-4 flex-shrink-0">
        <DatePicker
          label={rangeLabel}
          value={startDate ? dayjs(startDate) : null}
          onChange={(d) => onStartDateChange(d ? d.format("YYYY-MM-DD") : null)}
          slotProps={{
            textField: {
              size: "small",
              className: "w-full min-w-[180px] max-w-[260px]",
            },
          }}
        />
        <Button
          variant="contained"
          startIcon={<AssignmentIcon />}
          className="rounded-xl font-semibold normal-case px-4"
        >
          Create Report
        </Button>
      </Box>
    </Box>
  );
}
