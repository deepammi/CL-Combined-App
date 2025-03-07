export const dynamic = "force-dynamic";

import CallerDashboard from "@/components/CallerDashboard";
import "../../app/globals.css";
import { getBuyerData } from "@/common/dataService";

export default async function page() {

  const records = await getBuyerData();

  return (
    // <Layout>
    // <Navbar />
    <CallerDashboard records={records} />
    // <Footer />
    // </Layout>
  );
};
