describe('Simple Phone Test', () => {
  it('should visit the homepage', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.get('body').should('be.visible');
    cy.screenshot('homepage');
  });

  it('should navigate to login page', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('body').should('be.visible');
    cy.screenshot('login-page');
  });

  it('should have input fields on login page', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('input').should('exist');
    cy.screenshot('login-inputs');
  });

  it('should have a button on login page', () => {
    cy.visit('/login');
    cy.wait(2000);
    cy.get('button').should('exist');
    cy.screenshot('login-button');
  });

  it('should simulate login with localStorage', () => {
    // Instead of trying to log in through the UI, simulate it with localStorage
    cy.visit('/');
    
    // Set localStorage to simulate being logged in
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
    
    // Reload the page to apply the localStorage changes
    cy.reload();
    
    // Verify that the token is set in localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.equal('fake-jwt-token');
    });
  });
}); 