import { Dispatch, SetStateAction } from "react";

type Props = {
  vote: null | Boolean;
  setVote: Dispatch<SetStateAction<Boolean | null>>;
};
const DislikeOutlinedIcon = ({ vote, setVote }: Props) => {
  return (
    <svg
      className="w-[0.9rem] md:w-[1.1rem] cursor-pointer select-none"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => {
        if (vote === false) setVote(null);
        else setVote(false);
      }}
    >
      <path
        d="M3.27273 10.8L3.27273 0H0L0 10.8H3.27273ZM6.54545 0C6.11146 0 5.69525 0.189644 5.38837 0.527208C5.08149 0.864775 4.90909 1.32261 4.90909 1.8L4.90909 10.8C4.90909 11.295 5.08909 11.745 5.39182 12.069L10.7755 18L11.6427 17.046C11.8636 16.803 12.0027 16.47 12.0027 16.101L11.9782 15.813L11.2009 11.7L16.3636 11.7C16.7976 11.7 17.2138 11.5104 17.5207 11.1728C17.8276 10.8352 18 10.3774 18 9.9V8.1C18 7.866 17.9591 7.65 17.8855 7.443L15.4145 1.098C15.1691 0.450001 14.5882 0 13.9091 0L6.54545 0ZM6.54545 1.8L13.9336 1.8L16.3636 8.1V9.9H9.17182L10.0964 14.688L6.54545 10.773L6.54545 1.8Z"
        fill={vote === false ? "red" : "black"}
      />
    </svg>
  );
};

export default DislikeOutlinedIcon;
