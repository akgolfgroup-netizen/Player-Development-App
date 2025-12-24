import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
import BevisContainer from '../BevisContainer';
import apiClient from '../../../services/apiClient';

// Mock the API client
jest.mock('../../../services/apiClient');

// Test wrapper
const TestWrapper = ({ children }) => (
  <BrowserRouter>{children}</BrowserRouter>
);

const mockVideos = [
  {
    id: 'v1',
    title: 'Driver sving - januar 2025',
    type: 'swing',
    category: 'Driving',
    date: '2025-01-18',
    duration: '0:45',
    thumbnail: null,
    verified: true,
    coachNote: 'Mye bedre tempo enn sist!',
    tags: ['driver', 'tempo', 'forbedring'],
  },
  {
    id: 'v2',
    title: 'Bunkerslag teknikk',
    type: 'drill',
    category: 'Kortspill',
    date: '2025-01-15',
    duration: '1:20',
    thumbnail: null,
    verified: false,
    coachNote: null,
    tags: ['bunker', 'sand', 'teknikk'],
  },
  {
    id: 'v3',
    title: 'Putting rutine',
    type: 'routine',
    category: 'Putting',
    date: '2025-01-12',
    duration: '0:30',
    thumbnail: null,
    verified: true,
    coachNote: 'God rutine!',
    tags: ['putting', 'rutine'],
  },
];

describe('BevisContainer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should show loading state initially', () => {
    apiClient.get.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 1000))
    );

    render(<BevisContainer />, { wrapper: TestWrapper });

    expect(screen.getByText(/Laster videoer/i)).toBeInTheDocument();
  });

  it('should fetch and display video proofs', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(apiClient.get).toHaveBeenCalledWith('/video-proofs');
    });

    // Check if videos are displayed
    await waitFor(() => {
      expect(screen.getByText('Driver sving - januar 2025')).toBeInTheDocument();
      expect(screen.getByText('Bunkerslag teknikk')).toBeInTheDocument();
      expect(screen.getByText('Putting rutine')).toBeInTheDocument();
    });
  });

  it('should display stats correctly', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      // Total videos
      expect(screen.getByText('3')).toBeInTheDocument();
      expect(screen.getByText('Totalt')).toBeInTheDocument();

      // Verified count (2 out of 3)
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Verifisert')).toBeInTheDocument();

      // Videos with feedback (2 out of 3)
      expect(screen.getByText('Med feedback')).toBeInTheDocument();
    });
  });

  it('should filter videos by category', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Driver sving - januar 2025')).toBeInTheDocument();
    });

    // Click on Kortspill category
    const kortspillButton = screen.getByRole('button', { name: 'Kortspill' });
    fireEvent.click(kortspillButton);

    // Should only show Kortspill videos
    expect(screen.getByText('Bunkerslag teknikk')).toBeInTheDocument();
    expect(screen.queryByText('Driver sving - januar 2025')).not.toBeInTheDocument();
    expect(screen.queryByText('Putting rutine')).not.toBeInTheDocument();
  });

  it('should search videos by title and tags', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Driver sving - januar 2025')).toBeInTheDocument();
    });

    // Search for "putting"
    const searchInput = screen.getByPlaceholderText(/Sok i videoer/i);
    fireEvent.change(searchInput, { target: { value: 'putting' } });

    // Should only show putting videos
    await waitFor(() => {
      expect(screen.getByText('Putting rutine')).toBeInTheDocument();
      expect(screen.queryByText('Driver sving - januar 2025')).not.toBeInTheDocument();
      expect(screen.queryByText('Bunkerslag teknikk')).not.toBeInTheDocument();
    });
  });

  it('should show error message on API failure', async () => {
    apiClient.get.mockRejectedValue({
      message: 'Network error',
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/kunne ikke laste videoer/i)).toBeInTheDocument();
      expect(screen.getByText(/viser demo-data/i)).toBeInTheDocument();
    });

    // Should still render with fallback data
    expect(screen.getByText('Totalt')).toBeInTheDocument();
  });

  it('should show upload card', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: [] },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Last opp video')).toBeInTheDocument();
      expect(screen.getByText(/MP4, MOV/i)).toBeInTheDocument();
    });
  });

  it('should show upload button in header', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      const uploadButton = screen.getByRole('button', { name: /Last opp/i });
      expect(uploadButton).toBeInTheDocument();
    });
  });

  it('should show verified badge on verified videos', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      // Check for CheckCircle icon presence (verified videos)
      const driverVideo = screen.getByText('Driver sving - januar 2025');
      expect(driverVideo).toBeInTheDocument();
    });
  });

  it('should show coach notes when available', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Mye bedre tempo enn sist!/i)).toBeInTheDocument();
      expect(screen.getByText(/God rutine!/i)).toBeInTheDocument();
    });
  });

  it('should reset filter when clicking "Alle"', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: mockVideos },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText('Driver sving - januar 2025')).toBeInTheDocument();
    });

    // Filter to Putting
    const puttingButton = screen.getByRole('button', { name: 'Putting' });
    fireEvent.click(puttingButton);

    expect(screen.queryByText('Driver sving - januar 2025')).not.toBeInTheDocument();

    // Click "Alle" to reset
    const alleButton = screen.getByRole('button', { name: 'Alle' });
    fireEvent.click(alleButton);

    // Should show all videos again
    expect(screen.getByText('Driver sving - januar 2025')).toBeInTheDocument();
    expect(screen.getByText('Bunkerslag teknikk')).toBeInTheDocument();
    expect(screen.getByText('Putting rutine')).toBeInTheDocument();
  });

  it('should show empty state when no videos found', async () => {
    apiClient.get.mockResolvedValue({
      data: { data: [] },
    });

    render(<BevisContainer />, { wrapper: TestWrapper });

    await waitFor(() => {
      expect(screen.getByText(/Ingen videoer funnet/i)).toBeInTheDocument();
    });
  });
});
