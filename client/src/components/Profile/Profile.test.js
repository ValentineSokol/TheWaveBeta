import React from 'react';
import fetcher from '../../utils/fetcher';
import ReactDOM from 'react-dom';
import { render } from '@testing-library/react';

import Profile from "./Profile";

describe('Displays user profile', () => {
    beforeEach(() => {
      jest.mock('../../utils/fetcher');
      const resp = {
          username: 'Vallion',
      };
      fetcher.mockResolvedValue(resp);

    });
    it('renders correctkt')
}