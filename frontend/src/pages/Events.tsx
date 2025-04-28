import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { format } from 'date-fns';
import { eventService } from '../services/api';
import { Event } from '../types';
import { useAuth } from '../contexts/AuthContext';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await eventService.getEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    };

    fetchEvents();
  }, []);

  const handleRegister = async (eventId: string) => {
    try {
      const updatedEvent = await eventService.registerForEvent(eventId);
      setEvents(events.map(event => 
        event._id === eventId ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to register for event:', error);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    try {
      const updatedEvent = await eventService.cancelRegistration(eventId);
      setEvents(events.map(event => 
        event._id === eventId ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to cancel registration:', error);
    }
  };

  const isRegistered = (event: Event) => {
    return event.participants.some(participant => participant._id === user?._id);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Upcoming Events
      </Typography>
      <Stack spacing={3}>
        {events.map((event) => (
          <Card key={event._id}>
            <CardContent>
              <Typography variant="h6" component="h2">
                {event.title}
              </Typography>
              <Typography color="textSecondary" gutterBottom>
                {format(new Date(event.date), 'PPP')}
              </Typography>
              <Typography variant="body2" component="p">
                {event.description}
              </Typography>
              <Box mt={2}>
                <Typography variant="body2" color="textSecondary">
                  Created by: {event.creator.username}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Participants: {event.participants.length}
                </Typography>
              </Box>
            </CardContent>
            <CardActions>
              {isRegistered(event) ? (
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleCancelRegistration(event._id)}
                >
                  Cancel Registration
                </Button>
              ) : (
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleRegister(event._id)}
                >
                  Register
                </Button>
              )}
            </CardActions>
          </Card>
        ))}
      </Stack>
    </Container>
  );
};

export default Events; 