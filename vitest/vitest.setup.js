// import '@testing-library/jest-dom/extend-expect'

require('dotenv').config()

expect.extend({
  toBeOkResponse(received, expectedBody) {
    if (received.statusCode !== 200) {
      return { pass: false, message: () => `Expected statusCode to be 200, but got ${received.statusCode}` }
    }

    try {
      // eslint-disable-next-line jest/no-standalone-expect
      expect(JSON.parse(received.body)).toEqual(expectedBody)
    } catch {
      return { pass: false, message: () => `Expected body to be ${JSON.stringify(expectedBody, null, 2)}, but got ${received.body}` }
    }

    return { pass: true, message: () => '' }
  },
})
