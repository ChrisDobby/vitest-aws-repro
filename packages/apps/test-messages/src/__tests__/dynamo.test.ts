/* eslint-disable import/first */
import 'aws-sdk-client-mock-jest'
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb'
import { mockClient } from 'aws-sdk-client-mock'

process.env.DYNAMO_TABLE_NAME = 'tableName'

import { putTestMessage } from '../dynamo'

const ddbMock = mockClient(DynamoDBDocumentClient)

describe('main', () => {
  const mockTriggerRecord = {
    id: 'abc',
    contentMediaId: 'def',
    triggerTime: '2022-08-01T13:00:00.000Z',
    service: 'drm',
    task: 'create',
    title: 'Ipswich Town v Plymouth Argyle',
  }

  const mockTaskStatusRecord = {
    id: 'abc',
    service: 'drm',
    status: 'starting',
    task: 'create',
    sourceEnvironment: 'test',
  }

  beforeEach(() => {
    ddbMock.reset()
  })

  it('should put a trigger dynamo record', async () => {
    await putTestMessage({ message: mockTriggerRecord, messageSource: 'test-source' })

    expect(ddbMock).toHaveReceivedCommandTimes(PutCommand, 1)
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: 'tableName',
      Item: {
        id: 'def',
        messageSource: 'test-source',
        message: mockTriggerRecord,
      },
    })
  })

  it('should put a task status dynamo record', async () => {
    await putTestMessage({ message: mockTaskStatusRecord, messageSource: 'test-source' })
    expect(ddbMock).toHaveReceivedCommandTimes(PutCommand, 1)
    expect(ddbMock).toHaveReceivedCommandWith(PutCommand, {
      TableName: 'tableName',
      Item: {
        id: 'abc',
        messageSource: 'test-source',
        message: mockTaskStatusRecord,
      },
    })
  })
})
