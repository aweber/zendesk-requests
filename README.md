# zendesk-requests

Front end client for zendesk

## Documentation

Quickstart example:

```javascript
import ZendeskRequests, { RequestsError } from '@aweber/zendesk-requests';

const requests = new ZendeskRequests('mysubdomain');
const promise = requests.create({
    requester: {
        name: 'Anonymous'
    },
    subject: 'Request subject',
    comment: {
        body: 'This is the body'
    }
});
promise.catch((e) => {
    if(e instanceof RequestsError &&
            e.status === 422 &&
            e.json.error === 'RecordInvalid') {
        // Handle validation error
    } else {
        throw e;
    }
});
```

## API

### new RequestsClient(subdomain)
Creates a client for the front end.


| Param | Type | Description |
| --- | --- | --- |
| subdomain | <code>string</code> | the subdomain for your account |

<a name="RequestsClient.create"></a>

### RequestsClient.create(request) ⇒ <code>Promise.&lt;Object, Error&gt;</code>
Creates an anonymous Zendesk request.

**Returns**: <code>Promise.&lt;Object, Error&gt;</code> - the zendesk request that was created is
                                  resolved by the promise, else it throws a <a href="#RequestsError">RequestsError</a>

| Param | Type | Description |
| --- | --- | --- |
| request | <code>Object</code> | request object as documented in                  <a href="https://developer.zendesk.com/rest_api/docs/core/requests#create-request">                 zendesk</a> |


### RequestsError

<a name="RequestsError"></a>

Thrown when a non-successful HTTP status was returned.

| Key | Description |
| --- | ----------- |
| message | Response body text |
| status | HTTP status code |
| json | Response body as JSON, or null if not valid JSON |
