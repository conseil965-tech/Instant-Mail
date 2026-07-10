/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import axios from 'axios';
import { Domain, Account, Message } from '../types';

const API_BASE = 'https://api.mail.tm';

const api = axios.create({
  baseURL: API_BASE,
});

export const mailTmService = {
  async getDomains(): Promise<Domain[]> {
    const res = await api.get('/domains');
    return res.data['hydra:member'];
  },

  async createAccount(address: string, password: string): Promise<Account> {
    const res = await api.post('/accounts', { address, password });
    return res.data;
  },

  async getToken(address: string, password: string): Promise<string> {
    const res = await api.post('/token', { address, password });
    return res.data.token;
  },

  async getMessages(token: string): Promise<Message[]> {
    const res = await api.get('/messages', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data['hydra:member'];
  },

  async getMessage(id: string, token: string): Promise<Message> {
    const res = await api.get(`/messages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
  },

  async deleteAccount(id: string, token: string): Promise<void> {
    await api.delete(`/accounts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
