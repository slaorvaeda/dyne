"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { clearError, clearUploadResult } from "@/store/slices/salesSlice";

export default function GlobalSnackbar() {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.sales.error);
  const upload = useSelector((state) => state.sales.upload);
  const loading = useSelector((state) => state.sales.loading.upload);

  const isSuccess = upload.recordsInserted != null && !upload.error && !loading;
  const message = isSuccess
    ? upload.replaced
      ? `Existing data replaced. ${upload.recordsInserted} records inserted.`
      : `File processed successfully. ${upload.recordsInserted} records inserted.`
    : error || upload.error;
  const open = Boolean(message);

  const handleClose = () => {
    if (isSuccess) dispatch(clearUploadResult());
    else {
      dispatch(clearError());
      dispatch(clearUploadResult());
    }
  };

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(handleClose, 6000);
    return () => clearTimeout(t);
  }, [open]);

  return (
    <Snackbar
      open={open}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      autoHideDuration={6000}
    >
      <Alert
        onClose={handleClose}
        severity={isSuccess ? "success" : "error"}
        variant="filled"
        className="w-full"
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
