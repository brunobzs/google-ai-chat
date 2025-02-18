import { config } from "../../src/js/config/config";

describe('Google API check', () => {
  it('Should return status 200', () => {
    cy.request({
      method: 'POST',
      url: `${config.API_ENDPOINT}?key=${config.API_KEY}`,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'How old are you?'
          }]
        }]
      })
    }).then((response) => {
      expect(response.status).to.eq(200) // Check if the status is 200
      expect(response.body.candidates[0].content.parts).length.to.be.greaterThan(0) // Check if the response has parts
    })
  })
})