import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  Add as AddIcon,
  Folder as FolderIcon,
  FolderOpen as FolderOpenIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../../components/DataTable";
import {
  createGenre,
  deleteGenre,
  fetchActiveGenres,
  updateGenre,
  searchGenres,
} from "../../../store/features/genres/genreThunk";
import GenereForm from "./GenereForm";
import GenereState from "./GenereState";


export default function AdminGenresPage() {
  const dispatch = useDispatch();
  const { genres, loading } = useSelector((state) => state.genres);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    code:"",
    name: "",
    description: "",
    displayOrder:null,
    parentId: null,
  });

  useEffect(() => {
    loadGenres();
  }, []);

  const loadGenres = () => {
    dispatch(fetchActiveGenres());
  };

  // Handle search with debouncing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(searchTerm.trim());
      } else {
        loadGenres();
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSearch = async (term) => {
    try {
      await dispatch(
        searchGenres({
          term,
          page: 0,
          size: 100,
          sortBy: "displayOrder",
          sortDir: "ASC",
        })
      ).unwrap();
    } catch (error) {
      console.error("Error searching genres:", error);
    }
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    loadGenres();
  };

  const handleOpenDialog = (genre = null) => {
    if (genre) {
      setEditingGenre(genre);
      setFormData({
        code: genre.code || "",
        name: genre.name,
        description: genre.description || "",
        displayOrder: genre.displayOrder || null,
        parentId: genre.parentId || null,
      });
    } else {
      setEditingGenre(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        displayOrder: null,
        parentId: null,
      });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingGenre(null);
  };

  const handleSubmit = async () => {
    try {
      if (editingGenre) {
        await dispatch(
          updateGenre({ id: editingGenre.id, genreData: formData })
        ).unwrap();
      } else {
        await dispatch(createGenre(formData)).unwrap();
      }
      handleCloseDialog();
      loadGenres();
    } catch (error) {
      console.error("Error saving genre:", error);
    }
  };

  const handleDelete = async (genre) => {
    if (
      window.confirm(
        `Delete genre "${genre.name}"? This will also affect child genres.`
      )
    ) {
      try {
        await dispatch(deleteGenre(genre.id)).unwrap();
        loadGenres();
      } catch (error) {
        console.error("Error deleting genre:", error);
      }
    }
  };

  const getRootGenres = () => {
    return (genres || []).filter((g) => !g.parentId);
  };


  const columns = [
    {
      field: "name",
      headerName: "Genre Name",
      minWidth: 200,
      renderCell: (row) => (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {row.parentId ? (
            <FolderIcon color="action" />
          ) : (
            <FolderOpenIcon color="primary" />
          )}
          <Typography
            variant="body2"
            sx={{ fontWeight: row.parentId ? 400 : 600 }}
          >
            {row.name}
          </Typography>
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      minWidth: 250,
    },
    // {
    //   field: "parentName",
    //   headerName: "Parent Genre",
    //   renderCell: (row) =>
    //     row.parentId ? (
    //       <Chip
    //         label={genres?.find((g) => g.id === row.parentId)?.name || "N/A"}
    //         size="small"
    //       />
    //     ) : (
    //       <Chip label="Root" size="small" color="primary" variant="outlined" />
    //     ),
    // },
    {
      field: "bookCount",
      headerName: "Books",
      align: "center",
      renderCell: (row) => (
        <Chip
          label={row.bookCount || 0}
          size="small"
          color="info"
          variant="outlined"
        />
      ),
    },
    {
      field: "active",
      headerName: "Status",
      renderCell: (row) => (
        <Chip
          label={row.active ? "Active" : "Inactive"}
          color={row.active ? "success" : "default"}
          size="small"
        />
      ),
    },
  ];

  return (
    <Box>
      {/* Page Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            Genres Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage book categories and sub-categories
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          }}
        >
          Add Genre
        </Button>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search genres by name or code..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: searchTerm && (
              <InputAdornment position="end">
                <IconButton
                  size="small"
                  onClick={handleClearSearch}
                  edge="end"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              backgroundColor: "background.paper",
            },
          }}
        />
      </Box>

      {/* Stats */}
      <GenereState getRootGenres={getRootGenres} genres={genres} />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={genres || []}
        loading={loading}
        onEdit={handleOpenDialog}
        onDelete={handleDelete}
      />

      {/* Add/Edit Dialog */}
      <GenereForm
        dialogOpen={dialogOpen}
        handleCloseDialog={handleCloseDialog}
        editingGenre={editingGenre}
        formData={formData}
        setFormData={setFormData}
        handleSubmit={handleSubmit}
        getRootGenres={getRootGenres}
      />
    </Box>
  );
}
