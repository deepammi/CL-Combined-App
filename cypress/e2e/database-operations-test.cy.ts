describe('Database Operations Test', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/');
    cy.wait(1000);
    
    // Mock successful login
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

    // Login
    cy.get('input[type="email"], input[type="text"]').first().type('userone');
    cy.get('input[type="password"]').type('UserOne1*');
    cy.get('button[type="submit"]').click();
    cy.wait('@loginRequest');
    
    // Navigate to AI Research page (where Commit to DB button is located)
    cy.get('a, button').contains(/ai|research/i).click({ force: true });
  });

  it('should display the Commit to DB button after AI research is complete', () => {
    // Mock the campaign list API
    cy.intercept('GET', '**/api/v1/campaign/list', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { id: 'test-campaign-123', name: 'Test Campaign', createdAt: new Date().toISOString() }
        ]
      }
    }).as('getCampaigns');
    cy.wait('@getCampaigns');
    
    // Select a campaign
    cy.get('select, div[role="combobox"]').click({ force: true });
    cy.get('li, option').contains('Test Campaign').click({ force: true });
    
    // Mock the AI research status with completed results
    cy.intercept('GET', '**/api/v1/ai-research/status/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          status: 'completed',
          progress: 100,
          results: {
            callScripts: [
              { id: 1, buyerId: 1, content: 'Sample call script for Buyer 1' }
            ],
            emailScripts: [
              { id: 1, buyerId: 1, content: 'Sample email script for Buyer 1' }
            ]
          }
        }
      }
    }).as('getAIResearchStatus');
    cy.wait('@getAIResearchStatus');
    
    // Check if Commit to DB button is visible
    cy.get('button').contains(/commit|db|database/i).should('be.visible');
  });

  it('should commit research results to database successfully', () => {
    // Mock the campaign list API
    cy.intercept('GET', '**/api/v1/campaign/list', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { id: 'test-campaign-123', name: 'Test Campaign', createdAt: new Date().toISOString() }
        ]
      }
    }).as('getCampaigns');
    cy.wait('@getCampaigns');
    
    // Select a campaign
    cy.get('select, div[role="combobox"]').click({ force: true });
    cy.get('li, option').contains('Test Campaign').click({ force: true });
    
    // Mock the AI research status with completed results
    cy.intercept('GET', '**/api/v1/ai-research/status/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          status: 'completed',
          progress: 100,
          results: {
            callScripts: [
              { id: 1, buyerId: 1, content: 'Sample call script for Buyer 1' }
            ],
            emailScripts: [
              { id: 1, buyerId: 1, content: 'Sample email script for Buyer 1' }
            ]
          }
        }
      }
    }).as('getAIResearchStatus');
    cy.wait('@getAIResearchStatus');
    
    // Mock commit to DB API
    cy.intercept('POST', '**/api/v1/commit-to-db/*', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Research results committed to database',
        data: {
          transferredRecords: {
            buyerList: 1,
            callScripts: 1,
            emailScripts: 1
          }
        }
      }
    }).as('commitToDB');
    
    // Click Commit to DB button
    cy.get('button').contains(/commit|db|database/i).click({ force: true });
    cy.wait('@commitToDB');
    
    // Check for success message
    cy.get('body').should('contain.text', 'committed')
      .or('contain.text', 'transferred')
      .or('contain.text', 'saved');
    
    // Check for transferred records information
    cy.get('body').should('contain.text', '1')
      .and('contain.text', 'buyer')
      .and('contain.text', 'call')
      .and('contain.text', 'email');
  });

  it('should handle database commit errors gracefully', () => {
    // Mock the campaign list API
    cy.intercept('GET', '**/api/v1/campaign/list', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          { id: 'test-campaign-123', name: 'Test Campaign', createdAt: new Date().toISOString() }
        ]
      }
    }).as('getCampaigns');
    cy.wait('@getCampaigns');
    
    // Select a campaign
    cy.get('select, div[role="combobox"]').click({ force: true });
    cy.get('li, option').contains('Test Campaign').click({ force: true });
    
    // Mock the AI research status with completed results
    cy.intercept('GET', '**/api/v1/ai-research/status/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          status: 'completed',
          progress: 100,
          results: {
            callScripts: [
              { id: 1, buyerId: 1, content: 'Sample call script for Buyer 1' }
            ],
            emailScripts: [
              { id: 1, buyerId: 1, content: 'Sample email script for Buyer 1' }
            ]
          }
        }
      }
    }).as('getAIResearchStatus');
    cy.wait('@getAIResearchStatus');
    
    // Mock commit to DB API with error
    cy.intercept('POST', '**/api/v1/commit-to-db/*', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Failed to commit research results to database'
      }
    }).as('commitToDBError');
    
    // Click Commit to DB button
    cy.get('button').contains(/commit|db|database/i).click({ force: true });
    cy.wait('@commitToDBError');
    
    // Check for error message
    cy.get('body').should('contain.text', 'fail')
      .or('contain.text', 'error')
      .or('contain.text', 'unable');
  });
}); 