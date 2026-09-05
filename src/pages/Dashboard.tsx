import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { api, ApiError } from "../api/client";
import type { ProjectSummary } from "../api/types";
import { useAuth } from "../auth/AuthContext";

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const loadProjects = useCallback(async () => {
    try {
      setProjects(await api.listProjects());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Projecten laden mislukt");
    }
  }, []);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const openCreateDialog = () => {
    setNewProjectName("");
    setDialogOpen(true);
  };

  const handleCreate = async () => {
    const name = newProjectName.trim();
    if (!name) return;
    setCreating(true);
    setError(null);
    try {
      const project = await api.createProject(name);
      navigate(`/projects/${project.id}`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Project aanmaken mislukt");
      setCreating(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Mijn projecten
          </Typography>
          <Button variant="outlined" onClick={logout}>
            Uitloggen
          </Button>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Ingelogd als {user?.email}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {projects === null ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : projects.length === 0 ? (
          <Typography sx={{ mb: 2 }}>Je hebt nog geen projecten.</Typography>
        ) : (
          <List sx={{ mb: 2 }}>
            {projects.map((project) => (
              <ListItemButton
                key={project.id}
                onClick={() => navigate(`/projects/${project.id}`)}
                sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2, mb: 1 }}
              >
                <ListItemText
                  primary={project.name}
                  secondary={`Laatst opgeslagen: ${new Date(project.updatedAt).toLocaleString("nl-NL")}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}

        <Button variant="contained" onClick={openCreateDialog}>
          Nieuw project
        </Button>
      </Paper>

      <Dialog open={dialogOpen} onClose={() => !creating && setDialogOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Nieuw project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            margin="dense"
            label="Projectnaam"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && newProjectName.trim()) handleCreate();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} disabled={creating}>
            Annuleren
          </Button>
          <Button variant="contained" onClick={handleCreate} disabled={creating || !newProjectName.trim()}>
            Aanmaken
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
