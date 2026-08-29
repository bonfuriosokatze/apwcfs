// API client for forecast data
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getForecast(lat: number, lon: number, hours: number = 72) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/forecast?lat=${lat}&lon=${lon}&hours=${hours}`
    );
    if (!response.ok) throw new Error('Failed to fetch forecast');
    return response.json();
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
}

export async function getForecastForLocation(locationName: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/forecast/location/${locationName}`
    );
    if (!response.ok) throw new Error('Failed to fetch forecast for location');
    return response.json();
  } catch (error) {
    console.error('Error fetching forecast for location:', error);
    throw error;
  }
}

export async function getXAIExplanation(forecastId: string) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/xai/explanation/${forecastId}`
    );
    if (!response.ok) throw new Error('Failed to fetch XAI explanation');
    return response.json();
  } catch (error) {
    console.error('Error fetching XAI explanation:', error);
    throw error;
  }
}
