# ICE Notification Service

### Sample Payload

```
{
  "version": "1",
  "id": "6a7e8feb-b491-4cf7-a9f1-bf3703467718",
  "detail-type": "ICE Completed Campaign Notification",
  "source": "idn.ice.campaign",
  "time": "2022-23-22T18:43:48Z",
  "detail": {
    "campaignId": "23563",
    "createdByUserId": "2354",
    "createdByUsername": "cvfoobar",
    "title": "...",
    "productName": "...",
    "categories": "...",
    "objective": "...",
    "startTimeInMillis": "...",
    "endTimeInMillis": "...",
    "createdTimeInMillis": "...",
    "totalPrice": "...",
    "totalTax": "...",
    "totalTaxDeduction": "...",
    "totalChargeablePriceWithTaxAndDeduction": "...",
    "invoiceNumber": "...",
    "orderNumber": "...",
    "status": "COMPLETED"
  }
}
```

### Retries and backoff mechanism

Sometimes an event isn't successfully delivered to your endpoint. This can happen when, for example, your endpoint is unavailable, or due to network conditions. When an event isn't successfully delivered to a target because of retriable errors, ICE Notification Service retries sending the event. ICE Nofication Service retries sending the event for 24 hours and 185 times with [exponential backoff and jitter](https://aws.amazon.com/blogs/architecture/exponential-backoff-and-jitter/) mechanism.

When an event isn't delivered after all the retry attempts are exhausted, the event is dropped and ICE Notification Service sends you and email with the payload of the event.
