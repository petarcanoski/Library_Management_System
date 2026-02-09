import { Chip } from "@mui/material";
import React from "react";
 export const columns = [
    {
      field: "coverImage",
      headerName: "Cover",
      renderCell: (row) => (
        <img
          src={row.coverImageUrl || "/placeholder-book.jpg"}
          alt={row.title}
          style={{ width: 40, height: 56, objectFit: "cover", borderRadius: 4 }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Title",
      minWidth: 200,
    },
    {
      field: "author",
      headerName: "Author",
      minWidth: 150,
    },
    {
      field: "isbn",
      headerName: "ISBN",
      minWidth: 120,
    },
    {
      field: "genreName",
      headerName: "Genre",
      renderCell: (row) => (
        <Chip
          label={row.genreName || "N/A"}
          size="small"
          color="primary"
          variant="outlined"
        />
      ),
    },
    {
      field: "totalCopies",
      headerName: "Total Copies",
      align: "center",
    },
    {
      field: "availableCopies",
      headerName: "Available",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.availableCopies}
          size="small"
          color={row.availableCopies > 0 ? "success" : "error"}
        />
      ),
    },
    
    {
      field: "publishedYear",
      headerName: "Year",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.publicationDate}
          size="small"
          color="default"
        />
      ),
    },
  ];