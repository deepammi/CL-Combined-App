import AuthLayout from "@/components/AuthLayout/AuthLayout";
import Login from "@/components/Login";

const Page = () => {
  return (
    <>
      <Login />
    </>
  );
};

const PageWithLayout: React.FC = () => (
  <AuthLayout
    title={"Welcome Back"}
    description={
      "To keep connected  with us please login with your personal info"
    }
    backButton={false}
  >
    <Page />
  </AuthLayout>
);

export default PageWithLayout;
