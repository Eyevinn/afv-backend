import api from '../api';
import { healthcheckResponse } from '../endpoints/healthcheck';

describe('api', () => {
  it(`responds with ${healthcheckResponse}`, async () => {
    const server = api({ title: 'my awesome service' });
    const response = await server.inject({
      method: 'GET',
      url: '/'
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toBe(healthcheckResponse);
  });
});
