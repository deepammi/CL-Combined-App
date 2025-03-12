describe('Login Page', () => {
  beforeEach(() => {
    cy.visit('/login')
  })

  it('should display login form', () => {
    cy.get('form').should('exist')
    cy.get('input[type="email"]').should('exist')
    cy.get('input[type="password"]').should('exist')
    cy.get('button[type="submit"]').should('exist')
  })

  it('should show error with invalid credentials', () => {
    cy.get('input[type="email"]').type('invalid@email.com')
    cy.get('input[type="password"]').type('wrongpassword')
    cy.get('button[type="submit"]').click()
    cy.get('.error-message').should('be.visible')
  })

  it('should login successfully with valid credentials', () => {
    cy.get('input[type="email"]').type(Cypress.env('TEST_USER_EMAIL'))
    cy.get('input[type="password"]').type(Cypress.env('TEST_USER_PASSWORD'))
    cy.get('button[type="submit"]').click()
    cy.url().should('include', '/dashboard')
  })
}) 