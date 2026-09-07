import { useState, type FormEvent } from "react";
import { Link as RouterLink, useNavigate, useSearchParams } from "react-router-dom";
import { Alert, Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../auth/AuthContext";
import { ApiError } from "../api/client";

export function ResetPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("De wachtwoorden komen niet overeen");
      return;
    }
    setSubmitting(true);
    try {
      await resetPassword(token, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Wachtwoord wijzigen mislukt");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ py: 10 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
          Nieuw wachtwoord instellen
        </Typography>

        {!token ? (
          <Alert severity="error">
            Deze link is onvolledig. Vraag een{" "}
            <Link component={RouterLink} to="/forgot-password">
              nieuwe link
            </Link>{" "}
            aan.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField
              label="Nieuw wachtwoord"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoFocus
              inputProps={{ minLength: 8 }}
              helperText="Minimaal 8 tekens"
            />
            <TextField
              label="Herhaal wachtwoord"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
            <Button type="submit" variant="contained" disabled={submitting}>
              Wachtwoord opslaan
            </Button>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login">
                Terug naar inloggen
              </Link>
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
}
