import 'aws-sdk-client-mock-jest'
import { mockClient } from 'aws-sdk-client-mock'
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { foo } from '../index'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('index', () => {
  beforeEach(() => {
    ddbMock.reset()
  })

  it('should fail', async () => {
    await foo()

    expect(ddbMock).toHaveReceivedCommandTimes(QueryCommand, 1)
    expect(ddbMock).toHaveReceivedCommandWith(QueryCommand, {
      TableName: 'foo',
    })

    expect(true).toBe(false)
  })
})
