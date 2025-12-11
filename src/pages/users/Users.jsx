import React, { useState, useEffect } from "react";

import {
  Box,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Skeleton,
  Modal,
  Button,
  Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

import { Link } from "react-router-dom";

import axios from "../../services/axiosConfig";
import {
  userListEndpoint,
  userUpdateDeleteEndpoint,
  sentLinkToChangePassword,
} from "../../services/api_services";

import "../../style/users.scss";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [loading, setLoading] = useState(false);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSendLinkModal, setShowSendLinkModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [userToSendLink, setUserToSendLink] = useState(null);

  // Fetch Users
  const fetchUsers = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get(userListEndpoint, { params: { page } });
      const results = response.data?.data || [];
      setUsers(results);
      setHasNextPage(results.length > 0);
    } catch {
      console.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Delete User
  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(userUpdateDeleteEndpoint(userToDelete.id));
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
    } catch {
      console.error("Delete failed");
    }
    setShowDeleteModal(false);
  };

  // Send Password Reset Link
  const handleSendLinkConfirm = async () => {
    try {
      await axios.post(sentLinkToChangePassword, {
        email: userToSendLink.email,
      });
    } catch {
      console.error("Sending failed");
    }
    setShowSendLinkModal(false);
  };

  return (
    <Box
      sx={{
        width: "100% !important",
        maxWidth: "100% !important",
        overflowX: "hidden",
      }}
    >
      <Grid
        container
        sx={{
          width: "100% !important",
          maxWidth: "100% !important",
        }}
      >
        <Grid
          item
          xs={12}
          sx={{
            width: "100% !important",
            maxWidth: "100% !important",
          }}
        >
          <TableContainer
            component={Paper}
            sx={{
              borderRadius: 3,
              width: "100% !important",
              maxWidth: "100% !important",
            }}
          >
            <Table
              sx={{
                width: "100% !important",
                tableLayout: "auto",
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                      <TableCell>
                        <Skeleton />
                      </TableCell>
                    </TableRow>
                  ))
                ) : users.length > 0 ? (
                  users.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{
                        transition: "0.2s",
                        "&:hover": { background: "#f7f7f7" },
                      }}
                    >
                      <TableCell>{row.fullname}</TableCell>
                      <TableCell>{row.email}</TableCell>
                      <TableCell>{row.phone}</TableCell>
                      <TableCell>{row.role_name}</TableCell>

                      <TableCell align="center">
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            component={Link}
                            to={`/user/${row.id}`}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Send Reset Link">
                          <IconButton
                            color="success"
                            onClick={() => {
                              setUserToSendLink(row);
                              setShowSendLinkModal(true);
                            }}
                          >
                            <SendIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => {
                              setUserToDelete(row);
                              setShowDeleteModal(true);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        {/* Pagination */}
        {users.length === 10 && (
          <Grid
            item
            xs={12}
            mt={2}
            display="flex"
            justifyContent="center"
            gap={2}
            sx={{ width: "100%" }}
          >
            <Button
              variant="outlined"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
            >
              ‹ Previous
            </Button>

            <Box
              className="pagination_page_indicator"
              px={2}
              py={1}
            >
              Page {currentPage}
            </Box>

            <Button
              variant="outlined"
              disabled={!hasNextPage}
              onClick={() => setCurrentPage((p) => p + 1)}
            >
              Next ›
            </Button>
          </Grid>
        )}
      </Grid>

      {/* Delete Modal */}
      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box className="mui-modal">
          <Typography variant="h6" fontWeight={700}>
            Confirm Delete
          </Typography>

          <Typography mt={1}>
            Delete user <strong>{userToDelete?.fullname}</strong>?
          </Typography>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteConfirm}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Send Link Modal */}
      <Modal
        open={showSendLinkModal}
        onClose={() => setShowSendLinkModal(false)}
      >
        <Box className="mui-modal">
          <Typography variant="h6" fontWeight={700}>
            Send Password Reset Link
          </Typography>

          <Typography mt={1}>
            Send to <strong>{userToSendLink?.email}</strong>?
          </Typography>

          <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={() => setShowSendLinkModal(false)}>Cancel</Button>
            <Button variant="contained" onClick={handleSendLinkConfirm}>
              Send
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
