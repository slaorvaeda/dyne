"use client";

import { Box, Typography, Button } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

export default function MainContentHeader({
  title = "Dashboard",
  showSearch = true,
  showPeriod = true,
  showDownload = true,
}) {
  return (
    <Box className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-between gap-4 mb-6">
      <Typography variant="h5" fontWeight={700} color="text.primary" className="text-xl sm:text-2xl">
        {title}
      </Typography>
      <Box className="flex flex-col sm:flex-row items-stretch gap-3 flex-wrap w-full sm:w-auto">
        {showSearch && (
          <Box className="flex items-center rounded-full border border-gray-200 dark:border-gray-600 bg-gray-50/80 dark:bg-gray-800/50 pl-3 pr-2 py-1.5 min-w-full sm:min-w-[200px]">
            <SearchOutlinedIcon className="text-gray-500 dark:text-gray-400 mr-2 w-5 h-5" />
            <InputBase
              placeholder="Search"
              size="small"
              className="text-sm flex-1"
              inputProps={{ "aria-label": "search" }}
            />
          </Box>
        )}
        {showPeriod && (
          <FormControl size="small" className="min-w-full sm:min-w-[120px]">
            <Select value="week" displayEmpty className="rounded-xl">
              <MenuItem value="week">Last Week</MenuItem>
              <MenuItem value="month">Last Month</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
        )}
        {showDownload && (
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            className="rounded-xl font-semibold normal-case w-full sm:w-auto"
          >
            Download CSV
          </Button>
        )}
      </Box>
    </Box>
  );
}
