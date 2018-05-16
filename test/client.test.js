import fetch from 'unfetch';

import Client from '../lib/client';

jest.mock('unfetch', () => jest.fn());

const createZendeskResponse = (request, status) => {
    fetch.mockReturnValue(Promise.resolve({
        status,
        json: () => Promise.resolve({ request }),
        text: () => Promise.resolve('text'),
    }));
};

describe('Zendesk request client', () => {

    describe('creating a client', () => {

        it('require a subdomain that is used as the url', () => {
            const subdomain = 'subdomain';
            const client = new Client(subdomain);
            expect(client.url.includes(subdomain)).toBe(true);
        });

    });

    describe('creating a request', () => {

        let requestResponse = {
            request: 10,
            status: 'new',
            description: 'test',
        };

        let requests;

        const params = {
            requester: { name: 'test name' },
            subject: 'test subject',
            comment: { body: 'test body' }
        };

        beforeEach(() => {
            createZendeskResponse(requestResponse);
            requests = new Client('test');
        });

        it('should return the zendesk request that was created', async () => {
            const response = await requests.create(params);
            expect(response).toEqual(requestResponse);
        });

        it('should pass the name, subject, and body in the request body', () => {
            requests.create(params);
            const requestBody = JSON.parse(fetch.mock.calls[0][1].body).request;
            expect(requestBody.requester.name).toEqual(params.requester.name);
            expect(requestBody.comment.body).toEqual(params.comment.body);
            expect(requestBody.subject).toEqual(params.subject);
        });

        it('should use application/json content type', () => {
            requests.create(params);
            expect(fetch.mock.calls[0][1].headers['content-type']).toEqual('application/json');
        });

        it('should be a POST request', () => {
            requests.create(params);
            expect(fetch.mock.calls[0][1].method).toEqual('POST');
        });

        it('should throw an error if the server does not return in success', async () => {
            createZendeskResponse(requestResponse, 400);
            try {
                await requests.create(params);
                fail('Error not thrown');
            } catch (e) {
                expect(e).toEqual(expect.any(Error));
                expect(e.message).toEqual('text');
            }
        });

        it('should omit credentials since there are none for requests', () => {
            requests.create(params);
            expect(fetch.mock.calls[0][1].credentials).toEqual('omit');
        });

        it('should use cors mode', () => {
            requests.create(params);
            expect(fetch.mock.calls[0][1].mode).toEqual('cors');
        });
    });

});
