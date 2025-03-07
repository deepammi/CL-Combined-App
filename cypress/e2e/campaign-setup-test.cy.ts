describe('Campaign Setup Test', () => {
  beforeEach(() => {
    // Login and navigate to Campaign Setup page
    cy.loginAndNavigate('campaign');
  });

  it('should display the campaign setup page with file upload', () => {
    // Check for campaign setup elements
    cy.get('h1, h2, h3').contains(/campaign|setup/i).should('be.visible');
    cy.get('input[type="file"]').should('exist');
    cy.get('button').contains(/upload|submit/i).should('exist');
    
    // Check for campaign setup instructions
    cy.get('body').should('contain.text', 'Excel')
      .or('contain.text', 'file')
      .or('contain.text', 'upload');
  });

  it('should allow uploading an Excel file', () => {
    // Mock the file upload API
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 200,
      body: {
        success: true,
        message: 'File uploaded successfully',
        data: {
          campaignId: 'test-campaign-123'
        }
      }
    }).as('fileUpload');

    // Upload a test file
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-campaign.xlsx', { force: true });
    cy.get('button').contains(/upload|submit/i).click({ force: true });
    
    // Wait for the upload to complete
    cy.wait('@fileUpload');
    
    // Check for success message
    cy.get('body').should('contain.text', 'success')
      .or('contain.text', 'uploaded')
      .or('contain.text', 'complete');
  });

  it('should display loaded data in temporary tables', () => {
    // Mock the campaign data API
    cy.intercept('GET', '**/api/v1/campaign/data/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          buyerList: [
            { id: 1, name: 'Test Buyer 1', company: 'Test Company 1', phone: '+1234567890', email: 'buyer1@example.com', position: 'CEO' },
            { id: 2, name: 'Test Buyer 2', company: 'Test Company 2', phone: '+0987654321', email: 'buyer2@example.com', position: 'CTO' }
          ],
          buysideQueries: [
            { id: 1, query: 'What is the company\'s main product?' },
            { id: 2, query: 'Who are their main competitors?' }
          ],
          campUsers: [
            { id: 1, name: 'User One', email: 'userone@example.com', role: 'Admin' }
          ],
          topics: [
            { id: 1, topic: 'Product features' },
            { id: 2, topic: 'Pricing' },
            { id: 3, topic: 'Competition' }
          ]
        }
      }
    }).as('getCampaignData');

    // View campaign data
    cy.get('button').contains(/view|data|campaign/i).click({ force: true });
    cy.wait('@getCampaignData');
    
    // Check if data is displayed
    cy.get('table, div[role="table"]').should('exist');
    cy.get('body').should('contain.text', 'Test Buyer 1')
      .and('contain.text', 'Test Company 1');
    
    // Check for tabs or sections for different data types
    cy.get('button, tab, a').contains(/buyer|list/i).should('exist');
    cy.get('button, tab, a').contains(/quer|question/i).should('exist');
    cy.get('button, tab, a').contains(/user/i).should('exist');
    cy.get('button, tab, a').contains(/topic/i).should('exist');
  });
  
  it('should handle file upload errors gracefully', () => {
    // Mock the file upload API with an error
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Invalid file format'
      }
    }).as('fileUploadError');

    // Upload a test file
    cy.get('input[type="file"]').selectFile('cypress/fixtures/test-campaign.xlsx', { force: true });
    cy.get('button').contains(/upload|submit/i).click({ force: true });
    
    // Wait for the upload to complete
    cy.wait('@fileUploadError');
    
    // Check for error message
    cy.get('body').should('contain.text', 'error')
      .or('contain.text', 'invalid')
      .or('contain.text', 'failed');
  });
}); 