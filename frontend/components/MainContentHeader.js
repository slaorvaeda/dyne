"use client";

import { Box, Typography, Button, alpha } from "@mui/material";
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
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "center" },
        justifyContent: "space-between",
        gap: 2,
        mb: 3,
      }}
    >
      <Typography variant="h5" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>
        {title}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "stretch",
          gap: 1.5,
          flexWrap: "wrap",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        {showSearch && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              bgcolor: (t) => alpha(t.palette.action.hover, 0.04),
              borderRadius: "9999px",
              border: "1px solid",
              borderColor: "divider",
              px: 1.5,
              py: 0.75,
              minWidth: { xs: "100%", sm: 200 },
            }}
          >
            <SearchOutlinedIcon sx={{ color: "text.secondary", mr: 1, fontSize: 20 }} />
            <InputBase placeholder="Search" size="small" sx={{ fontSize: "0.875rem", flex: 1 }} inputProps={{ "aria-label": "search" }} />
          </Box>
        )}
        {showPeriod && (
          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 120 } }}>
            <Select value="week" displayEmpty sx={{ borderRadius: 2 }}>
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
            fullWidth={false}
            sx={{ borderRadius: 2, fontWeight: 600, textTransform: "none", width: { xs: "100%", sm: "auto" } }}
          >
            Download CSV
          </Button>
        )}
      </Box>
    </Box>
  );
}
