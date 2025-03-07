describe('AI Research Test', () => {
  beforeEach(() => {
    // Login and navigate to AI Research page
    cy.loginAndNavigate('ai-research');
  });

  it('should display the AI research page with campaign selection', () => {
    // Check for AI research elements
    cy.get('h1, h2, h3').contains(/ai|research/i).should('be.visible');
    cy.get('select, div[role="combobox"]').should('exist');
    cy.get('button').contains(/start|process|research/i).should('exist');
    
    // Check for instructions or description
    cy.get('body').should('contain.text', 'select')
      .and('contain.text', 'campaign');
  });

  it('should allow selecting a campaign for research', () => {
    // Select a campaign using our custom command
    cy.selectCampaign('Test Campaign');
    
    // Check if campaign is selected
    cy.get('body').should('contain.text', 'Test Campaign');
    
    // Check if the start research button is enabled
    cy.get('button').contains(/start|process|research/i).should('be.enabled');
  });

  it('should process AI research for a campaign', () => {
    // Select a campaign using our custom command
    cy.selectCampaign('Test Campaign');
    
    // Mock the AI research process API
    cy.intercept('POST', '**/api/v1/ai-research/process', {
      statusCode: 200,
      body: {
        success: true,
        message: 'AI research processing started',
        data: {
          taskId: 'test-task-123'
        }
      }
    }).as('processAIResearch');

    // Start AI research
    cy.get('button').contains(/start|process|research/i).click({ force: true });
    cy.wait('@processAIResearch');
    
    // Check for processing message
    cy.get('body').should('contain.text', 'processing')
      .or('contain.text', 'started')
      .or('contain.text', 'in progress');
    
    // Mock the AI research status API
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
            ],
            buyerInsights: [
              { id: 1, buyerId: 1, content: 'Sample insights for Buyer 1' }
            ]
          }
        }
      }
    }).as('getAIResearchStatus');
    
    // Wait for status check
    cy.wait('@getAIResearchStatus');
    
    // Check for results
    cy.get('body').should('contain.text', 'completed')
      .or('contain.text', 'finished')
      .or('contain.text', 'done');
    
    // Check for result content
    cy.get('body').should('contain.text', 'call script')
      .and('contain.text', 'email script');
  });

  it('should allow committing research results to database', () => {
    // Select a campaign using our custom command
    cy.selectCampaign('Test Campaign');
    
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
            ],
            buyerInsights: [
              { id: 1, buyerId: 1, content: 'Sample insights for Buyer 1' }
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
            callScripts: 1,
            emailScripts: 1,
            buyerInsights: 1
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
    cy.get('body').should('contain.text', 'call')
      .and('contain.text', 'email')
      .and('contain.text', 'insights');
  });
  
  it('should handle research process errors gracefully', () => {
    // Select a campaign using our custom command
    cy.selectCampaign('Test Campaign');
    
    // Mock the AI research process API with an error
    cy.intercept('POST', '**/api/v1/ai-research/process', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Failed to start AI research process'
      }
    }).as('processAIResearchError');

    // Start AI research
    cy.get('button').contains(/start|process|research/i).click({ force: true });
    cy.wait('@processAIResearchError');
    
    // Check for error message
    cy.get('body').should('contain.text', 'failed')
      .or('contain.text', 'error')
      .or('contain.text', 'unable');
  });
}); 