import React, { useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { checkEmail } from '../utils/checkEmail';

const TestEmail: React.FC = () => {
  const [email, setEmail] = useState('meghanakolanuvada7@gmail.com');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testEmail = async () => {
    setLoading(true);
    try {
      const response = await checkEmail(email);
      setResult(response);
    } catch (error) {
      setResult({ error: 'Failed to check email' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Email Check
      </Typography>
      
      <TextField
        fullWidth
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        onClick={testEmail}
        disabled={loading}
      >
        Check Email
      </Button>

      {result && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body1">
            Result: {JSON.stringify(result, null, 2)}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default TestEmail;
