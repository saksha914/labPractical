import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { eventService } from '../services/api';

const validationSchema = yup.object({
  title: yup
    .string()
    .min(3, 'Title should be of minimum 3 characters length')
    .required('Title is required'),
  description: yup
    .string()
    .min(10, 'Description should be of minimum 10 characters length')
    .required('Description is required'),
  date: yup
    .date()
    .min(new Date(), 'Event date must be in the future')
    .required('Date is required'),
});

const CreateEvent: React.FC = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      date: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        await eventService.createEvent({
          ...values,
          date: new Date(values.date).toISOString(),
        });
        navigate('/');
      } catch (error) {
        console.error('Failed to create event:', error);
      }
    },
  });

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Create New Event
          </Typography>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              id="title"
              name="title"
              label="Title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
              margin="normal"
            />
            <TextField
              fullWidth
              id="description"
              name="description"
              label="Description"
              multiline
              rows={4}
              value={formik.values.description}
              onChange={formik.handleChange}
              error={formik.touched.description && Boolean(formik.errors.description)}
              helperText={formik.touched.description && formik.errors.description}
              margin="normal"
            />
            <TextField
              fullWidth
              id="date"
              name="date"
              label="Event Date"
              type="datetime-local"
              value={formik.values.date}
              onChange={formik.handleChange}
              error={formik.touched.date && Boolean(formik.errors.date)}
              helperText={formik.touched.date && formik.errors.date}
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Create Event
            </Button>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateEvent; 