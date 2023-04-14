import axios from 'axios';
import { sepolia } from '../models/Chain';



export class TransactionService {

  static API_URL =  'https://deep-index.moralis.io/api/v2';
  static API_KEY =  'JcUexJAfAw4qrD0uAvytzhpVnzQQs0eyVEf6WE9zLV2XSeDmQDEt5ENJ6kh7sPa0';
 
  static async getTransactions(address: string, limit: number) {
    const options = {
      method: 'GET',
      url: `${TransactionService.API_URL}/${address}`,
      params: {
        chain: sepolia.name.toLowerCase(),
        limit: limit
      },
      headers: {accept: 'application/json', 'X-API-Key': TransactionService.API_KEY}
    };
    
    const response = await axios.request(options);
    return response;
  }
  
}