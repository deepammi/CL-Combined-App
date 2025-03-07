describe('Phone Calling Test', () => {
  beforeEach(() => {
    // Login and navigate to Phone Calling page
    cy.loginAndNavigate('phone-calling');
    
    // Mock active campaign data
    cy.mockActiveCampaign();
  });

  it('should display the phone calling page with buyer information', () => {
    // Check for phone calling elements
    cy.get('h1, h2, h3').contains(/phone|call/i).should('be.visible');
    cy.get('body').should('contain.text', 'Test Buyer 1');
    cy.get('body').should('contain.text', 'Test Company 1');
    cy.get('body').should('contain.text', '+1234567890');
    
    // Check for the blue, green, and red buttons
    cy.get('button').contains(/open amazon connect|connect|ccp/i).should('exist');
    cy.get('button').contains(/call|dial|green/i).should('exist');
    cy.get('button').contains(/disconnect|hang up|end|red/i).should('exist');
  });

  it('should display call scripts when a buyer is selected', () => {
    // Mock call scripts
    cy.intercept('GET', '**/api/v1/call-scripts/buyer/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          callScript: 'This is a test call script for Buyer 1',
          buyerDetails: {
            id: 'buyer-1',
            name: 'Test Buyer 1',
            company: 'Test Company 1',
            phone: '+1234567890'
          }
        }
      }
    }).as('getCallScripts');

    // Select a buyer
    cy.get('div, tr').contains('Test Buyer 1').click({ force: true });
    cy.wait('@getCallScripts');

    // Check if call script is displayed
    cy.get('body').should('contain.text', 'This is a test call script for Buyer 1');
    
    // Check for buyer details display
    cy.get('body').should('contain.text', 'Test Buyer 1')
      .and('contain.text', 'Test Company 1')
      .and('contain.text', '+1234567890');
  });

  it('should open Amazon Connect CCP when blue button is clicked', () => {
    // Mock window.open
    cy.window().then(win => {
      cy.stub(win, 'open').as('windowOpen');
    });

    // Click the blue button
    cy.get('button').contains(/open amazon connect|connect|ccp/i).click({ force: true });

    // Verify window.open was called
    cy.get('@windowOpen').should('be.called');
  });

  it('should make an API call when green button is clicked', () => {
    // Mock call scripts
    cy.intercept('GET', '**/api/v1/call-scripts/buyer/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          callScript: 'This is a test call script for Buyer 1',
          buyerDetails: {
            id: 'buyer-1',
            name: 'Test Buyer 1',
            company: 'Test Company 1',
            phone: '+1234567890'
          }
        }
      }
    }).as('getCallScripts');

    // Select a buyer
    cy.get('div, tr').contains('Test Buyer 1').click({ force: true });
    cy.wait('@getCallScripts');

    // Mock the outbound call API
    cy.intercept('POST', '**/api/v1/call/outbound', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Call initiated successfully',
        data: {
          callId: 'test-call-123'
        }
      }
    }).as('outboundCall');

    // Click the green button
    cy.get('button').contains(/call|dial|green/i).click({ force: true });
    cy.wait('@outboundCall');

    // Check for success message
    cy.get('body').should('contain.text', 'initiated')
      .or('contain.text', 'success')
      .or('contain.text', 'calling');
    
    // Check for active call state
    cy.get('button').contains(/disconnect|hang up|end|red/i).should('be.enabled');
  });

  it('should disconnect call when red button is clicked', () => {
    // Mock active call state
    cy.window().then(win => {
      win.localStorage.setItem('activeCall', 'true');
    });

    // Mock the disconnect call API
    cy.intercept('POST', '**/api/v1/call/disconnect', {
      statusCode: 200,
      body: {
        success: true,
        message: 'Call disconnected successfully'
      }
    }).as('disconnectCall');

    // Click the red button
    cy.get('button').contains(/disconnect|hang up|end|red/i).click({ force: true });
    cy.wait('@disconnectCall');

    // Check for success message
    cy.get('body').should('contain.text', 'disconnect')
      .or('contain.text', 'ended')
      .or('contain.text', 'hung up');
    
    // Check that active call state is cleared
    cy.window().then(win => {
      expect(win.localStorage.getItem('activeCall')).to.be.null;
    });
  });

  it('should fetch call history when requested', () => {
    // Mock the call history API
    cy.intercept('GET', '**/api/v1/call/history', {
      statusCode: 200,
      body: {
        success: true,
        data: [
          {
            id: 'call-1',
            buyerId: 'buyer-1',
            buyerName: 'Test Buyer 1',
            timestamp: new Date().toISOString(),
            duration: 120,
            status: 'completed',
            notes: 'Test call notes'
          },
          {
            id: 'call-2',
            buyerId: 'buyer-2',
            buyerName: 'Test Buyer 2',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            duration: 60,
            status: 'completed',
            notes: 'Another test call'
          }
        ]
      }
    }).as('getCallHistory');

    // Click the call history button
    cy.get('button').contains(/history|log|record/i).click({ force: true });
    cy.wait('@getCallHistory');

    // Check if call history is displayed
    cy.get('body').should('contain.text', 'Test Buyer 1')
      .and('contain.text', 'Test Buyer 2');
    cy.get('body').should('contain.text', 'completed');
    
    // Check for call details
    cy.get('body').should('contain.text', 'duration')
      .and('contain.text', 'notes');
  });
  
  it('should handle outbound call errors gracefully', () => {
    // Mock call scripts
    cy.intercept('GET', '**/api/v1/call-scripts/buyer/*', {
      statusCode: 200,
      body: {
        success: true,
        data: {
          callScript: 'This is a test call script for Buyer 1',
          buyerDetails: {
            id: 'buyer-1',
            name: 'Test Buyer 1',
            company: 'Test Company 1',
            phone: '+1234567890'
          }
        }
      }
    }).as('getCallScripts');

    // Select a buyer
    cy.get('div, tr').contains('Test Buyer 1').click({ force: true });
    cy.wait('@getCallScripts');

    // Mock the outbound call API with an error
    cy.intercept('POST', '**/api/v1/call/outbound', {
      statusCode: 500,
      body: {
        success: false,
        message: 'Failed to initiate call'
      }
    }).as('outboundCallError');

    // Click the green button
    cy.get('button').contains(/call|dial|green/i).click({ force: true });
    cy.wait('@outboundCallError');

    // Check for error message
    cy.get('body').should('contain.text', 'failed')
      .or('contain.text', 'error')
      .or('contain.text', 'unable');
  });
}); 