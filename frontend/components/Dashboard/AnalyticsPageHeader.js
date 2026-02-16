"use client";

import { useRef } from "react";
import { Box, Typography, Button } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { uploadSales } from "@/store/slices/salesSlice";

export default function AnalyticsPageHeader({ title = "Analytics" }) {
  const dispatch = useDispatch();
  const uploadLoading = useSelector((state) => state.sales.loading.upload);
  const fileInputRef = useRef(null);

  const handleUploadClick = () => fileInputRef.current?.click();
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!valid) return;
    dispatch(uploadSales(file));
    e.target.value = "";
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        justifyContent: "space-between",
        alignItems: { xs: "flex-start", md: "center" },
        mb: 2,
        gap: 2,
      }}
    >
      <Typography variant="h4" fontWeight={700} color="text.primary" sx={{ fontSize: { xs: "1.75rem", md: "2rem" } }}>
        {title}
      </Typography>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Button
          variant="outlined"
          startIcon={<CloudUploadIcon />}
          onClick={handleUploadClick}
          disabled={uploadLoading}
          sx={{
            borderRadius: "9999px",
            fontWeight: 600,
            textTransform: "none",
            px: 2.5,
            py: 1.25,
            borderColor: "divider",
            color: "text.primary",
            "&:hover": { borderColor: "primary.main", bgcolor: "action.hover" },
          }}
        >
          {uploadLoading ? "Uploading…" : "Upload CSV/Excel"}
        </Button>
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
