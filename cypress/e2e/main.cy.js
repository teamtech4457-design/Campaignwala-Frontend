describe('Home Page Test', () => {
  it('visits the site and checks title', () => {
    cy.visit('https://www.dashboard.campaignwala.in/')
    cy.title().should('include', 'CampaignWala')
  })
})