import fetch from 'unfetch';

/**
 * Creates a client for the front end.
 * @class RequestsClient
 * @param {string} subdomain the subdomain for your account
 */
export default class RequestsClient {

    /**
     * Creates a Requests client
     *
     * @param {string} subdomain of the zendesk account
     */
    constructor(subdomain) {
        this.url = `https://${subdomain}.zendesk.com/api/v2/requests.json`;
    }

    /**
     * Creates an anonymous Zendesk request.
     *
     * @memberof RequestsClient
     * @param {Object} request request object as documented in 
     *                 <a href="https://developer.zendesk.com/rest_api/docs/core/requests#create-request">
     *                 zendesk</a>
     * @return {Promise<Object, Error>} the zendesk request that was created is
     *                                   resolved by the promise, else it returns
     *                                   an error with the response text as the
     *                                   message
     */
    create(request) {
        return fetch(this.url, {
            body: JSON.stringify({ request }),
            headers: {
                'content-type': 'application/json',
            },
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
        }).then((res) => {
            if (res.status >= 400) {
                return res.text().then((data) => {
                    return Promise.reject(new Error(data));
                });
            }
            return res.json();
        }).then(({ request }) => {
            return request;
        });
    }
}
