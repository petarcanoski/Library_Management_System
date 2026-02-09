import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Checkbox,
  IconButton,
  Tooltip,
  Chip,
  Box,
  Typography,
  CircularProgress,
  alpha,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";

export default function DataTable({
  columns,
  data,
  loading = false,
  selectable = false,
  selected = [],
  onSelectAll,
  onSelectOne,
  onEdit,
  onDelete,
  onView,
  page = 0,
  rowsPerPage = 10,
  totalRows = 0,
  onPageChange,
  onRowsPerPageChange,
  actions = true,
  emptyMessage = "No data available",
  customActions,
}) {
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      const newSelected = data.map((row) => row.id);
      onSelectAll && onSelectAll(newSelected);
    } else {
      onSelectAll && onSelectAll([]);
    }
  };

  const handleSelectOne = (id) => {
    onSelectOne && onSelectOne(id);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  const renderCellContent = (row, column) => {
    const value = row[column.field];

    if (column.renderCell) {
      return column.renderCell(row);
    }

    if (column.type === "chip") {
      const chipProps = column.getChipProps ? column.getChipProps(value) : {};
      return <Chip label={value} size="small" {...chipProps} />;
    }

    if (column.type === "date") {
      return new Date(value).toLocaleDateString();
    }

    if (column.type === "currency") {
      return `$${parseFloat(value).toFixed(2)}`;
    }

    return value;
  };

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        borderRadius: 2,
      }}
    >
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={
                      selected.length > 0 && selected.length < data.length
                    }
                    checked={data.length > 0 && selected.length === data.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
              )}
              {columns.map((column) => (
                <TableCell
                  key={column.field}
                  align={column.align || "left"}
                  sx={{
                    fontWeight: 700,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    minWidth: column.minWidth,
                  }}
                >
                  {column.headerName}
                </TableCell>
              ))}
              {(actions || customActions) && (
                <TableCell
                  align="center"
                  sx={{
                    fontWeight: 700,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions || customActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions || customActions ? 1 : 0)
                  }
                  align="center"
                  sx={{ py: 8 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {emptyMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row) => {
                const isItemSelected = isSelected(row.id);
                return (
                  <TableRow
                    key={row.id}
                    hover
                    selected={isItemSelected}
                    sx={{
                      "&:hover": {
                        bgcolor: (theme) =>
                          alpha(theme.palette.primary.main, 0.04),
                      },
                    }}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          onChange={() => handleSelectOne(row.id)}
                        />
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={column.field}
                        align={column.align || "left"}
                      >
                        {renderCellContent(row, column)}
                      </TableCell>
                    ))}
                    {(actions || customActions) && (
                      <TableCell align="center">
                        {customActions ? (
                          customActions(row)
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              gap: 0.5,
                              justifyContent: "center",
                            }}
                          >
                            {onView && (
                              <Tooltip title="View">
                                <IconButton
                                  size="small"
                                  onClick={() => onView(row)}
                                  color="info"
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onEdit && (
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  onClick={() => onEdit(row)}
                                  color="primary"
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                            {onDelete && (
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  onClick={() => onDelete(row)}
                                  color="error"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Box>
                        )}
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {totalRows > 0 && (
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      )}
    </Paper>
  );
}
