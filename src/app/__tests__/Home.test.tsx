import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Home from '../page';

// Mock API call
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({
    data: {
      suitableDays: [
        {
          date: "Monday, January 1",
          tempC: 20,
          tempF: 68,
          humidity: 50,
          windSpeed: 5,
          precipitation: 0,
          weatherDescription: "clear sky",
          isSuitable: true
        }
      ]
    }
  }))
}));

describe('Home Component', () => {
  it('renders correctly', () => {
    render(<Home />);
    expect(screen.getByText('Can I play Badminton this week?')).toBeInTheDocument();
  });

  it('fetches and displays weather data', async () => {
    render(<Home />);
    
    fireEvent.change(screen.getByPlaceholderText('City'), { target: { value: 'New York' }});
    fireEvent.change(screen.getByPlaceholderText('State'), { target: { value: 'NY' }});
    fireEvent.click(screen.getByText('Check Weather'));
    
    expect(await screen.findByText('Monday, January 1')).toBeInTheDocument();
    expect(screen.getByText('Temperature: 20°C / 68.0°F')).toBeInTheDocument();
  });
});