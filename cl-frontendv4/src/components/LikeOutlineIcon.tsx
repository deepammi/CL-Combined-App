import { Dispatch, SetStateAction } from "react";

type Props = {
  vote: null | Boolean;
  setVote: Dispatch<SetStateAction<Boolean | null>>;
};
const LikeOutlineIcon = ({ vote, setVote }: Props) => {
  return (
    <svg
      className="w-[0.9rem] md:w-[1.1rem] cursor-pointer select-none"
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={() => {
        if (vote) setVote(null);
        else setVote(true);
      }}
    >
      <path
        d="M3.27273 7.2V18H0V7.2H3.27273ZM6.54545 18C6.11146 18 5.69525 17.8104 5.38837 17.4728C5.08149 17.1352 4.90909 16.6774 4.90909 16.2V7.2C4.90909 6.705 5.08909 6.255 5.39182 5.931L10.7755 0L11.6427 0.954C11.8636 1.197 12.0027 1.53 12.0027 1.899L11.9782 2.187L11.2009 6.3H16.3636C16.7976 6.3 17.2138 6.48964 17.5207 6.82721C17.8276 7.16477 18 7.62261 18 8.1V9.9C18 10.134 17.9591 10.35 17.8855 10.557L15.4145 16.902C15.1691 17.55 14.5882 18 13.9091 18H6.54545ZM6.54545 16.2H13.9336L16.3636 9.9V8.1H9.17182L10.0964 3.312L6.54545 7.227V16.2Z"
        fill={vote ? "green" : "black"}
      />
    </svg>
  );
};

export default LikeOutlineIcon;
