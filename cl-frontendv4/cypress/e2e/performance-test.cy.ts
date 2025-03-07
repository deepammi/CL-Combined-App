/**
 * Performance Tests
 * 
 * This test measures load times and API response times for critical paths.
 */

describe('Performance Tests', () => {
  beforeEach(() => {
    // Set up authenticated state
    cy.window().then(win => {
      win.localStorage.setItem('token', 'fake-jwt-token');
      win.localStorage.setItem('user', JSON.stringify({
        email: 'userone@example.com',
        name: 'User One',
        roleId: 1
      }));
    });
  });

  it('should measure page load time for dashboard', () => {
    // Start timer
    const start = performance.now();
    
    // Visit dashboard
    cy.visit('/dashboard', { failOnStatusCode: false });
    
    // Wait for page to load completely
    cy.get('body').should('be.visible').then(() => {
      const end = performance.now();
      const loadTime = end - start;
      
      // Log load time
      cy.log(`Dashboard load time: ${loadTime.toFixed(2)}ms`);
      
      // Assert that load time is under threshold (adjust as needed)
      expect(loadTime).to.be.lessThan(5000); // 5 seconds
    });
  });

  it('should measure API response time for campaign data', () => {
    // Store start time
    let startTime: number;
    
    // Set up intercept
    cy.intercept('GET', '**/api/v1/campaign/active').as('campaignRequest');
    
    // Trigger the API call and store start time
    cy.window().then(win => {
      startTime = performance.now();
      fetch('/api/v1/campaign/active');
    });
    
    // Wait for the API call and calculate response time
    cy.wait('@campaignRequest').then(() => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log response time
      cy.log(`Campaign API response time: ${responseTime.toFixed(2)}ms`);
      
      // Assert that response time is under threshold (adjust as needed)
      expect(responseTime).to.be.lessThan(1000); // 1 second
    });
  });

  it('should measure API response time for call history', () => {
    // Store start time
    let startTime: number;
    
    // Set up intercept
    cy.intercept('GET', '**/api/v1/call/history').as('historyRequest');
    
    // Trigger the API call and store start time
    cy.window().then(win => {
      startTime = performance.now();
      fetch('/api/v1/call/history');
    });
    
    // Wait for the API call and calculate response time
    cy.wait('@historyRequest').then(() => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log response time
      cy.log(`Call history API response time: ${responseTime.toFixed(2)}ms`);
      
      // Assert that response time is under threshold (adjust as needed)
      expect(responseTime).to.be.lessThan(1000); // 1 second
    });
  });

  it('should measure API response time for outbound call', () => {
    // Store start time
    let startTime: number;
    
    // Set up intercept
    cy.intercept('POST', '**/api/v1/call/outbound').as('outboundCallRequest');
    
    // Trigger the API call and store start time
    cy.window().then(win => {
      startTime = performance.now();
      fetch('/api/v1/call/outbound', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          buyerId: 'buyer-1',
          phone: '+1234567890'
        })
      });
    });
    
    // Wait for the API call and calculate response time
    cy.wait('@outboundCallRequest').then(() => {
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      // Log response time
      cy.log(`Outbound call API response time: ${responseTime.toFixed(2)}ms`);
      
      // Assert that response time is under threshold (adjust as needed)
      expect(responseTime).to.be.lessThan(2000); // 2 seconds
    });
  });
}); 