import fetch from 'unfetch';

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
     * https://developer.zendesk.com/rest_api/docs/core/requests#json-format
     * https://developer.zendesk.com/rest_api/docs/core/requests#create-request
     *
     * @param {Object} requests object as documented in zendesk create request
     * @return {Promise<request>} the zendesk request that was created is
     *                            resolved by the promise
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
