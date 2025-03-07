import AuthLayout from "@/components/AuthLayout/AuthLayout";
import PasswordResetForm from "@/components/PasswordReset/PasswordResetForm";
import CreateAccount from "@/components/CreateAccount";


const Page = () => {
  return (
    <CreateAccount/>
  );
};

const PageWithLayout: React.FC = () => (
  <AuthLayout
    title={"Hello Friends"}
    description={"Enter your personal details and start journey with us"}
    backButton={true}
  >
    <Page />
  </AuthLayout>
);

export default PageWithLayout;
