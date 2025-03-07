describe('Login Page Test', () => {
  beforeEach(() => {
    // Visit the login page before each test
    cy.visit('/');
    // Wait for the page to load
    cy.wait(1000);
  });

  it('should display the login page with proper elements', () => {
    // Check if we're on the login page
    cy.url().should('include', '/');
    
    // Look for login form elements
    cy.get('form').should('exist');
    cy.get('input[type="email"], input[type="text"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
    
    // Check for branding elements
    cy.get('img[alt*="logo"], svg[class*="logo"]').should('exist');
    cy.get('h1, h2, h3, .title').should('exist');
  });

  it('should show validation errors for invalid credentials', () => {
    // Try to login with invalid credentials
    cy.get('input[type="email"], input[type="text"]').first().type('invalid@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    // There should be some error message
    cy.get('body').should('contain.text', 'Invalid') 
      .or('contain.text', 'Error')
      .or('contain.text', 'Failed')
      .or('contain.text', 'Incorrect');
  });

  it('should show validation errors for empty fields', () => {
    // Try to login with empty fields
    cy.get('button[type="submit"]').click();
    
    // There should be validation errors
    cy.get('body').should('contain.text', 'required') 
      .or('contain.text', 'empty')
      .or('contain.text', 'fill');
  });

  it('should allow login with valid credentials', () => {
    // Mock the login API response
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token',
        user: {
          email: 'userone@example.com',
          name: 'User One',
          roleId: 1
        }
      }
    }).as('loginRequest');

    // Enter valid credentials (using the credentials from the screenshot)
    cy.get('input[type="email"], input[type="text"]').first().type('userone');
    cy.get('input[type="password"]').type('UserOne1*');
    cy.get('button[type="submit"]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginRequest');
    
    // Should be redirected to a dashboard or home page
    cy.url().should('not.include', '/login');
    
    // Check for authenticated elements
    cy.get('nav, header, .sidebar').should('exist');
    cy.get('body').should('contain.text', 'User One')
      .or('contain.text', 'userone@example.com');
  });
  
  it('should handle server errors gracefully', () => {
    // Mock a server error
    cy.intercept('POST', '**/api/v1/auth/login', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Internal server error'
      }
    }).as('loginServerError');

    // Enter valid credentials
    cy.get('input[type="email"], input[type="text"]').first().type('userone');
    cy.get('input[type="password"]').type('UserOne1*');
    cy.get('button[type="submit"]').click();
    
    // Wait for the login request to complete
    cy.wait('@loginServerError');
    
    // Should show an error message
    cy.get('body').should('contain.text', 'server')
      .or('contain.text', 'error')
      .or('contain.text', 'try again');
  });
}); 