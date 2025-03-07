import prisma from "../prisma";

export const BuyerListService = async () => {
  try {
    const latestCampaign = await prisma.campaigns.findFirst({
      orderBy: {
        created_at: "desc",
      },
    });

    // get buyer list for latest campaign only
    if (!latestCampaign) {
      throw new Error("No campaign found");
    }
    
    const result = await prisma.buyer_list.findMany({
      where: { campaign_name : latestCampaign.name },
      select: {
        f_name: true,
        l_name: true,
        company: true,
        title: true,
        phone: true,
        email: true,
        location: true,
        linkedin: true,
        s_no: true,
        buyer_identifier: true,
        Call_scripts: {
          select: {
            id: true,
            buyer_id: true,
            product_id: true,
            topic_id: true,
            description: true,
            Topics: {
              select: {
                id: true,
                title: true,
                category: true,
                detail: true,
                topic_identifier: true,
              },
            },
          },
        },
        Campaigns: {
          select: {
            name: true,
            Faqs: true,
          },
        },
        emailScripts : {
          select: {
            email1: true,
            email2: true,
            email3: true,
            linkedIn1: true,
            linkedIn2: true,
          },
        }
      },
    });
    return result;
  } catch (error) {
    console.error("Error fetching buyer list:", error);
    throw new Error("Failed to fetch buyer list");
  }
};
