import { handler } from '../index'
import { putTestMessage } from '../dynamo'

vi.mock('../dynamo')

vi.mock('@dazn/dazl-lambda', () => ({
  default: () => ({
    before: () => {},
  }),
}))

const logger = {
  info: vi.fn(),
  warn: vi.fn(),
}

describe('main', () => {
  const messageSource = 'test-source'
  const TopicArn = `arn:aws:sns:eu-central-1:xxxxxxxxx:${messageSource}`
  const mockSnsEventRecords = [
    { Sns: { Message: JSON.stringify({ contentMediaId: 'contentId1', triggerTime: '2022-10-12T12:00:00.000Z' }), TopicArn } },
    { Sns: { Message: JSON.stringify({ contentMediaId: 'contentId2', triggerTime: '2022-10-11T12:00:00.000Z' }), TopicArn } },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should take a list of sns events', async () => {
    await handler({ Records: mockSnsEventRecords }, { logger })
    expect(putTestMessage).toHaveBeenCalledTimes(2)
    expect(putTestMessage).toHaveBeenCalledWith({ message: { contentMediaId: 'contentId1', triggerTime: '2022-10-12T12:00:00.000Z' }, messageSource })
    expect(putTestMessage).toHaveBeenCalledWith({ message: { contentMediaId: 'contentId2', triggerTime: '2022-10-11T12:00:00.000Z' }, messageSource })
  })

  it('should take an event bridge record', async () => {
    const ocsAction = {
      id: '12345',
      contentMediaId: '12345',
      action: 'spin-up',
      type: 'live',
    }
    await handler({ detail: ocsAction, source: messageSource }, { logger })
    expect(putTestMessage).toHaveBeenCalledTimes(1)
    expect(putTestMessage).toHaveBeenCalledWith({ message: ocsAction, messageSource })
  })

  it('should not put a message if the message is not valid', async () => {
    await handler({ source: messageSource }, { logger })
    expect(putTestMessage).not.toHaveBeenCalled()
  })
})
