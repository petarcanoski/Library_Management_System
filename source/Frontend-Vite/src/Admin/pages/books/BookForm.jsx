import { Close, Upload, Image as ImageIcon, CloudUpload } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  styled,
  Paper,
} from "@mui/material";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBook,
  updateBook,
} from "../../../store/features/books/bookThunk";
import { useEffect } from "react";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";

// Styled component for custom upload button
const UploadButton = styled(Paper)(({ theme, isDragActive }) => ({
  padding: theme.spacing(3),
  border: `2px dashed ${isDragActive ? theme.palette.primary.main : theme.palette.divider}`,
  borderRadius: theme.spacing(2),
  textAlign: 'center',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  backgroundColor: isDragActive ? theme.palette.action.hover : 'transparent',
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const BookForm = ({
  dialogOpen,
  editingBook,
  setEditingBook,
  setDialogOpen,
  book
}) => {
  const dispatch = useDispatch();
  const { activeGenres } = useSelector((state) => state.genres);

  const [formData, setFormData] = useState({
    isbn: "",
    title: "",
    author: "",
    genreId: "",
    publisher: "",
    publicationDate: "",
    language: "",
    pages: "",
    description: "",
    totalCopies: 1,
    availableCopies: 1,
    price: "",
    coverImageUrl: "",
    active: true,
  });

  const [isDragActive, setIsDragActive] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingBook(null);
    setUploadError(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadImage(file);
  };

  const uploadImage = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const imageUrl = await uploadToCloudinary(file);
      if (imageUrl) {
        setFormData({ ...formData, coverImageUrl: imageUrl });
      } else {
        setUploadError('Failed to upload image. Please try again.');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragActive(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await uploadImage(file);
    }
  };

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await dispatch(
          updateBook({ id: editingBook.id, bookData: formData })
        ).unwrap();
      } else {
        await dispatch(createBook(formData)).unwrap();
      }
      handleCloseDialog();
      //   loadBooks();
    } catch (error) {
      console.error("Error saving book:", error);
    }
  };

  useEffect(() => {
    if (book) {
      setEditingBook(book);
      setFormData({
        isbn: book.isbn || "",
        title: book.title || "",
        author: book.author || "",
        genreId: book.genreId || "",
        publisher: book.publisher || "",
        publicationDate: book.publicationDate || "",
        language: book.language || "",
        pages: book.pages || "",
        description: book.description || "",
        totalCopies: book.totalCopies || 1,
        availableCopies: book.availableCopies || 1,
        price: book.price || "",
        coverImageUrl: book.coverImageUrl || "",
        active: book.active !== undefined ? book.active : true,
      });
    } else {
      setEditingBook(null);
      setFormData({
        isbn: "",
        title: "",
        author: "",
        genreId: "",
        publisher: "",
        publicationDate: "",
        language: "",
        pages: "",
        description: "",
        totalCopies: 1,
        availableCopies: 1,
        price: "",
        coverImageUrl: "",
        active: true,
      });
    }
  }, [book]);

//   console.log("Editing Book:", editingBook);

  return (
    <Dialog
      open={dialogOpen}
      onClose={handleCloseDialog}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {editingBook ? "Edit Book" : "Add New Book"}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          {/* ISBN */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="ISBN"
              value={formData.isbn}
              onChange={(e) =>
                setFormData({ ...formData, isbn: e.target.value })
              }
              required
              placeholder="978-3-16-148410-0"
            />
          </Grid>

          {/* Title */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </Grid>

          {/* Author */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Author"
              value={formData.author}
              onChange={(e) =>
                setFormData({ ...formData, author: e.target.value })
              }
              required
            />
          </Grid>

          {/* Genre */}
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth required>
              <InputLabel>Genre</InputLabel>
              <Select
                value={formData.genreId}
                onChange={(e) =>
                  setFormData({ ...formData, genreId: e.target.value })
                }
                label="Genre"
              >
                <MenuItem value="">
                  <em>Select a genre</em>
                </MenuItem>
                {activeGenres?.map((genre) => (
                  <MenuItem key={genre.id} value={genre.id}>
                    {genre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          {/* Publisher */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Publisher"
              value={formData.publisher}
              onChange={(e) =>
                setFormData({ ...formData, publisher: e.target.value })
              }
            />
          </Grid>

          {/* Publication Date */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Publication Date"
              type="date"
              value={formData.publicationDate}
              onChange={(e) =>
                setFormData({ ...formData, publicationDate: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>

          {/* Language */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Language"
              value={formData.language}
              onChange={(e) =>
                setFormData({ ...formData, language: e.target.value })
              }
              placeholder="English"
            />
          </Grid>

          {/* Pages */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Pages"
              type="number"
              value={formData.pages}
              onChange={(e) =>
                setFormData({ ...formData, pages: parseInt(e.target.value) || "" })
              }
              inputProps={{ min: 0 }}
            />
          </Grid>

          {/* Price */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) || "" })
              }
              inputProps={{ min: 0, step: 0.01 }}
            />
          </Grid>

          {/* Total Copies */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Total Copies"
              type="number"
              value={formData.totalCopies}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalCopies: parseInt(e.target.value) || 1,
                })
              }
              required
              helperText="Total number of copies in inventory"
              inputProps={{ min: 1 }}
            />
          </Grid>

          {/* Available Copies */}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Available Copies"
              type="number"
              value={formData.availableCopies}
              onChange={(e) => {
                const available = parseInt(e.target.value) || 0;
                const total = formData.totalCopies;
                setFormData({
                  ...formData,
                  availableCopies: available > total ? total : available,
                });
              }}
              required
              helperText="Copies currently available for checkout"
              inputProps={{ max: formData.totalCopies, min: 0 }}
            />
          </Grid>

          {/* Description */}
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </Grid>

          {/* Cover Image Upload - Custom Upload Button */}
          <Grid size={{ xs: 12 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Cover Image
            </Typography>

            <input
              type="file"
              id="cover-image-upload"
              hidden
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
            />

            {!formData.coverImageUrl ? (
              <label htmlFor="cover-image-upload">
                <UploadButton
                  elevation={0}
                  isDragActive={isDragActive}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  sx={{ cursor: uploading ? 'not-allowed' : 'pointer' }}
                >
                  {uploading ? (
                    <Box>
                      <CircularProgress size={40} sx={{ mb: 2 }} />
                      <Typography variant="body1" color="text.secondary">
                        Uploading...
                      </Typography>
                    </Box>
                  ) : (
                    <Box>
                      <CloudUpload sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        Click to upload or drag and drop
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        PNG, JPG, JPEG up to 5MB
                      </Typography>
                    </Box>
                  )}
                </UploadButton>
              </label>
            ) : (
              <Box
                sx={{
                  position: 'relative',
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box
                  component="img"
                  src={formData.coverImageUrl}
                  alt="Book Cover Preview"
                  sx={{
                    width: '100%',
                    maxHeight: 400,
                    objectFit: 'contain',
                    backgroundColor: 'grey.100',
                  }}
                />
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => setFormData({ ...formData, coverImageUrl: '' })}
                    sx={{ boxShadow: 2 }}
                  >
                    Remove
                  </Button>
                  <label htmlFor="cover-image-upload">
                    <Button
                      size="small"
                      variant="contained"
                      component="span"
                      startIcon={<Upload />}
                      sx={{ boxShadow: 2 }}
                    >
                      Replace
                    </Button>
                  </label>
                </Box>
              </Box>
            )}

            {uploadError && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {uploadError}
              </Alert>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCloseDialog} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background: "linear-gradient(45deg, #667eea 30%, #764ba2 90%)",
          }}
        >
          {editingBook ? "Update" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BookForm;
