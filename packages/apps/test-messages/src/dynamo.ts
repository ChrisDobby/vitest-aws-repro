import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'

const testMessageTableName = `${process.env.DYNAMO_TABLE_NAME}`

const documentClient = DynamoDBDocumentClient.from(new DynamoDBClient({}))

export const putTestMessage = async ({ message, messageSource }: { message; messageSource: string }) =>
  documentClient.send(
    new PutCommand({
      TableName: testMessageTableName,
      Item: { id: message.contentMediaId || message.id, messageSource, message },
    })
  )
