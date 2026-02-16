"use client";

import { Box, Typography, Button } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PostAddIcon from "@mui/icons-material/PostAdd";

export default function AnalyticsPageHeader({
  title = "Analytics",
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) {
  const rangeLabel =
    startDate && endDate
      ? `${dayjs(startDate).format("DD")}-${dayjs(endDate).format("DD")} ${dayjs(endDate).format("MMMM")}`
      : "01-24 September";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        mb: 6,
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <DatePicker
          value={startDate ? dayjs(startDate) : dayjs().subtract(1, "month")}
          onChange={(d) => onStartDateChange(d ? d.format("YYYY-MM-DD") : null)}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                minWidth: 200,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "9999px",
                  bgcolor: "background.paper",
                  color: "text.primary",
                  "& .MuiInputBase-input": { color: "text.primary" },
                  "& .MuiInputLabel-root": { color: "text.secondary" },
                },
              },
            },
          }}
          slots={{ openPickerIcon: CalendarMonthIcon }}
        />
        <Button
          variant="contained"
          startIcon={<PostAddIcon />}
          sx={{
            borderRadius: "9999px",
            fontWeight: 600,
            textTransform: "none",
            px: 3,
            py: 1.5,
            boxShadow: "0 4px 14px rgba(59, 130, 246, 0.4)",
          }}
        >
          Create Report
        </Button>
      </Box>
    </Box>
  );
}
