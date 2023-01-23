import { putTestMessage } from './dynamo'

export const handler = async (event, { logger }) => {
  if ('Records' in event) {
    logger.info({ message: 'Received an SNS event', private: { event } })
    const snsRecords = event.Records.map(({ Sns }) => ({ messageSource: Sns.TopicArn.split(':').slice(-1)[0], message: JSON.parse(Sns.Message) }))
    logger.info({ message: 'processing records', private: { snsRecords } })
    await Promise.all(snsRecords.map(record => putTestMessage(record)))
  } else if ('detail' in event) {
    logger.info({ message: 'Received an Event Bridge message', private: { event } })
    logger.info({ message: 'processing records', private: { event } })
    await putTestMessage({ message: event.detail, messageSource: event.source })
  }
}
