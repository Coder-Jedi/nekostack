// Currency API Service

import { apiClient } from '../client';
import { 
  CurrencyConversionRequest, 
  CurrencyConversionResponse, 
  Currency, 
  CurrencyRatesResponse 
} from '../types';

export const currencyService = {
  convert: async (request: CurrencyConversionRequest): Promise<CurrencyConversionResponse> => {
    const response = await apiClient.post<CurrencyConversionResponse>(
      'tools', 
      '/api/tools/unit-converter/currency', 
      request
    );
    return response.data;
  },

  getCurrencies: async (): Promise<Currency[]> => {
    const response = await apiClient.get<{ currencies: Currency[] }>(
      'tools', 
      '/api/tools/unit-converter/currency/list'
    );
    return response.data.currencies;
  },

  refreshRates: async (): Promise<CurrencyRatesResponse> => {
    const response = await apiClient.get<CurrencyRatesResponse>(
      'tools', 
      '/api/tools/unit-converter/currency/rates'
    );
    return response.data;
  }
};
