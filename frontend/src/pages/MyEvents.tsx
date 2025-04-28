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
} from '@mui/material';
import { format } from 'date-fns';
import { eventService } from '../services/api';
import { Event } from '../types';

const MyEvents: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const data = await eventService.getMyEvents();
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch my events:', error);
      }
    };

    fetchMyEvents();
  }, []);

  const handleCancelRegistration = async (eventId: string) => {
    try {
      const updatedEvent = await eventService.cancelRegistration(eventId);
      setEvents(events.filter(event => event._id !== eventId));
    } catch (error) {
      console.error('Failed to cancel registration:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        My Registered Events
      </Typography>
      {events.length === 0 ? (
        <Typography variant="body1" color="textSecondary">
          You haven't registered for any events yet.
        </Typography>
      ) : (
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
                <Button
                  size="small"
                  color="secondary"
                  onClick={() => handleCancelRegistration(event._id)}
                >
                  Cancel Registration
                </Button>
              </CardActions>
            </Card>
          ))}
        </Stack>
      )}
    </Container>
  );
};

export default MyEvents; 