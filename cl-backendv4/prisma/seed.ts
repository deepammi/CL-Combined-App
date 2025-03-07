import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding data...");

  // Seed Campaigns
  const campaigns = [
    {
      name: "test_campaign2",
      company_name: "TechCorp",
      company_site: "https://techcorp.com",
      product_id: 101,
      product_name: "TechSuite",
      product_category: "Software",
      vertical_1: "IT Solutions",
      vertical_2: "Enterprise",
      vertical_3: null,
      active: true,
      created_at: new Date(),
    },
    {
      name: "test_compaign3",
      company_name: "HealthLife",
      company_site: "https://healthlife.com",
      product_id: 102,
      product_name: "LifeSuite",
      product_category: "Healthcare",
      vertical_1: "Medical",
      vertical_2: "Wellness",
      vertical_3: null,
      active: true,
      created_at: new Date(),
    },
  ];

  for (const campaign of campaigns) {
    await prisma.campaigns.upsert({
      where: { name: campaign.name },
      update: {},
      create: campaign,
    });
  }

  console.log("Campaigns seeded.");

  // Seed Buyer_list
  const buyerList = [
    {
      s_no: 1,
      campaign_name: "test_campaign2", // Relation to Campaigns
      buyer_identifier: "test_campaign2-1TrentKaeslin",
      linkedin: "https://linkedin.com/in/buyer123",
      f_name: "John",
      l_name: "Doe",
      company: "TechCorp",
      website: "https://techcorp.com",
      title: "CTO",
      location: "San Francisco, CA",
      email: "john.doe@techcorp.com",
      phone: "408-418-8163",
      industry: "Technology",
      function: "Engineering",
    },
    {
      s_no: 2,
      campaign_name: "test_compaign3", // Relation to Campaigns
      buyer_identifier: "test_compaign3-1AjaneSmith",
      linkedin: "https://linkedin.com/in/buyer456",
      f_name: "Jane",
      l_name: "Smith",
      company: "HealthLife",
      website: "https://healthlife.com",
      title: "CEO",
      location: "New York, NY",
      email: "jane.smith@healthlife.com",
      phone: "925-332-9769",
      industry: "Healthcare",
      function: "Management",
    },
  ];

  for (const buyer of buyerList) {
    await prisma.buyer_list.upsert({
      where: { buyer_identifier: buyer.buyer_identifier },
      update: {},
      create: buyer,
    });
  }

  console.log("Buyer list seeded.");

  // Seed Topics
  const topics = [
    {
      title: "Topic 1",
      category: "Engineering",
      detail: "Engineering-related scripts.",
      topic_identifier: "eng-topic-1",
    },
    {
      title: "Topic 2",
      category: "Management",
      detail: "Management-related scripts.",
      topic_identifier: "mgmt-topic-1",
    },
  ];

  for (const topic of topics) {
    await prisma.topics.upsert({
      where: { topic_identifier: topic.topic_identifier },
      update: {},
      create: topic,
    });
  }

  console.log("Topics seeded.");

  // Seed Call_scripts
  const callScripts = [
    {
      buyer_id: "test_campaign2-1TrentKaeslin", // Relation to Buyer_list
      product_id: 101,
      topic_id: "eng-topic-1", // Relation to Topics
      description: "Script for TechCorp buyer John Doe.",
    },
    {
      buyer_id: "test_compaign3-1AjaneSmith", // Relation to Buyer_list
      product_id: 102,
      topic_id: "mgmt-topic-1", // Relation to Topics
      description: "Script for HealthLife buyer Jane Smith.",
    },
  ];

  for (const script of callScripts) {
    // Check if the script already exists
    const existingScript = await prisma.call_scripts.findFirst({
      where: {
        buyer_id: script.buyer_id,
        topic_id: script.topic_id,
      },
    });

    if (existingScript) {
      // Update the existing record
      await prisma.call_scripts.update({
        where: { 
          topic_buyer_id: {
            buyer_id: script.buyer_id,
            topic_id: script.topic_id,
          }
        },
        data: { ...script },
      });
    } else {
      // Create a new record
      await prisma.call_scripts.create({
        data: { ...script },
      });
    }
  }

  console.log("Call scripts seeded.");

  const adminRole = await prisma.role.upsert({
    where: { name: "Admin" },
    update: {},
    create: { name: "Admin" },
  });

  const viewerRole = await prisma.role.upsert({
    where: { name: "Viewer" },
    update: {},
    create: { name: "Viewer" },
  });

  console.log("Roles seeded.");

  const adminUser = await prisma.users.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      email: "admin@test.com",
      password: "admin",
      role: { connect: { id: adminRole.id } },
    },
  });

  console.log("admin user seeded",`[email: ${adminUser.email}, password: ${adminUser.password}]` );

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error("Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
