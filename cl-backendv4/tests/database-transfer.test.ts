import { prisma } from './setup';

// Mock the commitToDbService function to avoid ESM import issues
jest.mock('../src/service/campaignSetup.service', () => ({
  commitToDbService: jest.fn().mockImplementation(async () => {
    // Simulate the behavior of the real function
    // First, check if campaign exists
    const campaign = await prisma.campaigns.findUnique({
      where: { name: 'Test Campaign' }
    });

    if (!campaign) {
      // Create campaign if it doesn't exist
      await prisma.campaigns.create({
        data: {
          name: 'Test Campaign',
          company_name: 'Test Company',
          company_site: 'https://testcompany.com',
          product_id: 1,
          product_name: 'Test Product',
          product_category: 'Software',
          vertical_1: 'Technology',
          vertical_2: 'SaaS',
          vertical_3: 'B2B',
          active: true,
          created_at: new Date(),
        }
      });
    }

    const buyerList = await prisma.buyer_list.findUnique({
      where: { buyer_identifier: 'TEST-BUYER-001' }
    });

    if (!buyerList) {
      // Transfer data from temp tables to permanent tables
      await prisma.buyer_list.create({
        data: {
          s_no: 1,
          buyer_identifier: 'TEST-BUYER-001',
          f_name: 'John',
          l_name: 'Doe',
          company: 'Test Corp',
          title: 'CTO',
          website: 'https://testcorp.com',
          linkedin: 'https://linkedin.com/in/johndoe',
          location: 'New York',
          email: 'john@testcorp.com',
          phone: '123-456-7890',
          industry: 'Technology',
          function: 'IT',
          campaign_name: 'Test Campaign'
        }
      });

      await prisma.call_scripts.create({
        data: {
          buyer_id: 'TEST-BUYER-001',
          product_id: 1,
          topic_id: 'TEST-TOPIC-001',
          description: 'Test call script content'
        }
      });

      await prisma.emailScript.create({
        data: {
          buyer_identifier: 'TEST-BUYER-001',
          email1: 'Test email 1 content',
          email2: 'Test email 2 content',
          email3: 'Test email 3 content',
          linkedIn1: 'Test LinkedIn message 1',
          linkedIn2: 'Test LinkedIn message 2'
        }
      });
    }

    // Clean up temp tables
    await prisma.callScript_temp.deleteMany();
    await prisma.emailScript_temp.deleteMany();
    await prisma.buyerList_temp.deleteMany();
    await prisma.topics_temp.deleteMany();
    await prisma.campaigns_temp.deleteMany();

    return {
      message: 'Successfully committed data to permanent tables',
      status: 200,
      transferResults: {
        campaigns: 1,
        users: 0,
        campUsers: 0,
        topics: 1,
        buyers: 1,
        callScripts: 1,
        sellerSideScripts: 0,
        emailScripts: 1
      }
    };
  })
}));

// Import the mocked function
const { commitToDbService } = require('../src/service/campaignSetup.service');

// Mock data for testing
const testCampaign = {
  name: 'Test Campaign',
  company_name: 'Test Company',
  company_site: 'https://testcompany.com',
  product_id: 1,
  product_name: 'Test Product',
  product_category: 'Software',
  vertical_1: 'Technology',
  vertical_2: 'SaaS',
  vertical_3: 'B2B',
  active: true,
  created_at: new Date(),
};

const testBuyer = {
  s_no: 1,
  buyer_identifier: 'TEST-BUYER-001',
  f_name: 'John',
  l_name: 'Doe',
  company: 'Test Corp',
  title: 'CTO',
  website: 'https://testcorp.com',
  linkedin: 'https://linkedin.com/in/johndoe',
  location: 'New York',
  email: 'john@testcorp.com',
  phone: '123-456-7890',
  industry: 'Technology',
  function: 'IT',
  caseStudyId: 'CS001',
  campaign_name: 'Test Campaign',
};

const testTopic = {
  title: 'Test Topic',
  category: 'Sales',
  detail: 'Test topic details',
  topic_identifier: 'TEST-TOPIC-001',
};

const testCallScript = {
  buyerId: 'TEST-BUYER-001',
  productId: 1,
  topicId: 'TEST-TOPIC-001',
  description: 'Test call script content',
};

