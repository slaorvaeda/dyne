"use client";

import { useRef, useState } from "react";
import { Box, Typography, Button, FormControlLabel, Checkbox } from "@mui/material";
import PostAddIcon from "@mui/icons-material/PostAdd";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { uploadSales, setError } from "@/store/slices/salesSlice";

export default function AnalyticsPageHeader({ title = "Analytics" }) {
  const dispatch = useDispatch();
  const uploadLoading = useSelector((state) => state.sales.loading.upload);
  const fileInputRef = useRef(null);
  const [replaceExisting, setReplaceExisting] = useState(true);

  const handleUploadClick = () => fileInputRef.current?.click();
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const valid = /\.(csv|xlsx|xls)$/i.test(file.name);
    if (!valid) {
      dispatch(setError("Only CSV, XLSX, and XLS files are allowed."));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      dispatch(setError("File is too large (max 10MB)."));
      e.target.value = "";
      return;
    }
    dispatch(uploadSales({ file, replace: replaceExisting }));
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
        <FormControlLabel
          control={
            <Checkbox
              checked={replaceExisting}
              onChange={(e) => setReplaceExisting(e.target.checked)}
              size="small"
              color="primary"
            />
          }
          label={<Typography variant="body2" color="text.secondary">Replace existing data</Typography>}
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
