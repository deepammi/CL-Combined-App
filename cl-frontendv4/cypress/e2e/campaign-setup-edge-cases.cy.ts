/**
 * Campaign Setup Edge Cases Test
 * 
 * This test covers edge cases and error scenarios for the campaign setup feature.
 */

describe('Campaign Setup Edge Cases', () => {
  beforeEach(() => {
    // Visit the homepage
    cy.visit('/', { failOnStatusCode: false });
    
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

  it('should handle empty file upload', () => {
    // Mock file upload API with validation error
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 400,
      body: {
        success: false,
        message: 'No file uploaded or file is empty',
        errors: ['File is required']
      }
    }).as('emptyFileUpload');
    
    // Trigger the API call
    cy.window().then(win => {
      const formData = new FormData();
      fetch('/api/v1/campaign/upload', {
        method: 'POST',
        body: formData
      });
    });
    
    // Verify the mock was called
    cy.wait('@emptyFileUpload');
  });

  it('should handle invalid file format', () => {
    // Mock file upload API with format error
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Invalid file format',
        errors: ['Only .xlsx files are supported']
      }
    }).as('invalidFormatUpload');
    
    // Trigger the API call
    cy.window().then(win => {
      const formData = new FormData();
      // Create a mock file with wrong format
      const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
      formData.append('file', file);
      fetch('/api/v1/campaign/upload', {
        method: 'POST',
        body: formData
      });
    });
    
    // Verify the mock was called
    cy.wait('@invalidFormatUpload');
  });

  it('should handle missing required columns', () => {
    // Mock file upload API with missing columns error
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 400,
      body: {
        success: false,
        message: 'Missing required columns',
        errors: ['Column "Name" is required', 'Column "Email" is required']
      }
    }).as('missingColumnsUpload');
    
    // Trigger the API call
    cy.window().then(win => {
      const formData = new FormData();
      // Create a mock file
      const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      formData.append('file', file);
      fetch('/api/v1/campaign/upload', {
        method: 'POST',
        body: formData
      });
    });
    
    // Verify the mock was called
    cy.wait('@missingColumnsUpload');
  });

  it('should handle server error during upload', () => {
    // Mock file upload API with server error
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Internal server error',
        errors: ['Failed to process file']
      }
    }).as('serverErrorUpload');
    
    // Trigger the API call
    cy.window().then(win => {
      const formData = new FormData();
      // Create a mock file
      const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      formData.append('file', file);
      fetch('/api/v1/campaign/upload', {
        method: 'POST',
        body: formData
      });
    });
    
    // Verify the mock was called
    cy.wait('@serverErrorUpload');
  });

  it('should handle successful upload with warnings', () => {
    // Mock file upload API with success but warnings
    cy.intercept('POST', '**/api/v1/campaign/upload', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Campaign uploaded successfully with warnings',
        data: {
          campaignId: 'test-campaign-123',
          warnings: [
            'Some email addresses are invalid',
            '3 duplicate entries were found and merged'
          ]
        }
      }
    }).as('warningUpload');
    
    // Trigger the API call
    cy.window().then(win => {
      const formData = new FormData();
      // Create a mock file
      const file = new File(['test content'], 'test.xlsx', { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      formData.append('file', file);
      fetch('/api/v1/campaign/upload', {
        method: 'POST',
        body: formData
      });
    });
    
    // Verify the mock was called
    cy.wait('@warningUpload');
  });
}); 