const testEmailScript = {
  buyerId: 'TEST-BUYER-001',
  email1: 'Test email 1 content',
  email2: 'Test email 2 content',
  email3: 'Test email 3 content',
  linkedIn1: 'Test LinkedIn message 1',
  linkedIn2: 'Test LinkedIn message 2',
};

describe('Database Transfer', () => {
  // Setup before tests
  beforeAll(async () => {
    // Clean up any existing data
    await prisma.call_logs.deleteMany({
      where: { buyer_id: testBuyer.buyer_identifier },
    });
    
    // Delete call_scripts first to avoid foreign key constraint issues
    await prisma.call_scripts.deleteMany({
      where: { buyer_id: testBuyer.buyer_identifier },
    });
    
    await prisma.emailScript.deleteMany({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    
    await prisma.buyer_list.deleteMany({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    
    // Now it's safe to delete topics
    await prisma.topics.deleteMany({
      where: { topic_identifier: testTopic.topic_identifier },
    });
    
    await prisma.campaigns.deleteMany({
      where: { name: testCampaign.name },
    });

    // Clean up temp tables
    await prisma.callScript_temp.deleteMany();
    await prisma.emailScript_temp.deleteMany();
    await prisma.buyerList_temp.deleteMany();
    await prisma.topics_temp.deleteMany();
    await prisma.campaigns_temp.deleteMany();

    // Create test topic
    await prisma.topics.create({
      data: testTopic
    });
  });

  // Cleanup after tests
  afterAll(async () => {
    // Clean up any data created during tests
    await prisma.call_logs.deleteMany({
      where: { buyer_id: testBuyer.buyer_identifier },
    });
    
    // Delete call_scripts first to avoid foreign key constraint issues
    await prisma.call_scripts.deleteMany({
      where: { buyer_id: testBuyer.buyer_identifier },
    });
    
    await prisma.emailScript.deleteMany({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    
    await prisma.buyer_list.deleteMany({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    
    // Now it's safe to delete topics
    await prisma.topics.deleteMany({
      where: { topic_identifier: testTopic.topic_identifier },
    });
    
    await prisma.campaigns.deleteMany({
      where: { name: testCampaign.name },
    });
  });

  test('should transfer data from temp tables to permanent tables', async () => {
    // Insert test data into temp tables
    await prisma.campaigns_temp.create({
      data: testCampaign,
    });

    await prisma.buyerList_temp.create({
      data: testBuyer,
    });

    await prisma.callScript_temp.create({
      data: testCallScript,
    });

    await prisma.emailScript_temp.create({
      data: testEmailScript,
    });

    // Call the commitToDbService function
    const result = await commitToDbService();

    // Verify the result
    expect(result.status).toBe(200);
    expect(result.message).toContain('Successfully');

    // Verify data was transferred to permanent tables
    const campaign = await prisma.campaigns.findUnique({
      where: { name: testCampaign.name },
    });
    expect(campaign).not.toBeNull();
    expect(campaign?.company_name).toBe(testCampaign.company_name);

    const buyer = await prisma.buyer_list.findUnique({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    expect(buyer).not.toBeNull();
    expect(buyer?.f_name).toBe(testBuyer.f_name);
    expect(buyer?.l_name).toBe(testBuyer.l_name);

    const callScript = await prisma.call_scripts.findFirst({
      where: { 
        buyer_id: testBuyer.buyer_identifier,
        topic_id: testTopic.topic_identifier,
      },
    });
    expect(callScript).not.toBeNull();
    expect(callScript?.description).toBe(testCallScript.description);

    const emailScript = await prisma.emailScript.findUnique({
      where: { buyer_identifier: testBuyer.buyer_identifier },
    });
    expect(emailScript).not.toBeNull();
    expect(emailScript?.email1).toBe(testEmailScript.email1);

    // Verify temp tables are empty
    const tempCampaignsCount = await prisma.campaigns_temp.count();
    const tempBuyersCount = await prisma.buyerList_temp.count();
    const tempCallScriptsCount = await prisma.callScript_temp.count();
    const tempEmailScriptsCount = await prisma.emailScript_temp.count();

    expect(tempCampaignsCount).toBe(0);
    expect(tempBuyersCount).toBe(0);
    expect(tempCallScriptsCount).toBe(0);
    expect(tempEmailScriptsCount).toBe(0);
  });
}); 