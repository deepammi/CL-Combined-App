import Markdown from "react-markdown";

interface EmailDetails {
  email?: string;
}

const EmailContainer: React.FC<EmailDetails> = ({ email }) => {
  return (
    <div className="w-[80%] h-auto border-2 rounded shadow-md p-5">
      <Markdown>{email ?? "The response will appear here"}</Markdown>
    </div>
  );
};

export default EmailContainer;
