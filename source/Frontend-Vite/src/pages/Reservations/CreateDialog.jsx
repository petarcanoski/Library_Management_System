import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from "@mui/material";

const CreateDialog = ({ open, onClose, onCreate, isbn, setIsbn }) => {
    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
            <DialogTitle className="font-bold text-lg">
                Create New Reservation
            </DialogTitle>

            <DialogContent>
                <p className="text-gray-600 mb-3 text-sm">
                    Enter the <strong>ISBN</strong> of the book you want to reserve.
                </p>

                <TextField
                    label="Book ISBN"
                    variant="outlined"
                    fullWidth
                    value={isbn}
                    onChange={(e) => setIsbn(e.target.value)}
                    placeholder="9780134685991"
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button
                    onClick={onCreate}
                    variant="contained"
                    color="primary"
                    disabled={!isbn.trim()}
                >
                    Reserve
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateDialog;
